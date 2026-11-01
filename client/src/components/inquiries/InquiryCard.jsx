import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/common/StatusBadge';

const InquiryCard = ({ inquiry, onDelete }) => {
  const formattedDate = new Date(inquiry.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm leading-tight">{inquiry.customerName}</h3>
            <p className="text-xs text-muted-foreground">{inquiry.contact}</p>
          </div>
          <StatusBadge status={inquiry.status} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Interested in</p>
          <p className="text-sm font-medium">{inquiry.productInterest}</p>
        </div>

        <p className="text-xs text-muted-foreground">{formattedDate}</p>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/inquiries/${inquiry._id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(inquiry._id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InquiryCard;
