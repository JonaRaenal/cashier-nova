// ============================================
// CashierNova — Loading Spinner Component
// Komponen spinner animasi loading
// ============================================

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-3 border-gray-200 border-t-primary rounded-full animate-spin`}
        style={{ borderWidth: '3px' }}
      />
    </div>
  );
};

export default LoadingSpinner;
