import { Mars, Venus, VenusAndMars } from "lucide-react";

export default function Pronouns({ sex }) {
  return (
    <>
      {sex === "M" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer text-blue-500 gap-1">
          <Mars className="w-3.5 h-3.5" />
          <span>He/Him</span>
        </div>
      )}

      {sex === "F" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer text-pink-500 gap-1">
          <Venus className="w-3.5 h-3.5" />
          <span>She/Her</span>
        </div>
      )}

      {sex === "T" && (
        <div className="flex items-center font-semibold text-sm hover:underline cursor-pointer gap-1">
          <VenusAndMars className="w-3.5 h-3.5" />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            They/Them
          </span>
        </div>
      )}
    </>
  );
}
