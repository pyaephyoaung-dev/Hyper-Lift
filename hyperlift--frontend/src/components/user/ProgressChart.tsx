import { WorkoutResponse } from '../../types/AppTypes';

interface ProgressChartProps {
  workouts: WorkoutResponse[];
  weeks?: number;
}

const ProgressChart = ({ workouts, weeks = 8 }: ProgressChartProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Build `weeks` buckets, oldest first, each covering a 7-day window ending today.
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const end = new Date(today);
    end.setDate(end.getDate() - (weeks - 1 - i) * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { start, end, count: 0 };
  });

  workouts.forEach((w) => {
    const date = new Date(w.workoutDate);
    for (const bucket of buckets) {
      if (date >= bucket.start && date <= bucket.end) {
        bucket.count += 1;
        break;
      }
    }
  });

  const maxCount = Math.max(1, ...buckets.map((b) => b.count));
  const chartHeight = 140;
  const barGap = 12;
  const width = 100 / weeks;

  const weekLabel = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const hasAnyData = workouts.length > 0;

  return (
    <div>
      {!hasAnyData ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Log a workout to start tracking your progress.</p>
        </div>
      ) : (
        <>
          <svg viewBox={`0 0 100 ${chartHeight + 24}`} className="w-full" preserveAspectRatio="none" style={{ height: 180 }}>
            {/* baseline */}
            <line x1="0" y1={chartHeight} x2="100" y2={chartHeight} stroke="#374151" strokeWidth="0.5" />
            {buckets.map((b, i) => {
              const barHeight = (b.count / maxCount) * (chartHeight - 10);
              const x = i * width + barGap / 20;
              const barWidth = width - barGap / 10;
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={chartHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx="1.5"
                    fill={b.count > 0 ? '#f97316' : '#1f2937'}
                  />
                  {b.count > 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={chartHeight - barHeight - 4}
                      textAnchor="middle"
                      fontSize="4.5"
                      fill="#f97316"
                      fontWeight="600"
                    >
                      {b.count}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="flex justify-between mt-2 px-0.5">
            {buckets.map((b, i) => (
              <span key={i} className="text-[10px] text-gray-500" style={{ width: `${width}%`, textAlign: 'center' }}>
                {i === 0 || i === buckets.length - 1 ? weekLabel(b.end) : ''}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-500 text-xs mt-3">Workouts logged per week (last {weeks} weeks)</p>
        </>
      )}
    </div>
  );
};

export default ProgressChart;
