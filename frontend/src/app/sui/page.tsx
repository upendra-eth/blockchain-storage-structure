"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";

const COLOR = "#6fbcf0";

const objectModelCode = `// Sui Object Model — Everything is an Object
// Every asset, config, token = a typed Move object

struct Object {
    id:          UID,         // globally unique 32-byte ID
    version:     u64,         // incremented on every modification  
    digest:      ObjectDigest, // hash of current state
    owner:       Owner,        // who can use this object
    type_:       MoveObjectType, // Move struct type
    data:        MoveObject,   // the actual data (Move struct fields)
}

// Owner types:
enum Owner {
    AddressOwned(address),    // only this address can use it
    ObjectOwned(UID),          // owned by another object
    Shared { initial_version }, // any tx can access (needs ordering)
    Immutable,                  // read-only, no gas for reads
}

// Storage key in RocksDB:
DB[object_id] = serialize(object)
// No trie needed — direct object ID lookup`;

const moveObjectCode = `// Move Objects — Type-Safe Assets
// In Move, assets are types, not mappings

// Define a token:
module my_token::token {
    struct Token has key, store {
        id: UID,
        value: u64,
        metadata: String,
    }
    
    // Create: object has key ability → gets a UID
    public fun create(value: u64, ctx: &mut TxContext): Token {
        Token {
            id: object::new(ctx),  // generates unique UID
            value,
            metadata: string::utf8(b"MyToken"),
        }
    }
    
    // Transfer: Move's ownership system tracks this
    public fun transfer(token: Token, recipient: address) {
        transfer::transfer(token, recipient)  // changes owner
    }
}

// KEY DIFFERENCE from Ethereum ERC20:
// Ethereum: mapping(address => uint256) balances — central ledger
// Sui: each Token object is independently owned — no shared state needed`;

const parallelCode = `// Why Sui Can Parallelize — Owned vs Shared

// Owned objects → PARALLEL (no global consensus needed)
// Only the owner can submit txs → no conflicts possible

// Example: Alice sends Token to Bob
// Alice owns TokenA → only she can touch it
// This tx touches: TokenA, Alice's coin (for gas)
// No other tx can touch TokenA → PARALLEL!

// Shared objects → SEQUENTIAL (need global ordering)
// Multiple users can interact → conflicts possible

// Example: DEX pool (shared object)
// Alice and Bob both try to swap against the same pool
// → Must be sequentially ordered (who goes first?)
// → These txs CAN'T be fully parallelized

// Sui's performance insight:
// Most real-world txs (transfers, games, NFTs) = owned objects
// Only complex DeFi = shared objects
// → 90%+ of txs can be parallelized!`;

const smtCode = `// Sui State Commitment — Sparse Merkle Tree (SMT)
// Not MPT like Ethereum — uses a different tree structure

// Sparse Merkle Tree:
// - Fixed depth = 256 (for 256-bit keys)
// - Most nodes are "empty" (no data)
// - Efficient because: empty subtrees compress to one hash

// Key = object_id (32 bytes = 256 bits)
// Value = hash(object)

// Compared to Ethereum MPT:
// ETH MPT: variable depth, 16-way, key = keccak256(address)
// Sui SMT: fixed 256 depth, binary, key = object_id

// Proof size:
// Both: O(depth) proof elements
// ETH: 64 nibbles → up to 64 nodes × larger hashes → ~10KB
// Sui: 256 bits → 256 hashes × 32 bytes → 8KB (similar)
// But: SMT can compress empty subtrees → much smaller in practice!

// Checkpoint (like Ethereum block):
// checkpoint.effects_root = SMT root of all affected objects`;

const objectIdCode = `// Object ID Generation
// Derived from transaction hash + creation index

object_id = hash(transaction_digest, creation_index)
// → Guaranteed globally unique
// → Deterministic — clients can predict object IDs

// Example:
tx_digest = 0x4a3b2c...     // hash of the creating transaction
new_object_id = hash(tx_digest, 0)  // first object created in this tx

// This is stored in:
// 1. The object's UID field
// 2. As the DB key in RocksDB
// 3. In the transaction's output effects

// Shared object sequence:
// Shared objects need a "sequenced" version number
// assigned by validators during consensus
// Owned objects don't need this → no consensus overhead`;

