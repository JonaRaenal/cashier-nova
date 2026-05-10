const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded ${className}`} />
);

const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="skeleton h-3 w-24 mb-3 rounded" />
        <div className="skeleton h-7 w-32 rounded" />
      </div>
      <div className="skeleton w-11 h-11 rounded-xl" />
    </div>
  </div>
);

const SkeletonProductCard = () => (
  <div className="card p-3 animate-pulse">
    <div className="skeleton aspect-square rounded-lg mb-3" />
    <div className="skeleton h-4 w-3/4 mb-2 rounded" />
    <div className="skeleton h-3 w-1/2 mb-2 rounded" />
    <div className="flex items-center justify-between mt-2">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
  </div>
);

const SkeletonTableRow = ({ cols = 5 }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="table-cell">
        <div className="skeleton h-4 w-full rounded" style={{ maxWidth: `${60 + Math.random() * 40}%` }} />
      </td>
    ))}
  </tr>
);

const SkeletonChart = () => (
  <div className="animate-pulse">
    <div className="flex items-end gap-2 h-[280px] pt-8">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 skeleton rounded-t"
          style={{ height: `${30 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  </div>
);

export { SkeletonLine, SkeletonCard, SkeletonProductCard, SkeletonTableRow, SkeletonChart };
export default SkeletonCard;
