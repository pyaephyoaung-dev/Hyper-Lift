interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  size?: number;
}

const DonutChart = ({ segments, size = 220 }: DonutChartProps) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = size / 2 - 20;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulative = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#374151" strokeWidth={28} />
        ) : (
          segments
            .filter((s) => s.value > 0)
            .map((s, i) => {
              const fraction = s.value / total;
              const dash = fraction * circumference;
              const gap = circumference - dash;
              const rotation = (cumulative / total) * 360 - 90;
              cumulative += s.value;
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={28}
                  strokeDasharray={`${dash} ${gap}`}
                  transform={`rotate(${rotation} ${cx} ${cy})`}
                  strokeLinecap="butt"
                />
              );
            })
        )}
      </svg>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.color }} />
            <span className="text-gray-300">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
