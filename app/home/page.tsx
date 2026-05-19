import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home & Living | AURA COMMERCE",
  description: "Transform your space with AURA COMMERCE. Premium home decor, modern furniture, and kitchen essentials in the UK. Enjoy free delivery on all orders.",
};

export default function HomeLivingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Home & Living
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Create a sanctuary that reflects your impeccable taste. Our Home & Living collection 
            features luxurious decor, modern kitchen essentials, and bespoke furniture solutions 
            designed to elevate every room in your UK home.
          </p>
        </section>

        {/* Featured Categories Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category: Decor */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Luxury home decor and interior styling UK */}
                <span className="text-gray-400">Decor Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Decor</h3>
              <p className="mt-2 text-sm text-gray-500">Aesthetic accents</p>
            </div>

            {/* Category: Kitchen */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Premium modern kitchenware and dining accessories UK */}
                <span className="text-gray-400">Kitchen Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Kitchen & Dining</h3>
              <p className="mt-2 text-sm text-gray-500">Culinary essentials</p>
            </div>

            {/* Category: Furniture */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: High-end minimalist furniture and seating UK */}
                <span className="text-gray-400">Furniture Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Furniture</h3>
              <p className="mt-2 text-sm text-gray-500">Chic comfort</p>
            </div>

            {/* Category: Lighting */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Elegant modern lighting fixtures and lamps UK */}
                <span className="text-gray-400">Lighting Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Lighting</h3>
              <p className="mt-2 text-sm text-gray-500">Illuminating design</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors">
            Shop Home Collection
          </Link>
        </section>

        {/* Trust Signals Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop Securely with Us</h2>
            <p className="text-gray-600">Rest assured knowing every order includes <span className="font-semibold text-gray-900">Free UK Delivery</span> and is protected by our hassle-free <span className="font-semibold text-gray-900">14-Day Returns</span> policy.</p>
        </section>
      </div>
    </div>
  );
}
