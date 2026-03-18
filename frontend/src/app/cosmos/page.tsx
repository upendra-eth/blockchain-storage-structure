"use client";

import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";

const COLOR = "#2FB8EB";

const iavlCode = `// IAVL Tree — Immutable AVL + Versioned
// Used in Cosmos SDK for all module stores

// Each node in IAVL:
type Node struct {
    key         []byte   // storage key
    value       []byte   // stored value (nil for inner nodes)
    version     int64    // which block height created this
    height      int8     // subtree height (for AVL balance)
    size        int64    // number of key-value pairs in subtree
    hash        []byte   // merkle hash of this node
    leftHash    []byte   // left child hash
    rightHash   []byte   // right child hash
    leftNode    *Node    
    rightNode   *Node   
}

// DB key = hash(node)
// DB val = encoded(node)
// — exactly like Ethereum! Same concept, different tree shape.`;

const multistoreCode = `// Cosmos Multi-Store Architecture
// Each module gets its own isolated IAVL store

CommitMultiStore {
  stores: {
    "bank":         IAVLStore,   // token balances
    "staking":      IAVLStore,   // validators, delegations
    "gov":          IAVLStore,   // proposals, votes
    "ibc":          IAVLStore,   // IBC channels, packets
    "wasm":         IAVLStore,   // CosmWasm contracts
    "distribution": IAVLStore,   // rewards, commissions
    // ... more modules
  }
}

// App hash (like Ethereum's stateRoot) = 
//   merkle root of all store roots
AppHash = merkle.Hash([
  ("bank",    bankStore.root),
  ("staking", stakingStore.root),
  // ...
])`;

const versioningCode = `// IAVL Versioning — Historical Queries Built-In!
// This is the BIG advantage over Ethereum MPT

// Each tree version is immutable — creates new root
// Old nodes are shared (copy-on-write)

v1_tree: root_v1 → [node_a, node_b, node_c]
v2_tree: root_v2 → [node_a', node_b, node_c]  // only modified nodes are new
                         ↑ new node (value changed)
                              ↑ shared from v1
                                       ↑ shared from v1

// Query historical state:
store.GetVersioned(height: 1000, key: "balance/alice")
// → returns Alice's balance at block 1000 without archive node!

// Pruning: keep last N versions
// Default: keep 362880 versions (~3 weeks at 1 block/sec)

// Ethereum comparison:
// ETH: need archive node for historical queries (100s of GB)
// Cosmos: built-in versioning, configurable retention`;

const bankQueryCode = `// Cosmos Bank module storage
// Module: bank, Key format: address bytes

// Store balance:
bankStore.Set(
  key:   sdk.AccAddress(alice_bech32),  // 20 bytes
  value: sdk.Coins{{"uatom", 1000000}}  // protobuf encoded
)

// The key in IAVL:
// prefix "balances/" ++ address_bytes

// Historical query (Cosmos can do this natively!):
// GET /cosmos/bank/v1beta1/balances/{address}?height=500000
ctx.WithBlockHeight(500000)
bankKeeper.GetBalance(ctx, alice, "uatom")

// This works WITHOUT archive node because IAVL stores versions`;

const ibcCode = `// IBC (Inter-Blockchain Communication) — powered by IAVL
// Light clients verify state via IAVL Merkle proofs

// Proof that channel "channel-0" exists on Chain A:
// 1. Chain B has a light client of Chain A
// 2. Light client stores Chain A's latest AppHash
// 3. IBC relayer provides: IAVL Merkle proof of the IBC key
// 4. Chain B verifies: proof against stored AppHash

// IBC storage key in IAVL:
ibcStore.Set(
  key:   "channelEnds/ports/transfer/channels/channel-0",
  value: proto.Marshal(channelEnd)
)

// Proof verification:
root.Verify(
  key:   ibcKey,
  value: channelEndBytes,
  proof: MerkleProof{...}  // path through IAVL
) // → if true, cross-chain message is valid`;

