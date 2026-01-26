"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const FORCE_ANIMATIONS_IN_DEV = process.env.NODE_ENV === "development";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before mount: plain div (SSR match)
  if (!mounted) return <div className={className}>{children}</div>;

  const shouldReduce = !FORCE_ANIMATIONS_IN_DEV && reduce;
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22 }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before mount: plain div (SSR match)
  if (!mounted) return <div className={className}>{children}</div>;

  const shouldReduce = !FORCE_ANIMATIONS_IN_DEV && reduce;
  if (shouldReduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
