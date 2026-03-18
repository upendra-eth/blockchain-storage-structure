"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { blockchains } from "@/data/blockchains";
import { Database, GitBranch, Layers, Zap, ArrowRight } from "lucide-react";

const categories = [
  {
    title: "UTXO + Binary Merkle",
    color: "#F7931A",
    chains: ["bitcoin"],
    description: "No account state. Track unspent coins. Simple binary Merkle proofs.",
    icon: "₿",
  },
  {
    title: "Merkle Patricia Trie",
    color: "#627EEA",
    chains: ["ethereum"],
    description: "16-way trie. keccak256(address) = key. Powerful but storage-heavy.",
    icon: "Ξ",
  },
  {
    title: "Composed Key Trie",
    color: "#E6007A",
    chains: ["substrate"],
    description: "pallet + storage + key = composed trie path. Modular namespacing.",
    icon: "●",
  },
  {
    title: "Versioned AVL Tree",
    color: "#2FB8EB",
    chains: ["cosmos"],
    description: "IAVL — immutable, versioned. Historical queries built-in.",
    icon: "⚛",
  },
  {
    title: "Flat Account Store",
    color: "#9945FF",
    chains: ["solana"],
    description: "No global trie! Pure flat KV. Insane throughput via Sealevel.",
    icon: "◎",
  },
  {
    title: "Object Model",
    color: "#6fbcf0",
    chains: ["sui", "aptos"],
    description: "Every asset = unique object. Owned objects = parallel txs.",
    icon: "◈",
  },
  {
    title: "Verkle Trees (future)",
    color: "#00FFB3",
    chains: ["verkle"],
    description: "Polynomial commitments. Proofs 100× smaller. Stateless clients.",
    icon: "◊",
  },
];

