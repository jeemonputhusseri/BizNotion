import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/common/StatusBadge'

const ProductCard = ({ product, onDelete }) => {
  const formattedPrice = product.price != null
    ? `Rs. ${Number(product.price).toFixed(2)}`
    : 'Rs. 0.00'

  return (
    <Card className="overflow-hidden">
      {/* image or placeholder with product initial */}
      <div className="aspect-square w-full bg-muted flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-muted-foreground/40">
            {product.name?.charAt(0).toUpperCase() || '?'}
          </span>
        )}
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
          <StatusBadge status={product.status} />
        </div>

        <p className="text-lg font-bold">{formattedPrice}</p>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link to={`/products/${product._id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
