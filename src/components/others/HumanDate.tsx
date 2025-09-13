import React, { useState, useEffect } from "react";
import { parseISO, format } from "date-fns";

export function useHumanDate(dateString) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (!dateString) return;

    const updateFormattedDate = () => {
      const date = parseISO(dateString);

      const humanReadableDate = format(date, "EEEE, MMM d, yyyy 'at' hh:mm a");

      setFormattedDate(humanReadableDate);
    };

    updateFormattedDate();
  }, [dateString]);

  return formattedDate;
}
