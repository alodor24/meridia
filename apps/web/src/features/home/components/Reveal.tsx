import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  from?: string;
  sx?: SxProps<Theme>;
}

const shouldRevealImmediately = () => {
  if (typeof window === "undefined") return true;
  if (typeof IntersectionObserver === "undefined") return true;

  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
};

const Reveal = ({
  children,
  delay = 0,
  from = "translate3d(0, 28px, 0)",
  sx,
}: RevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(shouldRevealImmediately);

  useEffect(() => {
    const element = ref.current;

    if (!element || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [visible]);

  return (
    <Box
      ref={ref}
      sx={[
        {
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : from,
          transition: [
            `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
            `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          ].join(", "),
          willChange: visible ? "auto" : "opacity, transform",
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}>
      {children}
    </Box>
  );
};

export default Reveal;
