import React from 'react';
import ProblemSection from '../components/ProblemSection';
import Footer from '../components/Footer';

function About() {
  return (
    <div className="bg-white">
      {/* 🏛️ Heritage Header */}
      <section className="py-24 px-8 border-b border-gray-100">
        {/* ... header content ... */}
      </section>

      {/* 🚀 Technical Standards (NFR) */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
                <div className="max-w-xl">
                    <span className="text-blue-600 font-bold uppercase tracking-[0.3em] text-[10px]">Quality Benchmarks</span>
                    <h2 className="text-5xl font-black tracking-tighter mt-4">Built for Excellence.</h2>
                </div>
                <p className="text-gray-500 font-medium text-lg max-w-sm">
                    We don't just build features; we build standards. Our platform is engineered for speed, safety, and scale.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { title: "Performance", spec: "< 3s Load Time", detail: "Optimized for lightning-fast browsing.", icon: "⚡" },
                    { title: "Security", spec: "Bank-Grade", detail: "Secure login & payment readiness.", icon: "🔒" },
                    { title: "Reliability", spec: "99.9% Sync", detail: "Real-time accurate inventory tracking.", icon: "📈" },
                    { title: "Usability", spec: "Mobile-First", detail: "Seamless UI across all devices.", icon: "📱" },
                    { title: "Scalability", spec: "Multi-City", detail: "Engineered for rapid urban expansion.", icon: "🌍" }
                ].map((nfr, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-blue-500 transition-colors duration-500">
                        <div className="text-2xl mb-4">{nfr.icon}</div>
                        <h4 className="font-bold text-gray-900 mb-1">{nfr.title}</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3">{nfr.spec}</p>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">{nfr.detail}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 🍱 Core Philosophy */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div className="relative">
                <img 
                    src="https://images.unsplash.com/photo-1524758631624-e2822e304c36" 
                    alt="Modern Interior" 
                    className="rounded-[3rem] shadow-2xl brightness-90 hover:brightness-100 transition duration-700"
                />
                <div className="absolute -bottom-10 -right-10 bg-black text-white p-12 rounded-[2.5rem] hidden lg:block shadow-2xl">
                    <p className="text-4xl font-black mb-2">5k+</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">Active Subscriptions</p>
                </div>
            </div>
            <div>
                <h2 className="text-4xl font-black tracking-tight mb-8">Mission: Ownership Without Burden.</h2>
                <div className="space-y-8">
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">🚀</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Fluid Living</h3>
                            <p className="text-gray-500 text-sm font-medium">Relocate across 20+ cities without ever packing a truck. We move with you.</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">💎</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Financial Freedom</h3>
                            <p className="text-gray-500 text-sm font-medium">Stop locking your capital in depreciating assets. Invest your money where it grows.</p>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl">🧼</div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Zero Maintenance</h3>
                            <p className="text-gray-500 text-sm font-medium">Free servicing, cleaning, and repairs. If it's not perfect, we replace it.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 🎯 Primary Objectives */}
      <section className="py-24 px-8 bg-black text-white rounded-[4rem] mx-8 mb-24">
        {/* ... existing primary objectives grid ... */}
      </section>

      {/* 🌿 Secondary Objectives: Sustainability & Ecosystem */}
      <section className="py-24 px-8 mb-24">
        <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div>
                    <span className="text-green-600 font-bold uppercase tracking-[0.3em] text-[10px]">The Bigger Picture</span>
                    <h2 className="text-5xl font-black tracking-tighter mt-4 mb-8">Circular Living.</h2>
                    <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
                        Beyond convenience, RentEase is a commitment to the planet. We believe in a scalable rental ecosystem 
                        that reduces the environmental footprint of urban consumption.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Reduced Waste</h4>
                            <p className="text-sm text-gray-500 font-medium">By curbing unnecessary purchases, we keep furniture out of landfills and in homes.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Sustainable Choice</h4>
                            <p className="text-sm text-gray-500 font-medium">Promoting a circular economy where high-quality items are refurbished and reused.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Seamless Moves</h4>
                            <p className="text-sm text-gray-500 font-medium">Easy relocation support means you never have to discard items when you move.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-2">Scalable Tech</h4>
                            <p className="text-sm text-gray-500 font-medium">Building a technology-first ecosystem that makes renting as easy as shopping.</p>
                        </div>
                    </div>
                </div>
                <div className="relative group">
                    <img 
                        src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09" 
                        alt="Sustainable Living" 
                        className="rounded-[3rem] shadow-2xl brightness-90 group-hover:brightness-100 transition duration-700"
                    />
                    <div className="absolute inset-0 border-2 border-green-600/20 rounded-[3rem] -m-4 group-hover:m-0 transition-all duration-700"></div>
                </div>
            </div>
        </div>
      </section>

      {/* 🚩 The Friction We Eliminate */}
      <ProblemSection />

      {/* 🛠️ Platform Scope */}
      <section className="py-24 px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20">
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-8">In-Scope: Our Core Focus.</h2>
                    <div className="space-y-4">
                        {[
                            "Web-based responsive platform for all devices",
                            "Curated catalog of premium furniture & appliances",
                            "Transparent monthly rental and security plans",
                            "Scheduled delivery and professional pickup"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-gray-600 font-medium">
                                <span className="text-green-500 font-bold">✓</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight mb-8 text-gray-300">Out of Scope.</h2>
                    <div className="space-y-4">
                        {[
                            "Native mobile applications (iOS/Android)",
                            "International or cross-border rental services",
                            "Advanced AI-based dynamic pricing models",
                            "Second-hand resale or user-to-user marketplace"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-gray-300 font-medium italic">
                                <span className="text-gray-200">✕</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 🤝 Final Word */}
      <section className="py-24 px-8 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-black mb-6">Ready to simplify?</h2>
            <p className="text-gray-500 font-medium mb-10 text-lg">
                Join thousands of students and professionals who have swapped "Buying" for "Living". 
                Welcome to the future of home.
            </p>
            <div className="flex gap-4 justify-center">
                <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold hover:bg-gray-800 transition shadow-xl shadow-gray-200">Start Browsing</button>
                <button className="bg-white border border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition">View Plans</button>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;