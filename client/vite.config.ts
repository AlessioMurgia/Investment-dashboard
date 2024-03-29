import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const cherryPickedKeys = [
  "REACT_APP_GOOGLE_CLIENT_ID"
];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const processEnv = {};
  cherryPickedKeys.forEach(key => processEnv[key] = env[key]);

  return {
    define: {
      'process.env': processEnv
    },
    plugins: [react()],
  }
})
