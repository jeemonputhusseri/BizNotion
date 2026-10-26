const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-700',
  Listed: 'bg-blue-100 text-blue-700',
  Sold: 'bg-green-100 text-green-700',
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-amber-100 text-amber-700',
  'Follow-up': 'bg-purple-100 text-purple-700',
  Closed: 'bg-gray-100 text-gray-700',
}

const StatusBadge = ({ status }) => {
  const styles = STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  )
}

export default StatusBadge