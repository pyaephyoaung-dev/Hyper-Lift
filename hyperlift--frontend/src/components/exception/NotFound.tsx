import { Link } from 'react-router-dom';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden px-5">
      <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-orange-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-red-500/6 rounded-full blur-[120px]" />

      <div className="text-center relative z-10">
        <GiWeightLiftingUp className="mx-auto text-6xl text-orange-500/30 mb-6" />
        <h1 className="text-[120px] sm:text-[160px] font-black leading-none bg-gradient-to-b from-white to-gray-800 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-400 mt-2 mb-1 font-medium">Page Not Found</p>
        <p className="text-gray-600 text-sm max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all no-underline"
        >
          <FiArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
