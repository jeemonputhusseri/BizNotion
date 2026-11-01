import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import InquiryList from '@/components/inquiries/InquiryList';

const STATUSES = ['All', 'New', 'Contacted', 'Follow-up', 'Closed'];

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const fetchInquiries = async (status) => {
    setLoading(true);
    setError('');
    try {
      const params = status && status !== 'All' ? { status } : {};
      const res = await axiosInstance.get('/api/inquiries', { params });
      setInquiries(res.data.data);
    } catch (err) {
      setError('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries(activeFilter);
  }, [activeFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await axiosInstance.delete(`/api/inquiries/${id}`);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inquiries</h1>
        <Button asChild size="sm">
          <Link to="/inquiries/new">Add Inquiry</Link>
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveFilter(s)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              activeFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading...</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && inquiries.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No inquiries found.</p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/inquiries/new">Add your first inquiry</Link>
          </Button>
        </div>
      )}

      {!loading && !error && inquiries.length > 0 && (
        <InquiryList inquiries={inquiries} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default InquiriesPage;
