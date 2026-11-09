import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse', 'mammoth'],
  // lib/data is read via process.cwd() paths, which tracing can miss
  outputFileTracingIncludes: {
    '/api/agents/labor': ['./lib/data/**/*'],
    '/api/labor-rights': ['./lib/data/**/*'],
  },
};

export default nextConfig;
