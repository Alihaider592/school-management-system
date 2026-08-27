import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Moving tailwindcss() to the front ensures it builds the CSS injection graph before React processes components
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
  },
});