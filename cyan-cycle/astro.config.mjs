// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3000,
    headers: {
      "Cache-Control": "max-age=0",
      "Cross-Origin-Opener-Policy": "*",
    },
    host: "0.0.0.0",
  },
});
