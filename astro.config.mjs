// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    port: 3000
  },
  integrations: [react(), sitemap(), tailwind()],
  adapter: netlify(),
  vite: {
    define: {
      'import.meta.env.ENABLE_TEST_CLEANUP': JSON.stringify(process.env.ENABLE_TEST_CLEANUP)
    }
  }
});
