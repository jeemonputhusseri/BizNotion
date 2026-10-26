import ProductCard from './ProductCard'

const ProductList = ({ products, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ProductList