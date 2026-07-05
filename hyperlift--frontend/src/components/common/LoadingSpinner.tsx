const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
