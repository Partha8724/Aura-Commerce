import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Men's Collection | AURA COMMERCE",
  description: "Shop our premium men's collection in the UK. Discover luxury fashion, grooming, and bespoke accessories. Enjoy free delivery on all orders.",
};

export default function MenPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Men's Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Elevate your wardrobe with our premium men's collection. Tailored for the discerning modern gentleman, 
            our selection features luxury apparel, refined accessories, and cutting-edge grooming essentials. 
            Experience uncompromising quality with every piece.
          </p>
        </section>

        {/* Featured Categories Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category: Fashion */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Luxury men's apparel and fashion UK */}
                <span className="text-gray-400">Apparel Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Apparel</h3>
              <p className="mt-2 text-sm text-gray-500">Premium clothing</p>
            </div>

            {/* Category: Accessories */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Premium men's accessories and watches UK */}
                <span className="text-gray-400">Accessories Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Accessories</h3>
              <p className="mt-2 text-sm text-gray-500">Watches & belts</p>
            </div>

            {/* Category: Gadgets */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Tech gadgets for men UK */}
                <span className="text-gray-400">Gadgets Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Everyday Carry</h3>
              <p className="mt-2 text-sm text-gray-500">Essential gear</p>
            </div>

            {/* Category: Grooming */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Luxury men's grooming products UK */}
                <span className="text-gray-400">Grooming Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Grooming</h3>
              <p className="mt-2 text-sm text-gray-500">Personal care</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors">
            Shop All Men's Products
          </Link>
        </section>

        {/* Trust Signals Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop with Confidence</h2>
            <p className="text-gray-600">Enjoy <span className="font-semibold text-gray-900">Free UK Delivery</span> across the United Kingdom and a straightforward <span className="font-semibold text-gray-900">14-Day Returns</span> policy.</p>
        </section>
      </div>
    </div>
  );
}
