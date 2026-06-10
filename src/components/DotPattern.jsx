import React, { useId } from "react";

export function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 1,
  cr = 1,
  className,
  style,
  ...props
}) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={className}
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
        height: "100%",
        width: "100%",
        fill: "currentColor",
        ...style
      }}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

export default DotPattern;
