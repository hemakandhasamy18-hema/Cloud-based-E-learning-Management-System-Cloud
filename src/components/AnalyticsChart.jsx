import React from "react";

export function BarChart({ data, title, xKey, yKey }) {
  // Find max value to scale the bars
  const maxVal = Math.max(...data.map(d => d[yKey] || 1));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mb-6">{title}</h3>
      <div className="flex items-end justify-between h-48 pt-4 gap-2">
        {data.map((item, idx) => {
          const val = item[yKey] || 0;
          const percent = (val / maxVal) * 100;
          
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] px-2 py-1 rounded absolute -translate-y-12 pointer-events-none select-none font-bold">
                {val} units
              </div>
              
              {/* Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg h-36 flex items-end overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg transition-all duration-1000 ease-out origin-bottom animate-bar"
                  style={{ height: `${percent || 5}%` }}
                />
              </div>
              
              {/* Label */}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 truncate w-full text-center" title={item[xKey]}>
                {item[xKey]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AreaChart({ data, title, xKey, yKey }) {
  const maxVal = Math.max(...data.map(d => d[yKey] || 1));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d[yKey] || 0) / maxVal) * 80; // keep 20% margin top
    return `${x},${y}`;
  }).join(" ");

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
      <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200 mb-6">{title}</h3>
      <div className="relative h-44 w-full">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800" />
          <line x1="0" y1="80" x2="100" y2="80" stroke="#f1f5f9" strokeWidth="0.5" className="dark:stroke-slate-800" />

          {/* Area Fill */}
          <polygon points={fillPoints} fill="url(#areaGrad)" />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            points={points}
          />
        </svg>

        {/* Labels overlay */}
        <div className="flex justify-between mt-2">
          {data.map((d, i) => (
            <span key={i} className="text-[10px] text-slate-400 dark:text-slate-500">
              {d[xKey]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RadialMetric({ percent, title, subtitle }) {
  const radius = 35;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between transition-colors">
      <div>
        <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
        <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-3 font-display">{percent}%</p>
      </div>

      <div className="relative h-24 w-24">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            stroke="#f1f5f9"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="48"
            cy="48"
            className="dark:stroke-slate-800"
          />
          {/* Progress circle */}
          <circle
            stroke="url(#radialGrad)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx="48"
            cy="48"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="radialGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
