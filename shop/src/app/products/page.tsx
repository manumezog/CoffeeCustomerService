import products from '@/data/products.json'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-roast">Our Coffee</h1>
        <p className="text-gray-600 mb-12">Premium specialty coffee, roasted fresh to order</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border border-amber-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
              <h2 className="text-xl font-bold text-roast mb-2">{product.name}</h2>
              <p className="text-sm text-amber-700 mb-2">{product.type}</p>
              <p className="text-gray-700 text-sm mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-ember">${product.price}</span>
                <button className="bg-ember hover:bg-orange-700 text-white px-4 py-2 rounded transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
