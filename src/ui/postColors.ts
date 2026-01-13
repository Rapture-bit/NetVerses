import { tv } from "tailwind-variants";

export const postColors = tv({
  variants: {
    color: {
      purple:
        "text-purple-500 bg-purple-900 border-purple-600 shadow-purple-600",
      blue: "text-blue-500 bg-blue-900 border-blue-600 shadow-blue-600",
      red: "text-red-500 bg-red-900 border-red-600 shadow-red-600",
      green: "text-green-500 bg-green-900 border-green-600 shadow-green-600",
    },
  },
  defaultVariants: {
    color: "purple",
  },
});
