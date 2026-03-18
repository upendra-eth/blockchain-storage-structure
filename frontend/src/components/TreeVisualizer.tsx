"use client";

export interface TreeNodeData {
  id: string;
  label: string;
  sublabel?: string;
  value?: string;
  type: "root" | "branch" | "extension" | "leaf" | "internal" | "empty";
  children?: TreeNodeData[];
  highlighted?: boolean;
  active?: boolean;
  color?: string;
}

interface TreeVisualizerProps {
  tree: TreeNodeData;
  title?: string;
  color?: string;
  animatePath?: string[];
  onNodeClick?: (node: TreeNodeData) => void;
}

const NODE_W = 120;
const NODE_H = 52;
const H_GAP = 20;
const V_GAP = 60;

interface LayoutNode {
  node: TreeNodeData;
  x: number;
  y: number;
  width: number;
}

function layoutTree(
  node: TreeNodeData,
  depth = 0,
  offset = 0
): { nodes: LayoutNode[]; width: number } {
  if (!node.children || node.children.length === 0) {
    return {
      nodes: [{ node, x: offset, y: depth * (NODE_H + V_GAP), width: NODE_W }],
      width: NODE_W,
    };
  }

  const childLayouts = node.children.map((child) =>
    layoutTree(child, depth + 1, 0)
  );

  let totalWidth = 0;
  const spacedLayouts: LayoutNode[][] = [];

  for (const layout of childLayouts) {
    const offset2 = totalWidth;
    spacedLayouts.push(layout.nodes.map((n) => ({ ...n, x: n.x + offset2 })));
    totalWidth += layout.width + H_GAP;
  }
  totalWidth -= H_GAP;

  const allChildNodes = spacedLayouts.flat();

  const minX = allChildNodes
    .filter((n) => n.y === (depth + 1) * (NODE_H + V_GAP))
    .reduce((min, n) => Math.min(min, n.x), Infinity);
  const maxX = allChildNodes
    .filter((n) => n.y === (depth + 1) * (NODE_H + V_GAP))
    .reduce((max, n) => Math.max(max, n.x + NODE_W), -Infinity);

  const parentX = (minX + maxX) / 2 - NODE_W / 2;

  const parentNode: LayoutNode = {
    node,
    x: parentX,
    y: depth * (NODE_H + V_GAP),
    width: NODE_W,
  };

  return {
    nodes: [parentNode, ...allChildNodes],
    width: Math.max(totalWidth, NODE_W),
  };
}

const typeStyles: Record<string, { bg: string; border: string; text: string }> = {
  root: { bg: "#1a1a3a", border: "#627EEA", text: "#e8e8ff" },
  branch: { bg: "#0f1f0f", border: "#2a5a2a", text: "#88cc88" },
  extension: { bg: "#1a1400", border: "#5a4a00", text: "#ccaa44" },
  leaf: { bg: "#1a0a0a", border: "#5a1a1a", text: "#cc6644" },
  internal: { bg: "#0f0f2a", border: "#2a2a6a", text: "#8888ee" },
  empty: { bg: "#0a0a0a", border: "#1a1a1a", text: "#333344" },
};

export default function TreeVisualizer({
  tree,
  title,
  color = "#627EEA",
  animatePath = [],
  onNodeClick,
}: TreeVisualizerProps) {
  const { nodes, width } = layoutTree(tree);
  const height = Math.max(...nodes.map((n) => n.y)) + NODE_H + 20;

  const svgWidth = Math.max(width + 40, 400);
  const svgHeight = height + 20;

  const edges: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    active: boolean;
  }> = [];

  for (const layoutNode of nodes) {
    if (!layoutNode.node.children) continue;
    const parentCx = layoutNode.x + NODE_W / 2;
    const parentCy = layoutNode.y + NODE_H;

    for (const child of layoutNode.node.children) {
      const childLayout = nodes.find((n) => n.node.id === child.id);
      if (!childLayout) continue;
      const childCx = childLayout.x + NODE_W / 2;
      const childCy = childLayout.y;
      const isActive =
        animatePath.includes(layoutNode.node.id) &&
        animatePath.includes(child.id);
      edges.push({
        x1: parentCx,
        y1: parentCy,
        x2: childCx,
        y2: childCy,
        active: isActive,
      });
    }
  }

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] overflow-hidden">
      {title && (
        <div className="px-4 py-3 border-b border-[#1a1a2e] flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
          <span className="text-xs font-medium text-[#8888aa]">{title}</span>
        </div>
      )}
      <div className="overflow-x-auto p-4">
        <svg
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="mx-auto"
        >
          {/* Edges */}
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1 + 20}
              y1={e.y1 + 10}
              x2={e.x2 + 20}
              y2={e.y2 + 10}
              stroke={e.active ? color : "#2a2a4a"}
              strokeWidth={e.active ? 2 : 1.5}
            />
          ))}

          {/* Nodes */}
          {nodes.map((layoutNode) => {
            const style =
              typeStyles[layoutNode.node.type] ?? typeStyles.internal;
            const isActive = animatePath.includes(layoutNode.node.id);
            const isHighlighted = layoutNode.node.highlighted;

            return (
              <g
                key={layoutNode.node.id}
                onClick={() => onNodeClick?.(layoutNode.node)}
                style={{ cursor: onNodeClick ? "pointer" : "default" }}
              >
                <rect
                  x={layoutNode.x + 20}
                  y={layoutNode.y + 10}
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  fill={
                    isActive || isHighlighted ? `${color}22` : style.bg
                  }
                  stroke={
                    isActive || isHighlighted ? color : style.border
                  }
                  strokeWidth={isActive || isHighlighted ? 2 : 1}
                  style={{ transition: "fill 0.2s, stroke 0.2s" }}
                />
                <text
                  x={layoutNode.x + NODE_W / 2 + 20}
                  y={layoutNode.y + 22}
                  textAnchor="middle"
                  fill={isActive ? color : style.text}
                  fontSize={9}
                  fontFamily="monospace"
                  opacity={0.7}
                >
                  {layoutNode.node.type.toUpperCase()}
                </text>
                <text
                  x={layoutNode.x + NODE_W / 2 + 20}
                  y={layoutNode.y + 36}
                  textAnchor="middle"
                  fill={isActive ? color : "#c8c8e8"}
                  fontSize={11}
                  fontFamily="monospace"
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {layoutNode.node.label.length > 14
                    ? layoutNode.node.label.slice(0, 13) + "…"
                    : layoutNode.node.label}
                </text>
                {layoutNode.node.sublabel && (
                  <text
                    x={layoutNode.x + NODE_W / 2 + 20}
                    y={layoutNode.y + 50}
                    textAnchor="middle"
                    fill="#666688"
                    fontSize={9}
                    fontFamily="monospace"
                  >
                    {layoutNode.node.sublabel.length > 16
                      ? layoutNode.node.sublabel.slice(0, 15) + "…"
                      : layoutNode.node.sublabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
