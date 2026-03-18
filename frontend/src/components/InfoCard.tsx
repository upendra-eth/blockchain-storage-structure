import { ReactNode } from "react";
import clsx from "clsx";

interface InfoCardProps {
  title: string;
  children: ReactNode;
  color?: string;
  icon?: string;
  className?: string;
  variant?: "default" | "highlight" | "warning" | "success";
}

export default function InfoCard({
  title,
  children,
  color,
  icon,
  className,
  variant = "default",
}: InfoCardProps) {
  const variantStyles = {
    default: "bg-[#0f0f1a] border-[#1a1a2e]",
    highlight: "bg-[#0f0f2a] border-[#2a2a5a]",
    warning: "bg-[#1a1400] border-[#3a3000]",
    success: "bg-[#001a0a] border-[#003a1a]",
  };

  return (
    <div
      className={clsx(
        "rounded-xl border p-5 transition-all",
        variantStyles[variant],
        className
      )}
      style={
        color
          ? { borderColor: `${color}33`, background: `${color}08` }
          : undefined
      }
    >
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-xl">{icon}</span>}
        <h3
          className="font-semibold text-sm uppercase tracking-wider"
          style={color ? { color } : { color: "#8888aa" }}
        >
          {title}
        </h3>
      </div>
      <div className="text-[#c8c8e0] text-sm leading-relaxed">{children}</div>
    </div>
  );
}
