import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext } from "@/context/ThemeContext";
import { Tooltip } from "antd";

export default async function EditProfileMenu({ visible }) {
  const { colorProperties } = useContext(ThemeContext);

  const toggleVisible = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-999 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[20px] pointer-events-auto rounded-lg" />
          <div
            className={`relative flex flex-col space-y-3 w-1/4 darkerBackgroundColor rounded-lg p-3.5 z-10`}
          >
            <div className="flex flex-col space-y-2 w-full">
              <h2 className="lato font-semibold text-lg dark:text-white/85 text-black text-left">
                Profiles
              </h2>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
