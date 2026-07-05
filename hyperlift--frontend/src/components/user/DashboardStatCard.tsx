import { ReactNode } from 'react';

interface DashboardStatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color: string;
}

const DashboardStatCard = ({ icon, label, value, color }: DashboardStatCardProps) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-xl text-white`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
