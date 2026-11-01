import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const STATUSES = ['New', 'Contacted', 'Follow-up', 'Closed'];

const InquiryFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    customerName: '',
    contact: '',
    productInterest: '',
    status: 'New',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    const fetchInquiry = async () => {
      try {
        const res = await axiosInstance.get(`/api/inquiries/${id}`);
        const i = res.data;
        setForm({
          customerName: i.customerName || '',
          contact: i.contact || '',
          productInterest: i.productInterest || '',
          status: i.status || 'New',
          notes: i.notes || '',
          date: i.date ? new Date(i.date).toISOString().split('T')[0] : '',
        });
      } catch (err) {
        setError('Failed to load inquiry');
      }
    };
    fetchInquiry();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await axiosInstance.put(`/api/inquiries/${id}`, form);
      } else {
        await axiosInstance.post('/api/inquiries', form);
      }
      navigate('/inquiries');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Inquiry' : 'Add Inquiry'}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="e.g. Ravi Kumar"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone or email"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="productInterest">Product Interest</Label>
              <Input
                id="productInterest"
                name="productInterest"
                value={form.productInterest}
                onChange={handleChange}
                placeholder="e.g. Vintage Lamp"
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Notes (optional)</Label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Internal notes"
                rows={3}
                className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : isEdit ? 'Update Inquiry' : 'Add Inquiry'}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link to="/inquiries">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InquiryFormPage;
