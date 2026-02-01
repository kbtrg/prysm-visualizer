"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";

const LEVELS = [
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "PURPLE",
] as const;

function parseScore(param: string | null): { index: number; label: string } {
  const raw = (param ?? "RED1").toUpperCase();
  const match = raw.match(/^([A-Z]+)([123])$/);
  const group = match?.[1] ?? "RED";
  const level = match?.[2] ? parseInt(match[2], 10) : 1;
  const groupIndex = LEVELS.includes(group as (typeof LEVELS)[number])
    ? LEVELS.indexOf(group as (typeof LEVELS)[number])
    : 0;
  const index = Math.min(groupIndex * 3 + level - 1, 17);
  const label = `${group} ${level}`;
  return { index, label };
}

function ThanksContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { index, label } = useMemo(
    () => parseScore(mounted ? searchParams.get("score") : null),
    [mounted, searchParams]
  );

  const progress = (index + 1) / 18;
  const angleDeg = 180 - progress * 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const indicatorX = 100 + 80 * Math.cos(angleRad);
  const indicatorY = 100 - 80 * Math.sin(angleRad);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070708] px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-30%,#1e1b4b20,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_120%,#0f172a30,transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-16"
      >
        <div className="text-center">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.35em] text-zinc-600">
            Your Score
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-semibold tracking-tight text-white md:text-5xl"
          >
            {label}
          </motion.h1>
        </div>

        <div className="relative">
          <svg
            viewBox="0 0 200 120"
            className="h-[160px] w-[320px] md:h-[200px] md:w-[400px]"
          >
            <defs>
              <linearGradient
                id="meterGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="16%" stopColor="#f97316" />
                <stop offset="33%" stopColor="#eab308" />
                <stop offset="50%" stopColor="#22c55e" />
                <stop offset="66%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#meterGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              opacity={0.4}
            />
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#meterGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(168,85,247,0.5))",
              }}
            />
            <motion.circle
              r={6}
              fill="white"
              initial={{ cx: 20, cy: 100, opacity: 0 }}
              animate={{ cx: indicatorX, cy: indicatorY, opacity: 1 }}
              transition={{
                cx: { duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
                cy: { duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3, delay: 0.5 },
              }}
              style={{
                filter: "drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 24px rgba(168,85,247,0.6))",
              }}
            />
          </svg>

          <div className="mt-2 flex justify-between px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            <span>Red</span>
            <span>Purple</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#070708]">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-violet-500" />
        </div>
      }
    >
      <ThanksContent />
    </Suspense>
  );
}
