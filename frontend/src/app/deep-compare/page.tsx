"use client";

import { useState } from "react";
import InfoCard from "@/components/InfoCard";
import CodeBlock from "@/components/CodeBlock";

// ─── colour palette ───────────────────────────────────────────────────────────
const ETH = "#627EEA";
const SUB = "#E6007A";
const BTC = "#F7931A";
const COS = "#2FB8EB";
const SOL = "#9945FF";

// ─── small helpers ────────────────────────────────────────────────────────────
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

function Explainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0a0a18] border border-[#1a1a3a] rounded-xl p-4 mb-4 text-sm text-[#b0b0cc] leading-relaxed">
      <span className="text-[#627EEA] font-bold mr-2">📖 Plain English:</span>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-[#1a1a2e] my-10" />;
}

function BeginnerNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#0f0f0a] border border-[#3a3a1a] rounded-xl p-4 mb-4 text-sm">
      <span className="text-2xl shrink-0">💡</span>
      <div className="text-[#c8c870] leading-relaxed">{children}</div>
    </div>
  );
}

function PerformanceMeter({
  label,
  eth,
  sub,
}: {
  label: string;
  eth: number;   // 0-100, higher = more expensive/slower
  sub: number;
}) {
  return (
    <div className="mb-4">
      <div className="text-xs text-[#8888aa] mb-1">{label}</div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono w-20 shrink-0" style={{ color: ETH }}>
          Ethereum
        </span>
        <div className="flex-1 bg-[#1a1a2e] rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${eth}%`, background: ETH, opacity: 0.85 }}
          />
        </div>
        <span className="text-xs font-mono text-[#8888aa] w-8 text-right">{eth}%</span>
      </div>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs font-mono w-20 shrink-0" style={{ color: SUB }}>
          Substrate
        </span>
        <div className="flex-1 bg-[#1a1a2e] rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{ width: `${sub}%`, background: SUB, opacity: 0.85 }}
          />
        </div>
        <span className="text-xs font-mono text-[#8888aa] w-8 text-right">{sub}%</span>
      </div>
    </div>
  );
}

// ─── Accordion section ────────────────────────────────────────────────────────
function Accordion({
  title,
  color = "#627EEA",
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
      className="rounded-xl border mb-3 overflow-hidden transition-all"
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

// ─── Side-by-side comparison card ─────────────────────────────────────────────
function SideBySide({
  leftTitle,
  leftColor,
  rightTitle,
  rightColor,
  leftContent,
  rightContent,
}: {
  leftTitle: string;
  leftColor: string;
  rightTitle: string;
  rightColor: string;
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: `${leftColor}33`, background: `${leftColor}08` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: leftColor }} />
          <span className="font-bold text-sm" style={{ color: leftColor }}>
            {leftTitle}
          </span>
        </div>
        <div className="text-sm text-[#c8c8e8] leading-relaxed">{leftContent}</div>
      </div>
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: `${rightColor}33`, background: `${rightColor}08` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full" style={{ background: rightColor }} />
          <span className="font-bold text-sm" style={{ color: rightColor }}>
            {rightTitle}
          </span>
        </div>
        <div className="text-sm text-[#c8c8e8] leading-relaxed">{rightContent}</div>
      </div>
    </div>
  );
}

