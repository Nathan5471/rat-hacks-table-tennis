/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev({
  persist: "../.wrangler/state/v3",
});
