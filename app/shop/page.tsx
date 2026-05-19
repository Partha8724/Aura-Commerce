import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop All Products | AURA COMMERCE",
  description: "Discover our premium selection of curated products. Enjoy free UK delivery on all orders. Shop luxury fashion, tech, and home goods at AURA COMMERCE.",
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Shop All Products
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Welcome to our exclusively curated collection designed for the modern UK lifestyle. 
            Browse through our premium selection across fashion, cutting-edge electronics, and bespoke home decor. 
            Every item is sourced to guarantee uncompromising quality.
          </p>
        </section>

        {/* Featured Categories Grid */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Explore Our Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category: Men */}
            <Link href="/men" className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Men's premium clothing and accessories UK */}
                <span className="text-gray-400">Men's Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Men's Collection</h3>
              <p className="mt-2 text-sm text-gray-500">Refined apparel & accessories</p>
            </Link>

            {/* Category: Women */}
            <Link href="/women" className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Women's luxury fashion and accessories UK */}
                <span className="text-gray-400">Women's Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Women's Collection</h3>
              <p className="mt-2 text-sm text-gray-500">Elegant style & beauty</p>
            </Link>

            {/* Category: Electronics */}
            <Link href="/electronics" className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Premium tech gadgets and smart home devices UK */}
                <span className="text-gray-400">Tech Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Electronics</h3>
              <p className="mt-2 text-sm text-gray-500">Smart gadgets & audio</p>
            </Link>

            {/* Category: Home */}
            <Link href="/home" className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Minimalist luxury home decor and living UK */}
                <span className="text-gray-400">Home Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Home & Living</h3>
              <p className="mt-2 text-sm text-gray-500">Curated decor & essentials</p>
            </Link>
          </div>
        </section>

        {/* Trust Signals Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Free UK Delivery</h3>
              <p className="text-sm text-gray-500">Fully tracked delivery directly to your door within 10-20 working days.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="font-semibold text-gray-900">Secure Checkout</h3>
              <p className="text-sm text-gray-500">100% encrypted payment processing for your complete peace of mind.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="font-semibold text-gray-900">14-Day Returns</h3>
              <p className="text-sm text-gray-500">Hassle-free returns on all orders. Shop with utter confidence.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
