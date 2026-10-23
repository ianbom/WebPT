import { ImageResponse } from "next/og";
export const alt = "PT Liftco Indo Perkasa - Solusi Material Handling";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#103178", color: "white", padding: "70px", borderBottom: "18px solid #EA0500" }}><div style={{ display: "flex", fontSize: 30 }}>PT LIFTCO INDO PERKASA</div><div style={{ display: "flex", fontSize: 68, fontWeight: 700, maxWidth: 1000 }}>Solusi Terpercaya untuk Material Handling Anda</div><div style={{ display: "flex", fontSize: 24 }}>Sales · Rental · Service · Spare Part · Trade In</div></div>, size);
}