export default function SuiPage() {
  const [selectedOwner, setSelectedOwner] = useState<string>("AddressOwned");

  const ownerTypes = [
    {
      type: "AddressOwned",
      icon: "👤",
      color: COLOR,
      description: "Only one address can read/write this object. Most NFTs, tokens.",
      parallelism: "✅ Full parallel",
      example: "NFT, personal token, game item",
      consensus: "No consensus needed",
    },
    {
      type: "Shared",
      icon: "🌐",
      color: "#F7931A",
      description: "Any address can interact. Requires global ordering/sequencing.",
      parallelism: "❌ Sequential ordering",
      example: "DEX pool, voting contract, AMM",
      consensus: "Needs consensus",
    },
    {
      type: "ObjectOwned",
      icon: "🔗",
      color: "#2FB8EB",
      description: "Owned by another object. Used for parent-child relationships.",
      parallelism: "✅ Parallel (with parent)",
      example: "Child NFT, nested resource",
      consensus: "With parent object",
    },
    {
      type: "Immutable",
      icon: "🔒",
      color: "#666688",
      description: "Read-only forever. No gas cost for reads. Published packages.",
      parallelism: "✅ Fully parallel reads",
      example: "Published Move packages, config",
      consensus: "None (read-only)",
    },
  ];

  const selected = ownerTypes.find((o) => o.type === selectedOwner)!;

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
                ◈
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Sui</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Object Model + Sparse Merkle Tree
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              In Sui,{" "}
              <span className="text-white font-medium">everything is an object</span> with a unique
              ID. Objects have owners. Owned-object transactions skip consensus entirely — enabling
              massive parallelism. Built on{" "}
              <span className="text-white font-medium">Move language</span> for type-safe assets.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* Owner Types Explorer */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Object Ownership — The Key to Parallelism
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {ownerTypes.map((ot) => (
              <button
                key={ot.type}
                onClick={() => setSelectedOwner(ot.type)}
                className="rounded-xl border p-3 text-left transition-all"
                style={
                  selectedOwner === ot.type
                    ? { borderColor: ot.color, background: `${ot.color}15` }
                    : { borderColor: "#1a1a2e", background: "#0a0a14" }
                }
              >
                <div className="text-xl mb-2">{ot.icon}</div>
                <div
                  className="text-xs font-semibold"
                  style={selectedOwner === ot.type ? { color: ot.color } : { color: "#c8c8e0" }}
                >
                  {ot.type}
                </div>
                <div className="text-xs text-[#666688] mt-1">{ot.example}</div>
              </button>
            ))}
          </div>

          <div
            key={selectedOwner}
            className="rounded-xl border p-5 grid grid-cols-1 md:grid-cols-3 gap-4"
            style={{ borderColor: `${selected.color}44`, background: `${selected.color}08` }}
          >
            <div>
              <div className="text-xs text-[#666688] mb-1">Description</div>
              <p className="text-sm text-[#c8c8e0]">{selected.description}</p>
            </div>
            <div>
              <div className="text-xs text-[#666688] mb-1">Parallel Execution</div>
              <div className="text-sm font-semibold">{selected.parallelism}</div>
            </div>
            <div>
              <div className="text-xs text-[#666688] mb-1">Consensus Required</div>
              <div className="text-sm" style={{ color: selected.color }}>
                {selected.consensus}
              </div>
            </div>
          </div>
        </section>

        {/* Object model */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Object Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={objectModelCode} language="rust" title="object-model.rs" />
            <div className="space-y-4">
              <InfoCard title="vs Ethereum ERC20" color={COLOR} icon="⚡">
                <div className="text-xs space-y-3">
                  <div>
                    <div className="text-[#627EEA] font-semibold mb-1">Ethereum ERC20:</div>
                    <code className="text-[#8888aa] block p-2 bg-[#0a0a14] rounded">
                      mapping(address =&gt; uint256) balances;
                      <br/>
                      {"// Centralized ledger — shared object"}
                      <br/>
                      {"// All transfers need consensus"}
                    </code>
                  </div>
                  <div>
                    <div style={{ color: COLOR }} className="font-semibold mb-1">Sui Coin:</div>
                    <code className="text-[#8888aa] block p-2 bg-[#0a0a14] rounded">
                      struct Coin&lt;T&gt; &#123; id: UID, value: u64 &#125;
                      <br />
                      {"// Each coin is an owned object"}
                      <br />
                      <span style={{ color: COLOR }}>{"// Transfers skip consensus!"}</span>
                    </code>
                  </div>
                </div>
              </InfoCard>

              <InfoCard title="Object ID Generation" color={COLOR} icon="🔑">
                <code className="text-xs font-mono text-[#8888aa] block">
                  id = hash(tx_digest, creation_index)
                  <br/>
                  {"// Deterministic + unique"}
                  <br/>
                  {"// Clients can predict IDs"}
                </code>
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Move objects */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Move Objects — Type-Safe Assets</h2>
          <CodeBlock code={moveObjectCode} language="rust" title="move-objects.move" />
        </section>

        {/* Parallel execution */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Why Object Ownership Enables Parallelism
          </h2>
          <CodeBlock code={parallelCode} language="rust" title="parallel.rs" />
        </section>

        {/* SMT */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Sparse Merkle Tree — State Commitment
          </h2>
          <CodeBlock code={smtCode} language="text" title="smt.txt" />
        </section>

        {/* Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How Object Storage → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "Owned objects skip consensus",
                effect: "Simple transfers, NFT sales, game moves = no validator coordination needed. Near-instant finality for owned-object txs.",
                positive: true,
              },
              {
                cause: "Objects have explicit ownership",
                effect: "Move's type system prevents double-spending at the language level — no central ledger needed for safety.",
                positive: true,
              },
              {
                cause: "Shared objects need sequencing",
                effect: "Complex DeFi (DEX pools, lending) requires all nodes to agree on order. Throughput limited for shared-object txs.",
                positive: false,
              },
              {
                cause: "Object versioning (version field)",
                effect: "Each object tracks its own version. Enables optimistic concurrency for owned objects without global state lock.",
                positive: true,
              },
              {
                cause: "Different mental model from Ethereum",
                effect: "Developers must rethink DeFi (no ERC20 mappings, no global state). Steep learning curve for ETH devs.",
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
