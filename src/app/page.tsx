"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Shirt, Sparkles } from "lucide-react";
import { useCart } from "./context/CartContext";
import CartButton from "./components/CartButton";

// --- Types ---
type Product = { sku: string; name: string; category: string; price: number; stock: number; image: string; sizes?: string[]; colors?: string[]; };
type ApiResult = { transcript?: string; answer?: string; matches?: Product[]; error?: string; };

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState("แตะไมค์เพื่อค้นหาชุดที่ใช่");
  const [result, setResult] = useState<ApiResult>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { addItem, openCart } = useCart();

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

        // ถ้า n8n ส่ง ADD_TO_CART action กลับมา
        if (data?.action?.type === "ADD_TO_CART" && data.action.resolvedProduct) {
          addItem(data.action.resolvedProduct);
          openCart();
        }
      } catch (err) { setStatus("เกิดข้อผิดพลาด"); } finally { setIsProcessing(false); }
    };
    recognitionRef.current = rec;
  }, [isProcessing, addItem, openCart]);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else { setResult({}); recognitionRef.current?.start(); }
  };

  const handleAddToCart = (item: Product) => {
    addItem({
      sku: item.sku,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.sizes?.[0],
      color: item.colors?.[0],
    });
    openCart();
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#3A3532] pb-24 font-sans selection:bg-stone-200">
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-stone-100/80 to-transparent pointer-events-none"></div>

      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-stone-600 p-2 rounded-xl text-white shadow-sm">
              <Shirt size={20} strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-medium tracking-wide text-stone-800">
              Petit Closet
            </h1>
          </div>
          {/* ✅ ใช้ CartButton จริง แทน static button */}
          <CartButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-16 space-y-16 relative">

        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium tracking-widest uppercase">
            <Sparkles size={12} /> Voice-Powered Shopping
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-stone-800 tracking-tight leading-tight">
            ค้นหาลุคที่ <br className="md:hidden" />
            <span className="text-stone-500 font-normal">บ่งบอกความเป็นคุณ</span>
          </h2>
          <p className="text-stone-500/80 text-sm max-w-md mx-auto leading-relaxed">
            ลองบอกสไตล์ที่คุณชอบ เช่น "อยากได้เดรสไปทะเล" หรือ "เสื้อยืดสีขาวมินิมอล"
          </p>
        </section>

        {/* Mic Controller */}
        <section className="flex flex-col items-center gap-8">
          <div className="relative group">
            {isListening && (
              <div className="absolute inset-0 bg-stone-300 rounded-full animate-ping opacity-30"></div>
            )}
            <button
              onClick={toggleListening}
              className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${isListening ? "bg-stone-700 text-white scale-95 shadow-stone-200" : "bg-white text-stone-600 hover:scale-105 shadow-stone-100/50"}`}
            >
              {isListening ?
                <Square size={24} fill="currentColor" strokeWidth={1.5} /> :
                <Mic size={32} strokeWidth={1.5} />
              }
            </button>
          </div>
          <span className={`text-xs font-medium tracking-[0.15em] transition-colors uppercase ${isListening ? "text-stone-700" : "text-stone-400"}`}>
            {status}
          </span>
        </section>

        {/* Interaction Results */}
        {(result.transcript || result.answer) && (
          <section className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700 pt-4">
            {result.transcript && (
              <div className="flex justify-end">
                <div className="bg-stone-700 text-stone-50 px-6 py-3.5 rounded-2xl rounded-br-none text-sm shadow-md font-light tracking-wide">
                  "{result.transcript}"
                </div>
              </div>
            )}
            {result.answer && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/50">
                  <Sparkles size={16} className="text-stone-500" />
                </div>
                <div className="bg-white border border-stone-100 p-5 rounded-2xl rounded-tl-none shadow-sm text-stone-600 text-sm leading-relaxed flex-1 font-light">
                  {result.answer}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Product Grid */}
        {result.matches && result.matches.length > 0 && (
          <section className="pt-12 space-y-8">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="font-medium text-stone-800 tracking-wide">สินค้าที่เราเลือกให้คุณ</h3>
              <span className="text-xs text-stone-400 font-light">{result.matches.length} Items</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {result.matches.map((item) => (
                <div key={item.sku} className="group flex flex-col">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-50 transition-all duration-700 group-hover:shadow-xl group-hover:shadow-stone-200/40">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {item.stock < 10 && (
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-[10px] font-medium text-stone-500 tracking-wider">Only {item.stock} left</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 space-y-1.5 px-1">
                    <span className="text-[10px] font-medium text-stone-400 uppercase tracking-widest">{item.category}</span>
                    <h4 className="text-stone-700 font-medium text-sm line-clamp-1">{item.name}</h4>
                    <div className="flex justify-between items-center pt-1">
                      <p className="text-base font-semibold text-stone-800">฿{item.price.toLocaleString()}</p>
                      <div className="flex gap-1.5">
                        {item.sizes?.slice(0, 2).map(s => (
                          <span key={s} className="text-[10px] w-6 h-6 flex items-center justify-center bg-stone-100 text-stone-500 rounded-full font-medium">{s}</span>
                        ))}
                      </div>
                    </div>
                    {/* ✅ ปุ่มเพิ่มตะกร้าด้านล่างการ์ด (มองเห็นตลอดเวลา) */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full mt-2 py-2 rounded-lg border border-stone-200 text-stone-600 text-xs font-medium hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {item.stock === 0 ? "สินค้าหมด" : "+ เพิ่มลงตะกร้า"}
                    </button>
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