import { NextResponse } from "next/server";
import products from "@/data/products.json";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const transcript = (text || "").trim();

    if (!transcript) {
      return NextResponse.json({ error: "ไม่มีข้อความจากการพูด" }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      return NextResponse.json({ error: "ยังไม่ได้ตั้งค่า N8N_WEBHOOK_URL" }, { status: 500 });
    }

    const resp = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        products,
        lang: "th",
      }),
    });

    const data = await resp.json().catch(() => ({}));

    // ถ้า n8n ส่ง action กลับมาว่าต้องการเพิ่มสินค้า ให้ resolve product จาก sku
    // Expected n8n response shape (optional):
    // {
    //   reply: string,
    //   action?: {
    //     type: "ADD_TO_CART",
    //     sku: string,
    //     size?: string,
    //     color?: string,
    //     quantity?: number
    //   }
    // }
    if (data?.action?.type === "ADD_TO_CART" && data.action.sku) {
      const product = (products as any[]).find((p) => p.sku === data.action.sku);
      if (product) {
        data.action.resolvedProduct = {
          sku: product.sku,
          name: product.name,
          price: product.price,
          image: product.image,
          size: data.action.size ?? product.sizes[0],
          color: data.action.color ?? product.colors[0],
          quantity: data.action.quantity ?? 1,
        };
      }
    }

    return NextResponse.json(data, { status: resp.ok ? 200 : resp.status });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}