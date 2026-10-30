import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — dental virtual staffing and practice support`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const mark = await readFile(join(process.cwd(), "public/brand/smileworks-mark-light.png"));
  const markSrc = `data:image/png;base64,${mark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(circle at 85% 10%, rgba(255,198,41,0.28), #111111 55%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse requires <img> */}
          <img src={markSrc} width={118} height={80} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
              Smile<span style={{ color: "#FFC629" }}>Works</span>
            </div>
            <div style={{ fontSize: 16, letterSpacing: 8, color: "rgba(255,255,255,0.7)" }}>SOLUTIONS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 8, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, maxWidth: 940 }}>
            Your Practice Deserves More Than Just&nbsp;<span style={{ color: "#FFC629" }}>Support.</span>
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.75)" }}>
            Dedicated remote professionals for dental practices.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
