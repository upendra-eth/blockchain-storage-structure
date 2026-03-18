"use client";

import { useState } from "react";

interface MerkleTreeVizProps {
  transactions?: string[];
  color?: string;
  title?: string;
  showHashSteps?: boolean;
}

function shortHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  const hex = Math.abs(h).toString(16).padStart(8, "0");
  return `0x${hex}`;
}

function combineHash(a: string, b: string): string {
  return shortHash(a + b);
}

export default function MerkleTreeViz({
  transactions = ["Tx A", "Tx B", "Tx C", "Tx D"],
  color = "#F7931A",
  title = "Merkle Tree",
  showHashSteps = true,
}: MerkleTreeVizProps) {
  const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  let txs = [...transactions];
  if (txs.length % 2 !== 0) txs.push(txs[txs.length - 1]);

  const levels: string[][] = [txs.map((t) => shortHash(t))];

  while (levels[levels.length - 1].length > 1) {
    const prev = levels[levels.length - 1];
    const next: string[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      next.push(combineHash(prev[i], prev[i + 1] ?? prev[i]));
    }
    levels.push(next);
  }

  const totalLevels = levels.length;
  const maxWidth = levels[0].length;

  const nodeW = 110;
  const nodeH = 44;
  const hGap = 16;
  const vGap = 56;
  const svgWidth = maxWidth * (nodeW + hGap) + 40;
  const svgHeight = totalLevels * (nodeH + vGap) + 30;

  const getX = (level: number, idx: number) => {
    const levelCount = levels[level].length;
    const totalW = levelCount * (nodeW + hGap) - hGap;
    const startX = (svgWidth - totalW) / 2;
    return startX + idx * (nodeW + hGap);
  };

  const getY = (level: number) =>
    (totalLevels - 1 - level) * (nodeH + vGap) + 10;

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a2e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-xs font-medium text-[#8888aa]">{title}</span>
        </div>
        {showHashSteps && (
          <div className="flex gap-2 text-xs text-[#666688]">
            {levels.map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  setHighlightedLevel(highlightedLevel === i ? null : i)
                }
                className="px-2 py-0.5 rounded transition-all"
                style={
                  highlightedLevel === i
                    ? { background: `${color}33`, color }
                    : {}
                }
              >
                L{i}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="overflow-x-auto p-4">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
        >
          {/* Edges */}
          {levels.map((level, li) => {
            if (li === totalLevels - 1) return null;
            return level.map((_, ni) => {
              const parentIdx = Math.floor(ni / 2);
              const px = getX(li + 1, parentIdx) + nodeW / 2;
              const py = getY(li + 1) + nodeH;
              const cx = getX(li, ni) + nodeW / 2;
              const cy = getY(li);
              const isActive =
                highlightedLevel === li || highlightedLevel === li + 1;
              return (
                <line
                  key={`${li}-${ni}`}
                  x1={cx}
                  y1={cy}
                  x2={px}
                  y2={py}
                  stroke={isActive ? color : "#2a2a4a"}
                  strokeWidth={isActive ? 2 : 1.5}
                />
              );
            });
          })}

          {/* Nodes */}
          {levels.map((level, li) =>
            level.map((hash, ni) => {
              const x = getX(li, ni);
              const y = getY(li);
              const isRoot = li === totalLevels - 1;
              const isLeaf = li === 0;
              const isActive = highlightedLevel === li;
              const isHovered = hoveredNode === `${li}-${ni}`;

              return (
                <g
                  key={`${li}-${ni}`}
                  onMouseEnter={() => setHoveredNode(`${li}-${ni}`)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x}
                    y={y}
                    width={nodeW}
                    height={nodeH}
                    rx={8}
                    fill={
                      isRoot
                        ? `${color}22`
                        : isActive || isHovered
                        ? `${color}15`
                        : isLeaf
                        ? "#1a1a0a"
                        : "#0f0f1a"
                    }
                    stroke={
                      isRoot || isActive ? color : isLeaf ? "#5a5a1a" : "#2a2a4a"
                    }
                    strokeWidth={isRoot ? 2 : isActive ? 1.5 : 1}
                    style={{ transition: "fill 0.2s, stroke 0.2s" }}
                  />
                  <text
                    x={x + nodeW / 2}
                    y={y + 14}
                    textAnchor="middle"
                    fill={isRoot ? color : "#666688"}
                    fontSize={8}
                    fontFamily="monospace"
                  >
                    {isRoot ? "MERKLE ROOT" : isLeaf ? "LEAF" : `LEVEL ${li}`}
                  </text>
                  <text
                    x={x + nodeW / 2}
                    y={y + 30}
                    textAnchor="middle"
                    fill={isRoot ? color : isActive ? "#e8e8e8" : "#9999aa"}
                    fontSize={10}
                    fontFamily="monospace"
                    fontWeight={isRoot ? "bold" : "normal"}
                  >
                    {hash.slice(0, 10)}…
                  </text>

                  {isHovered && (
                    <g>
                      <rect
                        x={x - 20}
                        y={y - 36}
                        width={nodeW + 40}
                        height={28}
                        rx={4}
                        fill="#1a1a2e"
                        stroke="#2a2a4a"
                      />
                      <text
                        x={x + nodeW / 2}
                        y={y - 18}
                        textAnchor="middle"
                        fill="#e8e8e8"
                        fontSize={9}
                        fontFamily="monospace"
                      >
                        {hash}
                      </text>
                    </g>
                  )}
                </g>
              );
            })
          )}

          {/* Transaction labels */}
          {transactions.map((tx, i) => {
            const x = getX(0, i);
            const y = getY(0) + nodeH + 8;
            return (
              <text
                key={i}
                x={x + nodeW / 2}
                y={y + 12}
                textAnchor="middle"
                fill="#666688"
                fontSize={9}
                fontFamily="monospace"
              >
                {tx}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="px-4 pb-4 flex flex-wrap gap-3 text-xs text-[#666688]">
        <span>
          <span className="font-mono" style={{ color }}>
            Merkle Root
          </span>{" "}
          = hash of all child hashes
        </span>
        <span>
          <span className="font-mono text-[#9999aa]">Leaf</span> =
          hash(transaction)
        </span>
        <span>Click level buttons to highlight</span>
      </div>
    </div>
  );
}
