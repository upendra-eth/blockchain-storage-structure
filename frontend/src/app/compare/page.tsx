"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blockchains } from "@/data/blockchains";
import { ArrowRight } from "lucide-react";

type FilterKey = "all" | "fast" | "proofs" | "history" | "parallel";

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Chains" },
  { key: "fast", label: "Low Write Cost" },
  { key: "proofs", label: "State Proofs" },
  { key: "history", label: "Historical Queries" },
  { key: "parallel", label: "Parallel Execution" },
];

const comparisons = [
  {
    category: "Key Formation",
    items: [
      { chain: "Bitcoin", value: "hash(tx) → Merkle path", color: "#F7931A" },
      { chain: "Ethereum", value: "keccak256(address) → 64 nibbles → MPT", color: "#627EEA" },
      { chain: "Substrate", value: "Twox128(pallet) ++ Twox128(storage) ++ hash(key)", color: "#E6007A" },
      { chain: "Cosmos", value: "module_prefix + key → IAVL AVL path", color: "#2FB8EB" },
      { chain: "Solana", value: "pubkey → DIRECT (no tree!)", color: "#9945FF" },
      { chain: "Sui", value: "object_id → SMT 256-bit path", color: "#6fbcf0" },
      { chain: "Aptos", value: "keccak256(address ++ struct_tag) → JMT", color: "#00D4AA" },
      { chain: "Verkle", value: "address ++ suffix → 256-way Verkle path", color: "#00FFB3" },
    ],
  },
  {
    category: "Underlying DB",
    items: [
      { chain: "Bitcoin", value: "LevelDB (blocks + chainstate)", color: "#F7931A" },
      { chain: "Ethereum", value: "LevelDB or RocksDB", color: "#627EEA" },
      { chain: "Substrate", value: "RocksDB or ParityDB", color: "#E6007A" },
      { chain: "Cosmos", value: "GoLevelDB or RocksDB", color: "#2FB8EB" },
      { chain: "Solana", value: "RocksDB (AccountsDB)", color: "#9945FF" },
      { chain: "Sui", value: "RocksDB", color: "#6fbcf0" },
      { chain: "Aptos", value: "RocksDB", color: "#00D4AA" },
      { chain: "Verkle", value: "LevelDB or RocksDB (same as ETH)", color: "#00FFB3" },
    ],
  },
  {
    category: "Write Cost",
    items: [
      { chain: "Bitcoin", value: "Low — UTXO insert/delete", color: "#F7931A" },
      { chain: "Ethereum", value: "High — O(log n) trie nodes re-hashed per write", color: "#627EEA" },
      { chain: "Substrate", value: "Medium — similar trie traversal", color: "#E6007A" },
      { chain: "Cosmos", value: "Medium — AVL rebalance + node creation", color: "#2FB8EB" },
      { chain: "Solana", value: "Very Low — direct account write", color: "#9945FF" },
      { chain: "Sui", value: "Low for owned, medium for shared objects", color: "#6fbcf0" },
      { chain: "Aptos", value: "Low — JMT optimized sparse tree", color: "#00D4AA" },
      { chain: "Verkle", value: "Medium — polynomial commitment update", color: "#00FFB3" },
    ],
  },
  {
    category: "Proof Size",
    items: [
      { chain: "Bitcoin", value: "O(log₂ n) × 32 bytes — binary Merkle", color: "#F7931A" },
      { chain: "Ethereum", value: "~10KB per account (many MPT nodes)", color: "#627EEA" },
      { chain: "Substrate", value: "Medium — similar to ETH but optimized encoding", color: "#E6007A" },
      { chain: "Cosmos", value: "Medium — IAVL AVL path", color: "#2FB8EB" },
      { chain: "Solana", value: "N/A — no global state Merkle proof!", color: "#9945FF" },
      { chain: "Sui", value: "Small — SMT with sparse compression", color: "#6fbcf0" },
      { chain: "Aptos", value: "Small — JMT optimized proofs", color: "#00D4AA" },
      { chain: "Verkle", value: "~150 bytes (100× smaller than ETH MPT!)", color: "#00FFB3" },
    ],
  },
];

