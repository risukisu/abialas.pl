import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      // astro:content is a virtual module only available in Astro's build
      // pipeline. Stub it out so schema unit tests can run under plain Vitest.
      "astro:content": path.resolve(
        __dirname,
        "tests/__stubs__/astro-content.ts"
      ),
    },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    environment: "node",
  },
});
