import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import StatusBadge from '@/components/common/StatusBadge';

const RecentInquiries = ({ inquiries }) => {
  if (!inquiries || inquiries.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground text-sm">
          No inquiries yet. Add your first inquiry to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <ul className="divide-y">
          {inquiries.map((inquiry) => (
            <li key={inquiry._id} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{inquiry.customerName}</p>
                <p className="text-xs text-muted-foreground truncate">{inquiry.productInterest}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={inquiry.status} />
                <span className="text-xs text-muted-foreground">
                  {new Date(inquiry.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentInquiries;
