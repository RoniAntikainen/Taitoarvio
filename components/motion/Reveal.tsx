"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
  delay?: number;
  y?: number;
  blur?: boolean;
  once?: boolean;
};

const FORCE_ANIMATIONS_IN_DEV = process.env.NODE_ENV === "development";

const makeVariants = (y: number, blur: boolean): Variants => ({
  hidden: {
    opacity: 0,
    y,
    filter: blur ? "blur(10px)" : "none",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export default function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  y = 16,
  blur = true,
  once = true,
}: Props) {
  const reduce = useReducedMotion();

  // KEY FIX: server HTML === first client render
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before mount: return plain element (no motion inline styles => no hydration mismatch)
  if (!mounted) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  // Respect reduced motion only in prod; in dev we force animations
  const shouldReduce = !FORCE_ANIMATIONS_IN_DEV && reduce;

  if (shouldReduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const Comp = motion[as];

  return (
    <Comp
      className={className}
      variants={makeVariants(y, blur)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}
