import React from "react";
import { motion } from "framer-motion";

export default function GradientText({ children, className = "", as: Tag = "span", style = {}, ...props }) {
  const MotionTag = motion.create(Tag);

  return (
    <MotionTag
      className={`gradient-text-wrapper ${className}`}
      style={style}
      {...props}
    >
      {children}
      <span className="gradient-text-overlay">
        <span className="gradient-blob gradient-blob-1" />
        <span className="gradient-blob gradient-blob-2" />
        <span className="gradient-blob gradient-blob-3" />
        <span className="gradient-blob gradient-blob-4" />
      </span>
    </MotionTag>
  );
}
