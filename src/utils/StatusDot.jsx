import React from "react";
import { Circle } from "lucide-react";

export default function StatusDot({ color = "red", filled = false, size = 16 }) {
  return (
    <Circle
      size={size}                   // size in pixels
      stroke={color}                // outline color
      fill={filled ? color : "none"} // fill color
      strokeWidth={2}               // outline thickness
    />
  );
}