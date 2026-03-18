"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";

const SUB = "#E6007A";
const COS = "#2FB8EB";

// ─── helpers ─────────────────────────────────────────────────────────────────
function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block text-xs font-mono px-2 py-0.5 rounded-full"
      style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {text}
    </span>
  );
}

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-2xl font-bold text-white mb-2 scroll-mt-20">
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold text-white mb-2 mt-6">{children}</h3>;
}

function Explainer({ accent = SUB, children }: { accent?: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a18] border border-[#1a1a3a] rounded-xl p-4 mb-4 text-sm text-[#b0b0cc] leading-relaxed">
      <span className="font-bold mr-2" style={{ color: accent }}>
        📖 Plain English:
      </span>
      {children}
    </div>
  );
}

function BeginnerNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#0a0f0f] border border-[#1a3a3a] rounded-xl p-4 mb-4 text-sm">
      <span className="text-2xl shrink-0">💡</span>
      <div className="text-[#70c8c8] leading-relaxed">{children}</div>
    </div>
  );
}

function Divider() {
  return <hr className="border-[#1a1a2e] my-10" />;
}

function WinBadge({ winner }: { winner: "substrate" | "cosmos" | "tie" }) {
  const map = {
    substrate: { label: "Substrate Wins", color: SUB, icon: "🏆" },
    cosmos: { label: "Cosmos Wins", color: COS, icon: "🏆" },
    tie: { label: "Roughly Equal", color: "#888888", icon: "🤝" },
  };
  const w = map[winner];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full"
      style={{ background: `${w.color}22`, color: w.color, border: `1px solid ${w.color}55` }}
    >
      {w.icon} {w.label}
    </span>
  );
}

function DualBar({
  label,
  subVal,
  cosVal,
  higherIsBetter = true,
}: {
  label: string;
  subVal: number;
  cosVal: number;
  higherIsBetter?: boolean;
}) {
  return (
    <div className="mb-4">
      <div className="text-xs text-[#8888aa] mb-1 flex justify-between">
        <span>{label}</span>
        <span className="text-[#444466]">
          {higherIsBetter ? "higher = better" : "lower = better"}
        </span>
      </div>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-xs font-mono w-20 shrink-0" style={{ color: SUB }}>
          Substrate
        </span>
        <div className="flex-1 bg-[#1a1a2e] rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${subVal}%`, background: SUB, opacity: 0.85 }}
          />
        </div>
        <span className="text-xs font-mono text-[#8888aa] w-8 text-right">{subVal}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono w-20 shrink-0" style={{ color: COS }}>
          Cosmos
        </span>
        <div className="flex-1 bg-[#1a1a2e] rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full"
            style={{ width: `${cosVal}%`, background: COS, opacity: 0.85 }}
          />
        </div>
        <span className="text-xs font-mono text-[#8888aa] w-8 text-right">{cosVal}</span>
      </div>
    </div>
  );
}

