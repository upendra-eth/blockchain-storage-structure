"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  highlights?: number[];
}

export default function CodeBlock({
  code,
  language = "text",
  title,
  highlights = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className="rounded-lg overflow-hidden border border-[#1a1a2e] text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0a0a14] border-b border-[#1a1a2e]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {title && (
            <span className="text-[#8888aa] text-xs ml-2 font-mono">
              {title}
            </span>
          )}
          {language && language !== "text" && (
            <span className="text-[#444466] text-xs ml-1">{language}</span>
          )}
        </div>
        <button
          onClick={copy}
          className="text-[#8888aa] hover:text-white transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      {/* Code — plain text rendering, no dangerouslySetInnerHTML */}
      <div className="overflow-x-auto bg-[#050510]">
        <pre className="p-4 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={
                highlights.includes(i + 1)
                  ? "bg-[#1a1a3a] -mx-4 px-4 border-l-2 border-[#627EEA]"
                  : ""
              }
            >
              <span className="select-none text-[#2a2a4a] mr-4 w-6 inline-block text-right">
                {i + 1}
              </span>
              <span className={getLineColor(line, language)}>
                {line}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// Lightweight line-level coloring — no regex-on-HTML cascading issues
function getLineColor(line: string, lang: string): string {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
    return "text-[#666688]";
  }
  if (trimmed.startsWith("/*") || trimmed.startsWith("*")) {
    return "text-[#666688]";
  }
  if (
    trimmed.startsWith("import ") ||
    trimmed.startsWith("export ") ||
    trimmed.startsWith("use ")
  ) {
    return "text-[#9945FF]";
  }
  if (trimmed.startsWith("//") || trimmed.includes("→") || trimmed.startsWith("DB[")) {
    return "text-[#c8c8e8]";
  }
  return "text-[#c8c8e8]";
}
