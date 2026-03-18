"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MerkleTreeViz from "@/components/MerkleTreeViz";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";
import KeyBuilder from "@/components/KeyBuilder";

const COLOR = "#F7931A";

const utxoSetCode = `// Bitcoin's UTXO Set — stored in LevelDB "chainstate" DB
// Key:   'C' + txid + vout_index
// Value: VARINT(height*2 + coinbase) + compressed_txout

DB["C" + txid + vout] = {
  height: 750000,
  is_coinbase: false,
  amount: 0.5 BTC,       // 50,000,000 satoshis
  scriptPubKey: "76a914...88ac"  // Pay-to-PubKeyHash
}

// To check if a UTXO exists: just look it up in the DB
// If key exists → UTXO is unspent
// If key missing → already spent`;

const merkleProofCode = `// Merkle Inclusion Proof
// Prove Tx3 is in the block WITHOUT downloading all transactions

Block Header:
  merkle_root = 0xabc123...  // 32 bytes

Proof for Tx3:
  tx3_hash     = hash(Tx3)
  sibling_hash = hash(Tx4)  // sibling at level 0
  uncle_hash   = hash(Tx1+Tx2) // uncle at level 1

Verification:
  step1 = hash(tx3_hash + sibling_hash)  // = hash(Tx3+Tx4)
  step2 = hash(uncle_hash + step1)       // = merkle_root
  
  assert step2 == block.merkle_root  // ✅ Tx3 is in block!`;

const blockStructureCode = `// Bitcoin Block — what's stored vs what's computed
{
  // ---- BLOCK HEADER (80 bytes) ----
  version:    4,
  prev_hash:  "000000000000abc123...",  // links to parent block
  merkle_root:"0xdef456...",            // root of all tx hashes
  timestamp:  1704067200,
  bits:       0x1d00ffff,              // difficulty target
  nonce:      2083236893,              // proof of work
  
  // ---- TRANSACTIONS (variable) ----
  txs: [
    { txid: "0xaaa...", inputs: [...], outputs: [...] },
    { txid: "0xbbb...", inputs: [...], outputs: [...] },
    // ...thousands more
  ]
}

// What's in LevelDB:
// blocks/     → raw block data indexed by hash
// chainstate/ → UTXO set only (not full tx history!)`;

const keySteps = [
  {
    label: "Start with Transaction",
    input: "Tx: Alice sends 1 BTC to Bob",
    output: "raw_tx_bytes",
    description:
      "A Bitcoin transaction contains inputs (UTXOs being spent) and outputs (new UTXOs created).",
  },
  {
    label: "Double-SHA256 Hash",
    input: "SHA256(SHA256(raw_tx_bytes))",
    output: "txid = 0xa3b4c5d6...",
    description:
      "Bitcoin uses double-SHA256 (SHA256 applied twice) for transaction IDs. This is the core identifier.",
  },
  {
    label: "Combine with Output Index",
    input: "txid + vout_index (e.g., 0)",
    output: "UTXO key = txid:0",
    description:
      "A UTXO is identified by txid + output index. Alice's 1 BTC output at index 0 of this tx.",
  },
  {
    label: "Store in chainstate DB",
    input: "'C' + txid + vout",
    output: "DB['C'+txid+':0'] = {amount, script}",
    description:
      "Stored in LevelDB chainstate. Prefix 'C' distinguishes UTXOs from other chainstate entries.",
  },
];

const transactions = [
  "Tx: Alice→Bob 1BTC",
  "Tx: Bob→Carol 0.5BTC",
  "Tx: Dave→Eve 2BTC",
  "Tx: Fee payment",
];

