import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'

const STATUSES = ['All', 'Draft', 'Listed', 'Sold']

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const fetchProducts = async (status) => {
    setLoading(true)
    setError('')
    try {
      const params = status && status !== 'All' ? { status } : {}
      const res = await axiosInstance.get('/api/products', { params })
      setProducts(res.data.data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts(activeFilter)
  }, [activeFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axiosInstance.delete(`/api/products/${id}`)
      setProducts((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild size="sm">
          <Link to="/products/new">Add Product</Link>
        </Button>
      </div>

      {/* status filter */}
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

      {/* content */}
      {loading && (
        <p className="text-muted-foreground text-sm">Loading....</p>
      )}

      {error && (
        <p className="text-destructive text-sm">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No products found.</p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/products/new">Add your first product</Link>
          </Button>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
           "Product card"
          ))}
        </div>
      )}

    </div>
  )
}

export default ProductsPage
