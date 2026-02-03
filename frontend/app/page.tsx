import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Twitter, Facebook, Linkedin, Instagram, BookOpen, FlaskConical, Microscope, Layers } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header with Integrated Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* Banner Section - Enhanced with Interactive 3D Spline Scene */}
        <section className="relative h-[600px] md:h-[700px] bg-slate-900 flex items-center overflow-hidden">
          {/* Spotlight for premium focus */}
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20 opacity-50"
            fill="white"
          />

          {/* Premium White Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>

          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent z-10"></div>

          <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-white">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold mb-6 border border-orange-500/30 animate-pulse">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                SYSTEM ACTIVE: 3D INTERACTIVE MODE
              </div>
              <h1 className="text-6xl md:text-8xl font-black mb-6 drop-shadow-2xl leading-tight tracking-tighter">
                Prayukti <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">vLAB</span>
              </h1>
              <p className="text-xl md:text-3xl mb-10 text-slate-300 font-light max-w-xl leading-relaxed">
                Experience the next dimension of <span className="text-white font-bold underline decoration-orange-500 underline-offset-8">Digital Logic & Design</span>.
                Interact with precision modules in real-time.
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <Link href="/login">
                  <Button size="lg" className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-black px-12 py-10 text-2xl shadow-[0_0_40px_rgba(211,47,47,0.3)] border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all rounded-3xl">
                    Enter Virtual Lab
                  </Button>
                </Link>
                <div className="flex flex-col justify-center">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">+2.4k Students Active</p>
                  <div className="flex -space-x-3 items-center mt-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive 3D Spline Scene Area */}
            <div className="relative w-full md:w-[600px] h-[400px] md:h-[600px] flex items-center justify-center group">
              {/* Specialized Glow for Orange highlights */}
              <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-[120px] group-hover:bg-orange-500/10 transition-colors duration-1000"></div>

              <div className="w-full h-full relative z-30">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>

              {/* Floating UI elements overlay */}
              <div className="absolute top-10 right-10 w-32 h-32 border border-orange-500/20 rounded-3xl backdrop-blur-md z-40 flex items-center justify-center flex-col gap-2 p-4 bg-orange-500/5 animate-in fade-in zoom-in duration-1000">
                <div className="w-full h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                <div className="w-2/3 h-1.5 bg-white/20 rounded-full self-start"></div>
                <div className="w-full h-1.5 bg-white/10 rounded-full"></div>
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter mt-1">Core Logic: ON</span>
              </div>
            </div>
          </div>
        </section>

        {/* Available Labs/Subjects Grid */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Subtle Grid Background for content area */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
              <span className="text-sm font-black text-[#f57f17] uppercase tracking-[0.3em] mb-4">Academic Modules</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tighter">
                Explore Our <span className="text-[#d32f2f]">Virtual Ecosystem</span>
              </h2>
              <div className="w-20 h-1.5 bg-[#f57f17] rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Computer Networks */}
              <div className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-[#d32f2f] transition-all duration-500 shadow-xl shadow-slate-200/50 hover:shadow-red-100 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-red-100 text-[#d32f2f] rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-[#d32f2f] group-hover:text-white transition-colors">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 relative z-10">Computer Networks</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10 mb-6">
                  Simulate complex topologies, packet flows, and protocol behaviors including CSMA/CD, Token Ring, and OSI Layer interactions.
                </p>
                <Link href="/dashboard/cn" className="text-sm font-black text-[#d32f2f] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Enter Subject <span>→</span>
                </Link>
              </div>

              {/* Digital Logic & Design */}
              <div className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-orange-500 transition-all duration-500 shadow-xl shadow-slate-200/50 hover:shadow-orange-100 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <span className="text-2xl">🧠</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 relative z-10">Digital Logic & Design</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10 mb-6">
                  Build and test logic circuits, master flip-flops, and visualize gate-level operations with real-time waveform analysis.
                </p>
                <Link href="/dashboard/dld" className="text-sm font-black text-orange-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Enter Subject <span>→</span>
                </Link>
              </div>

              {/* OOPS (coming soon style) */}
              <div className="group bg-white p-8 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 transition-all duration-500 shadow-xl shadow-slate-200/50 hover:shadow-indigo-100 hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-4 relative z-10">Object Oriented Programming</h3>
                <p className="text-slate-600 font-medium leading-relaxed relative z-10 mb-6">
                  Visualize memory allocation, inheritance hierarchies, and polymorphism through interactive code simulation.
                </p>
                <Link href="/dashboard/oops" className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all relative z-10">
                  Enter Subject <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Mission / About Us Section */}
        <section className="py-24 bg-[#fafafa] border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                <div className="relative z-10 space-y-8">
                  <div className="inline-block bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-xs font-black text-[#d32f2f] uppercase tracking-widest">
                    Platform Mission
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tighter">
                    Empowering Next-Gen <br />
                    <span className="text-[#f57f17]">Technical Leaders</span>
                  </h2>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed">
                    Prayukti vLAB is more than just a simulation tool. It is a digital bridge between theoretical concepts and practical mastery, designed specifically for the students of MMMUT.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-3xl font-black text-[#d32f2f]">24/7</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Remote Access</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-3xl font-black text-[#d32f2f]">100%</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Real-time Feedback</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold">✓</div>
                  <h4 className="font-black text-slate-800">Govt. Certified</h4>
                  <p className="text-xs text-slate-500 font-medium font-mono leading-relaxed">Established under U.P. Act No. 22 of 2013 standards.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 space-y-4 mt-8 md:mt-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold">⚡</div>
                  <h4 className="font-black text-slate-800">Frictionless UI</h4>
                  <p className="text-xs text-slate-500 font-medium font-mono leading-relaxed">Optimized for low-latency interactive learn-by-doing.</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-50 space-y-4 md:-mt-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 text-xl font-bold">🎯</div>
                  <h4 className="font-black text-slate-800">Outcome Based</h4>
                  <p className="text-xs text-slate-500 font-medium font-mono leading-relaxed">Curriculum aligned modules for industrial readiness.</p>
                </div>
                <div className="bg-[#d32f2f] p-8 rounded-3xl shadow-lg shadow-red-200 space-y-4 mt-4 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-bold">★</div>
                  <h4 className="font-black">Open Source</h4>
                  <p className="text-xs text-red-100 font-medium font-mono leading-relaxed">Community driven excellence for academic growth.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / About Section */}
        <section className="py-16 bg-white relative -mt-10 z-30 container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-[#f57f17] grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-4 hover:bg-orange-50 rounded-lg transition-colors group">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-[#d32f2f] group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-bold text-gray-800 mb-1">10+</h3>
              <p className="text-gray-500 font-medium uppercase text-sm tracking-wider">Subjects</p>
            </div>
            <div className="p-4 hover:bg-orange-50 rounded-lg transition-colors group">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 text-[#f57f17] group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-bold text-gray-800 mb-1">25+</h3>
              <p className="text-gray-500 font-medium uppercase text-sm tracking-wider">Labs</p>
            </div>
            <div className="p-4 hover:bg-orange-50 rounded-lg transition-colors group">
              <Microscope className="w-12 h-12 mx-auto mb-4 text-[#d32f2f] group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-bold text-gray-800 mb-1">100+</h3>
              <p className="text-gray-500 font-medium uppercase text-sm tracking-wider">Experiments</p>
            </div>
            <div className="p-4 hover:bg-orange-50 rounded-lg transition-colors group">
              <Layers className="w-12 h-12 mx-auto mb-4 text-[#f57f17] group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-bold text-gray-800 mb-1">5+</h3>
              <p className="text-gray-500 font-medium uppercase text-sm tracking-wider">Engineering Domains</p>
            </div>
          </div>
        </section>

        {/* Notices & Events Grid */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Events Column */}
            <div className="md:col-span-3 bg-white shadow-sm border rounded-t-lg overflow-hidden">
              <div className="bg-[#f57f17] text-white px-4 py-2 font-bold uppercase text-sm">
                Recent Events
              </div>
              <div className="p-4 space-y-4 h-[300px] overflow-y-auto">
                <div className="border-b pb-2">
                  <p className="text-xs text-[#d32f2f] font-bold">DEC 24, 2025</p>
                  <p className="text-sm hover:underline cursor-pointer">International Conference on Green Technologies</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-xs text-[#d32f2f] font-bold">DEC 20, 2025</p>
                  <p className="text-sm hover:underline cursor-pointer">Alumni Meet 2025 Registration Open</p>
                </div>
              </div>
            </div>

            {/* Latest News Column (Center) */}
            <div className="md:col-span-6 bg-white shadow-sm border rounded-lg overflow-hidden">
              <div className="bg-[#f57f17] text-white px-4 py-2 font-bold uppercase text-sm flex justify-between">
                <span>Latest News</span>
                <span className="text-xs bg-white text-[#f57f17] px-2 py-0.5 rounded cursor-pointer">View All</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex gap-3 items-start border-b pb-3">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">NEW</span>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Registration for Odd Semester 2025-26 has started. Students are required to complete the process by 30th Dec.
                  </p>
                </div>
                <div className="flex gap-3 items-start border-b pb-3">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-bold">IMP</span>
                  <p className="text-sm leading-relaxed text-gray-700">
                    Schedule for End Semester Examination (DLD) - Practical & Viva Voce announced.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded border border-orange-100">
                  <h3 className="font-bold text-[#d32f2f] mb-2">Vice Chancellor&apos;s Message</h3>
                  <p className="text-xs text-gray-600 italic">&quot;MMMUT is committed to providing world-class technical education...&quot;</p>
                </div>
              </div>
            </div>

            {/* Quick Links / Student Zone */}
            <div className="md:col-span-3 space-y-4">
              <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                <div className="bg-[#f57f17] text-white px-4 py-2 font-bold uppercase text-sm">
                  Student Zone
                </div>
                <div className="p-2 grid grid-cols-2 gap-2">
                  <div className="text-center p-2 hover:bg-gray-50 cursor-pointer">
                    <span className="block text-2xl mb-1">🎓</span>
                    <span className="text-xs font-semibold">Results</span>
                  </div>
                  <div className="text-center p-2 hover:bg-gray-50 cursor-pointer">
                    <span className="block text-2xl mb-1">📅</span>
                    <span className="text-xs font-semibold">Timetable</span>
                  </div>
                  <div className="text-center p-2 hover:bg-gray-50 cursor-pointer">
                    <span className="block text-2xl mb-1">💸</span>
                    <span className="text-xs font-semibold">Fees</span>
                  </div>
                  <div className="text-center p-2 hover:bg-gray-50 cursor-pointer">
                    <span className="block text-2xl mb-1">📚</span>
                    <span className="text-xs font-semibold">Syllabus</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* About Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase inline-block border-b-4 border-[#f57f17] pb-1">Welcome to MMMUT</h2>
            <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed mt-4">
              Madan Mohan Malaviya University of Technology, Gorakhpur has been established in year 2013 by the Government of Uttar Pradesh in the form of a non-affiliating, teaching and research University after reconstituting the Madan Mohan Malaviya Engineering College, Gorakhpur which was established in 1962.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#212121] text-gray-300 py-12 text-sm border-t-4 border-[#d32f2f]">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-[#f57f17] font-bold mb-4 uppercase">Contact Us</h3>
            <p className="mb-2">Madan Mohan Malaviya University of Technology, Gorakhpur</p>
            <p>Phone: +91-551-2273958</p>
            <p>Email: patovc@mmmut.ac.in</p>
            <div className="flex gap-4 mt-4">
              {/* Social Icons */}
              <a href="#" className="hover:text-[#f57f17] transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-[#f57f17] transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-[#f57f17] transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-[#f57f17] transition-colors"><Instagram size={20} /></a>
            </div>
          </div>
          <div>
            <h3 className="text-[#f57f17] font-bold mb-4 uppercase">Important Links</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Tender</li>
              <li className="hover:text-white cursor-pointer">NIRF</li>
              <li className="hover:text-white cursor-pointer">Right to Information</li>
              <li className="hover:text-white cursor-pointer">Grievance Portal</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#f57f17] font-bold mb-4 uppercase">Quick Links</h3>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Webmail</li>
              <li className="hover:text-white cursor-pointer">Alumni Association</li>
              <li className="hover:text-white cursor-pointer">Training & Placement</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#f57f17] font-bold mb-4 uppercase">Locate Us</h3>
            <div className="bg-gray-700 h-32 w-full flex items-center justify-center text-xs">
              [Map Placeholder]
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 text-center text-xs text-gray-500">
          © 2025 Madan Mohan Malaviya University of Technology. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
