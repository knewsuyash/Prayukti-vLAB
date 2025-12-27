import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
    webpack: (config) => {
        config.resolve.alias["react"] = path.dirname(require.resolve("react/package.json"));
        config.resolve.alias["react-dom"] = path.dirname(require.resolve("react-dom/package.json"));
        return config;
    },
};

export default nextConfig;
