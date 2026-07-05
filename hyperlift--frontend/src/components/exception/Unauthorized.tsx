import { Link } from 'react-router-dom';
import { FiShield, FiArrowLeft } from 'react-icons/fi';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden px-5">
      <div className="absolute top-[20%] right-[10%] w-72 h-72 bg-red-500/8 rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] left-[10%] w-80 h-80 bg-orange-500/6 rounded-full blur-[120px]" />

      <div className="text-center relative z-10">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FiShield className="text-4xl text-red-500" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">Access Denied</h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto mb-10">
          You don't have permission to view this page. Please contact an administrator if you believe this is a mistake.
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

export default Unauthorized;
