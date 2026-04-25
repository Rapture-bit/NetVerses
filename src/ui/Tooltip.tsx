import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { computePosition, offset, shift, inline } from "@floating-ui/dom";

export default function Tooltip({ children, label }: any) {
  const [isHovered, setHovered] = useState<boolean>(false);

  const [tooltipVisible, setTooltipVisible] = useState<boolean>();
  const [tooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipLabel, setTooltipLabel] = useState<string>("");

  const tooltipRef = useRef<null | HTMLDivElement>(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!tooltipRef.current) return;

    setTooltipLabel(label);
    setTooltipVisible(isHovered);

    const asyncFunc = async () => {
      if (!menuRef.current || !tooltipRef.current) return;
      const { x, y } = await computePosition(
        menuRef?.current,
        tooltipRef.current,
        {
          placement: "bottom",
          strategy: "fixed",
          middleware: [inline(), offset(6), shift({ padding: 8 })],
        },
      );

      Object.assign(tooltipRef.current?.style, {
        left: `${x}px`,
        top: `${y}px`,
        transform: "",
      });
    };

    asyncFunc();

    window.addEventListener("resize", asyncFunc);
    return () => {
      window.removeEventListener("resize", asyncFunc);
    };
  }, [isHovered, label]);

  return (
    <>
      <div
        ref={menuRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </div>

      <motion.div
        ref={tooltipRef}
        animate={{ opacity: tooltipVisible ? 1 : 0 }}
        initial={{ opacity: 0 }}
        transition={{ duration: tooltipVisible ? 0.2 : 0.4 }}
        style={{
          pointerEvents: "none",
          position: "fixed",
          left: tooltipPos.x,
          top: tooltipPos.y,
        }}
        className={`z-50 rounded-md pointer-events-none! bg-[#333333]! px-2 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/4 whitespace-nowrap capitalize text-center`}
      >
        {tooltipLabel}
      </motion.div>
    </>
  );
}
