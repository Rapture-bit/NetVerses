import { parseISO, formatDistanceToNow } from "date-fns";

export default function formatDate(dateString) {
  if (!dateString) return "";

  const date = parseISO(dateString);
  const distance = formatDistanceToNow(date, { addSuffix: true });

  if (distance.includes("second") || distance.includes("minute")) {
    return "Just now";
  }

  return distance;
}
