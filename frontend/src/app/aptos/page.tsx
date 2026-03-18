"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";

const COLOR = "#00D4AA";

const jmtCode = `// Jellyfish Merkle Tree (JMT) — Aptos's State Tree
// An optimized Sparse Merkle Tree for account storage

// Key difference from regular SMT and Ethereum MPT:
// 1. Binary (not 16-way like MPT)
// 2. Sparse (not dense like MPT)
// 3. Leaf nodes store full key+value (efficient for sparse data)
// 4. Internal nodes only exist when needed (sparse optimization)

// Node types in JMT:
enum Node {
    // Leaf: stores the full key-value pair
    Leaf { key: HashValue, value_hash: HashValue },
    
    // Internal: binary branch (left/right, not 16-way)
    Internal { left: Option<Child>, right: Option<Child> },
    
    // Null: empty subtree (huge optimization!)
    Null,
}

// Key derivation:
// key = keccak256(address)  (same as Ethereum!)
// But traversal is BINARY (bit-by-bit), not 16-way (nibble-by-nibble)

// Storage:
// DB[hash(node)] = serialize(node)  — same concept as Ethereum`;

const moveResourcesCode = `// Aptos Move Resources — Account-Centric State
// Different from Sui's object model

// In Aptos, state lives under accounts as "resources"
module aptos_framework::coin {
    struct CoinStore<phantom CoinType> has key {
        coin: Coin<CoinType>,
        frozen: bool,
        deposit_events: EventHandle<DepositEvent>,
        withdraw_events: EventHandle<WithdrawEvent>,
    }
    
    struct Coin<phantom CoinType> has store {
        value: u64,
    }
}

// State access pattern:
// borrow_global<CoinStore<AptosCoin>>(alice_address)
// → looks up: alice_address / 0x1::coin::CoinStore<AptosCoin>

// Storage path in JMT:
// key = hash(account_address ++ struct_tag)
// → Alice's APT balance path:
// key = hash(alice ++ "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>")`;

const blockStmCode = `// Block-STM — Aptos's Parallel Execution
// Software Transactional Memory for blockchain

// Unlike Solana (pre-declared accounts), 
// Aptos figures out conflicts DURING execution:

// Step 1: Optimistically execute all txs in parallel
// (assume no conflicts)

// Step 2: Track read/write sets during execution
tx1.reads  = {alice.balance}
tx1.writes = {alice.balance: 100, bob.balance: 200}

tx2.reads  = {alice.balance}  // reads same as tx1 writes!
tx2.writes = {alice.balance: 50}

// Step 3: Detect conflicts — tx2 read alice.balance
// but tx1 wrote it. tx2 must re-execute after tx1!

// Step 4: Re-execute conflicting txs in correct order
// Non-conflicting txs: committed immediately ✅
// Conflicting txs: re-executed with updated state

// WHY this is better than Solana for complex apps:
// - No need to pre-declare all accessed accounts
// - Works with Ethereum-like smart contract patterns
// - Dynamic conflict detection = more flexible`;

const storagePathCode = `// Aptos Storage Paths — Account + Resource + Key

// State stored under account addresses as "resources":
// path = account_address / module_address::module_name::StructName / (optional key)

// Examples:
alice_apt_balance =
  alice_address / 0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>

alice_nft =
  alice_address / my_module::nft::NFT / nft_id

// JMT key = hash(path)  →  binary trie traversal
// Value = BCS-encoded (Binary Canonical Serialization) resource

// Compare to Ethereum:
// ETH: all state in one global trie, contract storage sub-trie
// Aptos: state scattered across account subtrees in JMT

// Multiple version support (like Cosmos IAVL):
// JMT is versioned → can query historical state per version
statedb.get_with_proof(key, version: 1000000)`;

