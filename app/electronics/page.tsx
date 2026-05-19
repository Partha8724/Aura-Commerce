import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Electronics | AURA COMMERCE",
  description: "Shop premium electronics and smart gadgets in the UK. AURA COMMERCE offers the latest tech with free delivery across the United Kingdom.",
};

export default function ElectronicsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Electronics & Gadgets
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Upgrade your life with our curation of premium electronics and innovative tech. 
            From immersive audio solutions to intuitive smart home devices, we bring the latest technological 
            advancements directly to your doorstep in the UK.
          </p>
        </section>

        {/* Featured Categories Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category: Audio */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: High quality noise cancelling headphones and audio UK */}
                <span className="text-gray-400">Audio Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Premium Audio</h3>
              <p className="mt-2 text-sm text-gray-500">Headphones & speakers</p>
            </div>

            {/* Category: Smart Home */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Innovative smart home technology and devices UK */}
                <span className="text-gray-400">Smart Home Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Smart Home</h3>
              <p className="mt-2 text-sm text-gray-500">Connected living</p>
            </div>

            {/* Category: Accessories */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Premium mobile accessories and chargers UK */}
                <span className="text-gray-400">Accessories Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Accessories</h3>
              <p className="mt-2 text-sm text-gray-500">Cables & power</p>
            </div>

            {/* Category: Gadgets */}
            <div className="group block bg-white rounded-xl shadow-sm p-6 text-center border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {/* Alt text: Cutting edge tech gadgets and innovations UK */}
                <span className="text-gray-400">Gadgets Image</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">New Tech</h3>
              <p className="mt-2 text-sm text-gray-500">Innovative gadgets</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-8">
          <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-colors">
            Shop All Electronics
          </Link>
        </section>

        {/* Trust Signals Section */}
        <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unmatched Reliability</h2>
            <p className="text-gray-600">Rest assured with guaranteed quality, <span className="font-semibold text-gray-900">Free UK Delivery</span>, and our standard <span className="font-semibold text-gray-900">14-Day Returns</span> process across the United Kingdom.</p>
        </section>
      </div>
    </div>
  );
}