export default function BitcoinPage() {
  const [selectedUtxo, setSelectedUtxo] = useState<number | null>(null);

  const utxos = [
    {
      txid: "0xa3b4c5...:0",
      amount: "1.0 BTC",
      script: "OP_DUP OP_HASH160...",
      owner: "Alice",
      spent: false,
    },
    {
      txid: "0xf1e2d3...:1",
      amount: "0.5 BTC",
      script: "OP_DUP OP_HASH160...",
      owner: "Bob",
      spent: false,
    },
    {
      txid: "0xc8d9e0...:0",
      amount: "2.0 BTC",
      script: "OP_DUP OP_HASH160...",
      owner: "Carol",
      spent: true,
    },
    {
      txid: "0x112233...:2",
      amount: "0.25 BTC",
      script: "OP_HASH160...",
      owner: "Dave",
      spent: false,
    },
  ];

  return (
    <div className="min-h-screen" style={{ "--chain-color": COLOR } as React.CSSProperties}>
      {/* Hero */}
      <div className="border-b border-[#1a1a2e]">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold"
                style={{ background: `${COLOR}22`, color: COLOR }}
              >
                ₿
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Bitcoin</div>
              </div>
            </div>

            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              UTXO Model + Binary Merkle Tree
            </div>

            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Bitcoin has <span className="text-white font-medium">no account state</span>.
              Instead, it tracks <span className="text-white font-medium">Unspent Transaction Outputs (UTXOs)</span>.
              The UTXO set lives in a flat LevelDB. Transactions reference UTXOs — no trie needed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Core Concept */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">The UTXO Model</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <InfoCard
              title="What is a UTXO?"
              color={COLOR}
              icon="💰"
            >
              <p className="mb-2">
                A <strong className="text-white">UTXO = an unspent output</strong> from a previous transaction.
                Like a physical coin you haven&apos;t spent yet.
              </p>
              <p className="text-[#666688]">
                Your Bitcoin &quot;balance&quot; = sum of all UTXOs that your key can spend.
              </p>
            </InfoCard>

            <InfoCard
              title="How Spending Works"
              color={COLOR}
              icon="→"
            >
              <ol className="space-y-1 text-xs">
                <li>1. Find UTXOs you own</li>
                <li>2. Reference them as inputs</li>
                <li>3. Create new output UTXOs</li>
                <li>4. Old UTXOs are deleted from DB</li>
                <li>5. New UTXOs are added to DB</li>
              </ol>
            </InfoCard>

            <InfoCard
              title="Storage Layout"
              color={COLOR}
              icon="🗄️"
            >
              <div className="space-y-2 font-mono text-xs">
                <div>
                  <span className="text-[#F7931A]">blocks/</span>
                  <span className="text-[#666688]"> — raw block bytes</span>
                </div>
                <div>
                  <span className="text-[#F7931A]">chainstate/</span>
                  <span className="text-[#666688]"> — UTXO set only</span>
                </div>
                <div className="text-[#666688] mt-1">Both are LevelDB instances</div>
              </div>
            </InfoCard>
          </div>

          {/* Interactive UTXO Set */}
          <div className="rounded-xl border border-[#1a1a2e] bg-[#0a0a14] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Interactive: UTXO Set (chainstate DB)
            </h3>
            <p className="text-xs text-[#666688] mb-4">
              This is what Bitcoin&apos;s LevelDB looks like. Each row is one entry.
              Click a UTXO to see its details.
            </p>
            <div className="space-y-2">
              {utxos.map((utxo, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedUtxo(selectedUtxo === i ? null : i)}
                  className="cursor-pointer rounded-lg border p-3 transition-all font-mono text-xs"
                  style={
                    selectedUtxo === i
                      ? { borderColor: COLOR, background: `${COLOR}12` }
                      : utxo.spent
                      ? { borderColor: "#2a1a1a", background: "#120a0a", opacity: 0.5 }
                      : { borderColor: "#1a1a2e", background: "#0f0f18" }
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={
                          utxo.spent
                            ? { background: "#2a1a1a", color: "#aa4444" }
                            : { background: `${COLOR}22`, color: COLOR }
                        }
                      >
                        {utxo.spent ? "SPENT" : "UNSPENT"}
                      </span>
                      <span className="text-[#8888aa]">KEY:</span>
                      <span className="text-[#c8c8e0]">{utxo.txid}</span>
                    </div>
                    <span style={{ color: COLOR }} className="font-bold">
                      {utxo.amount}
                    </span>
                  </div>

                  {selectedUtxo === i && (
                    <div
                      className="mt-3 pt-3 border-t border-[#2a2a4a] grid grid-cols-2 gap-3"
                    >
                      <div>
                        <div className="text-[#444466] mb-1">Owner</div>
                        <div style={{ color: COLOR }}>{utxo.owner}</div>
                      </div>
                      <div>
                        <div className="text-[#444466] mb-1">Script</div>
                        <div className="text-[#8888aa] break-all">{utxo.script}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-[#444466]">
              ↑ Crossed-out entries are spent UTXOs removed from the DB.
              The chainstate DB only holds live UTXOs.
            </div>
          </div>
        </section>

        {/* Key Formation */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            How a UTXO Gets Its Storage Key
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeyBuilder
              steps={keySteps}
              title="UTXO Key Formation"
              color={COLOR}
            />
            <CodeBlock
              code={utxoSetCode}
              language="js"
              title="chainstate-db.js"
            />
          </div>
        </section>

        {/* Merkle Tree */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            Merkle Tree — Verifying Transactions
          </h2>
          <p className="text-[#8888aa] text-sm mb-6">
            Each Bitcoin block header contains a <strong className="text-white">Merkle root</strong> — 
            a single hash that commits to all transactions in the block. This enables{" "}
            <strong className="text-white">SPV (Simple Payment Verification)</strong>: 
            light clients can verify a tx is in a block without downloading all transactions.
          </p>

          <MerkleTreeViz
            transactions={transactions}
            color={COLOR}
            title="Bitcoin Block Merkle Tree"
            showHashSteps={true}
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock
              code={merkleProofCode}
              language="text"
              title="merkle-proof.txt"
            />
            <div className="space-y-4">
              <InfoCard title="Why Merkle Trees?" color={COLOR} icon="🔍">
                <ul className="space-y-2 text-xs">
                  <li>✅ Prove a tx is in a block with just O(log n) hashes</li>
                  <li>✅ Light clients verify without full blocks</li>
                  <li>✅ Any change to any tx invalidates the root</li>
                  <li>✅ Block header stays small (80 bytes) regardless of tx count</li>
                </ul>
              </InfoCard>

              <InfoCard title="Proof Size" color={COLOR} icon="📏">
                <div className="font-mono text-xs space-y-1">
                  <div>1,000 txs → need 10 hashes (log₂ 1000)</div>
                  <div>1,000,000 txs → need 20 hashes</div>
                  <div className="text-[#F7931A] mt-2">
                    = 20 × 32 bytes = just 640 bytes!
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Block Structure */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Full Block Structure</h2>
          <CodeBlock
            code={blockStructureCode}
            language="js"
            title="block-structure.js"
          />
        </section>

        {/* Comparison */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Why UTXO vs Account Model?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl border p-5"
              style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}
            >
              <h3 style={{ color: COLOR }} className="font-semibold mb-3">
                ✅ Bitcoin UTXO Advantages
              </h3>
              <ul className="space-y-2 text-sm text-[#c8c8e0]">
                <li>🔀 <strong>Parallel processing</strong> — UTXOs are independent</li>
                <li>🔒 <strong>No double-spend by design</strong> — each UTXO used once</li>
                <li>🔍 <strong>Simple to audit</strong> — total supply = sum of all UTXOs</li>
                <li>🛡️ <strong>Privacy-friendly</strong> — new addresses per transaction</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#2a2a4a] p-5">
              <h3 className="text-[#8888aa] font-semibold mb-3">
                ❌ Bitcoin UTXO Limitations
              </h3>
              <ul className="space-y-2 text-sm text-[#c8c8e0]">
                <li>📜 <strong>No smart contracts</strong> — only Bitcoin Script</li>
                <li>💸 <strong>UTXO management</strong> — fragmented balance</li>
                <li>🏦 <strong>No account concept</strong> — complex for applications</li>
                <li>📦 <strong>Heavier transactions</strong> — must reference all inputs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How Storage Affects Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How UTXO Storage → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "UTXO = independent coin units",
                effect: "Natural UTXO parallelism — txs spending different UTXOs can be processed independently",
                positive: true,
              },
              {
                cause: "No global account state trie",
                effect: "No complex trie updates — writes are fast and predictable",
                positive: true,
              },
              {
                cause: "Only UTXOs stored (not full tx history)",
                effect: "chainstate DB stays small — can't query old state without archive data",
                positive: false,
              },
              {
                cause: "Merkle tree in block header",
                effect: "SPV light clients possible — verify txs without downloading everything",
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