export default function AptosPage() {
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
                ⬡
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Aptos</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Jellyfish Merkle Tree + Block-STM Parallelism
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Aptos uses the{" "}
              <span className="text-white font-medium">Jellyfish Merkle Tree</span> — an optimized
              sparse Merkle tree with efficient proofs. Combined with{" "}
              <span className="text-white font-medium">Block-STM</span> (parallel execution via
              software transactional memory), Aptos achieves high throughput without pre-declaring
              account access.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* JMT Overview */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Jellyfish Merkle Tree</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InfoCard title="Binary (not 16-way)" color={COLOR} icon="🌿">
              <p className="text-xs leading-relaxed">
                Ethereum MPT: 16-way trie (hex nibbles).
                JMT: <strong className="text-white">binary tree</strong> (bit-by-bit).
                More space-efficient for sparse state.
              </p>
            </InfoCard>
            <InfoCard title="Sparse Optimization" color={COLOR} icon="💡">
              <p className="text-xs leading-relaxed">
                Empty subtrees collapse to a single null hash.
                When most of the 2^256 key space is empty, this saves enormous space.
              </p>
            </InfoCard>
            <InfoCard title="Versioned" color={COLOR} icon="📚">
              <p className="text-xs leading-relaxed">
                JMT supports multiple versions (like Cosmos IAVL).
                Historical proofs work without archive nodes.
              </p>
            </InfoCard>
          </div>
          <CodeBlock code={jmtCode} language="rust" title="jellyfish-merkle.rs" />
        </section>

        {/* Move Resources */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Move Resources — Aptos&apos;s State Model
          </h2>
          <p className="text-sm text-[#8888aa] mb-4">
            Unlike Sui (objects), Aptos stores state as{" "}
            <strong className="text-white">resources under account addresses</strong>.
            Think: account address → {`{resource_type → data}`}.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={moveResourcesCode} language="rust" title="move-resources.move" />
            <div className="space-y-4">
              <InfoCard title="Aptos vs Sui Object Model" color={COLOR} icon="⚖️">
                <div className="text-xs space-y-3">
                  <div>
                    <div style={{ color: COLOR }} className="font-semibold mb-1">Aptos (resources under accounts):</div>
                    <code className="text-[#8888aa] block p-2 bg-[#0a0a14] rounded text-xs">
                      alice_address.CoinStore = &#123; value: 100 &#125;
                      <br/>
                      alice_address.NFT = &#123; id: 1, ... &#125;
                    </code>
                  </div>
                  <div>
                    <div className="text-[#6fbcf0] font-semibold mb-1">Sui (independent objects):</div>
                    <code className="text-[#8888aa] block p-2 bg-[#0a0a14] rounded text-xs">
                      object_0x1234 = &#123; owner: alice, value: 100 &#125;
                      <br/>
                      object_0x5678 = &#123; owner: alice, id: 1, ... &#125;
                    </code>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Storage Path Format" color={COLOR} icon="🔑">
                <code className="text-xs font-mono text-[#8888aa] block p-2 bg-[#0a0a14] rounded">
                  address / module::StructName
                  <br />
                  ↓
                  <br />
                  JMT key = hash(this path)
                  <br />
                  ↓ 
                  <br />
                  <span style={{ color: COLOR }}>binary tree traversal</span>
                </code>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Storage paths */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Storage Path → JMT Key</h2>
          <CodeBlock code={storagePathCode} language="rust" title="storage-path.rs" />
        </section>

        {/* Block-STM */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Block-STM — Dynamic Parallel Execution
          </h2>
          <p className="text-sm text-[#8888aa] mb-4">
            Unlike Solana (must pre-declare accounts), Aptos detects conflicts{" "}
            <em>during</em> execution and re-runs only conflicting transactions.
          </p>
          <CodeBlock code={blockStmCode} language="rust" title="block-stm.rs" />

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Solana (Sealevel)",
                desc: "Pre-declare all accounts. Scheduler knows conflicts upfront. Simple but rigid.",
                color: "#9945FF",
              },
              {
                title: "Aptos (Block-STM)",
                desc: "Execute optimistically. Detect conflicts. Re-execute conflicting txs. More flexible.",
                color: COLOR,
              },
              {
                title: "Ethereum",
                desc: "Sequential. No parallelism. Every tx runs after the previous. Bottleneck.",
                color: "#627EEA",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border p-3"
                style={{ borderColor: `${item.color}33`, background: `${item.color}08` }}
              >
                <div style={{ color: item.color }} className="font-semibold text-sm mb-2">
                  {item.title}
                </div>
                <p className="text-xs text-[#8888aa]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Storage → Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How JMT + Block-STM → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "JMT sparse optimization",
                effect: "Very efficient for sparse state (most accounts don't exist). Proof size much smaller than dense MPT for realistic datasets.",
                positive: true,
              },
              {
                cause: "Block-STM dynamic conflict detection",
                effect: "Developers don't need to pre-declare account access (unlike Solana). Easier to port Ethereum-like patterns to Aptos.",
                positive: true,
              },
              {
                cause: "Resources under accounts (not global objects)",
                effect: "State is naturally co-located with accounts. Easy to query all resources for a user. But shared DeFi pools are less natural.",
                positive: true,
              },
              {
                cause: "Re-execution on conflict",
                effect: "High-contention scenarios (popular DEX, airdrop) can cause many re-executions. Throughput degrades under contention.",
                positive: false,
              },
              {
                cause: "JMT versioning",
                effect: "Like Cosmos, historical queries possible. But Aptos prunes by default — need to configure to keep history.",
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
