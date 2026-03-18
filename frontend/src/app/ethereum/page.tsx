"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";
import KeyBuilder from "@/components/KeyBuilder";

const COLOR = "#627EEA";

// Simple deterministic nibble-hash for demo
function demoKeccak(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(h).toString(16).padStart(8, "0");
  return `0x${hex}${"abcdef9876543210".slice(0, 56)}`;
}

function getNibbles(hex: string): string[] {
  return hex.replace("0x", "").slice(0, 16).split("");
}

const mptStructureCode = `// Ethereum MPT — 3 node types in LevelDB
// DB key = keccak256(RLP(node))
// DB val = RLP(node)

// 1. BRANCH NODE — 16 children + optional value
branch_node = [
  child[0],  // pointer to child for nibble '0'
  child[1],  // pointer to child for nibble '1'
  // ...
  child[15], // pointer to child for nibble 'f'
  value      // optional value at this path
]

// 2. EXTENSION NODE — compressed shared prefix
extension_node = [
  "shared_prefix",  // hex-encoded nibbles (compressed)
  next_node_hash    // pointer to next node
]

// 3. LEAF NODE — compressed remaining path + value
leaf_node = [
  "remaining_path", // nibbles not yet traversed
  value             // the account data (RLP encoded)
]`;

const accountDataCode = `// What's stored at a leaf node (Ethereum account)
account_value = RLP([
  nonce:       42,          // how many txs sent
  balance:     1.5 ETH,     // in wei (1.5e18)
  storageRoot: 0xdef456..., // root of THIS account's storage trie
  codeHash:    0x789abc...  // keccak256(bytecode), 0x empty for EOA
])

// For smart contracts, storageRoot points to ANOTHER MPT:
// contract_storage_trie[keccak256(slot)] = value
// e.g., ERC20 balances[address] stored as:
// key = keccak256(abi.encode(address, slot_index))`;

const stateRootCode = `// Ethereum block — 4 separate tries
block = {
  // Each block has these Merkle roots:
  stateRoot:     0xabc...,  // root of global state trie
  transactionsRoot: 0xdef...,  // root of all block txs
  receiptsRoot:  0x789...,  // root of all tx receipts
  
  // State trie:
  // keccak256(address) → RLP(nonce, balance, storageRoot, codeHash)
  
  // Storage trie (per contract):  
  // keccak256(32-byte-key) → RLP(value)
}

// Proof that Alice has 1 ETH (Merkle proof):
// stateRoot → [node hash 1, node hash 2, ..., leaf]`;

const rlpCode = `// RLP Encoding — Ethereum's serialization
// (Recursive Length Prefix)

RLP(string "dog")  = [ 0x83, 'd', 'o', 'g' ]
                           ↑ 0x83 means "3-byte string"

RLP(list [1, 2])   = [ 0xC2, 0x01, 0x02 ]
                           ↑ 0xC2 means "2-byte list"

// Account encoded:
RLP([nonce, balance, storageRoot, codeHash])
→ 0xf8 44 01 88 0de0b6b3a7640000 a0 def456... a0 789abc...
     ↑list  ↑nonce  ↑balance(8 bytes)  ↑storageRoot(32)  ↑codeHash(32)`;

const nibbleTraversalCode = `// How keccak256(address) becomes a trie path

address = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"

Step 1: Hash the address
key = keccak256(address)
    = "0xabc123def456..." (32 bytes = 64 hex chars)

Step 2: Split into nibbles (0-f)
nibbles = ['a','b','c','1','2','3','d','e','f','4','5','6'...]

Step 3: Traverse the 16-way trie
root → [branch at 'a'] → [branch at 'b'] → [branch at 'c'] → ...
  ↓           ↓                ↓
child[a]   child[b]         child[c]
                                    ↓ ... → LEAF (account data)

// At each branch: follow the next nibble
// At extension: skip the shared prefix
// At leaf: read the value`;

