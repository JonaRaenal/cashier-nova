// ============================================
// CashierNova — Empty State Component
// Placeholder saat data kosong (reusable)
// ============================================

const EmptyState = ({
  icon: Icon,
  title = 'Tidak ada data',
  description = '',
  action = null,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
    {Icon && (
      <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="text-gray-400 dark:text-gray-500" />
      </div>
    )}
    <h3 className="text-base font-medium text-text-primary dark:text-gray-200 mb-1">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-text-secondary dark:text-gray-400 max-w-sm">
        {description}
      </p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
