"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";

const COLOR = "#00FFB3";

const mptVsVerkleCode = `// MPT (Current Ethereum) vs Verkle Trees (EIP-6800)

// ─── CURRENT: Merkle Patricia Trie ───────────────────
// Proof structure: list of hashes along the path
// Proof element: a 32-byte hash
// Depth: up to 64 nibbles = up to 64 proof elements
// Size: 64 elements × 32 bytes = 2,048 bytes
// + Node data overhead → typically 10–40 KB per account proof

// ─── FUTURE: Verkle Tree ────────────────────────────
// Proof structure: polynomial commitment + opening proof
// Uses: KZG polynomial commitments
// Key magic: prove MANY values with ONE small proof!

// Single-value proof sizes:
// MPT: ~600 bytes per node × many nodes = ~10KB
// Verkle: ~150 bytes total (compressed)

// Batch proof (proving many accounts at once):
// MPT: proof grows linearly with number of accounts
// Verkle: proof stays nearly constant size!
// → Proving 1,000 accounts: MPT ~10MB, Verkle ~200KB`;

const kzgCode = `// KZG Polynomial Commitments — the magic behind Verkle
// Named after Kate, Zaverucha, Goldberg (2010)

// CONCEPT:
// 1. Encode your data as a polynomial p(x)
//    If you have 256 values v_0...v_255:
//    p(0) = v_0, p(1) = v_1, ..., p(255) = v_255

// 2. Commit to the polynomial:
//    commitment C = commit(p(x))  ← just 48 bytes!

// 3. Prove a single value:
//    prove_at(i) → proof_π         ← just 48 bytes!
//    (prove that p(i) = v_i)

// 4. Verify:
//    verify(C, i, v_i, proof_π)   ← using elliptic curve pairing
//    → O(1) verification time!

// Why this beats hashes:
// Hash-based (MPT): need all sibling hashes along the path
// KZG: just ONE commitment + ONE proof = 48+48 = 96 bytes

// Trusted setup requirement:
// KZG needs a "powers of tau" ceremony
// Ethereum did this: the KZG ceremony (EIP-4844 used it too)
// Someone in the ceremony must delete their secret — 
// if even ONE person deleted it, the system is secure`;

const verkleTreeCode = `// Verkle Tree Structure
// Similar to a trie but uses KZG commitments instead of hashes

// Node structure:
struct VerkleNode {
    commitment: G1Point,  // 48-byte KZG commitment (vs 32-byte hash)
    children: [Option<VerkleNodeRef>; 256], // 256-way (not 16-way!)
}

// Why 256-way instead of 16-way (MPT)?
// With KZG, wider branching = smaller proof (not larger!)
// MPT: 16-way, depth 64 nibbles
// Verkle: 256-way, depth 32 bytes (same key length)
// Less depth → fewer proof elements needed

// Key mapping (EIP-6800):
// Everything keyed by: account_address ++ sub_key
// No more storage tries! Flat key space:
//   account_version:     hash(address, 0)
//   account_balance:     hash(address, 1)
//   account_nonce:       hash(address, 2)
//   account_code_hash:   hash(address, 3)
//   contract_slot_X:     hash(address, trie_key_to_stem(slot))`;

const statelessCode = `// Stateless Ethereum — enabled by Verkle Trees

// CURRENT (with MPT):
// To run a transaction, validators need:
// → Full state (currently ~100+ GB)
// → Every validator must store everything
// → High hardware requirements = centralization pressure

// FUTURE (with Verkle):
// "Witness" = proof of all state accessed by a transaction
// A block's witness proves: all accounts/storage accessed

// Current witness size (MPT): ~10-40 MB per block
// Verkle witness size: ~200-500 KB per block  (100× smaller!)

// Stateless client workflow:
// 1. Receiver gets: block_header + transactions + witness
// 2. Verify witness against state_root (KZG proofs)
// 3. Execute transactions using witness as "portable state"
// 4. No need to store full state!

// This enables:
// → Mobile clients that verify state without storage
// → Light validators that don't need 100+ GB
// → Better decentralization`;

