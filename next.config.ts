import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // A couple of company logos in public/Company Logos are SVGs. These are
    // trusted static assets checked into the repo, not user uploads, so the
    // default XSS precaution against SVGs doesn't apply -- still pairing it
    // with Next's recommended CSP/content-disposition mitigation.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
