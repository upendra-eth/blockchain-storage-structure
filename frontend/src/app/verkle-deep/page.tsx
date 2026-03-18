"use client";

import { useState } from "react";
import CodeBlock from "@/components/CodeBlock";

const VER = "#00FFB3";
const ETH = "#627EEA";
const SUB = "#E6007A";
const COS = "#2FB8EB";
const SOL = "#9945FF";
const BTC = "#F7931A";

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

function Explainer({ accent = VER, children }: { accent?: string; children: React.ReactNode }) {
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
    <div className="flex gap-3 bg-[#0a100a] border border-[#1a3a1a] rounded-xl p-4 mb-4 text-sm">
      <span className="text-2xl shrink-0">💡</span>
      <div className="text-[#70c870] leading-relaxed">{children}</div>
    </div>
  );
}

function MathNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#0a0a10] border border-[#2a2a5a] rounded-xl p-4 mb-4 text-sm">
      <span className="text-2xl shrink-0">🔢</span>
      <div className="text-[#8888cc] leading-relaxed font-mono text-xs">{children}</div>
    </div>
  );
}

function Divider() {
  return <hr className="border-[#1a1a2e] my-10" />;
}

function StatusBadge({ status }: { status: "active" | "proposal" | "research" | "planned" }) {
  const map = {
    active: { label: "Active", color: "#27c93f" },
    proposal: { label: "EIP Proposal", color: "#f0a040" },
    research: { label: "Research Phase", color: "#627EEA" },
    planned: { label: "Planned", color: "#9945FF" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}55` }}
    >
      ● {s.label}
    </span>
  );
}

function Accordion({
  title,
  color = VER,
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

const TOC = [
  { id: "intro", label: "1. What are Verkle Trees?" },
  { id: "hash-vs-poly", label: "2. Hash vs Polynomial Commitment" },
  { id: "pedersen", label: "3. Pedersen Commitments Explained" },
  { id: "tree-structure", label: "4. Verkle Tree Structure" },
  { id: "proof-size", label: "5. Why Proofs are 100× Smaller" },
  { id: "stateless", label: "6. Stateless Clients" },
  { id: "eip6800", label: "7. EIP-6800: Ethereum Migration" },
  { id: "write-cost", label: "8. Write Cost Analysis" },
  { id: "comparison", label: "9. All Structures Compared" },
  { id: "tradeoffs", label: "10. Trade-offs & Challenges" },
  { id: "timeline", label: "11. Ethereum Rollout Timeline" },
  { id: "summary", label: "12. Final Summary" },
];

export default function VerkleDeepPage() {
  const [activeToc, setActiveToc] = useState("intro");

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <Tag text="Next-Gen Cryptography" color={VER} />
            <Tag text="Stateless Ethereum" color={ETH} />
            <Tag text="EIP-6800" color="#f0a040" />
            <Tag text="Deep Dive" color="#ffffff" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Verkle Trees — The Future of Blockchain State
          </h1>
          <p className="text-[#8888aa] text-lg max-w-3xl leading-relaxed">
            Verkle Trees replace Merkle Patricia Tries in Ethereum and promise to shrink state
            proofs from 15KB down to 150 bytes — a 100× improvement. This guide explains the
            cryptographic magic behind them, why they matter, and how they compare to every other
            blockchain storage structure.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "150 byte proofs", color: VER },
              { label: "Polynomial commitments", color: "#9945FF" },
              { label: "Stateless nodes possible", color: "#27c93f" },
              { label: "256-way branching", color: ETH },
              { label: "Pedersen commitments", color: "#f0a040" },
            ].map((t) => (
              <span
                key={t.label}
                className="px-3 py-1.5 rounded-full border text-xs"
                style={{ borderColor: `${t.color}44`, color: t.color, background: `${t.color}11` }}
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
                        ? { background: `${VER}22`, color: VER }
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
                1. INTRO
            ════════════════════════════════ */}
            <section id="intro">
              <SectionTitle id="intro">🌿 1. What are Verkle Trees?</SectionTitle>
              <Explainer>
                A Verkle Tree is a new kind of tree data structure that uses advanced mathematics
                (polynomial commitments) instead of hashing to build proofs. The result is that
                proofs which were 15KB in Ethereum&apos;s current tree shrink to about 150 bytes —
                a 100× reduction — while still being cryptographically secure.
              </Explainer>

              <BeginnerNote>
                In a normal Merkle tree, to prove one item exists, you need to include every
                &quot;sibling&quot; hash along the path. In a tree with 16 branches per node, each node
                has 15 siblings — that&apos;s 15 × 32 bytes = 480 bytes just per node, times 15 nodes
                = 7KB+. A Verkle tree replaces those sibling hashes with a single small
                &quot;commitment&quot; that covers ALL children at once. That commitment is ~32-48 bytes
                — smaller than ONE sibling hash in the old system.
              </BeginnerNote>

              <SubTitle>The Name: Verkle = Vector + Merkle</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#080816] p-5 mb-4">
                <p className="text-sm text-[#b0b0cc] leading-relaxed mb-3">
                  The term was coined by John Kuszmaul at MIT. &quot;Vector commitment&quot; is the
                  cryptographic primitive used instead of hashing, and it&apos;s combined with the
                  tree structure of a Merkle tree. The paper was published in 2018 and Ethereum
                  researchers (Vitalik Buterin, Dankrad Feist, and others) began adapting it for
                  Ethereum state in 2021.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className="rounded-lg border p-3"
                    style={{ borderColor: `${ETH}44`, background: `${ETH}09` }}
                  >
                    <div className="font-semibold text-sm mb-1" style={{ color: ETH }}>
                      Merkle Patricia Trie (today)
                    </div>
                    <ul className="text-xs text-[#9999cc] space-y-1">
                      <li>• Proof = sibling hashes</li>
                      <li>• 16-way branching</li>
                      <li>• Proof size grows with tree width</li>
                      <li>• 5-15KB per account proof</li>
                    </ul>
                  </div>
                  <div
                    className="rounded-lg border p-3"
                    style={{ borderColor: `${VER}44`, background: `${VER}09` }}
                  >
                    <div className="font-semibold text-sm mb-1" style={{ color: VER }}>
                      Verkle Tree (future)
                    </div>
                    <ul className="text-xs space-y-1" style={{ color: "#88ddc8" }}>
                      <li>• Proof = polynomial evaluation proof</li>
                      <li>• 256-way branching</li>
                      <li>• Proof size independent of tree width</li>
                      <li>• ~150-200 bytes per account proof</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                2. HASH vs POLYNOMIAL
            ════════════════════════════════ */}
            <section id="hash-vs-poly">
              <SectionTitle id="hash-vs-poly">🔐 2. Hash Commitments vs Polynomial Commitments</SectionTitle>
              <Explainer>
                Both hashing and polynomial commitments are ways to &quot;commit&quot; to a set of values
                — meaning you produce a short summary that proves you know the full data, and lets
                others verify individual items. The key difference is in what you need to provide
                as proof.
              </Explainer>

              <SubTitle>Hash Commitments (used in Merkle trees)</SubTitle>
              <BeginnerNote>
                A hash commitment works like a fingerprint of all children combined. To prove one
                child is genuine, you must provide all the other children&apos;s fingerprints (siblings)
                so the verifier can recompute the parent fingerprint. More children = more siblings
                = bigger proof.
              </BeginnerNote>

              <CodeBlock
                title="hash-commitment.txt"
                language="text"
                code={`// HASH COMMITMENT (Merkle Tree)
// Parent node commits to 16 children by hashing them all:
parent_hash = Hash(child_0 | child_1 | ... | child_15)

// To PROVE child_3 is genuine:
// Verifier needs:
//   - value of child_3
//   - hashes of child_0, child_1, child_2, child_4, ... child_15
//     (all 15 OTHER children)
// Verifier computes:
//   recomputed = Hash(c0 | c1 | c2 | CHILD_3 | c4 | ... | c15)
//   check: recomputed == parent_hash

// Cost: 15 × 32 bytes = 480 bytes of proof data PER NODE
// With 15 nodes in path: 15 × 480 = 7,200 bytes minimum
// Plus RLP encoding overhead: 10-15KB total`}
              />

              <SubTitle>Polynomial Commitments (used in Verkle trees)</SubTitle>
              <BeginnerNote>
                A polynomial commitment works like a magic box that holds 256 values, but produces
                a single 32-byte &quot;commitment&quot; that proves all 256 values. To prove one specific
                value, you produce a single 32-byte &quot;proof of evaluation&quot; that proves
                &quot;at position 42, the value is X&quot; — without revealing any other values.
                This proof is the same size regardless of whether the tree has 16 or 256 children.
              </BeginnerNote>

              <CodeBlock
                title="polynomial-commitment.txt"
                language="text"
                code={`// POLYNOMIAL COMMITMENT (Verkle Tree — IPA/KZG scheme)
//
// SETUP (mathematical):
// Think of 256 children as points on a polynomial curve:
//   f(0) = child_0, f(1) = child_1, ..., f(255) = child_255
// The "commitment" C is a compact encoding of this polynomial:
//   C = commit(f)  → 32-48 bytes regardless of f's size
//
// To PROVE child_42 is genuine:
// Prover produces an "evaluation proof":
//   π = prove(f, 42, f(42))  → 32-48 bytes
//
// Verifier checks:
//   verify(C, 42, child_42, π)  → true/false
//
// CRITICAL: π is the SAME SIZE regardless of the number of children!
// 256 children → same 32-48 byte proof as 2 children
// No sibling data needed at all
//
// Full proof for an account:
// depth × (commitment + evaluation_proof) = depth × ~64 bytes
// For depth 8: 8 × 64 = 512 bytes
// Compare: Merkle depth 15: 15 × 480 = 7,200 bytes`}
              />

              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-5 mb-4">
                <div className="text-sm font-bold text-white mb-4">Why this is revolutionary</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      icon: "📐",
                      title: "Width-independent proofs",
                      desc: "In Merkle trees, proof size grows linearly with the number of children. In Verkle, it doesn&apos;t. Going from 16-way to 256-way branching costs ZERO extra proof bytes — but makes the tree much shallower.",
                    },
                    {
                      icon: "🎯",
                      title: "Aggregate proofs",
                      desc: "One polynomial commitment can prove multiple leaves from the same node simultaneously. A single proof can cover an account&apos;s balance, nonce, storage, and code — all at once.",
                    },
                    {
                      icon: "🔒",
                      title: "Same security",
                      desc: "Polynomial commitments (specifically IPA or KZG) are proven cryptographically secure under the discrete logarithm assumption — the same foundation as Elliptic Curve signatures used in Bitcoin and Ethereum.",
                    },
                  ].map((c) => (
                    <div
                      key={c.title}
                      className="rounded-xl border border-[#1a3a2a] bg-[#0a1a10] p-4"
                    >
                      <div className="text-2xl mb-2">{c.icon}</div>
                      <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                      <div className="text-xs text-[#88ccaa] leading-relaxed">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                3. PEDERSEN COMMITMENTS
            ════════════════════════════════ */}
            <section id="pedersen">
              <SectionTitle id="pedersen">🧮 3. Pedersen Commitments — The Math Made Simple</SectionTitle>
              <Explainer>
                Ethereum&apos;s Verkle Tree uses a specific type of polynomial commitment called a
                Pedersen commitment with an Inner Product Argument (IPA). &quot;Pedersen&quot; is a
                cryptographer&apos;s name. You don&apos;t need to understand the math to use Verkle trees,
                but understanding the intuition helps you see why they work.
              </Explainer>

              <SubTitle>The Core Idea — Hiding a Number in a Point</SubTitle>
              <BeginnerNote>
                Elliptic curves are mathematical objects where you can do special arithmetic. One
                property is that multiplying a point P by a secret number k gives you another
                point Q = k × P. But given only Q and P, you cannot figure out k — this is the
                &quot;discrete logarithm problem&quot; and it&apos;s computationally impossible to crack (with
                current computers). Pedersen commitments use this to &quot;hide&quot; values inside points.
              </BeginnerNote>

              <CodeBlock
                title="pedersen-intuition.txt"
                language="text"
                code={`// PEDERSEN COMMITMENT — Intuition (not exact code)
//
// Setup: we have fixed public elliptic curve points:
//   G_0, G_1, G_2, ..., G_255  (256 "basis points", public)
//
// To commit to 256 values [v_0, v_1, ..., v_255]:
//   C = v_0 × G_0 + v_1 × G_1 + ... + v_255 × G_255
//
// C is a single elliptic curve point — 32-48 bytes
// It "encodes" all 256 values cryptographically
//
// BINDING: You cannot change any v_i without changing C
// HIDING: C alone reveals nothing about individual values
//
// To prove "v_42 = X":
// The IPA (Inner Product Argument) protocol lets you prove:
//   "C commits to a polynomial f where f(42) = X"
//   in O(log n) rounds, producing a proof of size O(log n)
//
// For n=256: log(256) = 8 rounds → proof is ~8 × 32 bytes = 256 bytes
// vs Merkle: 255 sibling hashes × 32 bytes = 8,160 bytes
//
// The ratio: 8,160 / 256 ≈ 32× smaller just from this one node
// Across the whole tree: 100× smaller overall`}
              />

              <SubTitle>IPA vs KZG — Two Flavours</SubTitle>
              <div className="space-y-3 mb-4">
                <Accordion title="IPA (Inner Product Argument) — Ethereum Verkle uses this" color={VER} defaultOpen>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong className="text-white">What it is:</strong> A proof system that proves
                      &quot;these two vectors, when multiplied together element-by-element and summed,
                      give this value.&quot; Used to prove polynomial evaluations.
                    </li>
                    <li>
                      <strong className="text-white">Trusted setup:</strong> No trusted setup needed.
                      Security relies only on the discrete log problem.
                    </li>
                    <li>
                      <strong className="text-white">Proof size:</strong> O(log n) — for 256
                      children, this is ~8 group elements = ~256 bytes per node in the path.
                    </li>
                    <li>
                      <strong className="text-white">Verification cost:</strong> O(log n) scalar
                      multiplications — fast on modern CPUs.
                    </li>
                    <li>
                      <strong className="text-white">Why Ethereum chose IPA over KZG for Verkle:</strong>{" "}
                      No trusted setup ceremony required. Simpler security assumptions.
                    </li>
                  </ul>
                </Accordion>

                <Accordion title="KZG Commitments — used in Ethereum Blobs (EIP-4844)" color={ETH}>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <strong className="text-white">What it is:</strong> Kate-Zaverucha-Goldberg
                      scheme. Produces constant-size proofs (just 48 bytes) for any polynomial
                      evaluation — even smaller than IPA.
                    </li>
                    <li>
                      <strong className="text-white">Trusted setup:</strong> Requires a one-time
                      &quot;powers of tau&quot; ceremony (Ethereum already ran this for EIP-4844).
                    </li>
                    <li>
                      <strong className="text-white">Proof size:</strong> O(1) — constant 48 bytes
                      regardless of polynomial degree. Theoretically better than IPA.
                    </li>
                    <li>
                      <strong className="text-white">Already in Ethereum:</strong> KZG is used today
                      for blob data in EIP-4844 (proto-danksharding). Not currently used for state.
                    </li>
                    <li>
                      <strong className="text-white">Future:</strong> Future Verkle iterations may
                      switch to KZG for even smaller proofs.
                    </li>
                  </ul>
                </Accordion>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                4. TREE STRUCTURE
            ════════════════════════════════ */}
            <section id="tree-structure">
              <SectionTitle id="tree-structure">🌲 4. Verkle Tree Structure</SectionTitle>
              <Explainer>
                The Verkle tree proposed for Ethereum uses 256-way branching (each node has up
                to 256 children) instead of the current 16-way branching. This dramatically
                reduces tree depth — from ~15-20 levels down to ~4-8 levels. Shallower tree =
                fewer nodes per proof = smaller proof.
              </Explainer>

              <SubTitle>Key Layout Change: EIP-6800 Address Space</SubTitle>
              <CodeBlock
                title="verkle-key-layout.ts"
                language="text"
                code={`// EIP-6800 defines a new key structure for Verkle trees:
// Key = 32 bytes = stem (31 bytes) + suffix (1 byte)
//
// STEM identifies an account:
stem = keccak256(address)[0:31]   // first 31 bytes of address hash
// All data for ONE account shares the SAME stem!
//
// SUFFIX identifies what type of data:
// suffix = 0  → account version
// suffix = 1  → account balance
// suffix = 2  → account nonce
// suffix = 3  → code hash
// suffix = 4  → code size
// suffix = 64-127 → code chunks (contract bytecode)
// suffix = 128-255 → storage slots 0-127

// This is a HUGE change from current MPT:
// Current: account metadata and storage are in SEPARATE tries
//   → account trie + storage trie = 2 separate proofs
// Verkle: account metadata AND nearby storage are in the SAME tree
//   → one proof covers balance + nonce + first 128 storage slots

// Example: proving Alice's balance
// Current Ethereum: prove path in account trie (15KB)
// Verkle: prove stem=hash(alice)[0:31], suffix=1 (~150 bytes)`}
              />

              <SubTitle>Tree Depth Comparison</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-5 mb-4">
                <div className="space-y-4">
                  {[
                    {
                      name: "Ethereum MPT (current)",
                      color: ETH,
                      branching: "16-way",
                      depth: "15-20 levels",
                      proofNodes: "~15-20 nodes",
                      proofSize: "5-15 KB",
                      nodesForMillion: "~2M nodes in tree",
                    },
                    {
                      name: "Verkle Tree (proposed)",
                      color: VER,
                      branching: "256-way",
                      depth: "3-5 levels",
                      proofNodes: "3-5 commitments",
                      proofSize: "~150-300 bytes",
                      nodesForMillion: "~4K nodes in tree (!)",
                    },
                    {
                      name: "Substrate Patricia Trie",
                      color: SUB,
                      branching: "Flexible (2-16)",
                      depth: "Variable",
                      proofNodes: "~10-15 nodes",
                      proofSize: "2-8 KB",
                      nodesForMillion: "varies",
                    },
                    {
                      name: "Cosmos IAVL",
                      color: COS,
                      branching: "2 (binary)",
                      depth: "~20 levels (log₂ n)",
                      proofNodes: "~20 hashes",
                      proofSize: "3-8 KB",
                      nodesForMillion: "~1M nodes",
                    },
                  ].map((r) => (
                    <div
                      key={r.name}
                      className="rounded-xl border p-3 grid grid-cols-2 sm:grid-cols-3 gap-2"
                      style={{ borderColor: `${r.color}33`, background: `${r.color}07` }}
                    >
                      <div className="col-span-2 sm:col-span-3">
                        <span className="font-semibold text-sm" style={{ color: r.color }}>
                          {r.name}
                        </span>
                      </div>
                      {[
                        { label: "Branching", val: r.branching },
                        { label: "Tree Depth", val: r.depth },
                        { label: "Proof Nodes", val: r.proofNodes },
                        { label: "Proof Size", val: r.proofSize },
                        { label: "1M accounts", val: r.nodesForMillion },
                      ].map((f) => (
                        <div key={f.label}>
                          <div className="text-xs text-[#666688]">{f.label}</div>
                          <div className="text-xs font-mono text-[#c8c8e8]">{f.val}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <SubTitle>Why 256-way branching works with Verkle but not Merkle</SubTitle>
              <BeginnerNote>
                In a Merkle tree, increasing branching from 16 to 256 would make proofs
                16× larger (15 siblings → 255 siblings). In a Verkle tree, the proof stays
                the same size regardless of branching. So Verkle lets you choose 256-way
                branching purely for the tree depth benefit — shallower tree, shorter path,
                fewer commitments in the proof. Win-win.
              </BeginnerNote>
            </section>

            <Divider />

            {/* ════════════════════════════════
                5. PROOF SIZE
            ════════════════════════════════ */}
            <section id="proof-size">
              <SectionTitle id="proof-size">📦 5. Why Proofs are 100× Smaller</SectionTitle>

              <CodeBlock
                title="proof-size-breakdown.txt"
                language="text"
                code={`// ETHEREUM MPT PROOF (current):
// Path depth: ~15 nodes
// Each node proof:
//   - 15 sibling hashes × 32 bytes = 480 bytes
//   - RLP length prefixes: ~20 bytes
//   - Node type tag: ~5 bytes
// Per node: ~505 bytes × 15 nodes = 7,575 bytes
// Plus leaf value (RLP-encoded account): ~100-200 bytes
// Total: 7,700 - 15,000 bytes (7-15KB)
//
// ─────────────────────────────────────────────────────
//
// VERKLE TREE PROOF (proposed):
// Path depth: ~4 nodes
// Each node proof:
//   - 1 Pedersen commitment C: 32 bytes
//   - 1 IPA evaluation proof π: 8 × 32 bytes = 256 bytes
//     (IPA rounds: log₂(256) = 8 rounds)
// But! IPA proofs AGGREGATE across nodes:
//   - Total proof for full path: ~576 bytes (non-aggregated)
//   - With aggregation across multiple keys: ~150-200 bytes/key
//
// The magic of aggregation:
// When proving 10 leaves from the same block:
// MPT: 10 × 10KB = 100KB of proof data
// Verkle: ~10 × 150 + shared_parts ≈ 2-3KB total
// Ratio: 100KB → 2-3KB = 33-50× better with aggregation`}
              />

              <SubTitle>Proof Size Visual</SubTitle>
              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-6 mb-4">
                {[
                  { chain: "Bitcoin Merkle", size: 1, max: 15, label: "~1KB", color: BTC, note: "Binary tree, simple sibling hashes" },
                  { chain: "Verkle (aggregated)", size: 1.5, max: 15, label: "~150B-500B", color: VER, note: "Polynomial evaluation proof" },
                  { chain: "Substrate Trie", size: 5, max: 15, label: "2-8KB", color: SUB, note: "Patricia proof, SCALE encoded" },
                  { chain: "Cosmos IAVL", size: 6, max: 15, label: "3-8KB", color: COS, note: "Binary Merkle + SHA256" },
                  { chain: "Ethereum MPT", size: 12, max: 15, label: "5-15KB", color: ETH, note: "16-way + RLP + branch bloat" },
                  { chain: "Solana", size: 0, max: 15, label: "N/A", color: SOL, note: "No global state proofs" },
                ].map((b) => (
                  <div key={b.chain} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono" style={{ color: b.color }}>{b.chain}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#666688]">{b.note}</span>
                        <span className="text-xs font-bold" style={{ color: b.color }}>{b.label}</span>
                      </div>
                    </div>
                    <div className="bg-[#1a1a2e] rounded-full h-2">
                      {b.size > 0 && (
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(b.size / b.max) * 100}%`,
                            background: b.color,
                            opacity: 0.85,
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-[#444466] mt-2">
                  Bar length is proportional to proof size. Smaller bar = better.
                </p>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                6. STATELESS CLIENTS
            ════════════════════════════════ */}
            <section id="stateless">
              <SectionTitle id="stateless">🚀 6. Stateless Clients — The Game Changer</SectionTitle>
              <Explainer>
                Today, to run a full Ethereum node, you must store the entire state (~800GB and
                growing). With Verkle trees and stateless clients, a node could validate every
                block without storing ANY state — just the block itself (with embedded proofs).
              </Explainer>

              <BeginnerNote>
                Today&apos;s Ethereum node: &quot;I need to store 800GB so I can look up any account
                state when processing a block.&quot;
                <br />
                <br />
                Stateless Ethereum node: &quot;When you send me a block, include the 150-byte proofs
                for every account touched by that block. I&apos;ll verify the proofs against the
                state root in the block header. I don&apos;t need to store anything!&quot;
              </BeginnerNote>

              <SubTitle>How Stateless Validation Works</SubTitle>
              <div className="space-y-2 mb-6">
                {[
                  {
                    n: "1",
                    title: "Block producer includes &quot;witnesses&quot;",
                    desc: "When a validator creates a block, they also generate Verkle proofs (called &quot;witnesses&quot;) for every piece of state touched during block execution — balances read, storage slots accessed, code executed.",
                  },
                  {
                    n: "2",
                    title: "Witnesses are tiny (150 bytes each)",
                    desc: "With Verkle proofs, witnesses are so small that adding them to a block adds only ~100-300KB of overhead even for a densely-packed block with thousands of state accesses.",
                  },
                  {
                    n: "3",
                    title: "Other nodes verify without storage",
                    desc: "A receiving node only needs the block header (with state root) and the witnesses. It verifies each witness against the state root. If all check out, the block is valid — no local state lookup needed.",
                  },
                  {
                    n: "4",
                    title: "State root provides the anchor",
                    desc: "The state root (32 bytes in the block header) is the anchor of trust. Any Verkle proof for any state item can be verified against this root. The root itself is verified via consensus.",
                  },
                ].map((s) => (
                  <div
                    key={s.n}
                    className="flex gap-3 rounded-xl border border-[#1a3a2a] bg-[#0a1a10] p-4"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `${VER}22`, color: VER }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm mb-1"
                        dangerouslySetInnerHTML={{ __html: s.title }}
                      />
                      <div
                        className="text-xs text-[#88aa88] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: s.desc }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <SubTitle>Impact on Decentralisation</SubTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {[
                  {
                    icon: "💻",
                    title: "Run a node on a laptop",
                    desc: "A stateless node needs only the latest block + its witnesses (~300KB). It could run on a phone or browser extension.",
                  },
                  {
                    icon: "🌍",
                    title: "More validators = more decentralised",
                    desc: "Today, running a full node requires 8TB+ storage and 32GB RAM. Stateless nodes change this to requiring nearly no persistent storage.",
                  },
                  {
                    icon: "⚡",
                    title: "Faster sync",
                    desc: "New nodes don&apos;t need to download and verify 800GB of state. They just get the latest state root and start validating blocks with their witnesses.",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-[#1a3a2a] bg-[#0a1a10] p-4"
                  >
                    <div className="text-2xl mb-2">{c.icon}</div>
                    <div className="font-semibold text-white text-sm mb-1">{c.title}</div>
                    <div className="text-xs text-[#88aa88] leading-relaxed">{c.desc}</div>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                7. EIP-6800
            ════════════════════════════════ */}
            <section id="eip6800">
              <SectionTitle id="eip6800">📋 7. EIP-6800: Ethereum&apos;s Verkle Migration</SectionTitle>
              <div className="flex items-center gap-3 mb-4">
                <StatusBadge status="proposal" />
                <span className="text-xs text-[#666688]">
                  Target: Ethereum &quot;Glamsterdam&quot; or later upgrade (2025-2026)
                </span>
              </div>

              <Explainer>
                EIP-6800 is the formal proposal to migrate Ethereum&apos;s state from the current
                Merkle Patricia Trie to a Verkle Tree. It&apos;s one of the most complex changes
                ever proposed for Ethereum because it requires migrating 100M+ accounts and
                their storage without interrupting the chain.
              </Explainer>

              <SubTitle>Key Changes in EIP-6800</SubTitle>
              <div className="space-y-3 mb-6">
                {[
                  {
                    eip: "New state structure",
                    desc: "All account data (balance, nonce, code, storage) is reorganised into Verkle tree key-value pairs using the stem+suffix scheme. Account data and first 128 storage slots share the same stem — enabling single-proof coverage.",
                    status: "proposal" as const,
                  },
                  {
                    eip: "EIP-4762: Gas repricing",
                    desc: "SLOAD and SSTORE opcodes get new gas costs based on Verkle witness costs. Accessing a slot in the same stem as the account is cheaper (already covered by account witness) than accessing a distant storage slot.",
                    status: "proposal" as const,
                  },
                  {
                    eip: "Migration strategy: overlay",
                    desc: "Rather than a big-bang migration, Ethereum will use an overlay approach. New writes go to the Verkle tree immediately. Old accounts are migrated lazily (when first accessed after the fork). Full migration expected over 1-2 years.",
                    status: "research" as const,
                  },
                  {
                    eip: "EIP-2935: Historical block hashes",
                    desc: "Stores recent block hashes in the Verkle state to allow smart contracts to access them via witness proofs rather than hard-coded BLOCKHASH opcode.",
                    status: "proposal" as const,
                  },
                ].map((e) => (
                  <div
                    key={e.eip}
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${VER}22`, background: `${VER}06` }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-white text-sm">{e.eip}</span>
                      <StatusBadge status={e.status} />
                    </div>
                    <p className="text-xs text-[#88ccaa] leading-relaxed">{e.desc}</p>
                  </div>
                ))}
              </div>

              <SubTitle>The Migration Challenge</SubTitle>
              <CodeBlock
                title="migration-challenge.txt"
                language="text"
                code={`// CHALLENGE: Migrating ~200M state objects without downtime
//
// Current Ethereum state (as of 2024):
// - ~180M accounts (incl. contracts)
// - ~100B+ storage slots (mainly in large contracts)
// - MPT has ~1.5B+ nodes in LevelDB
//
// Naive migration: hash all accounts → build Verkle tree
// Time estimate: several days of downtime
// → Completely unacceptable
//
// ACTUAL PLAN: Lazy/Overlay Migration
// Phase 1: At fork block, NEW writes go to Verkle tree
//           Old state remains in MPT temporarily
//           Dual tree maintained briefly
//
// Phase 2: When old MPT account is FIRST ACCESSED after fork:
//           → Migrate it to Verkle tree
//           → Delete from MPT
//           → Record that it was migrated
//
// Phase 3: After 1-2 years, assume all accessed accounts migrated
//           Background process migrates remaining rarely-used accounts
//           MPT retired entirely
//
// Risk: During dual-tree period, nodes must maintain both structures
// Memory and storage overhead: ~50% during transition`}
              />
            </section>

            <Divider />

            {/* ════════════════════════════════
                8. WRITE COST
            ════════════════════════════════ */}
            <section id="write-cost">
              <SectionTitle id="write-cost">✍️ 8. Write Cost Analysis</SectionTitle>
              <Explainer>
                Verkle trees are significantly better for proofs and stateless clients, but
                writes are more expensive computationally than simple hash-based trees. The
                polynomial commitment operations (elliptic curve math) are heavier than SHA256 or
                Blake2b. This is a known trade-off.
              </Explainer>

              <CodeBlock
                title="write-cost.txt"
                language="text"
                code={`// WRITE COST COMPARISON (approximate)

// Per-node write operations:

Ethereum MPT (current):
  keccak256(node data)         → ~30ns per call
  RLP encoding                 → ~50ns per node
  Total per node write:        → ~80-120ns

Verkle Tree (proposed):
  Pedersen commitment update   → ~2-5μs per node
    (elliptic curve scalar mul)
  IPA proof generation (prover)→ ~50-200ms for full block witness
  Total per node write:        → ~2-6μs (25-50× slower than keccak)

Substrate Patricia:
  Blake2b-256(node)            → ~20ns per call
  SCALE encoding               → ~20ns per node
  Total per node write:        → ~40-60ns

// KEY MITIGATION:
// Write path (commitment update) and proof path (witness gen) are SEPARATE:
// - Commitment update happens at each block end (~2-6μs/node × depth)
//   → Acceptable: 10,000 state changes × 4 nodes deep × 4μs = 160ms
//   → Current MPT: 10,000 × 15 nodes × 0.1μs = 15ms
//   → Verkle write: ~10× slower than MPT
//
// - Witness generation (for stateless): only done by BLOCK PROPOSERS
//   → Other nodes just verify witnesses (very fast, ~few ms)
//   → Block proposers have extra time to generate witnesses`}
              />

              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] p-5 mb-4">
                <div className="text-sm font-bold text-white mb-4">Write Cost Comparison (lower bar = better)</div>
                {[
                  { chain: "Substrate Trie (Blake2b)", val: 10, color: SUB, note: "Blake2b ~20ns/hash" },
                  { chain: "Bitcoin Merkle (SHA256)", val: 15, color: BTC, note: "SHA256 ~25ns/hash" },
                  { chain: "Ethereum MPT (keccak)", val: 20, color: ETH, note: "keccak256 ~30ns/hash" },
                  { chain: "Cosmos IAVL (SHA256+rotations)", val: 35, color: COS, note: "SHA256 + rebalancing" },
                  { chain: "Verkle Tree (elliptic curve)", val: 75, color: VER, note: "~2-5μs/EC scalar mul" },
                ].map((b) => (
                  <div key={b.chain} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: b.color }}>{b.chain}</span>
                      <span className="text-xs text-[#666688]">{b.note}</span>
                    </div>
                    <div className="bg-[#1a1a2e] rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${b.val}%`, background: b.color, opacity: 0.85 }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-[#444466] mt-2">
                  Relative cost per node write operation. Verkle writes are slower but the shallower tree (4 vs 15 levels) partially compensates.
                </p>
              </div>

              <BeginnerNote>
                Verkle writes being 25× slower per-operation sounds bad — but because the tree is
                4-5× shallower, you do 3× fewer operations per state change. Net result: block
                state update is roughly 8-10× slower than today. This is a known trade-off accepted
                because the stateless client benefits are so significant for decentralisation.
              </BeginnerNote>
            </section>

            <Divider />

            {/* ════════════════════════════════
                9. ALL STRUCTURES COMPARED
            ════════════════════════════════ */}
            <section id="comparison">
              <SectionTitle id="comparison">📊 9. All Storage Structures Compared</SectionTitle>

              <div className="rounded-xl border border-[#1a1a2e] bg-[#050510] overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#1a1a2e]">
                        <th className="text-left px-3 py-3 text-[#666688] font-medium w-36">Property</th>
                        {[
                          { name: "Verkle", color: VER },
                          { name: "ETH MPT", color: ETH },
                          { name: "Substrate", color: SUB },
                          { name: "Cosmos IAVL", color: COS },
                          { name: "Bitcoin", color: BTC },
                          { name: "Solana", color: SOL },
                        ].map((c) => (
                          <th key={c.name} className="text-left px-3 py-3 font-medium" style={{ color: c.color }}>
                            {c.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a2e]">
                      {[
                        ["Branching", "256", "16", "2-16", "2", "2", "None"],
                        ["Tree depth", "3-5", "15-20", "~10-15", "~20", "~20", "N/A"],
                        ["Proof type", "Poly. commit.", "Hash chain", "Hash chain", "Hash chain", "Hash chain", "N/A"],
                        ["Proof size", "~150B", "5-15KB", "2-8KB", "3-8KB", "~1KB", "N/A"],
                        ["Write cost", "High (EC ops)", "Medium", "Low", "Medium-High", "Low", "Very Low"],
                        ["Read cost", "Fast (shallow)", "Slow", "Fast", "Medium", "Fast", "Fastest"],
                        ["Stateless node", "✅ Planned", "❌", "❌", "❌", "❌", "N/A"],
                        ["History", "Same as ETH", "Archive only", "Archive only", "Built-in", "No", "N/A"],
                        ["Self-balancing", "No", "No", "No", "AVL ✅", "No", "N/A"],
                        ["Node storage (full)", "~200GB*", "~800GB", "~100GB", "~800GB+", "~10GB", "~100GB"],
                        ["Hash function", "Pedersen/IPA", "keccak256", "Blake2b", "SHA256", "SHA256", "SHA256"],
                        ["Encoding", "Custom", "RLP", "SCALE", "Protobuf", "Custom", "Custom"],
                        ["Aggregated proofs", "✅", "❌", "❌", "❌", "❌", "N/A"],
                      ].map((row) => (
                        <tr key={row[0]} className="hover:bg-[#0a0a1a] transition-colors">
                          {row.map((cell, i) => (
                            <td
                              key={i}
                              className={`px-3 py-2 text-xs ${
                                i === 0 ? "text-[#8888aa] font-medium" : "text-[#c8c8e8]"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 pb-3 text-xs text-[#444466]">
                  * Estimated once stateless, post-migration. Current full node still ~800GB.
                </div>
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                10. TRADE-OFFS
            ════════════════════════════════ */}
            <section id="tradeoffs">
              <SectionTitle id="tradeoffs">⚖️ 10. Trade-offs &amp; Challenges</SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="font-bold text-[#27c93f] mb-3">✅ Advantages of Verkle Trees</div>
                  <div className="space-y-2">
                    {[
                      ["100× smaller proofs", "150 bytes vs 15KB — transforms what&apos;s possible for light clients"],
                      ["Stateless validation", "Nodes can validate without storing state"],
                      ["Aggregated proofs", "One proof covers multiple keys in the same node — free for common patterns"],
                      ["Shallower tree", "256-way branching → 3-5 levels vs 15-20 — fewer DB lookups"],
                      ["Better for ZK proofs", "Polynomial commitments work natively with ZK-SNARKs — synergy with ZK-rollups"],
                    ].map(([title, desc]) => (
                      <div
                        key={title}
                        className="rounded-xl border border-[#1a3a1a] bg-[#0a1a0a] p-3"
                      >
                        <div className="font-semibold text-white text-xs mb-1">{title}</div>
                        <div
                          className="text-xs text-[#88aa88]"
                          dangerouslySetInnerHTML={{ __html: desc }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-[#ff6666] mb-3">⚠️ Challenges &amp; Trade-offs</div>
                  <div className="space-y-2">
                    {[
                      ["Write cost ~8-10× higher", "Elliptic curve scalar multiplication is slow. Block production gets more compute-intensive."],
                      ["Complex migration", "Migrating 200M+ accounts without downtime is a massive engineering challenge. Dual-tree period adds overhead."],
                      ["Cryptographic complexity", "Pedersen commitments + IPA are much harder to implement correctly than SHA256 hashing. More attack surface."],
                      ["Prover time for witnesses", "Block proposers must generate Verkle witnesses in <12s (Ethereum block time). Requires efficient proof generation."],
                      ["Quantum vulnerability", "Elliptic curve discrete log is broken by quantum computers. Whereas SHA256 is only weakened (not broken). Long-term concern."],
                    ].map(([title, desc]) => (
                      <div
                        key={title}
                        className="rounded-xl border border-[#3a1a1a] bg-[#1a0a0a] p-3"
                      >
                        <div className="font-semibold text-white text-xs mb-1">{title}</div>
                        <div className="text-xs text-[#aa8888]">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <SubTitle>Is Verkle coming to Substrate or Cosmos?</SubTitle>
              <div className="space-y-3">
                {[
                  {
                    chain: "Substrate / Polkadot",
                    color: SUB,
                    status: "research" as const,
                    answer: "No current plans. Polkadot uses BEEFY bridges for cross-chain light clients, which uses a different approach (BLS signatures + Merkle). Substrate&apos;s existing trie design is already quite efficient for its use case.",
                  },
                  {
                    chain: "Cosmos SDK",
                    color: COS,
                    status: "research" as const,
                    answer: "There are discussions about moving from IAVL to SMT (Sparse Merkle Tree) first as an intermediate step. Verkle is further ahead on the roadmap. IBC requires proofs, so Cosmos is very interested in smaller proofs — but the migration complexity is daunting.",
                  },
                  {
                    chain: "Ethereum",
                    color: ETH,
                    status: "planned" as const,
                    answer: "EIP-6800 is actively developed by core researchers. Expected in a major Ethereum upgrade around 2025-2026. This is the most concrete Verkle deployment plan in production blockchains.",
                  },
                ].map((c) => (
                  <div
                    key={c.chain}
                    className="rounded-xl border p-4"
                    style={{ borderColor: `${c.color}33`, background: `${c.color}07` }}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-semibold text-sm" style={{ color: c.color }}>
                        {c.chain}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-xs text-[#9999aa] leading-relaxed">{c.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                11. TIMELINE
            ════════════════════════════════ */}
            <section id="timeline">
              <SectionTitle id="timeline">⏳ 11. Ethereum Verkle Rollout Timeline</SectionTitle>

              <div className="space-y-3 mb-4">
                {[
                  { date: "2018", title: "Verkle Trees paper", desc: "John Kuszmaul publishes &quot;Verkle Trie for Ethereum State&quot; at MIT.", done: true },
                  { date: "2021", title: "Ethereum research begins", desc: "Vitalik Buterin, Dankrad Feist propose adapting Verkle trees for Ethereum state.", done: true },
                  { date: "2022", title: "EIP-6800 drafted", desc: "Formal EIP written describing the Verkle transition. Detailed key layout (stem+suffix) specified.", done: true },
                  { date: "2023", title: "Testnet implementations", desc: "First Verkle test networks launched. Go-ethereum and Besu implement Verkle state. Performance benchmarks collected.", done: true },
                  { date: "2024", title: "Kaustinen testnets", desc: "Multiple Kaustinen test networks deployed with Verkle state. Cross-client compatibility tested. EIP-4762 gas repricing finalised.", done: true },
                  { date: "2025", title: "Target: Fusaka or later upgrade", desc: "Verkle targeted for inclusion in a major Ethereum upgrade. Migration tooling and overlay strategy finalised. EIP-6800 expected to be included.", done: false },
                  { date: "2025-2026", title: "Lazy migration period", desc: "Overlay migration runs: new writes to Verkle, old state migrated on access. Dual tree maintained.", done: false },
                  { date: "2026+", title: "Full Verkle state", desc: "MPT retired. All state in Verkle. Stateless clients become practical. Light clients on mobile become reliable.", done: false },
                ].map((e) => (
                  <div key={e.date} className="flex gap-4">
                    <div className="flex flex-col items-center shrink-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          background: e.done ? `${VER}22` : "#1a1a2e",
                          color: e.done ? VER : "#666688",
                          border: `1px solid ${e.done ? `${VER}55` : "#2a2a4a"}`,
                        }}
                      >
                        {e.done ? "✓" : "○"}
                      </div>
                      <div
                        className="w-0.5 h-full mt-1"
                        style={{ background: e.done ? `${VER}33` : "#1a1a2e" }}
                      />
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold" style={{ color: VER }}>
                          {e.date}
                        </span>
                        <span className="font-semibold text-sm text-white">{e.title}</span>
                      </div>
                      <p
                        className="text-xs text-[#9999aa] leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: e.desc }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Divider />

            {/* ════════════════════════════════
                12. FINAL SUMMARY
            ════════════════════════════════ */}
            <section id="summary">
              <SectionTitle id="summary">🎯 12. Final Summary</SectionTitle>

              <div
                className="rounded-xl border p-6 mb-6"
                style={{ borderColor: `${VER}44`, background: `${VER}09` }}
              >
                <div className="font-bold text-lg mb-3" style={{ color: VER }}>
                  The Core Innovation
                </div>
                <p className="text-[#b0b0cc] text-sm leading-relaxed mb-4">
                  Verkle trees replace the core primitive from hashing to polynomial commitments.
                  This single change unlocks proof aggregation, width-independent proof sizes, and
                  eventually stateless client operation. It&apos;s not just an optimisation — it&apos;s a
                  foundational redesign that changes what kind of clients can participate in the
                  Ethereum network.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { metric: "Proof size reduction", from: "5-15KB", to: "~150B", change: "100×" },
                    { metric: "Tree depth", from: "15-20 levels", to: "3-5 levels", change: "4-5×" },
                    { metric: "Full node size (future)", from: "~800GB", to: "~stateless", change: "∞×" },
                  ].map((m) => (
                    <div key={m.metric} className="rounded-xl border border-[#1a3a2a] bg-[#0a1a10] p-3 text-center">
                      <div className="text-xs text-[#666688] mb-1">{m.metric}</div>
                      <div className="text-xs text-[#888888] line-through mb-0.5">{m.from}</div>
                      <div className="text-sm font-bold" style={{ color: VER }}>
                        {m.to}
                      </div>
                      <div className="text-xs text-[#88ccaa]">{m.change} improvement</div>
                    </div>
                  ))}
                </div>
              </div>

              <SubTitle>One-Line Summaries</SubTitle>
              <div className="space-y-3">
                {[
                  {
                    color: VER,
                    chain: "Verkle Trees",
                    line: "Replace SHA256 hashing with elliptic curve polynomial commitments to make proofs 100× smaller and enable stateless clients — a foundational upgrade that trades higher write cost for dramatically better proof generation, enabling mobile light clients and more decentralised validation.",
                  },
                  {
                    color: ETH,
                    chain: "Ethereum MPT (today)",
                    line: "Secure and battle-tested but heavy — 16-way branching with RLP encoding means 15KB proofs and 800GB full nodes. The Verkle transition is Ethereum&apos;s answer to these limitations.",
                  },
                  {
                    color: SUB,
                    chain: "Substrate Trie",
                    line: "High-throughput and compact — structured keys with SCALE encoding give good write performance and 2-8KB proofs. A pragmatic choice that doesn&apos;t need Verkle&apos;s complexity for its cross-chain model (Polkadot BEEFY).",
                  },
                  {
                    color: COS,
                    chain: "Cosmos IAVL",
                    line: "Immutable versioning enables IBC light clients natively — but write amplification, storage bloat, and pruning complexity are real costs. Potential future migration to SMT or Verkle is discussed but not planned.",
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