const eip6800Code = `// EIP-6800: Ethereum state tree using a Verkle trie
// (The actual Ethereum upgrade proposal)

// New storage (replaces MPT):
type VerkleStem = [u8; 31]   // 31-byte stem (address-derived)
type VerkleKey  = [u8; 32]   // 32-byte key (stem ++ suffix)

// Account data (no more separate storage trie!):
stem(alice) = keccak256(alice_address)[..31]  // first 31 bytes

// Account header stored at:
BASIC_DATA_KEY    = stem ++ [0]  // version, balance, nonce, code_size
CODE_HASH_KEY     = stem ++ [1]  // code hash

// Contract storage at:  
STORAGE_OFFSET    = 256
slot_key = stem ++ [STORAGE_OFFSET + slot_mod_256]

// HUGE CHANGE: storage and account in the SAME tree!
// No more separate "storage trie" per contract
// All state in one Verkle trie
// Simpler + more uniform proofs`;

export default function VerklePage() {
  const comparisons = [
    { label: "Proof type", mpt: "Hash list", verkle: "KZG polynomial" },
    { label: "Single account proof", mpt: "~10 KB", verkle: "~150 bytes" },
    { label: "1,000 accounts proof", mpt: "~10 MB", verkle: "~200 KB" },
    { label: "Tree width", mpt: "16-way", verkle: "256-way" },
    { label: "Tree depth", mpt: "64 (nibbles)", verkle: "32 (bytes)" },
    { label: "Commitment size", mpt: "32 bytes (hash)", verkle: "48 bytes (G1)" },
    { label: "Verification time", mpt: "Fast (just hashes)", verkle: "Slower (pairings)" },
    { label: "Batch proofs", mpt: "Linear growth", verkle: "Near-constant size" },
    { label: "Trusted setup needed", mpt: "No", verkle: "Yes (KZG ceremony)" },
    { label: "Stateless clients", mpt: "Impractical", verkle: "✅ Practical" },
    { label: "Deployed on mainnet", mpt: "✅ Current", verkle: "🔜 Future" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${COLOR}22`, color: COLOR }}
              >
                ◊
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model (Future)</div>
                <div className="text-2xl font-bold text-white">Verkle Trees</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Polynomial Commitments — Ethereum&apos;s Future
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Verkle trees replace Ethereum&apos;s MPT with{" "}
              <span className="text-white font-medium">KZG polynomial commitments</span>.
              The result: proofs{" "}
              <span className="text-white font-medium">100× smaller</span>. This enables 
              stateless Ethereum clients — verify state without storing 100+ GB.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* The Problem Verkle Solves */}
        <section>
          <div
            className="rounded-xl border p-6 mb-6"
            style={{ borderColor: `${COLOR}44`, background: `${COLOR}08` }}
          >
            <h2 className="text-lg font-bold text-white mb-4">The Problem with MPT Proofs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-[#627EEA] mb-2">
                  Current Ethereum (MPT)
                </h3>
                <ul className="text-xs text-[#8888aa] space-y-2">
                  <li>📏 Prove 1 account → provide all hashes along the trie path</li>
                  <li>📦 1 account proof ≈ 10KB</li>
                  <li>📦 1,000 accounts ≈ 10MB</li>
                  <li>🖥️ Full node must store ~100+ GB</li>
                  <li>❌ Light clients can&apos;t fully verify state</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: COLOR }}>
                  Future Ethereum (Verkle)
                </h3>
                <ul className="text-xs text-[#8888aa] space-y-2">
                  <li>📏 Prove 1 account → 1 polynomial commitment + opening</li>
                  <li>📦 1 account proof ≈ 150 bytes</li>
                  <li>📦 1,000 accounts ≈ 200KB (not 10MB!)</li>
                  <li>🖥️ Stateless: verify without storing state</li>
                  <li>✅ Mobile clients can verify state</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* MPT vs Verkle */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">MPT vs Verkle Comparison</h2>
          <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#1a1a2e]">
                    <th className="text-left p-3 text-[#8888aa]">Property</th>
                    <th className="text-left p-3 text-[#627EEA]">MPT (Current)</th>
                    <th className="text-left p-3" style={{ color: COLOR }}>
                      Verkle (Future)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, i) => (
                    <tr
                      key={row.label}
                      className={`border-b border-[#0f0f18] ${i % 2 === 0 ? "bg-[#0a0a12]" : ""}`}
                    >
                      <td className="p-3 text-[#8888aa]">{row.label}</td>
                      <td className="p-3 font-mono text-[#9999cc]">{row.mpt}</td>
                      <td className="p-3 font-mono" style={{ color: COLOR }}>
                        {row.verkle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Code sections */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">The Core Comparison</h2>
          <CodeBlock code={mptVsVerkleCode} language="text" title="mpt-vs-verkle.txt" />
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            KZG Polynomial Commitments — The Math
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={kzgCode} language="text" title="kzg-commitments.txt" />
            <div className="space-y-4">
              <InfoCard title="What is KZG?" color={COLOR} icon="🔮">
                <p className="text-xs leading-relaxed mb-2">
                  KZG = a way to <strong className="text-white">commit to a polynomial</strong> 
                  in 48 bytes, then prove any single evaluation point in another 48 bytes.
                </p>
                <p className="text-xs text-[#666688]">
                  The polynomial encodes all your data values. The commitment is 
                  like a fingerprint — changing any value changes the fingerprint.
                </p>
              </InfoCard>

              <InfoCard title="Trusted Setup" color={COLOR} icon="⚠️">
                <p className="text-xs leading-relaxed">
                  KZG needs a <strong className="text-white">trusted setup ceremony</strong> — 
                  a one-time event where random secrets are generated and then deleted.
                  Ethereum ran this ceremony in 2023 with 140,000+ participants.
                  If even ONE person deleted their secret, the system is secure.
                </p>
              </InfoCard>

              <InfoCard title="EIP-4844 Already Uses KZG!" color={COLOR} icon="🎉">
                <p className="text-xs leading-relaxed">
                  EIP-4844 (Proto-Danksharding) — already live on Ethereum — uses KZG 
                  commitments for blob data. Verkle trees will use the SAME trusted setup.
                </p>
              </InfoCard>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Verkle Tree Node Structure</h2>
          <CodeBlock code={verkleTreeCode} language="text" title="verkle-tree.txt" />
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            EIP-6800 — The Actual Ethereum Proposal
          </h2>
          <CodeBlock code={eip6800Code} language="rust" title="eip-6800.rs" />
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-4">Stateless Ethereum</h2>
          <CodeBlock code={statelessCode} language="text" title="stateless-ethereum.txt" />
        </section>

        {/* Impact */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How Verkle Trees Change Ethereum
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "100× smaller proofs",
                effect: "Block witnesses shrink from ~10MB to ~200KB. Light clients and mobile devices can verify Ethereum state.",
                positive: true,
              },
              {
                cause: "Stateless clients enabled",
                effect: "Validators no longer need to store full state. Lowers hardware requirements → better decentralization.",
                positive: true,
              },
              {
                cause: "KZG pairing-based cryptography",
                effect: "Verification is slower than hash-based MPT. New cryptographic assumptions (not just hashes).",
                positive: false,
              },
              {
                cause: "Flat key space (no storage sub-trie)",
                effect: "Simpler storage model. All state (account + contract storage) in one uniform tree. Easier to reason about.",
                positive: true,
              },
              {
                cause: "256-way branching",
                effect: "Shallower tree than MPT. Fewer proof steps needed — key enabler for smaller proof sizes.",
                positive: true,
              },
              {
                cause: "Trusted setup requirement",
                effect: "KZG needs the powers-of-tau ceremony. Already done for EIP-4844, so Verkle can reuse it.",
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
