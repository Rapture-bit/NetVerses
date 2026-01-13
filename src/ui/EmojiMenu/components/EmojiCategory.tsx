import { motion, useAnimation } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import { computePosition, offset, shift, inline } from "@floating-ui/dom";

import emojisList from "../data/emojisList.json";

interface ComponentProps {
  categoryName: string;
  tone: "Light" | "Medium" | "Dark" | "Default";
  searchIndex?: string;
}

const skinTonesInNum: Record<string, number | ""> = {
  Light: 1,
  Medium: 3,
  Dark: 5,
  Default: "",
};

const normalizeGroup = (name: string) =>
  name.replace("&", "-").replace(/\+/g, "").toLowerCase().trim();

const allowedSpecials = [
  "kiss: man, man",
  "kiss: woman, woman",
  "women holding hands",
  "men holding hands",
  "couple with heart: man, man",
  "couple with heart: woman, woman",
];
const shouldExcludeAnnotation = (annotation: string) => {
  const a = annotation.toLowerCase();
  if (allowedSpecials.includes(a)) return false;

  return (
    a.startsWith("woman") ||
    a.startsWith("man") ||
    a.startsWith("women") ||
    a.startsWith("men") ||
    a.includes("woman") ||
    a.includes("man") ||
    a.includes("person, person") ||
    a.includes("man, man") ||
    a.includes("woman, woman") ||
    a.includes("girl, girl") ||
    a.includes("boy, boy") ||
    a.includes("girl, boy") ||
    a.includes("woman, man") ||
    a.includes("facing right") ||
    a.includes("mermaid") ||
    a.includes("health worker") ||
    a.includes("Western Sahara")
  );
};

