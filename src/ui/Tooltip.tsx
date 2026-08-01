import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { computePosition, offset, shift, autoUpdate } from "@floating-ui/dom";

export default function Tooltip({ children, label, TWStyling }: any) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState("");

  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTooltipLabel(label);

    if (!isHovered) return;
    if (!triggerRef.current || !tooltipRef.current) return;

    const updatePosition = async () => {
      const { x, y } = await computePosition(
        triggerRef.current!,
        tooltipRef.current!,
        {
          placement: "bottom",
          strategy: "fixed",
          middleware: [offset(6), shift({ padding: 8 })],
        },
      );

      Object.assign(tooltipRef.current!.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    };

    const cleanup = autoUpdate(
      triggerRef.current,
      tooltipRef.current,
      updatePosition,
    );

    updatePosition();

    return () => cleanup();
  }, [isHovered, label]);

  const trigger = React.Children.only(children);

  return (
    <>
      {React.cloneElement(trigger, {
        ref: triggerRef,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        "data-tooltip-trigger": label,
      })}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              left: 0,
              top: 0,
              pointerEvents: "none",
              zIndex: 9999,
            }}
            className={`z-50 rounded-2xl bg-[#333333] px-2 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/10 whitespace-nowrap text-center ${TWStyling}`}
          >
            {tooltipLabel}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
