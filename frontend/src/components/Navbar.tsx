"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Database } from "lucide-react";
import clsx from "clsx";

const chains = [
  { href: "/bitcoin", label: "Bitcoin", color: "#F7931A" },
  { href: "/ethereum", label: "Ethereum", color: "#627EEA" },
  { href: "/substrate", label: "Substrate", color: "#E6007A" },
  { href: "/cosmos", label: "Cosmos", color: "#2FB8EB" },
  { href: "/solana", label: "Solana", color: "#9945FF" },
  { href: "/sui", label: "Sui", color: "#6fbcf0" },
  { href: "/aptos", label: "Aptos", color: "#00D4AA" },
  { href: "/verkle", label: "Verkle", color: "#00FFB3" },
  { href: "/compare", label: "Compare All", color: "#ffffff" },
  { href: "/deep-compare", label: "ETH vs SUB", color: "#00FFB3" },
  { href: "/substrate-vs-cosmos", label: "SUB vs COS", color: "#2FB8EB" },
  { href: "/verkle-deep", label: "Verkle Deep", color: "#00FFB3" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a2e] bg-[#050508]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Database size={20} className="text-[#627EEA]" />
          <span className="font-bold text-sm text-white hidden sm:block">
            Chain Storage
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto flex-1">
          {chains.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={clsx(
                "px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all",
                pathname === c.href
                  ? "bg-[#1a1a2e] text-white"
                  : "text-[#8888aa] hover:text-white hover:bg-[#0f0f1a]"
              )}
              style={pathname === c.href ? { color: c.color } : {}}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ background: c.color }}
              />
              {c.label}
            </Link>
          ))}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="ml-auto lg:hidden text-[#8888aa]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#1a1a2e] bg-[#050508] px-4 py-3 grid grid-cols-2 gap-2">
          {chains.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "px-3 py-2 rounded text-xs font-medium transition-all",
                pathname === c.href
                  ? "bg-[#1a1a2e]"
                  : "text-[#8888aa] hover:text-white hover:bg-[#0f0f1a]"
              )}
              style={pathname === c.href ? { color: c.color } : {}}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                style={{ background: c.color }}
              />
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
