"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CodeBlock from "@/components/CodeBlock";
import InfoCard from "@/components/InfoCard";

const COLOR = "#9945FF";

const accountModelCode = `// Solana Account Model — NO GLOBAL STATE TRIE
// Every account is just a blob of bytes in RocksDB

Account {
  lamports:   u64,      // SOL balance (1 SOL = 1e9 lamports)
  data:       Vec<u8>,  // arbitrary data (up to 10MB)
  owner:      Pubkey,   // which program owns this account
  executable: bool,     // is this account a program?
  rent_epoch: u64,      // when rent was last collected
}

// Storage key: just the pubkey (32 bytes)
DB[alice_pubkey] = serialize(alice_account)
DB[program_pubkey] = serialize(program_account)  // program is also an account!

// NO global state trie
// NO keccak256(address) → nibbles → trie traversal
// JUST: pubkey → bytes`;

const programCode = `// Programs (Smart Contracts) = Just Accounts
// The code lives in a "program account" with executable=true

// Program account:
{
  owner:      BPF_LOADER_PUBKEY,
  executable: true,
  data:       [compiled BPF bytecode...]  // the actual program
}

// State accounts (owned by programs):
{
  owner:      spl_token_program,  // this program controls the data
  data:       serialize(TokenAccount {
    mint:    usdc_mint_pubkey,
    owner:   alice_pubkey,
    amount:  1000000,  // 1 USDC (6 decimals)
    ...
  })
}

// KEY INSIGHT: Programs are stateless!
// A program's code never changes its own data
// Instead, it updates "data accounts" that it owns
// This is why Solana can parallelize transactions`;

const parallelCode = `// Sealevel — Solana's Parallel Execution Engine
// Why it works: transactions declare ALL accounts they'll touch

// Transaction must declare:
tx.accounts = [
  { pubkey: alice,  is_writable: true,  is_signer: true  },
  { pubkey: bob,    is_writable: true,  is_signer: false },
  { pubkey: usdc,   is_writable: false, is_signer: false },
]

// Scheduler can see:
// Tx1 reads/writes: [alice, bob]
// Tx2 reads/writes: [carol, dave]
// Tx3 reads/writes: [alice, carol]  // conflicts with Tx1 and Tx2!

// Tx1 and Tx2 → PARALLEL (no shared accounts)
// Tx3 → must wait for Tx1 and Tx2 to finish

// Compare to Ethereum:
// Txs can read/write any account → must run sequentially`;

const accountsDbCode = `// Solana AccountsDB — How accounts are stored
// Uses an append-only write structure for performance

// Old accounts are NOT modified in place
// Instead, new versions are APPENDED and old ones marked as dead

AccountsDB {
  // Append-only storage files
  append_file_1: [account_v1_data, account_v2_data, ...]
  append_file_2: [new_account_data, ...]
  
  // Index: pubkey → (file_id, offset, size)
  index: {
    alice: (file_2, offset_100, 128),  // latest version
    bob:   (file_1, offset_500, 96),
  }
}

// Merkle hash for verification:
// Not a full trie! Uses account-hash for each account
// Then a separate "bank hash" combines all changed accounts
// Much simpler than Ethereum's per-account trie

bank_hash = hash(
  prev_bank_hash,
  hash_of_all_account_changes_in_block  // simple XOR of account hashes
)`;

const rentCode = `// Solana Rent — Paying for Storage
// Accounts must maintain minimum balance or get deleted

// Minimum balance = (account_size bytes) × rent_per_byte
// At current rates: ~0.00089 SOL per KB per year

// Rent-exempt: if balance > rent_minimum, never deleted
alice_min_lamports = RENT_EXEMPTION_THRESHOLD(account_size)
// ≈ 2 years of rent (about 0.002 SOL for a basic account)

// If balance falls below minimum:
// → account is garbage collected → data DELETED from DB
// This keeps the DB clean — no state bloat!

// Ethereum comparison:
// Ethereum has state bloat — old contract storage stays forever
// Solana's rent forces cleanup of unused state`;