function SideBySide({
  leftContent,
  rightContent,
  winner,
}: {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  winner?: "substrate" | "cosmos" | "tie";
}) {
  return (
    <div>
      {winner && (
        <div className="flex justify-end mb-2">
          <WinBadge winner={winner} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: `${SUB}33`, background: `${SUB}07` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ background: SUB }} />
            <span className="font-bold text-sm" style={{ color: SUB }}>
              Substrate / Polkadot
            </span>
          </div>
          <div className="text-sm text-[#c8c8e8] leading-relaxed">{leftContent}</div>
        </div>
        <div
          className="rounded-xl border p-4"
          style={{ borderColor: `${COS}33`, background: `${COS}07` }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full" style={{ background: COS }} />
            <span className="font-bold text-sm" style={{ color: COS }}>
              Cosmos / Tendermint
            </span>
          </div>
          <div className="text-sm text-[#c8c8e8] leading-relaxed">{rightContent}</div>
        </div>
      </div>
    </div>
  );
}

function Accordion({
  title,
  color = SUB,
  children,
  defaultOpen = false,
}: {
  title: string;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      className="rounded-xl border mb-3 overflow-hidden"
      style={{ borderColor: open ? `${color}44` : "#1a1a2e" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ background: open ? `${color}0a` : "#0a0a14" }}
      >
        <span className="font-semibold text-sm text-white">{title}</span>
        <span
          className="text-lg transition-transform shrink-0"
          style={{ transform: open ? "rotate(90deg)" : "", color }}
        >
          ▶
        </span>
      </button>
      {open && (
        <div className="px-5 py-4 bg-[#050510] border-t border-[#1a1a2e] text-sm text-[#b0b0cc] leading-relaxed space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

function ImpactCard({
  title,
  impact,
  color,
  children,
}: {
  title: string;
  impact: "high" | "medium" | "low";
  color: string;
  children: React.ReactNode;
}) {
  const impactColors = { high: "#ff6666", medium: "#f0a040", low: "#66cc66" };
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: `${color}33`, background: `${color}06` }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold text-white text-sm">{title}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full shrink-0"
          style={{
            background: `${impactColors[impact]}22`,
            color: impactColors[impact],
            border: `1px solid ${impactColors[impact]}55`,
          }}
        >
          {impact} impact
        </span>
      </div>
      <div className="text-xs text-[#9999aa] leading-relaxed">{children}</div>
    </div>
  );
}

const TOC = [
  { id: "overview", label: "1. Big Picture Overview" },
  { id: "tree-structure", label: "2. Tree Structures Compared" },
  { id: "key-formation", label: "3. Key Formation" },
  { id: "versioning", label: "4. Versioning & History" },
  { id: "reads", label: "5. Read Performance" },
  { id: "writes", label: "6. Write Performance" },
  { id: "iavl-rebalancing", label: "7. IAVL Rebalancing Cost" },
  { id: "encoding", label: "8. Encoding: SCALE vs Protobuf" },
  { id: "proof-size", label: "9. Proof Generation" },
  { id: "pruning", label: "10. Pruning Strategies" },
  { id: "real-world", label: "11. Real-World Impact" },
  { id: "summary", label: "12. Final Verdict" },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function SubstrateVsCosmosPage() {
  const [activeToc, setActiveToc] = useState("overview");

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag text="Deep Dive" color="#ffffff" />
            <Tag text="Substrate Trie" color={SUB} />
            <Tag text="Cosmos IAVL" color={COS} />
            <Tag text="Beginner Friendly" color="#27c93f" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Substrate vs Cosmos — Storage Deep Dive
          </h1>
          <p className="text-[#8888aa] text-lg max-w-3xl leading-relaxed">
            Both are leading Layer-1 / multi-chain frameworks, yet they made radically different
            choices for how they store and access state. This guide explains every difference —
            from tree structure to encoding format — with real performance impact data.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "Patricia Trie vs IAVL", color: SUB },
              { label: "Versioning Built-in (Cosmos)", color: COS },
              { label: "IAVL Rebalancing Cost", color: "#ff8800" },
              { label: "SCALE vs Protobuf", color: "#27c93f" },
              { label: "Proof Generation", color: "#9945FF" },
            ].map((t) => (
              <span
                key={t.label}
                className="px-3 py-1.5 rounded-full border text-xs"
                style={{
                  borderColor: `${t.color}44`,
                  color: t.color,
                  background: `${t.color}11`,
                }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8 items-start">
          {/* TOC */}
          <aside className="hidden xl:block w-52 shrink-0 sticky top-24 self-start">
            <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-4">
              <div className="text-xs font-bold text-[#666688] mb-3 uppercase tracking-wide">
                Contents
              </div>
              <nav className="space-y-1">
                {TOC.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    onClick={() => setActiveToc(t.id)}
                    className="block text-xs py-1.5 px-2 rounded transition-all leading-tight"
                    style={
                      activeToc === t.id
                        ? { background: `${SUB}22`, color: SUB }
                        : { color: "#8888aa" }
                    }
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ════════════════════════════════
                1. OVERVIEW
            ════════════════════════════════ */}
            <section id="overview">
              <SectionTitle id="overview">🌐 1. Big Picture Overview</SectionTitle>
              <Explainer accent={COS}>
                Substrate (used by Polkadot, Kusama, and many parachains) and Cosmos SDK (used
                by Cosmos Hub, Osmosis, Celestia, and 200+ chains) are the two dominant frameworks
                for building custom blockchains. They both use RocksDB under the hood — but
                everything above the database is completely different.
              </Explainer>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div
                  className="rounded-xl border p-5"
                  style={{ borderColor: `${SUB}44`, background: `${SUB}09` }}
                >
                  <div className="font-bold text-lg mb-1" style={{ color: SUB }}>
                    Substrate
                  </div>
                  <div className="text-xs text-[#888899] mb-3">Polkadot ecosystem</div>
                  <ul className="space-y-1.5 text-sm text-[#c8c8e8]">
                    <li>• State stored in Patricia Merkle Trie</li>
                    <li>• Keys structured by pallet namespace</li>
                    <li>• SCALE encoding (lean, no schema needed)</li>
                    <li>• No built-in versioning (opt-in history)</li>
                    <li>• Blake2b hashing for nodes</li>
                    <li>• Overlay cache buffers writes in RAM</li>
                    <li>• Database: RocksDB or ParityDB</li>
                  </ul>
                </div>
                <div
                  className="rounded-xl border p-5"
                  style={{ borderColor: `${COS}44`, background: `${COS}09` }}
                >
                  <div className="font-bold text-lg mb-1" style={{ color: COS }}>
                    Cosmos SDK
                  </div>
                  <div className="text-xs text-[#888899] mb-3">IBC ecosystem</div>
                  <ul className="space-y-1.5 text-sm text-[#c8c8e8]">
                    <li>• State stored in IAVL (Immutable AVL) Tree</li>
                    <li>• Keys prefixed by module name</li>
                    <li>• Protobuf encoding (typed, schema-required)</li>
                    <li>• Built-in versioning (every block = snapshot)</li>
                    <li>• SHA256 hashing for nodes</li>
                    <li>• Writes go straight to the IAVL in memory</li>
                    <li>• Database: GoLevelDB or RocksDB</li>
                  </ul>
                </div>
              </div>

              <BeginnerNote>
                Think of Substrate as a high-performance flat-pack warehouse — structured shelves,
                lean labels, no history kept by default, maximum throughput. Cosmos is more like
                an archive library — every version of every book is kept, indexed, and queryable,
                but maintaining that archive adds overhead.
              </BeginnerNote>
            </section>

            <Divider />

            {/* ════════════════════════════════
                2. TREE STRUCTURES
            ════════════════════════════════ */}
            <section id="tree-structure">
              <SectionTitle id="tree-structure">🌳 2. Tree Structures Compared</SectionTitle>

              <SubTitle>Substrate: Patricia Merkle Trie</SubTitle>
              <Explainer>
                Substrate uses a compressed Patricia Trie — a trie where long sequences of
                single-child nodes are collapsed into one node (like skipping floors in a building
                when there&apos;s only one staircase). This keeps the tree shallow and the nodes small.
              </Explainer>

              <CodeBlock
                title="substrate-trie-structure.txt"
                language="text"
                code={`Patricia Merkle Trie (Substrate)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Property          │ Value
──────────────────┼──────────────────────────────────
Type              │ Radix trie (compressed paths)
Branching factor  │ Variable (2–16 children per node)
Node types        │ 1 flexible type (partial_key + children + value)
Path length       │ Varies by key similarity
Ordering          │ Lexicographic on the raw key
Self-balancing    │ NO — structure follows key distribution
Node hash         │ Blake2b-256 (or Keccak-256, configurable)
Empty slots       │ Not stored (bitmask marks used children)
Merkle root       │ Hash of root node → 32 bytes`}
              />

              <SubTitle>Cosmos: IAVL Tree</SubTitle>
              <Explainer accent={COS}>
                IAVL stands for &quot;Immutable AVL&quot; tree. An AVL tree is a self-balancing binary
                search tree. &quot;Immutable&quot; means instead of modifying nodes in place, new versions
                are created, keeping old ones intact. This gives Cosmos its built-in version history
                — but comes with a cost.
              </Explainer>

              <CodeBlock
                title="cosmos-iavl-structure.txt"
                language="text"
                code={`IAVL Tree (Cosmos SDK)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Property          │ Value
──────────────────┼──────────────────────────────────
Type              │ Immutable AVL (Adelson-Velsky-Landis) tree
Branching factor  │ 2 (binary tree)
Node types        │ 2: inner nodes + leaf nodes
Path length       │ O(log₂ n) — guaranteed balanced
Ordering          │ Sorted by key (BST property)
Self-balancing    │ YES — rotations on every write
Node hash         │ SHA256
Empty slots       │ N/A (binary tree has exactly left + right)
Merkle root       │ Hash of root node → 32 bytes
Versioning        │ Every write creates new nodes; old nodes kept`}
              />

              <SubTitle>What self-balancing means — and why it matters</SubTitle>
              <BeginnerNote>
                An AVL tree always keeps itself balanced — the left and right subtrees of every
                node differ in height by at most 1. Imagine a tree of playing cards: every time
                you add or remove a card, the tree automatically reshuffles so no side gets too
                tall. This guarantees lookups always take O(log₂ n) steps — but the reshuffling
                (called &quot;rotation&quot;) costs CPU and extra writes.
              </BeginnerNote>

              <SideBySide
                winner="tie"
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Not self-balancing — shape follows key order</li>
                    <li>• With structured keys (pallet prefixes), depth is naturally bounded</li>
                    <li>• No rotation cost on writes</li>
                    <li>• Path length depends on key similarity</li>
                    <li className="text-[#27c93f]">✅ Simpler write path — no rebalancing</li>
                    <li className="text-[#ff6666]">❌ Worst case: very deep if keys collide early</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Self-balancing AVL — always O(log₂ n)</li>
                    <li>• Every write potentially triggers 1-2 rotations</li>
                    <li>• Each rotation = new nodes written (immutable)</li>
                    <li>• Path length is strictly bounded and predictable</li>
                    <li className="text-[#27c93f]">✅ Guaranteed O(log n) reads always</li>
                    <li className="text-[#ff6666]">❌ Rotations add CPU + write amplification</li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                3. KEY FORMATION
            ════════════════════════════════ */}
            <section id="key-formation">
              <SectionTitle id="key-formation">🔑 3. Key Formation</SectionTitle>
              <Explainer>
                The &quot;key&quot; is the path used to find data in the tree. How you build the key
                determines how data is physically laid out in storage, which directly affects
                cache efficiency and query performance.
              </Explainer>

              <SubTitle>Substrate — Namespaced Structured Keys</SubTitle>
              <CodeBlock
                title="substrate-key-formation.ts"
                language="text"
                code={`// Every key in Substrate is built from 3 parts:

final_key =
  Twox128("PalletName")          // 16 bytes — non-crypto hash of pallet name
  ++ Twox128("StorageItemName")  // 16 bytes — non-crypto hash of storage item  
  ++ KeyHasher(actual_key)       // 16-32 bytes — depends on storage type

// Example: Balances pallet, Account storage map, for Alice:
final_key = 
  Twox128("Balances")            = 0x26aa394eea5630e07c48ae0c9558cef7
  Twox128("Account")             = 0xb99d880ec681799c0cf30e8886371da9
  Blake2_128Concat(Alice_pubkey) = 0xde1e86a9a8c739864cf3cc5ec2bea59f...

// KEY PROPERTIES:
// ✅ All Balances.Account entries share the same 32-byte prefix
// ✅ Scanning all accounts in a pallet = prefix scan (very fast)
// ✅ Cache-friendly: related data lives near each other in RocksDB
// ❌ Key is opaque if you don't know the pallet/storage structure`}
              />

              <SubTitle>Cosmos SDK — Module-Prefixed Simple Keys</SubTitle>
              <CodeBlock
                title="cosmos-key-formation.ts"
                language="text"
                code={`// Cosmos SDK uses a KV Store abstraction per module
// Each module gets its own isolated KV namespace

// Store key for Cosmos bank module:
prefix = "bank/"   // module name as ASCII string prefix
key    = "balances/cosmos1abc..."  // human-readable path

// In the IAVL tree, the actual stored key is:
iavl_key = prefix + key
         = "bank/balances/cosmos1abc..."

// The IAVL tree sorts keys lexicographically (BST property)
// So all "bank/" keys are sorted and adjacent in the tree

// KEY PROPERTIES:
// ✅ Human-readable keys — easier debugging
// ✅ Module isolation — each module's keys are contiguous
// ✅ Natural range scans (sorted BST)
// ✅ IBC proofs use full key path for cross-chain verification
// ❌ Variable-length keys complicate some optimizations
// ❌ No hashing on keys — prefix collision if not careful`}
              />

              <SideBySide
                winner="tie"
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Fixed-length 32-byte prefix per pallet+storage</li>
                    <li>• Actual key hashed → uniform distribution</li>
                    <li>• Excellent RocksDB prefix scan support</li>
                    <li>• Keys are opaque (can&apos;t decode without schema)</li>
                    <li>• Prevents any key length-based attacks</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Variable-length human-readable keys</li>
                    <li>• Module name as ASCII prefix string</li>
                    <li>• IAVL BST ordering gives free range queries</li>
                    <li>• Keys are readable/debuggable</li>
                    <li>• Key ordering is semantically meaningful</li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                4. VERSIONING
            ════════════════════════════════ */}
            <section id="versioning">
              <SectionTitle id="versioning">📚 4. Versioning — Cosmos&apos;s Biggest Advantage</SectionTitle>
              <Explainer accent={COS}>
                This is the most important architectural difference between the two. Cosmos has
                versioned state built into the tree itself — you can query ANY historical block&apos;s
                state instantly. Substrate does not — it requires separate archive node tooling.
              </Explainer>

              <BeginnerNote>
                Think of Cosmos&apos;s IAVL like Google Docs — every edit creates a new version, and
                you can go back to any point in time. Substrate is more like a notepad where you
                scratch out and rewrite — you can keep old copies if you want (archive mode), but
                the notepad itself doesn&apos;t remember history.
              </BeginnerNote>

              <SubTitle>How Cosmos IAVL Versioning Works</SubTitle>
              <CodeBlock
                title="iavl-versioning.ts"
                language="text"
                code={`// IAVL is "immutable" — nodes are never modified in-place
// Every write creates new nodes; old nodes remain in DB

// Block 100: Alice has 100 ATOM
root_100 = NodeHash {
  left: NodeHash(Alice → 100),
  right: NodeHash(Bob → 50)
}

// Block 101: Alice sends 10 ATOM to Bob
// New nodes created for changed path; old nodes stay intact
root_101 = NodeHash {
  left: NodeHash(Alice → 90),   // NEW node
  right: NodeHash(Bob → 60)     // NEW node
}

// Block 100 root_100 still exists in the DB!
// You can query:
iavl.GetVersioned(100, "balances/alice")  // returns 100 ATOM
iavl.GetVersioned(101, "balances/alice")  // returns 90 ATOM

// This is how Cosmos light clients work:
// A validator can prove historical state without extra tooling
// This is CRITICAL for IBC (cross-chain message verification)`}
              />

              <SubTitle>Cosmos Versioning — The Cost</SubTitle>
              <div className="space-y-3 mb-6">
                {[
                  {
                    title: "Storage bloat",
                    desc: "Every block creates new nodes. Over millions of blocks, this accumulates enormously. A Cosmos Hub full node needs ~800GB+ for all historical IAVL data. Pruning (deleting old versions) reduces this but requires careful configuration.",
                  },
                  {
                    title: "Write amplification",
                    desc: "Instead of updating one node, a write creates a chain of new nodes from leaf to root (the changed path). Plus old nodes are kept. So 1 logical write = 2× the actual DB entries compared to a mutable structure.",
                  },
                  {
                    title: "Memory pressure",
                    desc: "The current version&apos;s IAVL is kept in memory for fast access. With many modules and large state (Osmosis has millions of LP positions), this can require 8-32GB of RAM for validators.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="flex gap-3 rounded-xl border border-[#2a1a0a] bg-[#0f0800] p-4"
                  >
                    <span className="text-orange-400 text-xl shrink-0">⚠️</span>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                      <div className="text-[#aa8866] text-xs leading-relaxed">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <SubTitle>How Substrate Handles History</SubTitle>
              <CodeBlock
                title="substrate-history.ts"
                language="text"
                code={`// Substrate does NOT version the trie by default
// State is updated in-place (old nodes overwritten or deleted)

// To get historical state, you need an ARCHIVE NODE:
// Archive nodes keep all old state in a separate "state database"
// They're much larger and slower to sync

// Substrate's approach:
// - Full node: keeps only recent state (prunable)
// - Archive node: keeps all state (like Cosmos always does)

// Substrate's TrieBackend:
let backend = TrieBackend::new(storage, root);
// "root" is the state root of a specific block
// You can query historical state IF you have the archive
// But the trie itself doesn't store old nodes natively

// The advantage:
// Full nodes are MUCH smaller (Substrate node: ~50-200GB vs Cosmos ~800GB+)
// The disadvantage:
// Historical queries require archive nodes or external indexers`}
              />

              <SideBySide
                winner="cosmos"
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• No built-in versioning in the trie</li>
                    <li>• Full nodes are compact (only recent state)</li>
                    <li>• Historical queries need archive node or indexer</li>
                    <li>• State pruning is simple — just delete old keys</li>
                    <li className="text-[#27c93f]">✅ Much smaller storage footprint for full nodes</li>
                    <li className="text-[#ff6666]">❌ Can&apos;t prove historical state without archive</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Built-in versioning — every block is a snapshot</li>
                    <li>• All nodes can prove ANY historical state</li>
                    <li>• Critical for IBC cross-chain light clients</li>
                    <li>• State grows with every block (needs pruning)</li>
                    <li className="text-[#27c93f]">✅ Historical proofs without archive infrastructure</li>
                    <li className="text-[#ff6666]">❌ Much larger storage requirement (800GB+)</li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                5. READ PERFORMANCE
            ════════════════════════════════ */}
            <section id="reads">
              <SectionTitle id="reads">📖 5. Read Performance</SectionTitle>
              <Explainer>
                Reading means fetching a value from state — checking a balance, reading a contract
                variable. Performance depends on tree depth (how many nodes to traverse), node size
                (how much data to load), and cache locality (is the data already in RAM?).
              </Explainer>

              <SubTitle>Substrate Read Path</SubTitle>
              <CodeBlock
                title="substrate-read.ts"
                language="text"
                code={`// Reading Balances.Account[Alice]:
1. Build key: Twox128("Balances") ++ Twox128("Account") ++ Blake2_128Concat(alice)
   → fast (Twox is non-crypto, ~5ns per call)
   
2. Look up in TrieBackend overlay (in-memory cache first)
   → if hit: return immediately (sub-microsecond)
   
3. If miss: traverse Patricia trie from current state root
   → follow partial_key path through nodes
   → each node: RocksDB read + SCALE decode
   
4. Return SCALE-encoded value, decode on client side

// Performance characteristics:
// - Structured keys → high cache hit rate for related keys
// - SCALE decode is fast (no schema lookup needed)
// - Path length: bounded by key diversity
// - Typical reads in a block: 95%+ come from overlay (RAM)`}
              />

              <SubTitle>Cosmos IAVL Read Path</SubTitle>
              <CodeBlock
                title="cosmos-read.ts"
                language="text"
                code={`// Reading bank.balances[alice]:
1. Look up in current version IAVL (in-memory working set)
   → IAVL keeps the "working tree" in memory
   → if hit: O(1) return
   
2. If not in working set: traverse IAVL from root
   → binary BST traversal: left or right at each inner node
   → each node: RocksDB read + decode
   → O(log₂ n) steps: for 1M entries = ~20 steps
   
3. Return value (Protobuf-encoded), decode with generated code

// Performance characteristics:
// - O(log₂ n) guaranteed (balanced AVL)
// - In-memory IAVL for current version = very fast for hot data
// - SHA256 hash verification at each node (CPU cost)
// - Binary tree = more levels than Patricia (for same data)
// - Historical reads: fast (just use getVersioned() API)`}
              />

              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 mb-4">
                <div className="text-sm font-bold text-white mb-4">Read Performance Indicators</div>
                <DualBar label="Cache locality (related keys near each other)" subVal={80} cosVal={65} />
                <DualBar label="Cold read speed (uncached, DB lookup)" subVal={62} cosVal={58} />
                <DualBar label="Historical state read speed" subVal={20} cosVal={90} higherIsBetter />
                <DualBar label="Batch read efficiency (read 1000 related keys)" subVal={85} cosVal={60} />
                <p className="text-xs text-[#444466] mt-2">
                  Bars show relative capability (higher = better for that metric). Based on published
                  benchmarks from Parity, Cosmos engineering blog, and community reports.
                </p>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                6. WRITE PERFORMANCE
            ════════════════════════════════ */}
            <section id="writes">
              <SectionTitle id="writes">✍️ 6. Write Performance</SectionTitle>
              <Explainer>
                Writing updates the state — transfers, contract calls, governance votes. Both
                systems must recompute the Merkle root after writes so that validators can agree
                on the new state. The cost is how much CPU and disk work that takes.
              </Explainer>

              <SubTitle>Substrate — Overlay Cache Strategy</SubTitle>
              <BeginnerNote>
                Substrate collects ALL writes for a block in a RAM buffer called the &quot;overlay&quot;.
                None of them hit the database until the block is finalised. Then all changes are
                flushed to RocksDB in one batch. This is very I/O efficient — like writing one
                big save at the end instead of saving after every keystroke.
              </BeginnerNote>

              <CodeBlock
                title="substrate-write.ts"
                language="text"
                code={`// Substrate write flow during block execution:
//
// 1. All pallet storage writes go to OverlayChangeset (RAM)
//    → Zero disk I/O during block execution
//
// 2. At end of block: compute new state root
//    → Traverse changed nodes in overlay
//    → Blake2b-hash each changed node
//    → Propagate hashes to root
//
// 3. Commit to RocksDB in one batch write
//    → RocksDB batching is extremely fast
//    → One fsync call instead of one per write

// Example: 5000 state changes in one block
// Substrate: 0 DB reads, 0 DB writes during execution
//            1 batch DB write at block end (~10-50ms)
//
// Overhead per write: ~1 Blake2b hash + node re-encode (SCALE)
// Blake2b: ~3-5ns per byte → very fast`}
              />

              <SubTitle>Cosmos — Direct IAVL Write Strategy</SubTitle>
              <CodeBlock
                title="cosmos-write.ts"
                language="text"
                code={`// Cosmos write flow during block execution:
//
// 1. Writes go to IAVL working tree (in-memory IAVL)
//    → IAVL modified in memory → no disk I/O yet
//    → BUT: AVL rebalancing happens in memory immediately
//
// 2. At end of block: Commit the IAVL
//    → SaveVersion() called on the IAVL
//    → New nodes written to RocksDB (old nodes kept!)
//    → Every changed path = new nodes from leaf to root
//
// 3. SHA256 hashed at each node up the tree

// Example: 5000 state changes in one block
// Cosmos: 0 DB reads during execution (in-memory IAVL)
//         ~5000-15000 new DB entries (write amplification from
//          immutable nodes + path re-creation)
//         SHA256 at each modified node = expensive CPU
//
// Additionally: IAVL rebalancing rotations on insert/delete
// (see next section for full rebalancing cost analysis)`}
              />

              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 mb-4">
                <div className="text-sm font-bold text-white mb-4">Write Performance Indicators</div>
                <DualBar label="Write amplification (lower = fewer actual DB writes)" subVal={75} cosVal={40} higherIsBetter />
                <DualBar label="CPU cost per state change" subVal={70} cosVal={45} higherIsBetter />
                <DualBar label="Batch commit efficiency" subVal={85} cosVal={60} />
                <DualBar label="Memory usage during block execution" subVal={75} cosVal={55} higherIsBetter />
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                7. IAVL REBALANCING
            ════════════════════════════════ */}
            <section id="iavl-rebalancing">
              <SectionTitle id="iavl-rebalancing">⚖️ 7. IAVL Rebalancing — The Hidden Cost</SectionTitle>
              <Explainer accent={COS}>
                This is the most discussed performance bottleneck in Cosmos. Every time a key is
                inserted or deleted, the AVL tree may need to rotate nodes to stay balanced.
                Combined with IAVL&apos;s immutability, this creates significant write amplification.
              </Explainer>

              <SubTitle>What is an AVL Rotation?</SubTitle>
              <BeginnerNote>
                Imagine you have a see-saw (the tree). When one side gets too heavy, you move some
                weight to the other side to balance it. That&apos;s a rotation. In a binary tree, when
                the left side is 2+ levels deeper than the right, the tree reshuffles one node up
                and two nodes down to rebalance. In IAVL, since nodes are immutable, the reshuffled
                nodes are entirely new DB entries.
              </BeginnerNote>

              <CodeBlock
                title="avl-rotation.txt"
                language="text"
                code={`// AVL Rotation Example (conceptual):
//
// BEFORE inserting key "D":
//         B
//        / \\
//       A   C
//
// After inserting D (tree becomes right-heavy):
//         B
//        / \\
//       A   C
//             \\
//              D    ← Height diff = 2, UNBALANCED
//
// LEFT ROTATION at B:
//         C         ← C promoted to root
//        / \\
//       B   D
//      /
//     A
//
// In IAVL (immutable): B, C are NEW nodes in DB
// Old B and C remain (for historical version)
// Result: 2 writes for the old nodes + 2 writes for new = 4 writes
//         for what is logically 1 insert

// In Substrate Patricia Trie: NO rotation ever
// Insert D: just add a new node at the correct position
// 1 logical insert = ~1-2 actual node writes`}
              />

              <SubTitle>Real Impact of IAVL Rebalancing</SubTitle>
              <div className="space-y-3 mb-6">
                {[
                  {
                    title: "Write amplification: 3-5× per logical write",
                    desc: "A single key insert in IAVL can require writing 3-8 new nodes (leaf + parent chain + rotated nodes). In Substrate, the same insert writes 1-3 nodes. At high TPS (1000+ tx/s), this is a significant throughput bottleneck.",
                    impact: "high" as const,
                    color: SUB,
                  },
                  {
                    title: "Osmosis discovered this at scale",
                    desc: "Osmosis (a major Cosmos DEX) found that IAVL performance degraded significantly above 100GB of state. Each LP position update triggered multiple rebalances. This was a key motivation for the IAVL v2 and ongoing discussions about moving to SMT (Sparse Merkle Tree) in Cosmos.",
                    impact: "high" as const,
                    color: COS,
                  },
                  {
                    title: "IAVL v2 addresses some issues",
                    desc: "Cosmos has invested in IAVL v2 (2023-2024) which separates the tree structure from values, caches inner nodes more aggressively, and reduces disk reads. Benchmarks show 10-50% improvement. But the fundamental write amplification from immutability + rebalancing remains.",
                    impact: "medium" as const,
                    color: COS,
                  },
                  {
                    title: "Substrate is immune to this",
                    desc: "Patricia Tries don&apos;t self-balance. Substrate's structured keys (pallet namespacing) ensure the trie is naturally well-distributed. There&apos;s no concept of rotation, so every insert is a straight O(key_length) operation.",
                    impact: "medium" as const,
                    color: SUB,
                  },
                ].map((c) => (
                  <ImpactCard key={c.title} title={c.title} impact={c.impact} color={c.color}>
                    {c.desc}
                  </ImpactCard>
                ))}
              </div>

              <SubTitle>IAVL vs Patricia Write Cost at Scale</SubTitle>
              <CodeBlock
                title="write-cost-comparison.txt"
                language="text"
                code={`Scenario: 1,000 state updates in one block

SUBSTRATE PATRICIA TRIE:
  Logical writes:      1,000
  Actual node writes:  ~2,000–4,000  (2-4× amplification)
  Hash operations:     ~2,000–4,000  (Blake2b, ~5ns each)
  Rotation events:     0
  Estimated time:      ~10-30ms

COSMOS IAVL (v1):
  Logical writes:      1,000
  Actual node writes:  ~5,000–12,000 (5-12× amplification from
                         immutability + rotations)
  Hash operations:     ~5,000–12,000 (SHA256, ~25ns each)
  Rotation events:     ~200–400
  Estimated time:      ~50-150ms

COSMOS IAVL (v2, 2024):
  Actual node writes:  ~3,000–7,000  (improved caching)
  Estimated time:      ~25-80ms      (2-3× faster than v1)

Note: Times are approximate and vary by hardware, state size,
and specific workload. Source: Cosmos engineering blog, 
informal.systems benchmarks, Osmosis state analysis.`}
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                8. ENCODING
            ════════════════════════════════ */}
            <section id="encoding">
              <SectionTitle id="encoding">🔢 8. Encoding: SCALE vs Protobuf</SectionTitle>
              <Explainer>
                Every value stored in the state must be serialised (converted to bytes) for storage,
                and deserialised (converted back) when read. The serialisation format affects node
                size, CPU cost, and whether you need a schema to read the data.
              </Explainer>

              <Accordion title="SCALE (Substrate) — Lean Binary Format" color={SUB} defaultOpen>
                <BeginnerNote>
                  SCALE is like a language with no grammar — just the raw words in order. The decoder
                  already knows what type to expect (it&apos;s compiled in), so no type markers are
                  needed. This makes it very compact but you must know the schema at compile time.
                </BeginnerNote>
                <CodeBlock
                  title="scale-encoding.ts"
                  language="text"
                  code={`// SCALE encoding — no schema needed at runtime, very compact

// Encoding a struct AccountInfo { nonce: u32, balance: u128 }:
// nonce = 5       → [05 00 00 00]  (4 bytes, little-endian)
// balance = 1000  → [e8 03 00 00 00 00 00 00 00 00 00 00 00 00 00 00] (16 bytes)
// Total: 20 bytes — raw values concatenated

// No field names, no type tags, no length prefixes for fixed types
// Variable types use compact encoding for length

// Advantages:
// ✅ Smallest possible output for fixed-size types
// ✅ Zero-copy decoding possible (for fixed types)
// ✅ Very fast encode/decode (just memcpy for fixed types)
// ✅ No schema file needed at runtime

// Disadvantages:
// ❌ Not self-describing — you must know the type
// ❌ Schema evolution is manual (breaking changes = migration)
// ❌ Cross-language support is limited (Rust-centric ecosystem)`}
                />
              </Accordion>

              <Accordion title="Protobuf (Cosmos) — Typed Schema Format" color={COS}>
                <BeginnerNote>
                  Protobuf is like a language with a dictionary — every word (field) has a number
                  and a type. The encoder writes field numbers alongside values, so the decoder can
                  skip unknown fields. This makes it forward-compatible but adds overhead per field.
                </BeginnerNote>
                <CodeBlock
                  title="protobuf-encoding.ts"
                  language="text"
                  code={`// Protobuf encoding — typed, schema-first, forward-compatible

// .proto definition (schema file):
message AccountInfo {
  uint64 nonce = 1;      // field number 1
  string balance = 2;    // field number 2
}

// Encoding AccountInfo { nonce: 5, balance: "1000" }:
// Field 1 (nonce), varint: [08] [05]        (2 bytes)
// Field 2 (balance), string: [12] [04] "1000" (6 bytes)
// Total: 8 bytes — smaller than raw when fields are sparse
// But larger for dense structs due to field tags

// Advantages:
// ✅ Self-describing — can decode without knowing exact schema version
// ✅ Forward/backward compatible — unknown fields are ignored
// ✅ Excellent cross-language support (Go, Rust, Python, etc.)
// ✅ Tooling: grpc, protoc code generation

// Disadvantages:
// ❌ Requires .proto schema files to be maintained
// ❌ Varint encoding adds per-field overhead
// ❌ String encoding for numbers (in some Cosmos types) wastes space
// ❌ Larger than SCALE for fixed-size numeric types`}
                />
              </Accordion>

              <SubTitle>Size Comparison — Real Data</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-5 mb-4">
                {[
                  { type: "Simple balance (u128)", scale: "16 bytes", proto: "8-18 bytes", note: "Comparable; proto uses varint" },
                  { type: "Account info struct", scale: "~50 bytes", proto: "~70-90 bytes", note: "Proto overhead per field" },
                  { type: "Complex nested type", scale: "varies", proto: "varies + tags", note: "Proto adds ~1-2 bytes per field" },
                  { type: "Large vector of items", scale: "compact_len + items", proto: "length-delimited + tags", note: "SCALE wins for dense arrays" },
                ].map((r) => (
                  <div key={r.type} className="flex flex-wrap gap-2 items-start py-2 border-b border-[#1a1a2e] last:border-0">
                    <div className="w-48 text-xs text-[#8888aa] shrink-0">{r.type}</div>
                    <Tag text={`SCALE: ${r.scale}`} color={SUB} />
                    <Tag text={`Proto: ${r.proto}`} color={COS} />
                    <span className="text-xs text-[#555566]">{r.note}</span>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                9. PROOF GENERATION
            ════════════════════════════════ */}
            <section id="proof-size">
              <SectionTitle id="proof-size">🔐 9. Proof Generation</SectionTitle>
              <Explainer>
                State proofs let someone verify that a specific value is genuinely part of the
                blockchain state — without downloading everything. This is critical for light
                clients, cross-chain bridges (like IBC), and mobile wallets.
              </Explainer>

              <SubTitle>Proof Types</SubTitle>
              <SideBySide
                winner="tie"
                leftContent={
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: SUB }}>Substrate Proof</div>
                      <ul className="space-y-1 text-xs">
                        <li>• Patricia Trie proof: set of nodes on the path</li>
                        <li>• Compact node encoding (SCALE)</li>
                        <li>• Typical size: 2-8KB</li>
                        <li>• Used in Polkadot light client protocol</li>
                        <li>• Proof verification: O(depth × hash_cost)</li>
                        <li className="text-[#27c93f]">✅ Smaller than Cosmos for single key proofs</li>
                      </ul>
                    </div>
                  </div>
                }
                rightContent={
                  <div className="space-y-3">
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: COS }}>Cosmos / IBC Proof</div>
                      <ul className="space-y-1 text-xs">
                        <li>• IAVL absence/existence proof</li>
                        <li>• Binary tree path + sibling hashes</li>
                        <li>• Typical size: 3-8KB</li>
                        <li>• Used extensively in IBC message verification</li>
                        <li>• Proof verification: O(log n × SHA256)</li>
                        <li className="text-[#27c93f]">✅ Historical proofs without archive nodes</li>
                      </ul>
                    </div>
                  </div>
                }
              />

              <SubTitle>IBC — Why Cosmos Proofs Matter More</SubTitle>
              <BeginnerNote>
                IBC (Inter-Blockchain Communication) is Cosmos&apos;s protocol for passing messages
                between chains. Every cross-chain message requires a Merkle proof that the message
                was committed on the source chain. Cosmos&apos;s IAVL makes this simple — every
                validator can generate historical proofs. Without this, you&apos;d need a trusted
                relayer service.
              </BeginnerNote>

              <CodeBlock
                title="ibc-proof-flow.ts"
                language="text"
                code={`// IBC message proof flow (simplified):

// Chain A sends a packet to Chain B:
// 1. Chain A commits the packet in its IAVL state
// 2. Relayer queries Chain A: "give me proof that packet P exists at height H"
// 3. Chain A returns: iavl.ProveExistence("ibc/packets/channel-0/1", height=H)
//    → Returns: [inner_node_hashes, leaf_data, version=H]
// 4. Relayer submits proof to Chain B
// 5. Chain B's light client verifies:
//    → Uses Chain A's trusted block header (root hash at height H)
//    → Reconstructs hash from proof → matches root → VALID

// Without versioned state (like Substrate without archive):
// Step 3 fails if height H is pruned from the node
// → Requires archive infrastructure for reliable IBC

// This is why Cosmos chose immutable IAVL despite the write cost:
// The versioning is REQUIRED for IBC light client security`}
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                10. PRUNING
            ════════════════════════════════ */}
            <section id="pruning">
              <SectionTitle id="pruning">🗑️ 10. Pruning Strategies</SectionTitle>
              <Explainer>
                &quot;Pruning&quot; means deleting old data you no longer need to save disk space.
                How and when old state is deleted is fundamentally different between the two systems
                because of their different approaches to versioning.
              </Explainer>

              <SideBySide
                winner="substrate"
                leftContent={
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold mb-2">Substrate Pruning</div>
                    <ul className="space-y-2">
                      <li>• State trie nodes not referenced by any recent block root are deleted</li>
                      <li>• Configurable: keep last N block states (default: 256)</li>
                      <li>• Dead nodes are identified and removed incrementally</li>
                      <li>• No version tracking overhead — nodes exist or they don&apos;t</li>
                      <li className="text-[#27c93f]">✅ Very efficient — minimal overhead</li>
                      <li className="text-[#27c93f]">✅ Full node stays small (50-200GB typically)</li>
                    </ul>
                  </div>
                }
                rightContent={
                  <div className="space-y-2 text-sm">
                    <div className="font-semibold mb-2">Cosmos IAVL Pruning</div>
                    <ul className="space-y-2">
                      <li>• Old versions of IAVL nodes must be explicitly deleted</li>
                      <li>• &quot;Snapshot&quot; versions (every Nth block) kept longer</li>
                      <li>• Pruning is slow: must identify which nodes belong to which version</li>
                      <li>• Pruning runs can cause latency spikes (&quot;pruning pauses&quot;)</li>
                      <li className="text-[#ff6666]">❌ Complex — known source of bugs historically</li>
                      <li className="text-[#ff6666]">❌ Nodes grow quickly without aggressive pruning</li>
                    </ul>
                  </div>
                }
              />

              <BeginnerNote>
                Cosmos chains like Osmosis have experienced &quot;pruning pauses&quot; — short periods
                where the node stops processing blocks while it cleans up old IAVL data. This has
                caused brief validator outages. Substrate&apos;s simpler approach doesn&apos;t have this
                problem but means you lose historical proofs on non-archive nodes.
              </BeginnerNote>
            </section>

            <Divider />

            {/* ════════════════════════════════
                11. REAL WORLD IMPACT
            ════════════════════════════════ */}
            <section id="real-world">
              <SectionTitle id="real-world">🌍 11. Real-World Impact</SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  {
                    category: "TPS Capacity",
                    subVal: "~1000-3000 TPS (Substrate chains)",
                    cosVal: "~500-1500 TPS (Cosmos chains)",
                    subNote: "Write overlay + Blake2b give throughput advantage",
                    cosNote: "IAVL write amplification + SHA256 are bottlenecks",
                    winner: "substrate" as const,
                  },
                  {
                    category: "Cross-Chain Bridges",
                    subVal: "Good (Polkadot XCM, BEEFY protocol)",
                    cosVal: "Excellent (IBC, light client native)",
                    subNote: "BEEFY bridges use separate commitment scheme",
                    cosNote: "IBC is the gold standard for trust-minimised bridges",
                    winner: "cosmos" as const,
                  },
                  {
                    category: "Node Storage Size",
                    subVal: "50-300GB (full node, recent chains)",
                    cosVal: "300GB-2TB (with IAVL history)",
                    subNote: "Compact state without version history",
                    cosNote: "IAVL versioning balloons storage over time",
                    winner: "substrate" as const,
                  },
                  {
                    category: "Historical Queries",
                    subVal: "Requires archive node (500GB+)",
                    cosVal: "Built-in on all full nodes",
                    subNote: "Archive mode available but not default",
                    cosNote: "Any full node can answer historical queries",
                    winner: "cosmos" as const,
                  },
                  {
                    category: "Block Time",
                    subVal: "6s (Polkadot), 12s-variable (parachains)",
                    cosVal: "~7s average (Tendermint BFT finality)",
                    subNote: "BABE+GRANDPA consensus",
                    cosNote: "CometBFT (Tendermint) instant finality",
                    winner: "tie" as const,
                  },
                  {
                    category: "State Explosion Risk",
                    subVal: "Low (state grows linearly)",
                    cosVal: "Medium-High (IAVL versions accumulate)",
                    subNote: "Efficient pruning keeps size in check",
                    cosNote: "Known issue; IAVL v2 mitigates but doesn&apos;t solve",
                    winner: "substrate" as const,
                  },
                ].map((r) => (
                  <div
                    key={r.category}
                    className="rounded-xl border border-[#1a1a2e] bg-[#080816] p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-white text-sm">{r.category}</span>
                      <WinBadge winner={r.winner} />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs font-mono mb-0.5" style={{ color: SUB }}>
                          Substrate:
                        </div>
                        <div className="text-xs text-[#c8c8e8]">{r.subVal}</div>
                        <div className="text-xs text-[#666688]">{r.subNote}</div>
                      </div>
                      <div>
                        <div className="text-xs font-mono mb-0.5" style={{ color: COS }}>
                          Cosmos:
                        </div>
                        <div className="text-xs text-[#c8c8e8]">{r.cosVal}</div>
                        <div className="text-xs text-[#666688]">{r.cosNote}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                12. FINAL VERDICT
            ════════════════════════════════ */}
            <section id="summary">
              <SectionTitle id="summary">🎯 12. Final Verdict</SectionTitle>

              <div className="rounded-xl border border-[#1a1a3a] bg-[#080816] p-6 mb-6">
                <p className="text-[#b0b0cc] text-sm leading-relaxed mb-4">
                  There is no universal winner — the right choice depends on what you&apos;re building.
                  Here&apos;s the decision framework:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${SUB}44`, background: `${SUB}09` }}
                  >
                    <div className="font-bold mb-3" style={{ color: SUB }}>
                      Choose Substrate when...
                    </div>
                    <ul className="space-y-2 text-sm text-[#c8c8e8]">
                      <li>✅ Maximum write throughput is critical</li>
                      <li>✅ You want small node storage footprint</li>
                      <li>✅ You&apos;re building in the Polkadot ecosystem</li>
                      <li>✅ Historical queries can use external indexers</li>
                      <li>✅ You want lean, fast state transitions</li>
                      <li>✅ Custom runtime logic (pallets) is a priority</li>
                    </ul>
                  </div>
                  <div
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${COS}44`, background: `${COS}09` }}
                  >
                    <div className="font-bold mb-3" style={{ color: COS }}>
                      Choose Cosmos when...
                    </div>
                    <ul className="space-y-2 text-sm text-[#c8c8e8]">
                      <li>✅ IBC cross-chain connectivity is a requirement</li>
                      <li>✅ Historical state queries must be native</li>
                      <li>✅ Light client security is paramount</li>
                      <li>✅ You need human-readable state keys</li>
                      <li>✅ You want Protobuf / gRPC API out of box</li>
                      <li>✅ Strong tooling for DeFi / exchange apps</li>
                    </ul>
                  </div>
                </div>
              </div>

              <SubTitle>One-Line Summary</SubTitle>
              <div className="space-y-3">
                {[
                  {
                    color: SUB,
                    chain: "Substrate",
                    line: "A lean, high-throughput state machine — structured keys and overlay caching give it a write speed advantage, while compact SCALE encoding keeps node sizes small. Trade-off: no built-in history means archive nodes are needed for historical proofs.",
                  },
                  {
                    color: COS,
                    chain: "Cosmos",
                    line: "A versioned, IBC-native archive — the immutable IAVL tree makes cross-chain light client proofs trivial and historical queries free, at the cost of write amplification, storage bloat, and complex pruning. The right choice when trustless cross-chain connectivity is the primary goal.",
                  },
                ].map((c) => (
                  <div
                    key={c.chain}
                    className="flex gap-3 items-start rounded-xl border p-4"
                    style={{ borderColor: `${c.color}33`, background: `${c.color}07` }}
                  >
                    <span className="font-bold text-sm shrink-0" style={{ color: c.color }}>
                      {c.chain}
                    </span>
                    <p className="text-sm text-[#c8c8e0] leading-relaxed">{c.line}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
