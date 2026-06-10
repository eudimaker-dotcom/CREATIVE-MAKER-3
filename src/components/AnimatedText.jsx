import * as React from "react";

// Simple and robust class merger for JSX styling
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const AnimatedText = React.forwardRef(
  (
    {
      text,
      gradientColors = "linear-gradient(90deg, #ff003c, #ff007f, #adfa1d, #7f00ff, #ff003c)",
      gradientAnimationDuration = 4,
      hoverEffect = true,
      className,
      textClassName,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn("flex justify-center items-center", className)}
        {...props}
      >
        <span
          className={cn("leading-none", textClassName)}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: isHovered ? "0 0 15px rgba(255, 0, 60, 0.45)" : "none",
            display: "inline-block",
            transition: "text-shadow 0.3s ease",
            animation: `text-gradient-shift ${gradientAnimationDuration}s linear infinite`,
          }}
          onMouseEnter={() => hoverEffect && setIsHovered(true)}
          onMouseLeave={() => hoverEffect && setIsHovered(false)}
        >
          {text}
        </span>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
