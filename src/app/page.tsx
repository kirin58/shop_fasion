"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Shirt, Sparkles, ShoppingBag, Search, ShoppingCart } from "lucide-react";

// --- Types ---
type Product = { sku: string; name: string; category: string; price: number; stock: number; image: string; sizes?: string[]; colors?: string[]; };
type ApiResult = { transcript?: string; answer?: string; matches?: Product[]; error?: string; };

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("แตะไมค์เพื่อค้นหาชุดที่ใช่");
  const [result, setResult] = useState<ApiResult>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = "th-TH";
    rec.interimResults = false;
    rec.onstart = () => { setIsListening(true); setIsProcessing(false); setStatus("กำลังฟังคุณอยู่..."); };
    rec.onend = () => { setIsListening(false); if (!isProcessing) setStatus("แตะอีกครั้งเพื่อค้นหาใหม่"); };
    rec.onresult = async (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (!transcript.trim()) return;
      setIsProcessing(true);
      setResult({ transcript });
      try {
        const resp = await fetch("/api/voice", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: transcript }),
        });
        const data = await resp.json();
        setResult(data);
        setStatus("ค้นหาเรียบร้อยแล้ว");
      } catch (err) { setStatus("เกิดข้อผิดพลาด"); } finally { setIsProcessing(false); }
    };
    recognitionRef.current = rec;
  }, [isProcessing]);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else { setResult({}); recognitionRef.current?.start(); }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-[#2D3139] pb-24 font-sans selection:bg-indigo-100">
      {/* Soft Glow Background */}
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>

      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Shirt size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">
              AURA <span className="text-indigo-600">CLOSET</span>
            </h1>
          </div>
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ShoppingCart size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-16 relative">
        
        {/* Hero Section */}
        <section className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-widest uppercase">
            <Sparkles size={12} /> Voice-Powered Shopping
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            ค้นหาลุคที่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">บ่งบอกความเป็นคุณ</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
            ลองบอกสไตล์ที่คุณชอบ เช่น "อยากได้เดรสไปทะเล" หรือ "เสื้อยืดสีขาวมินิมอล"
          </p>
        </section>

        {/* Mic Controller - Minimalist Design */}
        <section className="flex flex-col items-center gap-6">
          <div className="relative group">
            {isListening && (
              <div className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-10"></div>
            )}
            <button 
              onClick={toggleListening} 
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isListening ? "bg-indigo-600 text-white scale-95 shadow-indigo-200" : "bg-white text-gray-700 hover:scale-105 shadow-gray-200/50"}`}
            >
              {isListening ? 
                <Square size={24} fill="currentColor" /> : 
                <Mic size={32} />
              }
            </button>
          </div>
          <span className={`text-xs font-bold tracking-[0.1em] transition-colors ${isListening ? "text-indigo-600" : "text-gray-400"}`}>
            {status}
          </span>
        </section>

        {/* Interaction Results */}
        {(result.transcript || result.answer) && (
          <section className="max-w-xl mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {result.transcript && (
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white px-6 py-3 rounded-3xl rounded-br-none text-sm shadow-xl shadow-indigo-100 font-medium">
                  "{result.transcript}"
                </div>
              </div>
            )}
            
            {result.answer && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                  <Sparkles size={18} className="text-indigo-500" />
                </div>
                <div className="bg-white border border-gray-100 p-5 rounded-3xl rounded-tl-none shadow-sm text-gray-700 text-sm leading-relaxed flex-1">
                  {result.answer}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Product Grid - Clean Minimal Cards */}
        {result.matches && result.matches.length > 0 && (
          <section className="pt-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-bold text-gray-900">สินค้าที่เราเลือกให้คุณ</h3>
              <span className="text-xs text-gray-400 font-medium">{result.matches.length} รายการ</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {result.matches.map((item) => (
                <div key={item.sku} className="group flex flex-col">
                  <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-gray-800 shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:text-white">
                      <ShoppingBag size={18} />
                    </button>
                    {item.stock < 10 && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                        <span className="text-[9px] font-bold text-red-500">เหลือเพียง {item.stock} ชิ้น</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-5 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{item.category}</span>
                    <h4 className="text-gray-800 font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-lg font-extrabold text-gray-900">฿{item.price.toLocaleString()}</p>
                      <div className="flex gap-1">
                        {item.sizes?.slice(0, 2).map(s => (
                          <span key={s} className="text-[9px] w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md font-bold">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}