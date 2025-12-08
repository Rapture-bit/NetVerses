import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { Link, useNavigation } from "react-router-dom";

type RadioGenre = "News" | "Music" | "Sports" | "Talk" | "Weather" | "Other";
type playStatus = "playing" | "paused";

interface RadioCardProps {
  genre: RadioGenre;
  radioName: string;
  id: string;
  playingStatus: playStatus;
  setPlayingStatus?: (status) => any;
}

const genreIcons: Record<string, string> = {
  News: "icon-[ri--broadcast-fill]",
  Music: "icon-[ri--music-fill]",
  Sports: "icon-[solar--football-bold]",
  Weather: "icon-[material-symbols--weather-mix]",
  Talk: "icon-[mdi--microphone]",
  Other: "icon-[material-symbols--globe]",
};

export default function RadioCard({
  genre,
  radioName,
  id,
  playingStatus,
  setPlayingStatus,
}: RadioCardProps) {
  const changePlayStatus = () => {
    if (playingStatus === "playing") {
      setPlayingStatus("paused");
    } else {
      setPlayingStatus("playing");
    }
  };

  return (
    <div
      id={id}
      className="flex flex-shrink-0 gap-3 darkerBackgroundColor border border-neutral-700 p-6 duration-300 rounded-xl shadow-sm transition-all"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center justify-center bg-neutral-700 p-3 rounded-full">
          <span
            className={`${genreIcons[genre] || ""} w-6 h-6 text-neutral-300`}
          ></span>
        </div>

        <div className="flex flex-col gap-0.5 items-center justify-center">
          <span className="font-semibold text-base hover:underline cursor-pointer">
            {radioName}
          </span>
          <span className="text-sm text-neutral-300 hover:underline hover:text-purple-400 cursor-pointer transition-colors duration-300">
            {genre}
          </span>
        </div>

        <div className="flex flex-row flex-shrink-0 gap-3 justify-center items-end w-full">
          <button
            onClick={() => {
              changePlayStatus();
            }}
            className="flex justify-center items-center w-10 h-10 bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {playingStatus === "paused" && (
                <motion.span
                  key="play"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="icon-[fluent--play-12-filled] w-6 h-6 text-neutral-300"
                ></motion.span>
              )}

              {playingStatus === "playing" && (
                <motion.span
                  key="pause"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="icon-[material-symbols--pause] w-6 h-6 text-neutral-300"
                ></motion.span>
              )}
            </AnimatePresence>
          </button>

          <button className="flex justify-center items-center w-10 h-10 bg-neutral-700 rounded-full hover:bg-neutral-600 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
            <span className="icon-[basil--chat-outline] w-6 h-6 text-neutral-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
}
