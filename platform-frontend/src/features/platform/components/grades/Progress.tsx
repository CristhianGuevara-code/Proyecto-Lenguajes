import React from "react";


interface ProgressProps {
  value?: number;
  label?: string;
}

const Progress: React.FC<ProgressProps> = ({ value = 0, label = "Progreso" }) => {
  const progressColor =
    value < 40
      ? "bg-red-400"
      : value < 70
      ? "bg-yellow-400"
      : "bg-green-500";

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-5 shadow-inner">
        <div
          className={`h-5 rounded-full ${progressColor} transition-all duration-700 ease-in-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default Progress;
