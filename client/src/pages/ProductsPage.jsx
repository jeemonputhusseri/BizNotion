import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/products/ProductList';

const STATUSES = ['All', 'Draft', 'Listed', 'Sold'];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (status, page) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 10 };
      if (status && status !== 'All') params.status = status;
      const res = await axiosInstance.get('/api/products', { params });
      setProducts(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(activeFilter, currentPage);
  }, [activeFilter, currentPage]);

  // reset to page 1 when filter changes
  const handleFilterChange = (status) => {
    setActiveFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axiosInstance.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild size="sm">
          <Link to="/products/new">Add Product</Link>
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => handleFilterChange(s)}
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

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No products found.</p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/products/new">Add your first product</Link>
          </Button>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <ProductList products={products} onDelete={handleDelete} />
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