const deepDiveComparisons = [
  {
    title: "Same KV DB — Different Structure on Top",
    body: `All blockchains use key-value databases (LevelDB / RocksDB) under the hood.
The DIFFERENCE is entirely in how they build keys and what data structure sits on top:

Bitcoin:   DB["C" + txid + vout]         → flat UTXO set + separate Merkle tree in block header
Ethereum:  DB[keccak256(RLP(trie_node))] → 16-way Patricia Trie
Substrate: DB[trie_path_hash]            → Trie with composed keys
Cosmos:    DB[iavl_node_hash]            → Immutable Versioned AVL Tree
Solana:    DB[pubkey]                    → No tree at all! Direct lookup
Sui:       DB[object_id]                 → Sparse Merkle Tree
Aptos:     DB[jmt_node_hash]             → Jellyfish Merkle Tree (sparse binary)`,
  },
  {
    title: "Why Solana is Fastest (but with tradeoffs)",
    body: `Reading Ethereum state:
1. Compute: key = keccak256(address)        (1 hash)
2. Split key into 64 nibbles               (CPU)
3. For each nibble: lookup DB[node_hash]   (64 DB reads!)
4. Decode RLP at each node                 (64 decodes)
Total: 64+ DB reads per account read

Reading Solana state:
1. Key = pubkey (already known)            
2. Lookup DB[pubkey]                       (1 DB read!)
3. Deserialize bytes                       (1 decode)
Total: 1 DB read per account read

That's why Solana can handle 65,000 TPS while Ethereum handles ~15-30.
Trade-off: no cryptographic state proofs → can't support light clients.`,
  },
  {
    title: "Ethereum MPT: Why Write Amplification is a Problem",
    body: `When Alice sends 1 ETH to Bob, Ethereum must:

1. Update Alice's account: new balance in leaf node
2. Hash the leaf → new leaf hash
3. Update parent branch node with new child hash
4. Hash parent branch → new branch hash
5. Update grandparent → new grandparent hash
6. ... repeat up to root (up to 64 levels!)
7. Update state root in block header

Result: 1 logical "update balance" = up to 64 node writes in DB
Each node = keccak256(RLP(node)) → value stored, old hash invalidated

This is "write amplification" — the actual cost is much higher than it seems.
Verkle trees reduce this: polynomial commitments can batch-update more efficiently.`,
  },
  {
    title: "Cosmos IAVL vs Ethereum MPT: Historical Queries",
    body: `Ethereum MPT:
- Each block overwrites old state trie nodes
- Old state is garbage collected (pruned)
- To query historical state: need archive node (14+ TB)
- Most Ethereum RPCs don't support eth_call at old blocks

Cosmos IAVL:
- Every tree write creates new nodes (immutable/copy-on-write)
- Old nodes are KEPT (with configurable pruning)
- Query balance at block 1,000,000: statedb.GetVersioned(1000000, key)
- No archive node needed for recent history!

Why does this matter?
- Governance: verify vote counts at proposal-close block
- IBC: prove channel state at specific version
- Debugging: replay transactions at historical state`,
  },
];