export default function EthereumPage() {
  const [address, setAddress] = useState("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
  const [step, setStep] = useState(0);

  const hash = demoKeccak(address);
  const nibbles = getNibbles(hash);

  const buildKeySteps = [
    {
      label: "Start with Ethereum Address",
      input: address || "0x742d35...",
      output: address || "0x742d35...",
      description:
        "An Ethereum address is 20 bytes (40 hex chars). This is the input to the state trie key derivation.",
    },
    {
      label: "keccak256(address)",
      input: address || "0x742d35...",
      output: hash,
      description:
        "The address is hashed with keccak256 to produce a 32-byte (64 hex char) key. This distributes keys uniformly across the trie.",
    },
    {
      label: "Split into Nibbles",
      input: hash,
      output: nibbles.join(" → "),
      description:
        "The 64 hex characters become 64 nibbles (0-f). Each nibble selects a child from the current branch node.",
    },
    {
      label: "Traverse 16-way Trie",
      input: `nibbles[0] = '${nibbles[0]}'`,
      output: `root → child['${nibbles[0]}'] → child['${nibbles[1]}'] → ...`,
      description:
        "Starting from the root, follow child[nibble[0]], then child[nibble[1]], etc. At depth 64 we reach the leaf with account data.",
    },
    {
      label: "Read Account Data",
      input: "Leaf node reached",
      output: "RLP(nonce, balance, storageRoot, codeHash)",
      description:
        "The leaf node stores the account state RLP-encoded. nonce, balance, contract storage root, and code hash.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ background: `${COLOR}22`, color: COLOR }}
              >
                Ξ
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Ethereum</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Merkle Patricia Trie (MPT)
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Ethereum stores all account state in a{" "}
              <span className="text-white font-medium">Merkle Patricia Trie</span>.
              The key = <code className="text-[#627EEA] font-mono text-sm">keccak256(address)</code>.
              The trie is 16-way (hexadecimal nibbles). This enables cryptographic proofs of any account state.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Interactive Key Builder */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Interactive: How an Address Becomes a Trie Key
          </h2>
          <p className="text-sm text-[#8888aa] mb-6">
            Type any Ethereum address and see exactly how it gets hashed and traversed through the MPT.
          </p>

          <div className="mb-4">
            <label className="text-xs text-[#666688] mb-2 block font-mono">
              Ethereum Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0a0a14] border border-[#1a1a2e] rounded-lg px-4 py-2 font-mono text-sm text-[#c8c8e0] focus:outline-none focus:border-[#627EEA]"
              placeholder="0x742d35..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeyBuilder
              steps={buildKeySteps}
              title="MPT Key Formation"
              color={COLOR}
            />

            {/* Nibble visualization */}
            <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] p-4">
              <div className="text-xs text-[#8888aa] mb-3 font-mono">
                keccak256 → nibbles (first 16 shown)
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {nibbles.map((n, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded flex items-center justify-center font-mono text-sm font-bold"
                    style={{
                      background:
                        i === step ? `${COLOR}33` : "#0f0f1a",
                      color: i === step ? COLOR : "#666688",
                      border: `1px solid ${i === step ? COLOR : "#1a1a2e"}`,
                    }}
                    onClick={() => setStep(i)}
                  >
                    {n}
                  </div>
                ))}
              </div>

              {/* Trie depth visualization */}
              <div className="text-xs text-[#666688] mb-2">
                Trie traversal (click nibble to highlight):
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-3 font-mono text-xs overflow-x-auto">
                <div className="text-[#444466]">root</div>
                {nibbles.slice(0, Math.min(step + 2, 8)).map((n, i) => (
                  <div key={i} className="ml-2">
                    <span className="text-[#444466]">{"  ".repeat(i)}└──</span>
                    <span
                      style={{
                        color: i === step ? COLOR : "#666688",
                      }}
                    >
                      {" "}
                      child[{n}]{" "}
                      {i === step && (
                        <span style={{ color: COLOR }}>← current</span>
                      )}
                    </span>
                  </div>
                ))}
                {step < 8 && <div className="text-[#444466] ml-{step*2}">...</div>}
              </div>

              <div className="mt-3 text-xs text-[#444466]">
                Full depth = 64 nibbles → leaf with account state
              </div>
            </div>
          </div>
        </section>

        {/* MPT Node Types */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            MPT Node Types — 3 Types, 1 Trie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                name: "Branch Node",
                color: "#2a8a2a",
                icon: "🌿",
                description:
                  "16-element array [child0...child15, value]. At each branch, we follow the next nibble. The array is always length 17.",
                example: "[child_a, child_b, ..., child_f, optional_value]",
                when: "When the key prefix is shared by multiple accounts",
              },
              {
                name: "Extension Node",
                color: "#8a8a2a",
                icon: "🔗",
                description:
                  "Compressed shared prefix: [encoded_path, next_node]. Instead of one branch per nibble, skip identical nibbles.",
                example: '[encoded("ab3"), → next_node_hash]',
                when: "When a long prefix is shared — saves space",
              },
              {
                name: "Leaf Node",
                color: "#8a2a2a",
                icon: "🍃",
                description:
                  "End of path: [remaining_path, value]. Contains the compressed remaining nibbles and the actual account data.",
                example: '[encoded("...remaining"), RLP(account)]',
                when: "When we've uniquely identified an account",
              },
            ].map((node) => (
              <div
                key={node.name}
                className="rounded-xl border p-4"
                style={{
                  borderColor: `${node.color}66`,
                  background: `${node.color}10`,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{node.icon}</span>
                  <span style={{ color: node.color }} className="font-bold text-sm">
                    {node.name}
                  </span>
                </div>
                <p className="text-xs text-[#8888aa] mb-3 leading-relaxed">
                  {node.description}
                </p>
                <code
                  className="text-xs font-mono block p-2 rounded mb-2"
                  style={{ background: `${node.color}15`, color: node.color }}
                >
                  {node.example}
                </code>
                <div className="text-xs text-[#666688]">
                  <strong>When used:</strong> {node.when}
                </div>
              </div>
            ))}
          </div>

          <CodeBlock
            code={mptStructureCode}
            language="js"
            title="mpt-nodes.js"
          />
        </section>

        {/* Trie traversal code */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Full Traversal — Step by Step
          </h2>
          <CodeBlock
            code={nibbleTraversalCode}
            language="js"
            title="trie-traversal.js"
          />
        </section>

        {/* Account data + Storage trie */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            What&apos;s Stored at the Leaf?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock
              code={accountDataCode}
              language="js"
              title="account-data.js"
            />

            <div className="space-y-4">
              <InfoCard title="EOA vs Contract Account" color={COLOR} icon="👤">
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-white font-semibold mb-1">
                      Externally Owned Account (EOA)
                    </div>
                    <div className="font-mono text-[#666688]">
                      codeHash = keccak256(&quot;&quot;) // empty
                      <br />
                      storageRoot = empty_trie_root
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-semibold mb-1">
                      Smart Contract
                    </div>
                    <div className="font-mono text-[#666688]">
                      codeHash = keccak256(bytecode)
                      <br />
                      storageRoot = root of{" "}
                      <span style={{ color: COLOR }}>
                        its own storage trie
                      </span>
                    </div>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Storage Trie (per contract)" color={COLOR} icon="📦">
                <div className="text-xs space-y-2">
                  <p>
                    Each contract has its own second-level MPT. ERC20 balances
                    are stored here:
                  </p>
                  <code className="block font-mono bg-[#0a0a14] p-2 rounded text-[#9999cc]">
                    key = keccak256(address ++ slot)
                    <br />
                    val = RLP(balance)
                  </code>
                  <p className="text-[#666688]">
                    This is why Ethereum has 4 tries: state, storage,
                    transactions, receipts.
                  </p>
                </div>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* RLP Encoding */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            RLP Encoding — Ethereum&apos;s Wire Format
          </h2>
          <p className="text-sm text-[#8888aa] mb-4">
            Every node in the trie is encoded with RLP before being hashed and stored in LevelDB.
          </p>
          <CodeBlock code={rlpCode} language="js" title="rlp-encoding.js" />
        </section>

        {/* 4 Tries per block */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            4 Tries Per Block
          </h2>
          <CodeBlock
            code={stateRootCode}
            language="js"
            title="block-tries.js"
          />

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                name: "State Trie",
                desc: "Global account state. keccak256(address) → account",
                color: COLOR,
              },
              {
                name: "Storage Trie",
                desc: "Per-contract. keccak256(slot) → value",
                color: "#9945FF",
              },
              {
                name: "Tx Trie",
                desc: "Block's transactions. index → tx",
                color: "#F7931A",
              },
              {
                name: "Receipt Trie",
                desc: "Block's receipts. index → receipt",
                color: "#2FB8EB",
              },
            ].map((trie) => (
              <div
                key={trie.name}
                className="rounded-lg border p-3"
                style={{
                  borderColor: `${trie.color}33`,
                  background: `${trie.color}08`,
                }}
              >
                <div style={{ color: trie.color }} className="font-semibold text-xs mb-1">
                  {trie.name}
                </div>
                <div className="text-xs text-[#666688]">{trie.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Storage → Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How MPT Storage → Capabilities & Limitations
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "Merkle tree → cryptographic state root",
                effect: "Any account state can be proven with a Merkle proof. Light clients can verify state without full node.",
                positive: true,
              },
              {
                cause: "16-way trie with keccak256 keys",
                effect: "Every write to account state touches O(log₁₆ n) nodes — each must be re-hashed and re-stored in LevelDB. High write amplification.",
                positive: false,
              },
              {
                cause: "4 separate tries per block",
                effect: "Rich data model — query state, txs, receipts all independently. But 4× the Merkle overhead.",
                positive: false,
              },
              {
                cause: "Sequential execution required",
                effect: "Transactions can read/write any account — must run in order to detect conflicts. No native parallelism.",
                positive: false,
              },
              {
                cause: "Storage trie per contract",
                effect: "Smart contracts have isolated, provable storage. Powers DeFi composability.",
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