export default function EmojiCategory({
  categoryName,
  tone,
  searchIndex = "",
}: ComponentProps) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  const [tooltipLabel, setTooltipLabel] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [tooltipPos, _] = useState({ x: 0, y: 0 });

  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);

  const emojisListRef = useRef(null);
  const contextMenuRef = useRef(null);

  const groupName = useMemo(() => normalizeGroup(categoryName), [categoryName]);
  const emojis = useMemo(() => {
    const toneValue = skinTonesInNum[tone];
    const search = searchIndex.trim().toLowerCase();

    return emojisList
      .filter((e) => e.group === groupName)
      .filter((e) => e.skintone_combination !== "multiple")
      .filter((e) => !shouldExcludeAnnotation(e.annotation))
      .filter((e) => {
        if (!search) return true;

        const annotation = e.annotation?.toLowerCase() ?? "";
        const category = e.group?.toLowerCase() ?? "";

        const tagMatch =
          typeof e.tags === "string"
            ? e.tags.toLowerCase().includes(search)
            : Array.isArray(e.tags)
            ? e.tags.some((t: string) => t.toLowerCase().includes(search))
            : false;

        const annotationMatch = annotation.includes(search);
        const categoryMatch = category.includes(search);

        return tagMatch || annotationMatch || categoryMatch;
      })
      .filter((e) => {
        if (e.skintone_combination === "single") {
          return e.skintone === toneValue;
        }
        return true;
      })
      .map((e) => {
        const annotation = e.annotation.trim();
        const lower = annotation.toLowerCase();

        let label: string;

        if (lower.startsWith("flag")) {
          const colonIndex = annotation.indexOf(":");
          label =
            colonIndex !== -1
              ? annotation.slice(colonIndex + 1).trim()
              : annotation;
        } else {
          const colonIndex = annotation.indexOf(":");
          label =
            colonIndex !== -1
              ? annotation.slice(0, colonIndex).trim()
              : annotation;
        }

        return {
          emoji: e.emoji,
          label,
        };
      });
  }, [groupName, tone, searchIndex]);

  useEffect(() => {
    controls.start({
      opacity: tooltipVisible ? 1 : 0,
      transition: { duration: tooltipVisible ? 0.2 : 0.4 },
    });
  }, [tooltipVisible, controls]);

  const handleMouseEnter = async (
    e: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) => {
    if (!tooltipRef.current) return;

    setTooltipLabel(label);
    setTooltipVisible(true);

    const { x, y } = await computePosition(
      e.currentTarget,
      tooltipRef.current,
      {
        placement: "bottom",
        strategy: "fixed",
        middleware: [inline(), offset(6), shift({ padding: 8 })],
      }
    );

    Object.assign(tooltipRef.current.style, {
      left: `${x}px`,
      top: `${y}px`,
      transform: "",
    });
  };

  useEffect(() => {
    const emojisListDiv = emojisListRef?.current;
    if (!emojisListDiv) return;

    const children = Array.from(emojisListDiv.children);
    const contextMenuListeners: Array<() => void> = [];

    children.forEach((child) => {
      const handleContextMenu = async (event: MouseEvent) => {
        event.preventDefault();
        if (!contextMenuRef.current) return;

        setContextMenuVisible(true);

        const { x, y } = await computePosition(child, contextMenuRef.current, {
          placement: "right",
          strategy: "fixed",
        });

        setContextMenuPos({ x, y });
      };

      child.addEventListener("contextmenu", handleContextMenu);
      contextMenuListeners.push(() =>
        child.removeEventListener("contextmenu", handleContextMenu)
      );
    });

    const resetContextMenu = () => {
      setContextMenuVisible(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        resetContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contextMenuVisible) return;

      if (e.key === "Escape") {
        resetContextMenu();
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("resize", resetContextMenu);
    document.addEventListener("scroll", resetContextMenu, true);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      contextMenuListeners.forEach((remove) => remove());
      window.removeEventListener("resize", resetContextMenu);
      document.removeEventListener("scroll", resetContextMenu, true);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [emojisListRef, emojis, contextMenuVisible]);

  useEffect(() => {
    if (contextMenuVisible) {
      document.body.classList.add("context-lock");
    } else {
      document.body.classList.remove("context-lock");
    }

    return () => {
      document.body.classList.remove("context-lock");
    };
  }, [contextMenuVisible]);

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  if (emojis.length === 0) return null;

  return (
    <div className="flex flex-col space-y-1 relative">
      <span className="text-xs uppercase inter-font text-gray-400 select-none">
        {categoryName.replace("-", " & ")}
      </span>

      <div
        ref={emojisListRef}
        className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1 mt-1.5"
      >
        {emojis.map(({ emoji, label }, index) => (
          <button
            key={index}
            onMouseEnter={(e) => handleMouseEnter(e, label)}
            onMouseLeave={handleMouseLeave}
            className="
              inline-flex items-center justify-center
              cursor-pointer rounded-md p-1 py-2
              hover:bg-gray-700/50
              transition-colors duration-200
              outline-none border-0
              focus-visible:border-2 border-purple-800
            "
          >
            <span
              style={{ fontFamily: "OpenMoji" }}
              className="text-3xl leading-none select-none"
            >
              {emoji}
            </span>
          </button>
        ))}
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
        className="z-50 rounded-md pointer-events-none! bg-[#1b2333] px-2 py-1 text-xs font-medium text-white shadow-lg ring-1 ring-white/4 whitespace-nowrap capitalize text-center"
      >
        {tooltipLabel}
      </motion.div>

      <motion.div
        ref={contextMenuRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: contextMenuVisible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "fixed",
          left: contextMenuPos.x,
          top: contextMenuPos.y,
          pointerEvents: contextMenuVisible ? "auto" : "none",
          display: contextMenuVisible ? "flex" : "none",
        }}
        className="flex flex-col z-90 rounded-md bg-[#1b2333] text-xs p-1 font-medium text-white shadow-lg ring-1 ring-white/4 whitespace-nowrap"
      >
        <button
          type="button"
          onClick={(e) => {}}
          className="flex p-1 cursor-pointer! -m-1 px-2 py-1.5 rounded-md pointer-events-auto! hover:bg-gray-700/50 duration-300 transition-all items-center justify-between"
        >
          <span className="flex items-center gap-8">
            <span>Favorite Emoji</span>
            <span
              className="icon-[material-symbols--star-rounded] w-4 h-4 text-base"
              aria-hidden="true"
            />
          </span>
        </button>
      </motion.div>
    </div>
  );
}
