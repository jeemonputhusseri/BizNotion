import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatCard from '@/components/dashboard/StatCard';

const DashboardPage = () => {
  return (
    <div className="space-y-8">

      {/* page header */}
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

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Products" count={0} />
        <StatCard label="Open Inquiries" count={0} />
        <StatCard label="Closed Inquiries" count={0} />
      </div>

      {/* recent inquiries */}
      <div>
        <h2 className="text-base font-semibold mb-4">Recent Inquiries</h2>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground text-sm">
            No inquiries yet. Add your first inquiry to get started.
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default DashboardPage