export default function SolanaPage() {
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);

  const accounts = [
    {
      type: "EOA (Wallet)",
      pubkey: "4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy",
      owner: "System Program",
      lamports: "2.5 SOL",
      dataSize: "0 bytes",
      executable: false,
      color: "#9945FF",
      icon: "👛",
    },
    {
      type: "Token Account",
      pubkey: "7nZ3GwrJTe...",
      owner: "SPL Token Program",
      lamports: "0.002 SOL (rent)",
      dataSize: "165 bytes",
      executable: false,
      color: "#00D4AA",
      icon: "🪙",
    },
    {
      type: "Program Account",
      pubkey: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      owner: "BPF Loader",
      lamports: "1 SOL",
      dataSize: "~200KB (bytecode)",
      executable: true,
      color: "#F7931A",
      icon: "📜",
    },
    {
      type: "Data Account",
      pubkey: "8QvjH3b...",
      owner: "Custom Program",
      lamports: "0.005 SOL",
      dataSize: "512 bytes",
      executable: false,
      color: "#2FB8EB",
      icon: "📦",
    },
  ];

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
                ◎
              </span>
              <div>
                <div className="text-xs text-[#666688] font-mono">Storage Model</div>
                <div className="text-2xl font-bold text-white">Solana</div>
              </div>
            </div>
            <div
              className="inline-block text-sm px-3 py-1 rounded-full font-mono mb-4"
              style={{ background: `${COLOR}22`, color: COLOR }}
            >
              Flat Account Model — No Global State Trie!
            </div>
            <p className="text-[#8888aa] text-lg max-w-2xl leading-relaxed">
              Solana throws away the state trie entirely.{" "}
              <span className="text-white font-medium">Just pubkey → bytes in RocksDB.</span>
              Programs are accounts. Data is in accounts. Parallel execution via{" "}
              <span className="text-white font-medium">Sealevel</span> because transactions 
              pre-declare which accounts they touch.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">

        {/* THE Big Insight */}
        <section>
          <div
            className="rounded-xl border p-6 text-center mb-8"
            style={{ borderColor: `${COLOR}44`, background: `${COLOR}08` }}
          >
            <div className="text-4xl mb-3">🚫</div>
            <h2 className="text-xl font-bold text-white mb-2">
              No Merkle Patricia Trie. No IAVL. No State Trie At All.
            </h2>
            <p className="text-[#8888aa] max-w-xl mx-auto text-sm">
              Ethereum/Cosmos: every state read/write → traverse a deep tree → many DB lookups
              <br />
              <span style={{ color: COLOR }} className="font-semibold">
                Solana: pubkey → bytes — 1 DB lookup. Done.
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard title="Everything is an Account" color={COLOR} icon="📦">
              <p className="text-xs leading-relaxed">
                Wallets, tokens, programs, config — everything is an account.
                Each account = lamports (SOL) + bytes (data) + owner program.
              </p>
            </InfoCard>

            <InfoCard title="Programs are Stateless" color={COLOR} icon="📜">
              <p className="text-xs leading-relaxed">
                A program (smart contract) only stores bytecode. All mutable state lives
                in separate &quot;data accounts&quot; owned by the program. This enables parallelism.
              </p>
            </InfoCard>

            <InfoCard title="Parallel via Account Declarations" color={COLOR} icon="⚡">
              <p className="text-xs leading-relaxed">
                Transactions must declare all accounts upfront. The scheduler sees which txs
                share accounts and runs independent ones in parallel via Sealevel.
              </p>
            </InfoCard>
          </div>
        </section>

        {/* Interactive Account Explorer */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Account Types — Everything in Solana
          </h2>
          <p className="text-xs text-[#666688] mb-4">
            Click any account to explore its structure.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {accounts.map((acc, i) => (
              <div
                key={i}
                onClick={() => setSelectedAccount(selectedAccount === i ? null : i)}
                className="cursor-pointer rounded-xl border p-4 transition-all"
                style={
                  selectedAccount === i
                    ? { borderColor: acc.color, background: `${acc.color}12` }
                    : { borderColor: "#1a1a2e", background: "#0a0a14" }
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{acc.icon}</span>
                    <span style={{ color: acc.color }} className="font-semibold text-sm">
                      {acc.type}
                    </span>
                  </div>
                  {acc.executable && (
                    <span className="text-xs px-2 py-0.5 rounded bg-[#1a1400] text-[#aaaa44] border border-[#3a3000]">
                      executable
                    </span>
                  )}
                </div>
                <div className="font-mono text-xs text-[#666688] truncate">
                  {acc.pubkey}
                </div>

                {selectedAccount === i && (
                  <div
                    className="mt-3 pt-3 border-t border-[#2a2a4a] grid grid-cols-2 gap-2 text-xs"
                  >
                    <div>
                      <div className="text-[#444466]">Owner</div>
                      <div className="text-[#c8c8e0]">{acc.owner}</div>
                    </div>
                    <div>
                      <div className="text-[#444466]">Balance</div>
                      <div style={{ color: acc.color }}>{acc.lamports}</div>
                    </div>
                    <div>
                      <div className="text-[#444466]">Data Size</div>
                      <div className="text-[#c8c8e0]">{acc.dataSize}</div>
                    </div>
                    <div>
                      <div className="text-[#444466]">Executable</div>
                      <div className="text-[#c8c8e0]">{acc.executable ? "Yes" : "No"}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Account model code */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Account Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodeBlock code={accountModelCode} language="rust" title="account-model.rs" />
            <CodeBlock code={programCode} language="rust" title="program-account.rs" />
          </div>
        </section>

        {/* Parallel execution */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Sealevel — Parallel Execution Engine
          </h2>
          <CodeBlock code={parallelCode} language="rust" title="sealevel.rs" />

          <div className="mt-6 rounded-xl border border-[#1a1a2e] bg-[#0a0a14] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">
              Visual: Parallel vs Sequential Execution
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#627EEA] mb-2">Ethereum (Sequential)</div>
                <div className="space-y-1">
                  {["Tx1: Alice→Bob", "Tx2: Carol→Dave", "Tx3: Eve→Frank"].map((tx, i) => (
                    <div
                      key={tx}
                      className="text-xs font-mono p-2 rounded"
                      style={{
                        background: "#0a0a1a",
                        borderLeft: "3px solid #627EEA",
                        marginLeft: `${i * 0}px`,
                      }}
                    >
                      {i > 0 && (
                        <span className="text-[#444466]">
                          [waits for Tx{i}] {" "}
                        </span>
                      )}
                      {tx}
                    </div>
                  ))}
                  <div className="text-xs text-[#444466]">Total: 3 time slots</div>
                </div>
              </div>
              <div>
                <div className="text-xs mb-2" style={{ color: COLOR }}>
                  Solana Sealevel (Parallel)
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    {["Tx1: Alice→Bob", "Tx3: Eve→Frank"].map((tx) => (
                      <div
                        key={tx}
                        className="text-xs font-mono p-2 rounded"
                        style={{ background: `${COLOR}15`, borderLeft: `3px solid ${COLOR}` }}
                      >
                        {tx}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-xs font-mono p-2 rounded h-full flex items-center"
                      style={{ background: "#00D4AA15", borderLeft: "3px solid #00D4AA" }}
                    >
                      Tx2: Carol→Dave
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#444466] mt-1">Total: 1 time slot!</div>
              </div>
            </div>
          </div>
        </section>

        {/* AccountsDB */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            AccountsDB — Append-Only Storage
          </h2>
          <CodeBlock code={accountsDbCode} language="rust" title="accounts-db.rs" />
        </section>

        {/* Rent */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">
            Rent — Preventing State Bloat
          </h2>
          <CodeBlock code={rentCode} language="rust" title="rent.rs" />
        </section>

        {/* Storage → Capabilities */}
        <section className="bg-[#0a0a14] rounded-xl border border-[#1a1a2e] p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            How Flat Storage → Capabilities
          </h2>
          <div className="space-y-3">
            {[
              {
                cause: "No state trie — direct pubkey lookup",
                effect: "Reading account state = 1 RocksDB lookup. Ethereum = O(64) trie node reads. Solana is dramatically faster for reads.",
                positive: true,
              },
              {
                cause: "Pre-declared account access + stateless programs",
                effect: "Sealevel can run thousands of transactions in parallel. ~65,000 TPS theoretical. No sequential bottleneck.",
                positive: true,
              },
              {
                cause: "No global state Merkle proof",
                effect: "Can't prove account state to a light client like Ethereum can. Solana needs validators to trust each other more.",
                positive: false,
              },
              {
                cause: "Rent mechanism",
                effect: "Forces accounts to hold minimum SOL. Prevents state bloat. But unfamiliar to Ethereum developers.",
                positive: true,
              },
              {
                cause: "Programs are fixed code accounts",
                effect: "Programs can't be upgraded unless they use special upgrade authority pattern. More secure but less flexible.",
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