export default function ComparePage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [activeDeepDive, setActiveDeepDive] = useState(0);

  const filteredChains = blockchains.filter((bc) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "fast") return bc.writeCost === "Very Low" || bc.writeCost === "Low";
    if (activeFilter === "proofs") return bc.proofSize !== "N/A";
    if (activeFilter === "history") return bc.historicalQueries;
    if (activeFilter === "parallel") return bc.parallelExec;
    return true;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-3">
              Compare All Storage Models
            </h1>
            <p className="text-[#8888aa] text-lg max-w-2xl">
              Side-by-side comparison of how Bitcoin, Ethereum, Substrate, Cosmos, Solana, Sui, 
              Aptos, and Verkle trees store state — and how that shapes their capabilities.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Quick Stats Grid */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Quick Reference</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={
                  activeFilter === f.key
                    ? { background: "#1a1a3a", color: "#c8c8ff", border: "1px solid #3a3a7a" }
                    : { background: "#0a0a14", color: "#8888aa", border: "1px solid #1a1a2e" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#1a1a2e]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#1a1a2e] bg-[#0a0a14]">
                  <th className="text-left p-3 text-[#8888aa] whitespace-nowrap">Chain</th>
                  <th className="text-left p-3 text-[#8888aa] whitespace-nowrap">Model</th>
                  <th className="text-left p-3 text-[#8888aa] whitespace-nowrap">DB</th>
                  <th className="text-left p-3 text-[#8888aa] whitespace-nowrap">Proof Size</th>
                  <th className="text-left p-3 text-[#8888aa] whitespace-nowrap">Write Cost</th>
                  <th className="text-center p-3 text-[#8888aa] whitespace-nowrap">Parallel ⚡</th>
                  <th className="text-center p-3 text-[#8888aa] whitespace-nowrap">History 📚</th>
                  <th className="text-center p-3 text-[#8888aa] whitespace-nowrap">Contracts 📜</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filteredChains.map((bc, i) => (
                  <tr
                    key={bc.id}
                    className="border-b border-[#0f0f18] hover:bg-[#0a0a14] transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold shrink-0"
                          style={{ background: `${bc.color}22`, color: bc.color }}
                        >
                          {bc.icon}
                        </span>
                        <span className="font-medium text-white whitespace-nowrap">{bc.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-0.5 rounded font-mono text-xs whitespace-nowrap"
                        style={{ background: `${bc.color}15`, color: bc.color }}
                      >
                        {bc.model.split(" ").slice(0, 3).join(" ")}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[#8888aa] whitespace-nowrap">{bc.db}</td>
                    <td className="p-3 text-[#c8c8e0] whitespace-nowrap max-w-[160px] truncate">
                      {bc.proofSize}
                    </td>
                    <td className="p-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background:
                            bc.writeCost === "Very Low"
                              ? "#001a0a"
                              : bc.writeCost === "Low"
                              ? "#001505"
                              : bc.writeCost === "High"
                              ? "#1a0000"
                              : "#0f0f00",
                          color:
                            bc.writeCost === "Very Low"
                              ? "#44cc44"
                              : bc.writeCost === "Low"
                              ? "#44aa44"
                              : bc.writeCost === "High"
                              ? "#cc4444"
                              : "#aaaa44",
                        }}
                      >
                        {bc.writeCost}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {bc.parallelExec ? (
                        <span className="text-green-500">✅</span>
                      ) : (
                        <span className="text-[#444466]">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {bc.historicalQueries ? (
                        <span className="text-yellow-500">✅</span>
                      ) : (
                        <span className="text-[#444466]">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {bc.smartContracts ? (
                        <span className="text-blue-400">✅</span>
                      ) : (
                        <span className="text-[#444466]">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Link
                        href={bc.href}
                        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded transition-all hover:opacity-80"
                        style={{ color: bc.color }}
                      >
                        Deep Dive <ArrowRight size={10} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comparison tables */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Detailed Comparison</h2>
          <div className="space-y-8">
            {comparisons.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-sm font-semibold text-[#8888aa] uppercase tracking-wider mb-3">
                  {cat.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cat.items.map((item) => {
                    const bc = blockchains.find((b) => b.name === item.chain || b.name.startsWith(item.chain));
                    return (
                      <div
                        key={item.chain}
                        className="rounded-lg border p-3"
                        style={{
                          borderColor: `${item.color}33`,
                          background: `${item.color}08`,
                        }}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="text-xs font-bold"
                            style={{ color: item.color }}
                          >
                            {bc?.icon} {item.chain}
                          </span>
                        </div>
                        <p className="text-xs text-[#8888aa] font-mono leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Dive Explanations */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Deep Dives</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {deepDiveComparisons.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDeepDive(i)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left"
                style={
                  activeDeepDive === i
                    ? { background: "#1a1a3a", color: "#c8c8ff", border: "1px solid #3a3a7a" }
                    : { background: "#0a0a14", color: "#8888aa", border: "1px solid #1a1a2e" }
                }
              >
                {d.title.split(":")[0]}
              </button>
            ))}
          </div>

          <div
            key={activeDeepDive}
            className="rounded-xl border border-[#1a1a2e] bg-[#05050e] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[#1a1a2e] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-xs text-[#8888aa] font-mono">
                {deepDiveComparisons[activeDeepDive].title}
              </span>
            </div>
            <pre className="p-5 font-mono text-xs leading-relaxed text-[#9999bb] overflow-x-auto whitespace-pre-wrap">
              {deepDiveComparisons[activeDeepDive].body}
            </pre>
          </div>
        </section>

        {/* Mind Map Summary */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">Storage Model Family Tree</h2>
          <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Root */}
              <div className="flex justify-center mb-8">
                <div className="px-4 py-2 rounded-xl border border-[#3a3a7a] bg-[#0f0f2a] text-white font-bold text-sm">
                  Blockchain Storage
                </div>
              </div>

              {/* Level 1 */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "UTXO Model", color: "#F7931A", chains: "Bitcoin" },
                  { label: "Account + Trie", color: "#627EEA", chains: "ETH, Substrate, Cosmos" },
                  { label: "Flat Account", color: "#9945FF", chains: "Solana" },
                  { label: "Object Model", color: "#6fbcf0", chains: "Sui, Aptos" },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    className="rounded-lg border p-3 text-center"
                    style={{ borderColor: `${cat.color}44`, background: `${cat.color}10` }}
                  >
                    <div style={{ color: cat.color }} className="font-semibold text-xs mb-1">
                      {cat.label}
                    </div>
                    <div className="text-[#666688] text-xs">{cat.chains}</div>
                  </div>
                ))}
              </div>

              {/* Level 2 - details */}
              <div className="grid grid-cols-8 gap-2">
                {blockchains.map((bc) => (
                  <Link key={bc.id} href={bc.href}>
                    <div
                      className="rounded-lg border p-2 text-center hover:scale-105 transition-all cursor-pointer"
                      style={{ borderColor: `${bc.color}44`, background: `${bc.color}08` }}
                    >
                      <div className="text-lg mb-1">{bc.icon}</div>
                      <div style={{ color: bc.color }} className="text-xs font-semibold">
                        {bc.name.split(" ")[0]}
                      </div>
                      <div className="text-[#444466] text-xs mt-1">{bc.db.split(" ")[0]}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Core Mental Model */}
        <section className="rounded-xl border border-[#2a2a4a] bg-[#0a0a14] p-6">
          <h2 className="text-lg font-bold text-white mb-4">The Core Mental Model</h2>
          <div className="font-mono text-xs text-[#9999bb] leading-loose whitespace-pre-wrap overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────────────────────┐
│              SAME UNDERLYING KV DATABASE (LevelDB / RocksDB)                 │
│  DB[key] = value                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
         ↓                    ↓                  ↓               ↓
   ┌──────────┐      ┌──────────────┐      ┌──────────┐   ┌──────────────┐
   │  Bitcoin │      │   Ethereum   │      │  Solana  │   │  Cosmos/Sui  │
   │  UTXO   │      │   MPT Trie   │      │  Flat    │   │  Tree/Object │
   └──────────┘      └──────────────┘      └──────────┘   └──────────────┘
   key = 'C'+txid    key = hash(node)      key = pubkey   key = hash(node)
   val = utxo_bytes  val = RLP(node)       val = account  val = encoded_node
   
   No global trie    16-way trie           No trie         Binary/AVL tree
   Merkle in header  64-nibble depth       1 DB read       Provable state
   Simple + fast     Powerful + expensive  Ultra-fast      Balanced
   No contracts      Full EVM              Programs        Move language`}
          </div>
        </section>
      </div>
    </div>
  );
}
