import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import InquiryCard from '@/components/inquiries/InquiryCard';

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [productsRes, inquiriesRes] = await Promise.all([
          axiosInstance.get(`/api/admin/users/${userId}/products`),
          axiosInstance.get(`/api/admin/users/${userId}/inquiries`),
        ]);
        setProducts(productsRes.data);
        setInquiries(inquiriesRes.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <Button variant="outline" onClick={() => navigate('/admin/users')} className="mb-4">
        Back to Users
      </Button>

      <h1 className="text-3xl font-bold mb-8">User Details</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">No products found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} readOnly />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Inquiries ({inquiries.length})</h2>
          {inquiries.length === 0 ? (
            <p className="text-gray-500">No inquiries found</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inquiries.map((inquiry) => (
                <InquiryCard key={inquiry._id} inquiry={inquiry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
