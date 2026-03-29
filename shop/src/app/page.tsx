export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-roast to-amber-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">Ember & Roast</h1>
        <p className="text-xl text-amber-100 mb-8">Premium Specialty Coffee, Roasted Fresh</p>
        <p className="text-lg mb-6">Welcome to Sierra.AI interview showcase project</p>
        <nav className="flex gap-4">
          <a href="/products" className="bg-ember hover:bg-orange-700 px-6 py-3 rounded-lg transition">
            Browse Products
          </a>
          <a href="/orders" className="bg-amber-700 hover:bg-amber-800 px-6 py-3 rounded-lg transition">
            Track Order
          </a>
        </nav>
      </div>
    </main>
  )
}
