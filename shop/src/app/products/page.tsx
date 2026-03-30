import products from '@/data/products.json'

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2 text-roast font-heading">Our Coffee</h1>
        <p className="text-gray-600 mb-12">Premium specialty coffee, roasted fresh to order</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border border-amber-200 rounded-lg p-6 hover:shadow-lg transition">
              <div className="bg-gradient-to-br from-amber-100 to-orange-50 aspect-[4/3] rounded-xl mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-12 h-12 text-amber-400 opacity-60" fill="currentColor">
                  <path d="M2 21v-2h2V3h16v16h2v2H2zm4-2h12V5H6v14zm2-2h2v-2H8v2zm4 0h2v-2h-2v2zm-4-4h2v-2H8v2zm4 0h2v-2h-2v2zm-4-4h2V7H8v2zm4 0h2V7h-2v2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-roast mb-2 font-heading">{product.name}</h2>
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
