// components/ProgressBar.tsx
"use client";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "bg-blue-500",
  height = 6,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      <div
        className={`relative rounded-full ${
          color === "bg-blue-500" ? "bg-blue-100" : "bg-gray-200"
        }`}
        style={{ height: `${height}px` }}
      >
        <div
          className={`absolute left-0 top-0 h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentage && (
        <div className="mt-1 text-right text-sm text-gray-600">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
