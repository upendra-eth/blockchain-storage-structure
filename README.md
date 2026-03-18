# 🔗 Blockchain Storage Structure — Visual Learning Platform

An interactive educational platform teaching how different blockchains store and verify data under the hood — even though most of them use similar KV databases like LevelDB/RocksDB.

## 🎯 What You'll Learn

| Blockchain | Storage Model | Key Insight |
|---|---|---|
| **Bitcoin** | UTXO + Merkle Tree | No global state, only unspent outputs |
| **Ethereum** | Merkle Patricia Trie (MPT) | keccak256(address) → nibble-by-nibble trie |
| **Substrate/Polkadot** | Composed Key Trie | pallet + storage + key → composed path |
| **Cosmos** | IAVL Tree | Immutable AVL with versioning for history |
| **Solana** | Flat Account Model | No global state trie — pure speed |
| **Sui** | Object Model + SMT | Every asset is an object with unique ID |
| **Aptos** | Jellyfish Merkle Tree | Optimized sparse Merkle, parallel execution |
| **Verkle Trees** | Polynomial Commitments | Future Ethereum — tiny proofs, stateless clients |
| **IOTA/DAG** | Directed Acyclic Graph | No blocks — transactions reference transactions |

## 🧠 Core Insight

> All these blockchains ultimately use a **key-value database** (LevelDB, RocksDB, etc.) under the hood.
> The DIFFERENCE is in **how they build the keys**, **what data structure they lay on top**, and **how that affects capabilities**.

```
Same KV Database underneath:
   key: <some_hash>  →  value: <encoded_node_or_data>

But how that key is derived and what structure sits above it:
  Bitcoin:   key = hash(tx)              → Merkle binary tree
  Ethereum:  key = hash(trie_node)       → 16-way Patricia Trie
  Substrate: key = hash(pallet+storage)  → Custom Trie
  Cosmos:    key = hash(iavl_node)       → Balanced AVL Tree
  Solana:    key = account_pubkey        → Flat! No tree!
```

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📚 Pages

- **`/`** — Mind map + overview of all storage models
- **`/bitcoin`** — UTXO model, Merkle trees, block structure
- **`/ethereum`** — MPT deep dive with interactive key builder
- **`/substrate`** — Composed storage keys, pallet-based storage
- **`/cosmos`** — IAVL tree, versioning, multi-store
- **`/solana`** — Flat account model, why it's fast
- **`/sui`** — Object model, owned vs shared, parallel execution
- **`/aptos`** — Jellyfish Merkle Tree, Move language
- **`/verkle`** — Polynomial commitments, stateless clients
- **`/compare`** — Side-by-side comparison of all models

## 🗂 Project Structure

```
blockchain-storage-structure/
├── README.md
└── frontend/                    # Next.js interactive platform
    ├── src/
    │   ├── app/                 # Next.js App Router pages
    │   ├── components/          # Reusable UI components
    │   │   ├── TreeVisualizer   # Generic tree/trie renderer
    │   │   ├── MerkleTree       # Merkle tree animation
    │   │   ├── KeyBuilder       # Step-by-step key construction
    │   │   └── ComparisonTable  # Side-by-side comparison
    │   ├── data/                # Blockchain data definitions
    │   └── lib/                 # Utility functions (hashing etc.)
    └── package.json
```

## 🧩 How Each Storage Model Affects Capabilities

| Model | Proof Size | Write Cost | Historical Queries | Parallel Execution |
|---|---|---|---|---|
| Bitcoin Merkle | O(log n) | Low | No | UTXO parallelism |
| Ethereum MPT | ~10KB | High (trie updates) | No (needs archive) | Limited |
| Cosmos IAVL | Medium | Medium | ✅ Built-in | Per-module |
| Solana Flat | N/A | Very Low | No | ✅ Account-based |
| Sui Objects | Small (SMT) | Low | No | ✅ Per-object |
| Verkle (future) | ~150 bytes | Medium | No | Enables stateless |
