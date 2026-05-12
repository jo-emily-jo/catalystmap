import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "CatalystMap — Map the supply chain of major catalyst companies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 64,
          fontWeight: 500,
          color: "#4F46E5",
          marginBottom: 16,
        }}
      >
        CatalystMap
      </div>
      <div
        style={{
          fontSize: 24,
          color: "#525252",
          maxWidth: 700,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Map the supply chain of major catalyst companies.
      </div>
    </div>,
    { ...size }
  );
}
