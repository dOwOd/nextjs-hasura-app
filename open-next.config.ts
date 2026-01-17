import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // SSGのみ使用するため、incrementalCache は不要
});
