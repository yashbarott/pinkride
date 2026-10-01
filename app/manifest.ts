import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PinkRide",
    short_name: "PinkRide",
    description: "Women-focused ride service for safe, reliable travel.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffafc",
    theme_color: "#a6437a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
