import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';
import RecentInquiries from '@/components/dashboard/RecentInquiries';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get('/api/dashboard');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link to="/products/new">Add Product</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/inquiries/new">Add Inquiry</Link>
          </Button>
        </div>
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading...</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Products" count={stats.productCount} />
            <StatCard label="Open Inquiries" count={stats.openInquiryCount} />
            <StatCard label="Closed Inquiries" count={stats.closedInquiryCount} />
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4">Recent Inquiries</h2>
            <RecentInquiries inquiries={stats.recentInquiries} />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