export default function CosmosPage() {
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
                ⚛
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Cosmos / Tendermint</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              IAVL Tree (Immutable AVL + Versioned)
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Cosmos uses an <span className="text-white font-medium">IAVL tree</span> — 
              an immutable, versioned AVL tree. The killer feature: 
              <span className="text-white font-medium"> historical state queries built-in</span>,
              and each module has its own isolated store that powers IBC interoperability.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* IAVL vs MPT Overview */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">IAVL vs Ethereum MPT</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard title="What is IAVL?" color={COLOR} icon="🌳">
              <p className="text-xs leading-relaxed mb-2">
                <strong className="text-white">IAVL = Immutable AVL Tree</strong> with versioning.
                It&apos;s a balanced binary tree (AVL) where old versions are never modified.
              </p>
              <p className="text-xs text-[#666688]">
                Like Git — each commit creates a new root, but shares unchanged subtrees with previous versions.
              </p>
            </InfoCard>

            <InfoCard title="AVL vs Patricia Trie" color={COLOR} icon="⚖️">
              <div className="text-xs space-y-2">
                <div>
                  <span className="text-[#627EEA]">MPT (Ethereum):</span>
                  <span className="text-[#8888aa]"> 16-way trie, nibble keys, O(64) depth</span>
                </div>
                <div>
                  <span style={{ color: COLOR }}>IAVL (Cosmos):</span>
                  <span className="text-[#8888aa]"> Binary tree, balanced, O(log n) depth</span>
                </div>
                <div className="mt-2 text-[#666688]">
                  AVL auto-balances via rotations. MPT doesn&apos;t balance — it has fixed 64-nibble depth.
                </div>
              </div>
            </InfoCard>

            <InfoCard title="The Versioning Killer Feature" color={COLOR} icon="📚">
              <div className="text-xs leading-relaxed">
                <strong className="text-white">Ethereum needs archive nodes</strong> (multi-TB) for historical queries.
                <br /><br />
                <strong style={{ color: COLOR }}>Cosmos has built-in versioning</strong> — query any block height
                without extra infrastructure.
              </div>
            </InfoCard>
          </div>
        </section>

        {/* IAVL Node Structure */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">IAVL Node Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={iavlCode} language="go" title="iavl-node.go" />

            {/* Visual tree */}
            <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] p-4">
              <div className="text-xs text-[#8888aa] mb-3">IAVL tree visual (binary, balanced)</div>
              <div className="font-mono text-xs text-[#666688] leading-8">
                <div className="text-center mb-2">
                  <span
                    className="inline-block px-3 py-1 rounded-lg border text-sm"
                    style={{ borderColor: COLOR, color: COLOR, background: `${COLOR}15` }}
                  >
                    root (height=3, v=latest)
                  </span>
                </div>
                <div className="flex justify-around mb-2">
                  {["left (h=2)", "right (h=2)"].map((n) => (
                    <span
                      key={n}
                      className="px-2 py-1 rounded border text-xs"
                      style={{ borderColor: `${COLOR}44`, color: `${COLOR}aa` }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="flex justify-around">
                  {["ll(h=1)", "lr(h=1)", "rl(h=1)", "rr(h=1)"].map((n) => (
                    <span
                      key={n}
                      className="px-2 py-1 rounded border text-xs"
                      style={{ borderColor: "#2a2a4a", color: "#666688" }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <div className="mt-4 text-[#444466] text-xs text-center">
                  Each node stores: key, value, version, height, hash
                  <br />
                  DB key = hash(node) → same concept as Ethereum
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Store */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">Multi-Store Architecture</h2>
          <p className="text-[#8888aa] text-sm mb-4">
            Unlike Ethereum&apos;s single state trie, Cosmos gives each module its own IAVL store.
            The app hash is a Merkle root of all store roots.
          </p>
          <CodeBlock code={multistoreCode} language="go" title="multistore.go" />
        </section>

        {/* Versioning */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Historical Queries — Cosmos&apos;s Superpower
          </h2>
          <CodeBlock code={versioningCode} language="go" title="versioning.go" />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: `${COLOR}33`, background: `${COLOR}08` }}
            >
              <h3 style={{ color: COLOR }} className="font-semibold text-sm mb-3">
                ✅ Cosmos: Built-in Versioning
              </h3>
              <ul className="text-xs space-y-1 text-[#c8c8e0]">
                <li>Query balance at block 1,000,000 → works</li>
                <li>No special archive node needed</li>
                <li>Configurable pruning (keep last N blocks)</li>
                <li>Copy-on-write: only modified nodes duplicated</li>
                <li>Enables time-locked governance</li>
              </ul>
            </div>
            <div className="rounded-xl border border-[#2a1a1a] p-4 bg-[#180808]">
              <h3 className="text-[#aa4444] font-semibold text-sm mb-3">
                ❌ Ethereum: No Built-in History
              </h3>
              <ul className="text-xs space-y-1 text-[#c8c8e0]">
                <li>Historical queries need an archive node</li>
                <li>Archive node = 14+ TB of data</li>
                <li>MPT only stores current state</li>
                <li>Past state discarded unless archived</li>
                <li>Most RPCs don&apos;t support old blocks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bank module example */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Bank Module Storage Example</h2>
          <CodeBlock code={bankQueryCode} language="go" title="bank-module.go" />
        </section>

        {/* IBC */}
        <section>
          <h2 className="text-xl font-bold text-white mb-2">
            IBC — Powered by IAVL Merkle Proofs
          </h2>
          <p className="text-[#8888aa] text-sm mb-4">
            Inter-Blockchain Communication works because IAVL produces Merkle proofs that
            light clients on other chains can verify.
          </p>
          <CodeBlock code={ibcCode} language="go" title="ibc-proof.go" />
        </section>

        {/* Storage → Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How IAVL Storage → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "Immutable versioned tree",
                effect: "Historical state queries at any block height — no archive node required. Query Alice's balance 3 months ago directly.",
                positive: true,
              },
              {
                cause: "Per-module isolated stores",
                effect: "Modules are isolated — bank can't accidentally touch staking state. Clean separation enables modular app development.",
                positive: true,
              },
              {
                cause: "IAVL Merkle proofs",
                effect: "IBC works because any state can be proven to a remote chain with a compact proof. Enables trustless cross-chain messaging.",
                positive: true,
              },
              {
                cause: "AVL rebalancing on writes",
                effect: "Write-heavy workloads trigger rebalancing. More predictable than MPT but adds overhead for insert-heavy patterns.",
                positive: false,
              },
              {
                cause: "Multiple store roots → single AppHash",
                effect: "Each module root is separately verifiable. But the extra Merkle aggregation adds overhead per block.",
                positive: false,
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
