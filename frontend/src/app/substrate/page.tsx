"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";
import KeyBuilder from "@/components/KeyBuilder";

const COLOR = "#E6007A";

const composedKeyCode = `// Substrate Storage Key Formation
// TOTALLY different from Ethereum's keccak256(address)

// Every storage item is addressed by:
// Twox128(pallet_name) ++ Twox128(storage_name) ++ hash(key)

// Example: Balances pallet, Account storage map, Alice's key

Twox128("Balances")        = 0x26aa394eea5630e07c48ae0c9558cef7
Twox128("Account")         = 0xb99d880ec681799c0cf30e8886371da9
Blake2_128Concat(Alice_SS58)= 0xbe5ddb1579b72e84524fc29e78609e3c9fAlice_pubkey

FINAL KEY = 0x26aa394eea5630e07c48ae0c9558cef7
          ++ b99d880ec681799c0cf30e8886371da9
          ++ be5ddb1579b72e84524fc29e78609e3c...

// This is the key stored in the underlying trie / RocksDB
// Length: 16 + 16 + (16 + 32) = 80 bytes (320 hex chars)`;

const palletStorageCode = `// Different storage types in Substrate pallets

// 1. StorageValue — single value
#[pallet::storage]
pub type TotalIssuance<T> = StorageValue<_, u128>;
// Key = Twox128("Balances") ++ Twox128("TotalIssuance")
// No map key needed — it's a single global value

// 2. StorageMap — key → value map
#[pallet::storage]
pub type Account<T: Config> = StorageMap<
    _,
    Blake2_128Concat,  // hash function for the key
    T::AccountId,
    AccountData<T::Balance>,
>;
// Key = Twox128(pallet) ++ Twox128("Account") ++ Blake2_128Concat(account_id)

// 3. StorageDoubleMap — key1 + key2 → value
#[pallet::storage]
pub type Locks<T: Config> = StorageDoubleMap<
    _,
    Blake2_128Concat, T::AccountId,  // first key
    Twox64Concat, LockIdentifier,    // second key
    BoundedVec<BalanceLock<T::Balance>, MaxLocks>,
>;
// Key = Twox128(pallet) ++ Twox128("Locks") ++ hash1(key1) ++ hash2(key2)`;

const hashFunctionsCode = `// Substrate offers 3 hash functions for map keys
// Choose based on security needs:

// 1. Blake2_128Concat — SECURE (use for user-controlled keys)
//    key_hash = blake2_128(key) ++ key
//    - Resistant to HashDoS attacks
//    - Key is appended → can iterate and decode
//    - Use for: AccountId, user-provided data

// 2. Twox64Concat — FAST (use for trusted keys)  
//    key_hash = twox64(key) ++ key
//    - NOT secure against adversarial input
//    - Much faster than Blake2
//    - Use for: internal system keys (block numbers etc.)

// 3. Identity — NO HASH (use for fixed-size trusted keys)
//    key_hash = key (no hashing at all)
//    - Fastest, but vulnerable to DoS
//    - Only for fixed-size, trusted, non-adversarial keys

// Why Blake2_128Concat vs Ethereum's keccak256?
// Ethereum: keccak256(key) → no way to reverse → can't enumerate
// Substrate: blake2_128(key) ++ key → can iterate all keys in a map!`;

const trieVsEthCode = `// Substrate Trie vs Ethereum MPT

// ETHEREUM:
key = keccak256(address)               // single hash, 32 bytes
// → Traverse 64 nibbles in 16-way trie
// → RLP-encoded node stored as DB[keccak256(RLP(node))]
// → 3 node types: branch, extension, leaf

// SUBSTRATE:
key = Twox128(pallet) ++ Twox128(storage) ++ hash(key)
// → SAME trie traversal after key construction
// → But different encoding (not RLP — custom codec SCALE)
// → Optimized trie (more compact, fewer node types)

// The KEY INSIGHT:
// ┌─────────────────────────────────────────────────┐
// │  BOTH end up in a trie stored as hash→node in DB│
// │  Difference is HOW the key is constructed        │
// │                                                   │
// │  Ethereum: one hash → trie                        │
// │  Substrate: namespaced hash → same trie          │
// └─────────────────────────────────────────────────┘`;

const accountDataCode = `// Substrate AccountData (Balances pallet)
// Stored at: Twox128("Balances")++Twox128("Account")++Blake2_128Concat(who)

AccountData {
    free:     u128,    // freely transferable balance
    reserved: u128,    // locked for staking/governance
    frozen:   u128,    // frozen by governance/system
    flags:    ExtraFlags,
}

// Compare with Ethereum:
// Ethereum account: { nonce, balance, storageRoot, codeHash }
// Substrate account: { free, reserved, frozen, flags }
// + nonce stored separately in System pallet:
// Twox128("System") ++ Twox128("Account") ++ Blake2_128Concat(who)`;

