import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Blockchain Storage Explorer",
  description:
    "Interactive learning platform — how Bitcoin, Ethereum, Solana, Cosmos, Sui, Aptos and more store their data under the hood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050508] text-[#e8e8f0] antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <footer className="border-t border-[#1a1a2e] py-8 mt-20 text-center text-[#8888aa] text-sm">
          <p>
            Blockchain Storage Explorer — Built for learning how blockchains
            actually work under the hood
          </p>
          <p className="mt-1 font-mono text-xs text-[#4444aa]">
            All use KV databases (LevelDB/RocksDB) — the magic is in the
            structure above it
          </p>
        </footer>
      </body>
    </html>
  );
}