const coreInsight = `
// All blockchains use KV databases under the hood
// The MAGIC is in what structure sits on top

Bitcoin:   DB[hash(tx)]           → Merkle binary tree
Ethereum:  DB[hash(trie_node)]    → 16-way Patricia Trie
Substrate: DB[hash(pallet+name)]  → Composed Key Trie
Cosmos:    DB[hash(iavl_node)]    → Versioned AVL Tree
Solana:    DB[pubkey]             → FLAT — no tree!
Sui:       DB[object_id]          → Sparse Merkle Tree
`;

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a1a2e] bg-[#0f0f1a] text-xs text-[#8888aa] mb-6">
            <Database size={12} />
            All blockchains use LevelDB / RocksDB under the hood
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            How Blockchains{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #627EEA, #9945FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Store Data
            </span>
          </h1>

          <p className="text-[#8888aa] text-lg max-w-2xl mx-auto leading-relaxed">
            Bitcoin, Ethereum, Solana, Cosmos, Sui, Aptos — they all use similar
            key-value databases. The difference is the{" "}
            <span className="text-white font-medium">data structure on top</span>{" "}
            and how it shapes their capabilities.
          </p>
        </div>

        {/* Core insight code block */}
        <div
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] overflow-hidden">
            <div className="px-4 py-2 border-b border-[#1a1a2e] flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
              </div>
              <span className="text-[#666688] text-xs font-mono ml-2">
                core-insight.ts
              </span>
            </div>
            <pre className="p-4 font-mono text-xs leading-relaxed text-[#8888bb] overflow-x-auto">
              {coreInsight.split("\n").map((line, i) => (
                <div key={i}>
                  {line.startsWith("//") ? (
                    <span className="text-[#444466]">{line}</span>
                  ) : line.includes("→") ? (
                    <>
                      {line.split("→")[0]}
                      <span className="text-[#627EEA]">→</span>
                      <span className="text-[#c8c8ff]">
                        {line.split("→")[1]}
                      </span>
                    </>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Storage model categories */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Storage Models
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div
                key={cat.title}
                className="rounded-xl border p-4 transition-all hover:scale-[1.02]"
                style={{
                  borderColor: `${cat.color}33`,
                  background: `${cat.color}08`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-2xl w-9 h-9 flex items-center justify-center rounded-lg text-lg"
                    style={{ background: `${cat.color}22`, color: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <h3
                    className="font-semibold text-xs leading-tight"
                    style={{ color: cat.color }}
                  >
                    {cat.title}
                  </h3>
                </div>
                <p className="text-[#8888aa] text-xs leading-relaxed mb-3">
                  {cat.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {cat.chains.map((id) => {
                    const bc = blockchains.find((b) => b.id === id);
                    if (!bc) return null;
                    return (
                      <Link
                        key={id}
                        href={bc.href}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-all hover:opacity-80"
                        style={{
                          background: `${bc.color}22`,
                          color: bc.color,
                          border: `1px solid ${bc.color}33`,
                        }}
                      >
                        {bc.icon} {bc.name}
                        <ArrowRight size={10} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blockchain cards grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-2 text-center">
            All Blockchains
          </h2>
          <p className="text-[#666688] text-sm text-center mb-6">
            Click any chain to see its storage structure in detail
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {blockchains.map((bc, i) => (
              <div
                key={bc.id}
              >
                <Link href={bc.href}>
                  <div
                    className="rounded-xl border p-5 h-full transition-all hover:scale-[1.03] hover:shadow-lg group"
                    style={{
                      borderColor: `${bc.color}22`,
                      background: `${bc.color}05`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                          style={{
                            background: `${bc.color}22`,
                            color: bc.color,
                          }}
                        >
                          {bc.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-sm text-white">
                            {bc.name}
                          </div>
                          <div className="text-xs text-[#666688]">{bc.db}</div>
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-[#444466] group-hover:text-white transition-colors"
                      />
                    </div>

                    {/* Model badge */}
                    <div
                      className="text-xs px-2 py-1 rounded mb-3 font-mono inline-block"
                      style={{
                        background: `${bc.color}15`,
                        color: bc.color,
                      }}
                    >
                      {bc.model}
                    </div>

                    <p className="text-xs text-[#8888aa] leading-relaxed mb-3">
                      {bc.tagline}
                    </p>

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#0a0a14] rounded p-2">
                        <div className="text-[#444466] text-xs">Proof Size</div>
                        <div className="text-[#c8c8e0] font-mono text-xs mt-0.5">
                          {bc.proofSize}
                        </div>
                      </div>
                      <div className="bg-[#0a0a14] rounded p-2">
                        <div className="text-[#444466] text-xs">Write Cost</div>
                        <div className="text-[#c8c8e0] font-mono text-xs mt-0.5">
                          {bc.writeCost}
                        </div>
                      </div>
                    </div>

                    {/* Feature flags */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {bc.parallelExec && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#001a0a] text-[#44aa44] border border-[#003a1a]">
                          ⚡ Parallel
                        </span>
                      )}
                      {bc.smartContracts && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#0a0a1a] text-[#4444aa] border border-[#1a1a3a]">
                          📜 Contracts
                        </span>
                      )}
                      {bc.historicalQueries && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[#1a1400] text-[#aaaa44] border border-[#3a3000]">
                          📚 History
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Compare CTA */}
        <div
          className="text-center"
        >
          <Link href="/compare">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[#2a2a4a] bg-[#0f0f1a] hover:border-[#627EEA] hover:bg-[#0f0f2a] transition-all text-sm font-medium text-white">
              <Layers size={16} className="text-[#627EEA]" />
              Compare All Storage Models Side-by-Side
              <ArrowRight size={14} className="text-[#8888aa]" />
            </div>
          </Link>
        </div>
      </section>

      {/* How to use this platform */}
      <section className="border-t border-[#1a1a2e] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-bold text-white mb-8 text-center">
            Learning Path
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Start with Bitcoin",
                desc: "Understand UTXO and Merkle trees — the simplest model. No global state, just unspent outputs.",
                href: "/bitcoin",
                color: "#F7931A",
              },
              {
                step: "02",
                title: "Deep Dive: Ethereum MPT",
                desc: "Learn the Merkle Patricia Trie — how keccak256(address) becomes a trie path. Interactive key builder.",
                href: "/ethereum",
                color: "#627EEA",
              },
              {
                step: "03",
                title: "Compare Everything",
                desc: "See how all storage models stack up — proof size, write cost, parallelism, and more.",
                href: "/compare",
                color: "#9945FF",
              },
            ].map((item) => (
              <Link key={item.step} href={item.href}>
                <div className="rounded-xl border border-[#1a1a2e] p-5 h-full hover:border-[#2a2a4a] hover:bg-[#0f0f1a] transition-all group">
                  <div
                    className="text-3xl font-black mb-3"
                    style={{ color: `${item.color}44` }}
                  >
                    {item.step}
                  </div>
                  <h3
                    className="font-semibold text-sm mb-2 group-hover:text-white transition-colors"
                    style={{ color: item.color }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#8888aa] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