// ─── Table of contents ────────────────────────────────────────────────────────
const TOC = [
  { id: "merkle-proof", label: "1. What is a Merkle Proof?" },
  { id: "trie-basics", label: "2. What is a Trie?" },
  { id: "key-formation", label: "3. How Keys are Formed" },
  { id: "node-types", label: "4. Node Types & Storage" },
  { id: "encoding", label: "5. RLP vs Compact Encoding" },
  { id: "reads", label: "6. Read Performance" },
  { id: "writes", label: "7. Write Performance" },
  { id: "proof-size", label: "8. Proof Size" },
  { id: "all-chains", label: "9. All Chains Compared" },
  { id: "summary", label: "10. Final Summary" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DeepComparePage() {
  const [activeToc, setActiveToc] = useState("merkle-proof");

  return (
    <div className="min-h-screen pt-20">
      {/* ── Hero ── */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag text="Deep Dive" color="#ffffff" />
            <Tag text="Ethereum MPT" color={ETH} />
            <Tag text="Substrate Trie" color={SUB} />
            <Tag text="Beginner Friendly" color="#27c93f" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Deep Storage Performance Comparison
          </h1>
          <p className="text-[#8888aa] text-lg max-w-3xl leading-relaxed">
            A detailed, beginner-friendly guide explaining how different blockchains store data
            internally, why some are faster than others, what a &quot;Merkle proof&quot; actually is, and
            every term explained — no jargon left behind.
          </p>
          <div className="flex flex-wrap gap-3 mt-6 text-xs">
            {[
              { label: "Merkle Proofs", icon: "🔐" },
              { label: "Trie Traversal", icon: "🌳" },
              { label: "Read / Write Cost", icon: "⚡" },
              { label: "Proof Size", icon: "📦" },
              { label: "RLP Encoding", icon: "🔢" },
            ].map((t) => (
              <span
                key={t.label}
                className="px-3 py-1.5 rounded-full border border-[#1a1a2e] bg-[#0a0a14] text-[#8888aa]"
              >
                {t.icon} {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex gap-8 items-start">
          {/* ── Table of Contents (sticky) ── */}
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
                        ? { background: `${ETH}22`, color: ETH }
                        : { color: "#8888aa" }
                    }
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ═══════════════════════════════════════════════
                1. WHAT IS A MERKLE PROOF
            ══════════════════════════════════════════════════ */}
            <section id="merkle-proof">
              <SectionTitle id="merkle-proof">🔐 1. What is a Merkle Proof?</SectionTitle>
              <Explainer>
                A Merkle proof is a small amount of data that lets you confirm that something
                (like a transaction or an account balance) is genuinely part of a blockchain,
                without having to download and check the entire blockchain yourself.
              </Explainer>

              <BeginnerNote>
                Think of it like a receipt from a restaurant. Instead of reading the full menu and
                every order ever made, the receipt proves your specific order was placed — and the
                manager&apos;s stamp (root hash) confirms it&apos;s real.
              </BeginnerNote>

              <SubTitle>What problem does it solve?</SubTitle>
              <p className="text-[#9999aa] text-sm leading-relaxed mb-4">
                Blockchains can have millions of accounts and transactions. If a mobile wallet
                had to download all of that just to check your balance, it would take hours.
                Merkle proofs let a light client (e.g. a phone app) ask a full node:
                &quot;Can you prove my account has 5 ETH?&quot; and get a tiny proof back that it can verify
                in milliseconds — without trusting the full node blindly.
              </p>

              <SubTitle>How does it work — step by step?</SubTitle>
              <div className="space-y-3 mb-6">
                {[
                  {
                    step: "1",
                    title: "Build a tree of hashes",
                    desc: 'All pieces of data (transactions, account states) are hashed individually. Then pairs of hashes are combined and hashed again. This continues until one single hash remains — called the "root hash" or "Merkle root".',
                  },
                  {
                    step: "2",
                    title: "Root hash goes into the block header",
                    desc: 'The Merkle root is stored in the block header (a small summary of the block). Everyone trusts the block header because it\'s secured by the blockchain\'s consensus (e.g. proof of work or proof of stake).',
                  },
                  {
                    step: "3",
                    title: "To prove one item, you only need siblings",
                    desc: 'To prove item B exists, you only need the hash of its sibling A, and the hash of the sibling subtree (H2). From those, you can recompute the root and check if it matches.',
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="flex gap-4 rounded-xl border border-[#1a1a2e] bg-[#080816] p-4"
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: `${ETH}22`, color: ETH }}
                    >
                      {s.step}
                    </span>
                    <div>
                      <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                      <div className="text-[#9999aa] text-sm leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <SubTitle>Visual — Merkle Tree</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 mb-4">
                <svg viewBox="0 0 500 200" className="w-full max-w-xl mx-auto">
                  {/* lines */}
                  <line x1="250" y1="40" x2="125" y2="100" stroke="#2a2a5a" strokeWidth="1.5" />
                  <line x1="250" y1="40" x2="375" y2="100" stroke="#2a2a5a" strokeWidth="1.5" />
                  <line x1="125" y1="120" x2="65" y2="170" stroke="#2a2a5a" strokeWidth="1.5" />
                  <line x1="125" y1="120" x2="185" y2="170" stroke="#2a2a5a" strokeWidth="1.5" />
                  <line x1="375" y1="120" x2="315" y2="170" stroke="#2a2a5a" strokeWidth="1.5" />
                  <line x1="375" y1="120" x2="435" y2="170" stroke="#2a2a5a" strokeWidth="1.5" />
                  {/* proof path highlighted */}
                  <line x1="250" y1="40" x2="125" y2="100" stroke={ETH} strokeWidth="2" />
                  <line x1="125" y1="120" x2="185" y2="170" stroke={ETH} strokeWidth="2" />

                  {/* root */}
                  <rect x="195" y="20" width="110" height="30" rx="6" fill="#1a1a3a" stroke={ETH} strokeWidth="2" />
                  <text x="250" y="33" textAnchor="middle" fill={ETH} fontSize="10" fontFamily="monospace" fontWeight="bold">MERKLE ROOT</text>
                  <text x="250" y="44" textAnchor="middle" fill={ETH} fontSize="8" fontFamily="monospace">0xabc123…</text>

                  {/* H1 */}
                  <rect x="80" y="100" width="90" height="24" rx="5" fill="#0f1f0f" stroke={ETH} strokeWidth="1.5" />
                  <text x="125" y="114" textAnchor="middle" fill={ETH} fontSize="9" fontFamily="monospace">H1 = hash(A+B)</text>

                  {/* H2 */}
                  <rect x="330" y="100" width="90" height="24" rx="5" fill="#0a0a0a" stroke="#2a2a5a" strokeWidth="1" />
                  <text x="375" y="114" textAnchor="middle" fill="#666688" fontSize="9" fontFamily="monospace">H2 = hash(C+D)</text>

                  {/* Leaves */}
                  <rect x="38" y="162" width="54" height="24" rx="4" fill="#0a0a0a" stroke="#2a2a5a" />
                  <text x="65" y="176" textAnchor="middle" fill="#666688" fontSize="10" fontFamily="monospace">A</text>
                  <rect x="158" y="162" width="54" height="24" rx="4" fill="#1a1a3a" stroke={ETH} strokeWidth="1.5" />
                  <text x="185" y="176" textAnchor="middle" fill={ETH} fontSize="10" fontFamily="monospace" fontWeight="bold">B ✓</text>
                  <rect x="288" y="162" width="54" height="24" rx="4" fill="#0a0a0a" stroke="#2a2a5a" />
                  <text x="315" y="176" textAnchor="middle" fill="#666688" fontSize="10" fontFamily="monospace">C</text>
                  <rect x="408" y="162" width="54" height="24" rx="4" fill="#0a0a0a" stroke="#2a2a5a" />
                  <text x="435" y="176" textAnchor="middle" fill="#666688" fontSize="10" fontFamily="monospace">D</text>

                  {/* labels */}
                  <text x="30" y="197" fill="#444466" fontSize="8" fontFamily="monospace">To prove B: need hash(A) + H2 only</text>
                </svg>
                <p className="text-xs text-center text-[#666688] mt-2">
                  Blue = proof path. To prove B is in the tree, you only need hash(A) and H2 — not C or D.
                </p>
              </div>

              <SubTitle>What a proof contains in real systems</SubTitle>
              <SideBySide
                leftTitle="Ethereum MPT Proof"
                leftColor={ETH}
                rightTitle="Bitcoin Merkle Proof"
                rightColor={BTC}
                leftContent={
                  <ul className="space-y-1 text-sm">
                    <li>• Multiple trie nodes (branch, extension, leaf)</li>
                    <li>• Each node has up to 16 child references</li>
                    <li>• RLP-encoded (adds byte overhead)</li>
                    <li>• Typical size: <strong className="text-white">5KB – 15KB</strong></li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-1 text-sm">
                    <li>• A simple list of sibling hashes</li>
                    <li>• One hash per &quot;level&quot; in the tree</li>
                    <li>• Binary tree = fewer levels</li>
                    <li>• Typical size: <strong className="text-white">~1KB (log₂ n × 32 bytes)</strong></li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                2. WHAT IS A TRIE
            ══════════════════════════════════════════════════ */}
            <section id="trie-basics">
              <SectionTitle id="trie-basics">🌳 2. What is a Trie?</SectionTitle>
              <Explainer>
                A Trie (pronounced &quot;try&quot;) is a special kind of tree where each path from root to
                leaf spells out a key. It&apos;s like a filing cabinet where the folder hierarchy IS the
                key itself — you navigate folders one character at a time.
              </Explainer>

              <BeginnerNote>
                Imagine a dictionary. Instead of a flat list of words, letters are organised as
                branches. &quot;c → a → t&quot; leads to &quot;cat&quot;. &quot;c → a → r&quot; leads to &quot;car&quot;. They share the
                &quot;ca&quot; prefix, saving space and making lookups fast.
              </BeginnerNote>

              <SubTitle>Why do blockchains use Tries?</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { icon: "🔐", title: "Cryptographic Proof", desc: "Every node is hashed. Any change anywhere changes the root — making tampering detectable." },
                  { icon: "📍", title: "Efficient Lookup", desc: "Find any account's state by traversing the key path — no scanning a list." },
                  { icon: "🔄", title: "State Snapshots", desc: "You can represent the entire world state as a single 32-byte root hash." },
                ].map((c) => (
                  <div key={c.title} className="rounded-xl border border-[#1a1a2e] bg-[#080816] p-4">
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                    <div className="text-[#9999aa] text-xs leading-relaxed">{c.desc}</div>
                  </div>
                ))}
              </div>

              <SubTitle>Trie vs Regular Tree — Key Difference</SubTitle>
              <CodeBlock
                title="trie-concept.txt"
                language="text"
                code={`Regular Binary Tree (BST):
  Node stores: value + left pointer + right pointer
  Search: compare at each node (balanced = O(log n))

Trie:
  Node stores: children indexed by KEY CHARACTERS
  Search: follow the key characters one by one
  
Example - Ethereum 16-way trie:
  Key = "a7f3..." (hex characters 0-f)
  Root → [a] → [7] → [f] → [3] → ... → leaf (account data)
  Each step: pick the next nibble, follow that branch`}
              />
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                3. KEY FORMATION
            ══════════════════════════════════════════════════ */}
            <section id="key-formation">
              <SectionTitle id="key-formation">🔑 3. How Keys are Formed</SectionTitle>
              <Explainer>
                The &quot;key&quot; is the address used to navigate the trie tree. How you build
                that key determines how the trie is organised, how fast it is, and how big the
                proof will be. This is where Ethereum and Substrate differ most fundamentally.
              </Explainer>

              <SubTitle>Ethereum: Single Hash Key</SubTitle>
              <BeginnerNote>
                Ethereum hashes the address with Keccak-256. This is like taking a name and
                putting it through a scrambler — you get a random-looking 64-character hex string.
                The trie must follow all 64 characters one by one. The path is deep and random.
              </BeginnerNote>

              <CodeBlock
                title="ethereum-key.ts"
                language="text"
                code={`// User wants: account data for address 0x742d35...
// Step 1: Hash the address
key = keccak256(0x742d35Cc6634C0532925a3b844Bc454e4438f44e)
    = 0xabc1234567890abc1234567890abc1234567890abc1234567890abc1234567890

// Step 2: Convert to nibbles (each hex char = one nibble)
nibbles = [a, b, c, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, a, b, c, ...]
           ↑  ↑  ↑  ↑                            total: 64 nibbles

// Step 3: Traverse the 16-way trie, one nibble at a time
root → [a] → [b] → [c] → [1] → ... → leaf (account state)

// Result: 64 steps deep, completely random order
// No two related addresses will be "near" each other in the trie`}
              />

              <SubTitle>Substrate: Composed Structured Key</SubTitle>
              <BeginnerNote>
                Substrate builds the key in parts — pallet name + storage item name + the actual
                key. This is like an organised filing system: &quot;Finance Department / Salaries /
                Alice&quot;. Related things end up near each other, which is better for caching.
              </BeginnerNote>

              <CodeBlock
                title="substrate-key.ts"
                language="text"
                code={`// User wants: Balances pallet, Account storage, for Alice
// Step 1: Hash each part separately
pallet_hash   = Twox128("Balances")        // = 0x26aa394eea5630e07c48ae0c9558cef7
storage_hash  = Twox128("Account")         // = 0xb99d880ec681799c0cf30e8886371da9
key_hash      = Blake2_128Concat(Alice)    // = 0xde1e86a9a8c739864cf3cc5ec2bea59f...

// Step 2: Concatenate all parts
final_key = pallet_hash ++ storage_hash ++ key_hash
          = 0x26aa394e...b99d880e...de1e86a9...

// Key insight: ALL accounts in Balances pallet share the same PREFIX
// → they are physically grouped together in the database
// → cache hits are much more likely when reading multiple accounts`}
              />

              <SideBySide
                leftTitle="Ethereum Keys — Random"
                leftColor={ETH}
                rightTitle="Substrate Keys — Structured"
                rightColor={SUB}
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Single keccak256 hash of the address</li>
                    <li>• 64 nibbles long (32 bytes)</li>
                    <li>• Completely random output — no logical ordering</li>
                    <li>• Alice and Bob&apos;s accounts are at random spots in the trie</li>
                    <li className="text-[#ff6666]">❌ Poor cache locality — every read likely causes a cache miss</li>
                    <li className="text-[#27c93f]">✅ Prevents prefix attacks (no predictable ordering)</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Pallet hash + storage hash + key hash (concatenated)</li>
                    <li>• Structured and human-readable prefix</li>
                    <li>• All keys in the same pallet share the same prefix</li>
                    <li>• Alice and Bob&apos;s accounts are near each other in storage</li>
                    <li className="text-[#27c93f]">✅ Great cache locality — reading multiple accounts is fast</li>
                    <li className="text-[#27c93f]">✅ Can enumerate all keys of a storage map efficiently</li>
                  </ul>
                }
              />

              <SubTitle>Hash Functions Used — Explained</SubTitle>
              <div className="space-y-3">
                {[
                  {
                    name: "keccak256 (Ethereum)",
                    color: ETH,
                    desc: "A cryptographic hash — extremely secure, output is random-looking. Takes 35–50 CPU cycles per byte. Used for trie node hashing too, so every node access involves a keccak hash.",
                    used: "Ethereum state/storage key derivation + node hashing",
                  },
                  {
                    name: "Twox128 (Substrate, non-crypto)",
                    color: SUB,
                    desc: "A very fast non-cryptographic hash (xxHash). Not resistant to brute-force key attacks, so it's only used for PALLET and STORAGE names (which are public). ~5× faster than keccak256.",
                    used: "Pallet name and storage item name prefix hashing",
                  },
                  {
                    name: "Blake2_128Concat (Substrate, crypto)",
                    color: "#9945FF",
                    desc: "A cryptographic hash that ALSO preserves the original key by appending it. This is used for map keys (like AccountId) where the key must be readable from the full storage key.",
                    used: "Map keys where user-controlled input needs protection",
                  },
                ].map((h) => (
                  <div
                    key={h.name}
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${h.color}33`, background: `${h.color}08` }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Tag text={h.name} color={h.color} />
                    </div>
                    <p className="text-sm text-[#c8c8e0] mb-1">{h.desc}</p>
                    <p className="text-xs text-[#666688]">Used for: {h.used}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                4. NODE TYPES & STORAGE
            ══════════════════════════════════════════════════ */}
            <section id="node-types">
              <SectionTitle id="node-types">🗂 4. Node Types &amp; How They&apos;re Stored in DB</SectionTitle>
              <Explainer>
                Each &quot;node&quot; in the trie is an individual data structure stored as a single
                key-value pair in the database. How nodes are designed directly affects how
                many DB reads are needed and how much data is transferred.
              </Explainer>

              <SubTitle>Ethereum: 3 Fixed Node Types</SubTitle>

              <div className="space-y-3 mb-6">
                <Accordion title="Branch Node — the most common (and heaviest)" color={ETH} defaultOpen>
                  <BeginnerNote>
                    At any fork in the path, Ethereum uses a Branch Node — always an array of
                    exactly 17 slots (16 for hex characters 0–f, plus 1 for an optional value).
                    Even if only 2 of the 16 slots are used, all 17 must be stored.
                  </BeginnerNote>
                  <CodeBlock
                    title="branch-node.ts"
                    language="text"
                    code={`// Branch Node structure — always 17 elements
[
  child_0,   // reference to child if key[i] == '0'
  child_1,   // reference to child if key[i] == '1'
  child_2,   // ...
  child_3,
  child_4,
  child_5,
  child_6,
  child_7,
  child_8,
  child_9,
  child_a,
  child_b,
  child_c,
  child_d,
  child_e,
  child_f,   // reference to child if key[i] == 'f'
  value      // optional value stored at this node
]
// Even if only slots [3] and [7] are used,
// the other 15 slots still take up space (as empty = 0x80 in RLP)`}
                  />
                  <p className="text-[#9999aa] text-sm">
                    Why this matters: even a sparse trie wastes space in branch nodes. A typical
                    Ethereum state trie has ~100 million accounts, but most branch nodes only use
                    2–3 of their 16 slots.
                  </p>
                </Accordion>

                <Accordion title="Extension Node — shared prefix shortcut" color={ETH}>
                  <BeginnerNote>
                    If many keys share the same prefix, Ethereum uses an Extension Node to skip
                    ahead. Instead of one node per nibble, the shared portion is stored as one node.
                    This is a compression optimization.
                  </BeginnerNote>
                  <CodeBlock
                    title="extension-node.ts"
                    language="text"
                    code={`// Extension Node
[encoded_shared_path, next_node_hash]

// Example: if two keys share the prefix "abc":
// Instead of: root → [a] → [b] → [c] → branch
// We use:     root → extension("abc") → branch
// One node stores the shared prefix "abc"

// The path encoding uses "compact encoding" (HP encoding)
// which adds a flag nibble to distinguish leaf vs extension`}
                  />
                </Accordion>

                <Accordion title="Leaf Node — end of path (stores the value)" color={ETH}>
                  <BeginnerNote>
                    When you reach the end of the key, a Leaf Node stores the remaining path
                    plus the actual value (account balance, nonce, etc.).
                  </BeginnerNote>
                  <CodeBlock
                    title="leaf-node.ts"
                    language="text"
                    code={`// Leaf Node
[remaining_encoded_path, value]

// Example for account state:
value = RLP([nonce, balance, storageRoot, codeHash])
      = RLP([5, 1500000000000000000, 0x..., 0x...])

// The value is RLP-encoded — adding extra bytes for type/length metadata`}
                  />
                </Accordion>
              </div>

              <SubTitle>How every node is stored in LevelDB</SubTitle>
              <CodeBlock
                title="ethereum-db.ts"
                language="text"
                code={`// For EVERY node (branch, extension, leaf):
DB_key   = keccak256(RLP(node))   // 32 bytes — hash of the encoded node
DB_value = RLP(node)               // the full encoded node data

// To look up any node, you:
// 1. Receive a 32-byte hash reference
// 2. Do a DB lookup with that hash as key
// 3. Get back the RLP-encoded node
// 4. Decode the RLP to get the actual children / value

// Cost per node:  1 DB read + 1 RLP decode + 1 keccak hash verification
// For a 64-nibble path: up to 64 nodes × (DB read + decode + hash)`}
              />

              <SubTitle>Substrate: One Flexible Node Type</SubTitle>
              <Explainer>
                Substrate doesn&apos;t use separate branch/extension/leaf types. Instead, every node is
                the same flexible structure that can have any number of children (not fixed at 16)
                and optionally holds a value. This is more compact and efficient.
              </Explainer>

              <CodeBlock
                title="substrate-node.ts"
                language="text"
                code={`// Substrate uses the Patricia Merkle Trie (different from Ethereum's MPT)
// Node structure:
Node {
  partial_key: Vec<u8>,       // compressed shared path
  children: BTreeMap<u8, NodeRef>, // DYNAMIC — only used children stored
  value: Option<Vec<u8>>,     // value if this is a leaf-level node
}

// Key difference: only USED children are stored
// If only 2 of 16 positions are occupied, only 2 children exist
// No wasted space for empty slots

// DB storage:
DB_key   = hash(encoded_node)   // 32 bytes
DB_value = scale_encoded(node)  // SCALE codec — more compact than RLP`}
              />

              <SideBySide
                leftTitle="Ethereum MPT Nodes"
                leftColor={ETH}
                rightTitle="Substrate Trie Nodes"
                rightColor={SUB}
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• 3 separate node types (branch, extension, leaf)</li>
                    <li>• Branch always stores 17 slots (16 children + value)</li>
                    <li>• Empty slots still take space in RLP encoding</li>
                    <li>• Node hash = keccak256(RLP(node))</li>
                    <li>• DB key = 32-byte keccak hash</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Single unified node type</li>
                    <li>• Children are dynamic — only used children stored</li>
                    <li>• No wasted space for empty positions</li>
                    <li>• Node hash = Blake2 or Keccak (configurable)</li>
                    <li>• Encoded with SCALE — more compact than RLP</li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                5. ENCODING
            ══════════════════════════════════════════════════ */}
            <section id="encoding">
              <SectionTitle id="encoding">🔢 5. RLP vs SCALE Encoding</SectionTitle>
              <Explainer>
                &quot;Encoding&quot; means converting a data structure (like a node with children and values)
                into raw bytes that can be stored in a database. The encoding format affects how many
                bytes are used and how fast encoding/decoding is.
              </Explainer>

              <SubTitle>What is RLP? (Ethereum&apos;s encoding)</SubTitle>
              <BeginnerNote>
                RLP stands for &quot;Recursive Length Prefix&quot;. It&apos;s a way to encode nested data by
                prepending the length of each item before the item itself. It was invented
                specifically for Ethereum and is flexible but not particularly compact.
              </BeginnerNote>

              <CodeBlock
                title="rlp-example.ts"
                language="text"
                code={`// RLP Encoding Example
// Encoding the string "cat":
// 1. String length = 3
// 2. Length prefix = 0x83 (0x80 + 3 for short strings)
// RLP("cat") = 0x83 0x63 0x61 0x74

// Encoding a list ["cat", "dog"]:
// 1. Encode each item: 0x83636174, 0x83646f67
// 2. Total payload length = 8 bytes
// 3. List prefix = 0xc8 (0xc0 + 8 for short lists)
// RLP(["cat", "dog"]) = 0xc8 0x83 0x63 0x61 0x74 0x83 0x64 0x6f 0x67

// For a branch node with 16 children:
// EACH child reference is a 32-byte hash
// Plus length prefix for each + list prefix
// Total branch node size: ~600+ bytes even when mostly empty

// Why this is a problem:
// Every node read = 1 RLP decode operation
// Deep trie = many decode operations per lookup`}
              />

              <SubTitle>What is SCALE? (Substrate&apos;s encoding)</SubTitle>
              <BeginnerNote>
                SCALE (Simple Concatenated Aggregate Little-Endian) is Substrate&apos;s custom encoding
                format. It&apos;s designed to be lean — no extra metadata, no length prefixes where
                the length is already known from the type. It&apos;s 20-40% more compact than RLP.
              </BeginnerNote>

              <CodeBlock
                title="scale-example.ts"
                language="text"
                code={`// SCALE Encoding Example
// Encoding a u32 integer (e.g. 1000000):
// SCALE: just the 4 bytes in little-endian
// SCALE(1000000) = 0x40 0x42 0x0f 0x00

// For a vector of bytes:
// SCALE: compact-encoded length + raw bytes
// No nested prefix like RLP — simpler structure

// Substrate node encoding:
// - partial_key length + partial_key bytes
// - bitmask of which children exist (2 bytes)  ← KEY OPTIMIZATION
// - only the hashes of EXISTING children
// - optional value

// Example sparse node (2 children out of 16):
// RLP would encode 16 slots (mostly empty = 0x80 each) → ~530 bytes
// SCALE: bitmask (2 bytes) + 2 hashes (64 bytes) → ~70 bytes
// SCALE is ~7.5x smaller for sparse nodes!`}
              />

              <SideBySide
                leftTitle="RLP (Ethereum)"
                leftColor={ETH}
                rightTitle="SCALE (Substrate)"
                rightColor={SUB}
                leftContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Recursive, general-purpose encoding</li>
                    <li>• Prepends length before every value</li>
                    <li>• Empty branch slots = 0x80 each (1 byte × 16 = 16 bytes overhead)</li>
                    <li>• Branch node avg size: ~500-600 bytes</li>
                    <li className="text-[#ff6666]">❌ Decode cost on every node access</li>
                    <li className="text-[#ff6666]">❌ More bytes = more I/O = slower</li>
                  </ul>
                }
                rightContent={
                  <ul className="space-y-2 text-sm">
                    <li>• Flat, optimised binary encoding</li>
                    <li>• Uses bitmask (2 bytes) to mark which children exist</li>
                    <li>• Only existing children stored — zero overhead for empty</li>
                    <li>• Node avg size: significantly smaller</li>
                    <li className="text-[#27c93f]">✅ Faster encode/decode</li>
                    <li className="text-[#27c93f]">✅ Less data per node = fewer I/O bytes</li>
                  </ul>
                }
              />
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                6. READ PERFORMANCE
            ══════════════════════════════════════════════════ */}
            <section id="reads">
              <SectionTitle id="reads">⚡ 6. Read Performance — Step by Step</SectionTitle>
              <Explainer>
                A &quot;read&quot; is any time you look up state — checking an account balance, reading a
                contract variable, querying a mapping. This is the most common operation and its
                speed directly impacts how fast a blockchain can validate transactions.
              </Explainer>

              <SubTitle>Ethereum — Read Flow</SubTitle>
              <div className="space-y-2 mb-6">
                {[
                  { n: 1, t: "Hash the address", d: "Compute keccak256(address) → 32 bytes. This is a moderately expensive cryptographic operation (SHA-3 family)." },
                  { n: 2, t: "Convert to nibbles", d: "Split the 32-byte hash into 64 nibbles (half-bytes). Each nibble (0-f) is one step in the trie." },
                  { n: 3, t: "Traverse 64 levels", d: "At each level, load the node from LevelDB using its hash as the key. This is a disk read if the node isn't in memory." },
                  { n: 4, t: "RLP decode each node", d: "Once a node is loaded from disk, it must be decoded from RLP format before you can read its children/value. CPU cost at every step." },
                  { n: 5, t: "Hash verification", d: "To ensure the node wasn't tampered with, its keccak256 hash is recomputed and compared. Another hash per node." },
                  { n: 6, t: "Return the leaf value", d: "After traversing ~15-20 nodes on average (many are compressed), the leaf value is RLP-decoded to get the actual account data." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3 rounded-xl border border-[#1a1a2e] bg-[#080816] p-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${ETH}22`, color: ETH }}>{s.n}</div>
                    <div>
                      <div className="text-white text-sm font-semibold mb-0.5">{s.t}</div>
                      <div className="text-[#9999aa] text-xs leading-relaxed">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <CodeBlock
                title="ethereum-read-cost.ts"
                language="text"
                code={`// Cost analysis for ONE account read in Ethereum:
keccak256(address)        → 1 hash operation
convert to 64 nibbles     → trivial
traverse ~15-20 nodes:
  × 15 DB reads           → disk seeks (expensive!)
  × 15 RLP decodes        → CPU work
  × 15 hash verifications → keccak per node
final RLP decode (value)  → 1 decode

// Total: ~15 disk reads + ~30 keccak operations + ~15 RLP decodes
// In the WORST case (cold cache, deep path): ~20+ operations`}
              />

              <SubTitle>Substrate — Read Flow</SubTitle>
              <div className="space-y-2 mb-6">
                {[
                  { n: 1, t: "Build the structured key", d: "Twox128(pallet) ++ Twox128(storage) ++ Blake2(key). Twox is ~5× faster than keccak256." },
                  { n: 2, t: "Traverse a shorter path", d: "Because keys are shorter and the trie is more balanced (structured keys, not random), the path from root to leaf typically has fewer nodes." },
                  { n: 3, t: "SCALE decode each node (cheaper)", d: "SCALE is faster to decode than RLP. Nodes are also smaller, so less data is loaded from disk." },
                  { n: 4, t: "Cache hits are more likely", d: "Because all Balances accounts share a key prefix, they're physically near each other in storage. Reading 10 accounts? The first read warms the OS disk cache for the rest." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3 rounded-xl border border-[#2a1a2a] bg-[#0f0810] p-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${SUB}22`, color: SUB }}>{s.n}</div>
                    <div>
                      <div className="text-white text-sm font-semibold mb-0.5">{s.t}</div>
                      <div className="text-[#9999aa] text-xs leading-relaxed">{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>

              <SubTitle>Read Cost Comparison</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 mb-4">
                <PerformanceMeter label="DB Reads per lookup (lower = better)" eth={75} sub={40} />
                <PerformanceMeter label="CPU Hashing Cost (lower = better)" eth={80} sub={35} />
                <PerformanceMeter label="Encoding/Decoding Overhead (lower = better)" eth={70} sub={30} />
                <PerformanceMeter label="Cache Miss Probability (lower = better)" eth={85} sub={35} />
                <p className="text-xs text-[#666688] mt-2">Note: bars show relative overhead (higher % = worse). Absolute numbers vary by hardware and state size.</p>
              </div>
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                7. WRITE PERFORMANCE
            ══════════════════════════════════════════════════ */}
            <section id="writes">
              <SectionTitle id="writes">✍️ 7. Write Performance — Why Ethereum Writes are Expensive</SectionTitle>
              <Explainer>
                A &quot;write&quot; happens when you update state — a token transfer, a smart contract
                execution, changing a vote. Every write must update the trie and recompute hashes
                all the way up to the root. This is called &quot;hash propagation&quot; and it&apos;s expensive.
              </Explainer>

              <SubTitle>The Write Cascade Problem</SubTitle>
              <BeginnerNote>
                Think of the trie like a pyramid of glass balls where each ball&apos;s colour depends on
                its children&apos;s colours. Change one ball at the bottom and EVERY ball above it up to
                the top must be repainted. That&apos;s exactly what happens with cryptographic hash
                propagation in a Merkle trie.
              </BeginnerNote>

              <CodeBlock
                title="write-cascade.ts"
                language="text"
                code={`// Writing to Ethereum state (e.g. Alice sends Bob 1 ETH):

// Step 1: Update Alice's leaf node
alice_leaf_new = RLP([nonce+1, balance-1eth, storageRoot, codeHash])
DB[keccak256(alice_leaf_new)] = alice_leaf_new

// Step 2: Alice's parent branch node now has a new child hash
parent_branch_new = [...15_children..., NEW_alice_hash, value]
DB[keccak256(parent_branch_new)] = parent_branch_new

// Step 3: The grandparent now has a new child hash
// ... repeats all the way to root ...

// Step N: New state root
new_state_root = keccak256(new_root_node)

// COST per write:
// depth × (1 RLP encode + 1 keccak256 + 1 DB write)
// For depth=15: 15 encodes + 15 hashes + 15 DB writes

// Plus: OLD nodes stay in DB (for history) until pruning
// So every write = 2× DB writes (old + new node versions)`}
              />

              <SubTitle>Ethereum Write Cost Factors</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { icon: "🔗", title: "Hash Propagation", desc: "Every ancestor node must be re-hashed after a leaf changes. Depth of ~15-20 means 15-20 keccak256 operations per write.", bad: true },
                  { icon: "💾", title: "RLP Re-encoding", desc: "Each updated node is re-encoded in RLP before being hashed and stored. CPU cost on every level of the tree.", bad: true },
                  { icon: "📋", title: "Copy-on-Write Semantics", desc: "Ethereum creates new nodes instead of modifying old ones (for history preservation). Each write = new nodes inserted into DB.", bad: true },
                  { icon: "🗃️", title: "Multiple DB Writes", desc: "A single state update results in ~15 new DB entries (one per updated ancestor node), each requiring a disk write.", bad: true },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl border p-4" style={{ borderColor: "#ff666633", background: "#ff66660a" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{f.icon}</span>
                      <span className="font-semibold text-white text-sm">{f.title}</span>
                    </div>
                    <p className="text-xs text-[#cc9999] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              <SubTitle>Substrate Write Improvements</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { icon: "⚡", title: "Faster Hash Functions", desc: "Substrate can use Blake2b for node hashing (faster than keccak256) or even xxHash for non-security-critical paths." },
                  { icon: "📦", title: "Smaller Nodes = Less Data", desc: "Compact SCALE-encoded nodes mean each DB write is smaller. Less I/O bandwidth per write operation." },
                  { icon: "🎯", title: "Fewer Nodes Updated", desc: "Flexible node structure (only used children stored) means tree rebalancing is cheaper and fewer nodes need updating." },
                  { icon: "🔄", title: "Overlay Caching", desc: "Substrate accumulates writes in an in-memory overlay during block execution, batching all DB writes at block commit time." },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl border p-4" style={{ borderColor: `${SUB}33`, background: `${SUB}08` }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{f.icon}</span>
                      <span className="font-semibold text-white text-sm">{f.title}</span>
                    </div>
                    <p className="text-xs text-[#cc88cc] leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>

              <SubTitle>Write Cost Comparison</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6">
                <PerformanceMeter label="DB Writes per state update (lower = better)" eth={80} sub={45} />
                <PerformanceMeter label="Hash operations per write (lower = better)" eth={80} sub={40} />
                <PerformanceMeter label="Encoding overhead per write (lower = better)" eth={75} sub={30} />
                <PerformanceMeter label="Total CPU cost per write (lower = better)" eth={78} sub={38} />
              </div>
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                8. PROOF SIZE
            ══════════════════════════════════════════════════ */}
            <section id="proof-size">
              <SectionTitle id="proof-size">📦 8. Proof Size — Why Ethereum Proofs are Larger</SectionTitle>
              <Explainer>
                A &quot;proof&quot; is all the data you need to send someone so they can verify a value
                exists in the state — without them having the full state themselves.
                Smaller proofs = faster light clients, cheaper cross-chain bridges, and lower
                bandwidth usage.
              </Explainer>

              <SubTitle>What goes into a proof?</SubTitle>
              <p className="text-[#9999aa] text-sm leading-relaxed mb-4">
                To prove a value in a Merkle trie, you need every node along the path from root
                to the leaf, PLUS any sibling nodes needed to recompute parent hashes. The more
                nodes, and the bigger each node, the larger the proof.
              </p>

              <SubTitle>Why Ethereum proofs are large</SubTitle>
              <div className="space-y-3 mb-6">
                {[
                  {
                    title: "16-slot Branch Nodes",
                    desc: "Every branch node in Ethereum has 16 child slots. Even if only 2 are used, all 16 must be included in the proof (verifiers need all sibling hashes to recompute the parent hash). At 32 bytes per hash × 16 slots = 512 bytes per branch node, and a path has ~15 branch nodes.",
                    cost: "~7.5 KB from branch nodes alone",
                  },
                  {
                    title: "RLP Metadata Overhead",
                    desc: "Each node includes RLP length prefixes and type tags. On a typical branch node this adds 50-100 bytes of overhead that carries no data — just encoding metadata.",
                    cost: "+500B-1KB overhead per proof",
                  },
                  {
                    title: "Path Depth",
                    desc: "With 64-nibble paths and random key distribution, the tree is maximally deep. More depth = more nodes = bigger proof.",
                    cost: "~15-20 nodes per proof path",
                  },
                ].map((r) => (
                  <div key={r.title} className="rounded-xl border border-[#627eea33] bg-[#627eea08] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-white text-sm">{r.title}</span>
                      <Tag text={r.cost} color={ETH} />
                    </div>
                    <p className="text-xs text-[#9999cc] leading-relaxed">{r.desc}</p>
                  </div>
                ))}
              </div>

              <SubTitle>Proof Size by Blockchain</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] overflow-hidden mb-6">
                <div className="p-4 space-y-3">
                  {[
                    { chain: "Bitcoin Merkle", size: "~1KB", bar: 8, color: BTC, note: "Binary tree, O(log₂ n) × 32 bytes. ~20 hashes for 1M txs." },
                    { chain: "Substrate Trie", size: "2–8KB", bar: 30, color: SUB, note: "Compact nodes + SCALE encoding. Fewer nodes, smaller nodes." },
                    { chain: "Cosmos IAVL", size: "~3–8KB", bar: 32, color: COS, note: "AVL tree is balanced — path length is O(log n), similar to Substrate." },
                    { chain: "Ethereum MPT", size: "5–15KB", bar: 70, color: ETH, note: "16-way trie + RLP + random keys = many large nodes in proof." },
                    { chain: "Solana", size: "N/A", bar: 0, color: SOL, note: "No global state Merkle trie — cannot generate state proofs for light clients." },
                    { chain: "Verkle Trees (future ETH)", size: "~150 bytes", bar: 3, color: "#00FFB3", note: "Polynomial commitment — one proof for MANY leaves simultaneously!" },
                  ].map((b) => (
                    <div key={b.chain}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono" style={{ color: b.color }}>{b.chain}</span>
                        <span className="text-xs font-bold" style={{ color: b.color }}>{b.size}</span>
                      </div>
                      <div className="bg-[#1a1a2e] rounded-full h-2 mb-1">
                        {b.bar > 0 && (
                          <div className="h-2 rounded-full" style={{ width: `${b.bar}%`, background: b.color }} />
                        )}
                      </div>
                      <p className="text-xs text-[#666688]">{b.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <SubTitle>Why proof size matters in practice</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: "📱", title: "Light Clients", desc: "A mobile wallet proving your balance downloads the proof. 15KB per account × 100 queries = 1.5MB. With Verkle: 150B × 100 = 15KB. 100× cheaper." },
                  { icon: "🌉", title: "Cross-Chain Bridges", desc: "Bridges between chains pass Merkle proofs to verify state on another chain. Smaller proofs = less gas cost for on-chain verification." },
                  { icon: "🔒", title: "ZK Proofs", desc: "Zero-knowledge systems often use Merkle proofs as inputs. Smaller proofs dramatically reduce ZK circuit complexity and proving time." },
                ].map((c) => (
                  <div key={c.title} className="rounded-xl border border-[#1a1a2e] bg-[#080816] p-4">
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                    <div className="text-[#9999aa] text-xs leading-relaxed">{c.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                9. ALL CHAINS COMPARED
            ══════════════════════════════════════════════════ */}
            <section id="all-chains">
              <SectionTitle id="all-chains">🌐 9. All Chains — Performance Overview</SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  {
                    chain: "Bitcoin", color: BTC, symbol: "₿",
                    model: "UTXO + Binary Merkle",
                    read: "Fast (flat DB lookup)", readScore: 85,
                    write: "Low (insert/delete UTXO)", writeScore: 85,
                    proof: "~1KB (binary Merkle)", proofScore: 90,
                    keyStyle: "hash(tx) → binary path",
                    notes: ["No global account trie", "UTXO spending = simple key delete + insert", "Proof = O(log₂ n) hashes"],
                  },
                  {
                    chain: "Ethereum", color: ETH, symbol: "Ξ",
                    model: "Merkle Patricia Trie",
                    read: "Slow (16-way, 64 levels)", readScore: 30,
                    write: "High (rehash all ancestors)", writeScore: 25,
                    proof: "5–15KB (RLP + branch bloat)", proofScore: 20,
                    keyStyle: "keccak256(address) → nibbles",
                    notes: ["64-nibble random path", "RLP encode/decode per node", "15+ DB reads per lookup"],
                  },
                  {
                    chain: "Substrate", color: SUB, symbol: "●",
                    model: "Composed Key Trie",
                    read: "Faster (structured keys, cache)", readScore: 60,
                    write: "Medium (compact nodes)", writeScore: 55,
                    proof: "2–8KB (SCALE + sparse)", proofScore: 55,
                    keyStyle: "Twox(pallet)++Twox(storage)++hash(key)",
                    notes: ["Structured keys = cache locality", "SCALE encoding is more compact", "Flexible node = less waste"],
                  },
                  {
                    chain: "Cosmos", color: COS, symbol: "⚛",
                    model: "IAVL Tree",
                    read: "Medium (balanced AVL)", readScore: 55,
                    write: "Medium (AVL rebalance)", writeScore: 50,
                    proof: "3–8KB (similar to Substrate)", proofScore: 50,
                    keyStyle: "module_prefix + key → AVL path",
                    notes: ["AVL self-balancing = O(log n) guaranteed", "Versioned — historical queries built-in", "Rebalancing on writes adds overhead"],
                  },
                  {
                    chain: "Solana", color: SOL, symbol: "◎",
                    model: "Flat Account Store",
                    read: "Very Fast (direct key lookup)", readScore: 95,
                    write: "Very Low (direct write)", writeScore: 95,
                    proof: "N/A (no state Merkle)", proofScore: 0,
                    keyStyle: "pubkey → direct DB key",
                    notes: ["No trie at all — pure flat KV", "Can't generate account state proofs", "Uses PoH + merkle for tx history only"],
                  },
                  {
                    chain: "Verkle (future)", color: "#00FFB3", symbol: "◊",
                    model: "Polynomial Commitments",
                    read: "Medium (256-way tree, shallower)", readScore: 65,
                    write: "Medium (polynomial ops)", writeScore: 50,
                    proof: "~150 bytes (!)", proofScore: 99,
                    keyStyle: "address ++ suffix → 256-way path",
                    notes: ["256-way → tree is much shallower", "One proof can cover many leaves", "Enables stateless Ethereum clients"],
                  },
                ].map((c) => (
                  <div
                    key={c.chain}
                    className="rounded-xl border p-4 flex flex-col gap-3"
                    style={{ borderColor: `${c.color}33`, background: `${c.color}06` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold" style={{ color: c.color }}>{c.symbol}</span>
                      <div>
                        <div className="font-bold text-white text-sm">{c.chain}</div>
                        <div className="text-xs text-[#666688]">{c.model}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: "Read Speed", value: c.read, score: c.readScore },
                        { label: "Write Cost", value: c.write, score: c.writeScore },
                        { label: "Proof Size", value: c.proof, score: c.proofScore },
                      ].map((m) => (
                        <div key={m.label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-[#666688]">{m.label}</span>
                          </div>
                          <div className="bg-[#1a1a2e] rounded-full h-1.5">
                            <div className="h-1.5 rounded-full" style={{ width: `${m.score}%`, background: c.color, opacity: 0.8 }} />
                          </div>
                          <div className="text-xs text-[#8888aa] mt-0.5">{m.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-[#1a1a2e] pt-2">
                      <div className="text-xs text-[#666688] mb-1">Key formation:</div>
                      <code className="text-xs break-all" style={{ color: c.color }}>{c.keyStyle}</code>
                    </div>

                    <ul className="space-y-1">
                      {c.notes.map((n) => (
                        <li key={n} className="text-xs text-[#9999aa] flex gap-1">
                          <span style={{ color: c.color }}>•</span>{n}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ═══════════════════════════════════════════════
                10. FINAL SUMMARY
            ══════════════════════════════════════════════════ */}
            <section id="summary">
              <SectionTitle id="summary">🎯 10. Final Summary & Mental Model</SectionTitle>

              <div className="rounded-xl border border-[#1a1a3a] bg-[#080816] p-6 mb-6">
                <div className="text-sm font-bold text-[#627EEA] mb-4">
                  The Core Insight — Why structure matters more than the database
                </div>
                <p className="text-[#b0b0cc] text-sm leading-relaxed mb-3">
                  All blockchains use essentially the same underlying database — LevelDB or
                  RocksDB. Both are high-performance key-value stores. The performance difference
                  between Ethereum and Substrate is <strong className="text-white">not</strong> the
                  database. It&apos;s:
                </p>
                <ol className="space-y-2">
                  {[
                    ["How the key is derived", "Random (keccak256) vs structured (pallet+storage+key)"],
                    ["How nodes are designed", "Fixed 16-slot arrays vs compact flexible nodes"],
                    ["How data is encoded", "RLP (verbose) vs SCALE (compact)"],
                    ["How hashing is done", "keccak256 (expensive) vs Twox128+Blake2 (cheaper)"],
                  ].map(([title, desc]) => (
                    <li key={title} className="flex gap-3 text-sm">
                      <span className="text-[#627EEA] font-bold shrink-0">▸</span>
                      <div>
                        <strong className="text-white">{title}:</strong>{" "}
                        <span className="text-[#9999aa]">{desc}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <SubTitle>Final Comparison Table</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#1a1a2e]">
                        <th className="text-left px-4 py-3 text-[#8888aa] font-medium text-xs">Feature</th>
                        {[
                          { name: "Bitcoin", color: BTC },
                          { name: "Ethereum", color: ETH },
                          { name: "Substrate", color: SUB },
                          { name: "Cosmos", color: COS },
                          { name: "Solana", color: SOL },
                        ].map((c) => (
                          <th key={c.name} className="text-left px-4 py-3 text-xs font-medium" style={{ color: c.color }}>
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a2e]">
                      {[
                        ["Key style", "hash(tx)", "keccak(addr)", "pallet+storage+key", "module+key", "pubkey direct"],
                        ["Tree type", "Binary Merkle", "16-way MPT", "Custom Trie", "AVL (IAVL)", "None (flat)"],
                        ["Encoding", "Custom", "RLP", "SCALE", "Protobuf-like", "Custom"],
                        ["Node hashing", "SHA256", "keccak256", "Blake2/keccak", "SHA256", "SHA256"],
                        ["Read cost", "Very Low", "High", "Medium", "Medium", "Very Low"],
                        ["Write cost", "Low", "High", "Medium", "Medium", "Very Low"],
                        ["Proof size", "~1KB", "5–15KB", "2–8KB", "3–8KB", "N/A"],
                        ["Historical queries", "No", "No*", "No*", "✅ Built-in", "No"],
                        ["Parallelism", "UTXO natural", "Limited", "Per-pallet", "Per-module", "Account-based"],
                        ["Cache locality", "Good", "Poor", "Good", "Good", "Excellent"],
                      ].map((row) => (
                        <tr key={row[0]} className="hover:bg-[#0a0a1a] transition-colors">
                          {row.map((cell, i) => (
                            <td key={i} className={`px-4 py-2.5 text-xs ${i === 0 ? "text-[#8888aa] font-medium" : "text-[#c8c8e8]"}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 pb-3 text-xs text-[#444466]">* Needs archive node for full history</div>
              </div>

              <SubTitle>One-Line Summaries (no jargon)</SubTitle>
              <div className="space-y-2">
                {[
                  { chain: "Bitcoin", color: BTC, line: "No account model — just track unspent coins. Simple, fast, can't do smart contracts." },
                  { chain: "Ethereum", color: ETH, line: "Secure and expressive but heavy — random keys mean poor caching, RLP adds overhead, 16-slot nodes waste space. Security was prioritised over speed." },
                  { chain: "Substrate", color: SUB, line: "Structured keys act like a namespace. Nearby data stays nearby in storage. Compact encoding reduces I/O. The right trade-off for a developer-first platform." },
                  { chain: "Cosmos", color: COS, line: "Self-balancing AVL tree keeps depth predictable. Versioned by design — historical queries are free. Great for multi-chain use cases via IBC." },
                  { chain: "Solana", color: SOL, line: "Throws out the trie entirely. Direct key-to-account lookup. Maximum speed, minimum overhead — but cannot prove account state to light clients." },
                  { chain: "Verkle (future)", color: "#00FFB3", line: "Uses polynomial math to make proofs 100× smaller. One proof covers many accounts at once. Will make light clients and stateless nodes practical for Ethereum." },
                ].map((c) => (
                  <div
                    key={c.chain}
                    className="flex gap-3 items-start rounded-xl border p-4"
                    style={{ borderColor: `${c.color}33`, background: `${c.color}06` }}
                  >
                    <span className="font-bold text-sm shrink-0 mt-0.5" style={{ color: c.color }}>
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
