import React from 'react';
import { motion } from 'framer-motion';

const MALE_PATH = "M100,25c-8.8,0-16,7.2-16,16s7.2,16,16,16s16-7.2,16-16S108.8,25,100,25z M75,65l-15,10c-5,3.3-8,8.8-8,14.7V250h12v-140h10v350h30v-160h12v160h30V110h10v140h12V90c0-6.1-3.2-11.8-8.5-15.1l-14-8.9c-4.6-2.9-10-4.5-15.5-4.5h-10C83.5,61.5,79,62.8,75,65z";
const FEMALE_PATH = "M100,30c-7.7,0-14,6.3-14,14s6.3,14,14,14s14-6.3,14-14S107.7,30,100,30z M78,68l-8,8c-3,3-5,7-5,11v140l10,0V115l4,0c7,40,5,80,15,130l-5,210h24l6-160h12l6,160h24l-5-210c10-50,8-90,15-130l4,0v112l10,0V87c0-4.1-1.6-8.1-4.4-11.1l-7.2-7.5c-3.1-3.2-7.3-5-11.7-5h-15.4C87.6,63.4,82.4,65.1,78,68z";

const DigitalTwin = ({ status, onOrganClick, gender = 'male' }) => {
  const getColor = (s) => {
    switch (s) {
      case 'critical': return '#f43f5e'; // rose-500
      case 'warning': return '#fbbf24'; // amber-400
      default: return '#10b981'; // emerald-500
    }
  };

  const organPos = [
    { id: 'brain', label: 'Brain', cy: 60, cx: 100, r: 25 },
    { id: 'lungs', label: 'Lungs', cy: 150, cx: 100, r: 35 },
    { id: 'heart', label: 'Heart', cy: 160, cx: 115, r: 15 },
    { id: 'liver', label: 'Liver', cy: 210, cx: 85, r: 20 },
    { id: 'kidneys', label: 'Kidneys', cy: 260, cx: 100, r: 25 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary-500/5 blur-[100px] rounded-full pointer-events-none" />

      <svg viewBox="0 0 200 500" className="h-full w-auto drop-shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        {/* Human Silhouette */}
        <motion.path
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          d={gender === 'female' ? FEMALE_PATH : MALE_PATH}
          fill="currentColor"
          className="text-slate-900 dark:text-slate-800/50 transition-colors"
        />

        {/* Interactive Organs */}
        {organPos.map((organ) => (
          <motion.circle
            key={organ.id}
            cx={organ.cx}
            cy={organ.cy}
            r={organ.r}
            fill={getColor(status[organ.id])}
            fillOpacity={0.7}
            stroke={getColor(status[organ.id])}
            strokeWidth={3}
            className="cursor-pointer"
            whileHover={{ 
              scale: 1.2, 
              fillOpacity: 0.95,
              filter: "brightness(1.2)" 
            }}
            onClick={() => onOrganClick(organ.id)}
          />
        ))}

        {/* Labels - Visible on hover or mobile */}
        <g className="pointer-events-none opacity-60">
           {organPos.map(organ => (
             <text 
               key={`text-${organ.id}`} 
               x={organ.cx} 
               y={organ.cy + 5} 
               textAnchor="middle" 
               fontSize="8" 
               className="fill-slate-600 dark:fill-white font-bold pointer-events-none transition-colors"
             >
               {organ.label.toUpperCase()}
             </text>
           ))}
        </g>
      </svg>
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-2 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Normal</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <span>Warning</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;