export default function SubstratePage() {
  const [pallet, setPallet] = useState("Balances");
  const [storage, setStorage] = useState("Account");
  const [key, setKey] = useState("Alice");

  // Deterministic demo hash
  function demohash128(s: string): string {
    let h = 0;
    for (let c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0;
    return Math.abs(h).toString(16).padStart(16, "0").repeat(2).slice(0, 32);
  }

  function blake2concat(s: string): string {
    let h = 7;
    for (let c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
    const hash = Math.abs(h).toString(16).padStart(16, "0").repeat(2).slice(0, 32);
    const keyHex = s.split("").map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("").slice(0, 64);
    return hash + keyHex;
  }

  const palletHash = demohash128(pallet);
  const storageHash = demohash128(storage);
  const keyHash = blake2concat(key);
  const finalKey = `0x${palletHash}${storageHash}${keyHash}`;

  const keySteps = [
    {
      label: `Twox128("${pallet}")`,
      input: pallet,
      output: `0x${palletHash}`,
      description: `TwoX128 hash of the pallet name "${pallet}". This namespaces all storage under this pallet. Fast, non-cryptographic hash — pallet names are trusted.`,
    },
    {
      label: `Twox128("${storage}")`,
      input: storage,
      output: `0x${storageHash}`,
      description: `TwoX128 hash of the storage map name "${storage}". Combined with the pallet hash, this uniquely identifies this specific storage map.`,
    },
    {
      label: `Blake2_128Concat("${key}")`,
      input: key,
      output: `0x${keyHash.slice(0, 32)}...${key.slice(0, 8)}`,
      description: `Blake2_128 hash of the map key, concatenated with the raw key. The appended key allows iterating all entries — unlike Ethereum where keccak256(key) is irreversible.`,
    },
    {
      label: "Concatenate All Parts",
      input: `${pallet} ++ ${storage} ++ ${key}`,
      output: finalKey.slice(0, 40) + "...",
      description:
        "The final storage key is the concatenation of all three hashed parts. This is what gets stored in the underlying trie and ultimately in RocksDB.",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ background: `${COLOR}22`, color: COLOR }}
              >
                ●
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Substrate / Polkadot</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Composed Storage Key Trie
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Substrate uses a <span className="text-white font-medium">namespaced composed key</span>:
              <code className="text-pink-400 font-mono text-sm mx-1">
                Twox128(pallet) ++ Twox128(storage) ++ hash(key)
              </code>
              This gives every storage slot a structured, readable address — and allows iteration over all keys in a map.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Interactive Key Builder */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Interactive: Build a Substrate Storage Key
          </h2>
          <p className="text-sm text-[#8888aa] mb-6">
            Change the pallet name, storage name, and key to see how the composed storage key is built.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: "Pallet Name", value: pallet, set: setPallet },
              { label: "Storage Map", value: storage, set: setStorage },
              { label: "Map Key (e.g. AccountId)", value: key, set: setKey },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs text-[#666688] mb-1 block font-mono">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-lg px-3 py-2 font-mono text-sm text-[#c8c8e0] focus:outline-none focus:border-[#E6007A]"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeyBuilder
              steps={keySteps}
              title="Substrate Key Formation"
              color={COLOR}
            />

            {/* Final key display */}
            <div className="space-y-4">
              <div
                className="rounded-xl border p-4"
                style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}
              >
                <div className="text-xs text-[#666688] mb-2 font-mono">Final Storage Key (hex)</div>
                <div
                  className="font-mono text-xs break-all leading-relaxed p-3 rounded-lg"
                  style={{ background: `${COLOR}12`, color: COLOR }}
                >
                  <span className="text-[#666688]">Twox128({pallet}):</span>
                  <br />
                  <span>0x{palletHash}</span>
                  <br />
                  <span className="text-[#666688]">Twox128({storage}):</span>
                  <br />
                  <span>0x{storageHash}</span>
                  <br />
                  <span className="text-[#666688]">Blake2_128Concat({key}):</span>
                  <br />
                  <span>0x{keyHash.slice(0, 48)}...</span>
                </div>
              </div>

              <InfoCard title="vs. Ethereum" color={COLOR} icon="⚡">
                <div className="text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-[#627EEA]">ETH:</span>
                    <code className="text-[#8888aa]">
                      key = keccak256(address)
                      <br />— can&apos;t decode key back
                    </code>
                  </div>
                  <div className="flex items-start gap-2">
                    <span style={{ color: COLOR }}>SUB:</span>
                    <code className="text-[#8888aa]">
                      key = hash(pallet) ++ hash(storage) ++ hash(key) ++ key
                      <br />
                      <span style={{ color: COLOR }}>— can iterate all keys!</span>
                    </code>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Key formation code */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Real Substrate Key Example</h2>
          <CodeBlock code={composedKeyCode} language="text" title="substrate-key.txt" />
        </section>

        {/* Storage types */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Storage Types: Value, Map, DoubleMap
          </h2>
          <CodeBlock
            code={palletStorageCode}
            language="rust"
            title="pallet-storage.rs"
          />
        </section>

        {/* Hash functions */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            3 Hash Functions — Choose Wisely
          </h2>
          <CodeBlock
            code={hashFunctionsCode}
            language="text"
            title="hash-functions.txt"
          />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Blake2_128Concat",
                security: "High",
                speed: "Medium",
                when: "User-controlled keys (AccountId, etc.)",
                color: "#2a8a2a",
              },
              {
                name: "Twox64Concat",
                security: "Low*",
                speed: "High",
                when: "Trusted system keys (block numbers, etc.)",
                color: "#8a8a2a",
              },
              {
                name: "Identity",
                security: "None",
                speed: "Max",
                when: "Fixed-size, trusted, non-adversarial keys",
                color: "#8a2a2a",
              },
            ].map((fn) => (
              <div
                key={fn.name}
                className="rounded-lg border p-3"
                style={{ borderColor: `${fn.color}55`, background: `${fn.color}10` }}
              >
                <div style={{ color: fn.color }} className="font-mono text-sm font-bold mb-2">
                  {fn.name}
                </div>
                <div className="text-xs space-y-1 text-[#888899]">
                  <div>Security: <span className="text-white">{fn.security}</span></div>
                  <div>Speed: <span className="text-white">{fn.speed}</span></div>
                  <div className="mt-2 text-[#666688]">{fn.when}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Substrate vs Ethereum */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Substrate vs Ethereum — Key Differences
          </h2>
          <CodeBlock
            code={trieVsEthCode}
            language="text"
            title="substrate-vs-ethereum.txt"
          />
        </section>

        {/* Account data */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Account Data Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={accountDataCode} language="rust" title="account-data.rs" />
            <div className="space-y-4">
              <InfoCard title="Pallet Architecture" color={COLOR} icon="🧩">
                <p className="text-xs mb-2">
                  Unlike Ethereum&apos;s single flat state, Substrate organizes state by{" "}
                  <strong className="text-white">pallets</strong>. Each pallet owns its storage.
                </p>
                <div className="font-mono text-xs space-y-1 text-[#666688]">
                  <div>
                    <span style={{ color: COLOR }}>System</span> pallet →
                    nonce, block number, events
                  </div>
                  <div>
                    <span style={{ color: COLOR }}>Balances</span> pallet →
                    free, reserved, frozen
                  </div>
                  <div>
                    <span style={{ color: COLOR }}>Staking</span> pallet →
                    validators, delegations
                  </div>
                  <div>
                    <span style={{ color: COLOR }}>EVM</span> pallet →
                    Ethereum-compatible contracts
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Key Iteration — Major Advantage" color={COLOR} icon="🔄">
                <p className="text-xs leading-relaxed">
                  Because <code className="text-pink-400">Blake2_128Concat</code> appends the raw
                  key to the hash, you can scan a storage map and decode all keys:
                </p>
                <code className="text-xs font-mono block mt-2 p-2 bg-[#0a0a14] rounded text-[#8888aa]">
                  for (key, value) in storage_map.iter() &#123;
                  <br />
                  &nbsp; // key = blake2_128(k) ++ k → extract k
                  <br />
                  &nbsp; let account = decode(key[16..]);
                  <br />
                  &#125;
                </code>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Storage → Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How Composed Keys → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "Twox128(pallet) prefix",
                effect: "Complete namespace isolation. Pallets can never accidentally share storage keys. Add new pallets without collision risk.",
                positive: true,
              },
              {
                cause: "Blake2_128Concat appends raw key",
                effect: "Can iterate all entries in a StorageMap — useful for migrations, queries. Ethereum (keccak256) can't do this.",
                positive: true,
              },
              {
                cause: "Structured keys add length overhead",
                effect: "Keys are 80+ bytes vs Ethereum's 32 bytes. More data per trie path.",
                positive: false,
              },
              {
                cause: "Runtime upgrades with same storage layout",
                effect: "Substrate supports forkless runtime upgrades because storage keys are deterministic from pallet/storage names.",
                positive: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border p-3"
                style={{
                  borderColor: item.positive ? "#1a3a1a" : "#3a1a1a",
                  background: item.positive ? "#0a1a0a" : "#1a0a0a",
                }}
              >
                <span className="text-lg mt-0.5">{item.positive ? "✅" : "⚠️"}</span>
                <div>
                  <code className="text-xs font-mono" style={{ color: COLOR }}>
                    {item.cause}
                  </code>
                  <p className="text-xs text-[#8888aa] mt-1">{item.effect}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
