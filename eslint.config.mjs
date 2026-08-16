import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off"
    }
  },
  globalIgnores([".next/**", "node_modules/**"])
]);
