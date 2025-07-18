import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#750f33] text-[#f4e1e7] border-[1px] border-[#d62e68]",
  "bg-[#0c9e7a] text-[#e3f5f1] border-[1px] border-[#86ecd3]",
  "bg-[#102e9d] text-[#dfe2f0] border-[1px] border-[#335efc]",
  "bg-[#6b4238] text-[#eedfe8] border-[1px] border-[#b18c6a]",
];

export const getColor = (color: number) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};

export const animationDefaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
};
