"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface Step {
  label: string;
  input: string;
  output: string;
  description: string;
  color?: string;
}

interface KeyBuilderProps {
  steps: Step[];
  title?: string;
  color?: string;
}

export default function KeyBuilder({
  steps,
  title = "Key Formation",
  color = "#627EEA",
}: KeyBuilderProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (activeStep >= steps.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setActiveStep((s) => s + 1), 900);
    return () => clearTimeout(t);
  }, [playing, activeStep, steps.length]);

  const play = () => {
    setActiveStep(0);
    setPlaying(true);
  };

  return (
    <div className="rounded-xl border border-[#1a1a2e] bg-[#05050e] overflow-hidden">
      <div className="px-4 py-3 border-b border-[#1a1a2e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-xs font-medium text-[#8888aa]">{title}</span>
        </div>
        <button
          onClick={play}
          className="text-xs px-3 py-1 rounded transition-all"
          style={{ background: `${color}22`, color }}
        >
          ▶ Animate
        </button>
      </div>

      <div className="p-4 space-y-3">
        {steps.map((step, i) => {
          const isActive = i <= activeStep;
          const isCurrent = i === activeStep;

          return (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              className="cursor-pointer transition-opacity"
              style={{ opacity: isActive ? 1 : 0.35 }}
            >
              <div
                className="rounded-lg border p-3 transition-all"
                style={
                  isCurrent
                    ? { borderColor: color, background: `${color}0f` }
                    : {
                        borderColor: isActive ? "#2a2a4a" : "#1a1a2e",
                        background: "#0a0a14",
                      }
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={
                      isCurrent
                        ? { background: color, color: "#000" }
                        : isActive
                        ? { background: "#2a2a4a", color: "#e8e8e8" }
                        : { background: "#1a1a2e", color: "#666688" }
                    }
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={isCurrent ? { color } : { color: "#c8c8e0" }}
                  >
                    {step.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs font-mono bg-[#0a0a0a] border border-[#1a1a2e] px-2 py-1 rounded text-[#9999cc] max-w-[200px] truncate">
                    {step.input}
                  </code>
                  <ChevronRight size={14} className="text-[#444466] shrink-0" />
                  <code
                    className="text-xs font-mono px-2 py-1 rounded max-w-[200px] truncate"
                    style={
                      isCurrent
                        ? {
                            background: `${color}22`,
                            color,
                            border: `1px solid ${color}44`,
                          }
                        : {
                            background: "#0f0f1a",
                            color: "#8888aa",
                            border: "1px solid #1a1a2e",
                          }
                    }
                  >
                    {step.output}
                  </code>
                </div>

                <AnimatePresence>
                  {isCurrent && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-xs text-[#888899] mt-2 leading-relaxed overflow-hidden"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {steps.length > 0 && (
        <div className="px-4 pb-4">
          <div
            className="rounded-lg p-3 border font-mono text-xs break-all"
            style={{
              background: `${color}0a`,
              borderColor: `${color}33`,
              color,
            }}
          >
            <div className="text-[#666688] text-xs mb-1">Final DB Key:</div>
            {steps[steps.length - 1]?.output}
          </div>
        </div>
      )}
    </div>
  );
}
