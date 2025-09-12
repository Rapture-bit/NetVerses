import React, { useState, useEffect } from "react";
import {
  parseISO,
  differenceInHours,
  differenceInMinutes,
  differenceInDays,
} from "date-fns";

export function useTimeAgo(dateString) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    if (!dateString) return;

    const updateTimeAgo = () => {
      const date = parseISO(dateString);
      const now = new Date();

      const minutes = differenceInMinutes(now, date);
      const hours = differenceInHours(now, date);
      const days = differenceInDays(now, date);

      let timeString = "";

      if (minutes < 1) {
        timeString = "Just now";
      } else if (minutes < 60) {
        timeString = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else if (hours < 24) {
        timeString = `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else {
        timeString = `${days} day${days > 1 ? "s" : ""} ago`;
      }

      setTimeAgo(timeString);
    };

    updateTimeAgo();

    const intervalId = setInterval(updateTimeAgo, 30000);

    return () => clearInterval(intervalId);
  }, [dateString]);

  return timeAgo;
}
