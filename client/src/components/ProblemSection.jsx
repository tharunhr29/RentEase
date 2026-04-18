import React from 'react';

const ProblemSection = () => {
    const challenges = [
        {
            title: "High Upfront Costs",
            desc: "Buying premium furniture and appliances requires massive initial investment that could be used elsewhere.",
            icon: "💰",
            solution: "Rent for a fraction of the cost."
        },
        {
            title: "Relocation Stress",
            desc: "Moving heavy items across cities is a logistical nightmare and often damages your expensive assets.",
            icon: "📦",
            solution: "We handle the heavy lifting."
        },
        {
            title: "Lack of Flexibility",
            desc: "Traditional ownership locks you down. Changing your lifestyle or home layout becomes an expensive chore.",
            icon: "🔄",
            solution: "Swap or return whenever you want."
        },
        {
            title: "Local Limitations",
            desc: "Finding quality rentals locally is often restricted to poor selections and unreliable local vendors.",
            icon: "📍",
            solution: "Premium catalog at your fingertips."
        },
        {
            title: "Maintenance Gaps",
            desc: "Once you buy, you're on your own. Repairs and support are often costly and slow to arrive.",
            icon: "🛠️",
            solution: "24/7 complimentary support."
        }
    ];

    return (
        <section className="bg-black text-white py-24 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-600/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="text-center mb-20">
                    <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">The Challenge</span>
                    <h2 className="text-5xl font-black mt-4 tracking-tighter">Why Ownership is Overrated.</h2>
                    <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto font-medium">
                        Living in a modern city shouldn't mean being weighed down by possessions. We've identified the hurdles that stop you from living your best life.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {challenges.map((item, index) => (
                        <div key={index} className="group relative">
                            <div className="h-full bg-white/5 border border-white/10 p-8 rounded-[2.5rem] hover:bg-white/10 transition-all duration-500 hover:-translate-y-2">
                                <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium mb-6">
                                    {item.desc}
                                </p>
                                
                                <div className="pt-6 border-t border-white/5">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-blue-500 mb-2">Our Fix</p>
                                    <p className="text-xs font-bold text-white opacity-80">{item.solution}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-sm font-bold animate-pulse">
                        <span className="text-green-500">●</span>
                        Solving urban living constraints for 5000+ members.
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;
