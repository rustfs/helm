import { marked, Renderer } from "marked";

const README_URL =
  "https://raw.githubusercontent.com/rustfs/helm/main/README.md";
const README_TIMEOUT_MS = 5000;
const CACHE_TTL = 300;
const SECURITY_HEADERS = {
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'none'",
    "connect-src 'self'",
    "font-src 'self'",
    "form-action 'none'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
    "img-src 'self' data: https:",
    "object-src 'none'",
    "script-src 'self'",
    "style-src 'self'",
  ].join("; "),
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const markdownRenderer = new Renderer();
markdownRenderer.html = (token) =>
  escapeHtml(typeof token === "string" ? token : token.text);

const productNavigation = [
  ["Multiple Protocol Access", "/product/multiple-protocol-access", "Native S3, WebDAV, Swift, FTP(s), and MCP access."],
  ["Data Management", "/product/data-management", "Buckets, lifecycle, Object Lock, versioning, and S3 Tables."],
  ["High Availability & Scale", "/product/high-availability-scale", "Distributed topology, Erasure Coding, and self-healing."],
  ["Security & Compliance", "/product/security-compliance", "Identity, OIDC, mTLS, encryption, KMS, and audit."],
  ["Operational & Observability", "/product/operational-observability", "Cluster management, OTEL signals, and rc operations."],
];

const resourceNavigation = [
  ["EC Calculator", "/erasure-code-calculator", "Plan durable and storage-efficient Erasure Coding configurations."],
  ["Documentation", "/docs", "Deploy, configure, and manage RustFS."],
  ["Blog", "/blog", "Production guidance, technical deep dives, and project updates."],
];

function absoluteUrl(path) {
  return `https://rustfs.com${path}`;
}

function renderNavigationMenu(label, items) {
  const links = items
    .map(
      ([title, path, description]) => `<a class="nav-menu-item" href="${absoluteUrl(path)}">
        <strong>${title}</strong>
        <span>${description}</span>
      </a>`,
    )
    .join("");

  return `<details class="nav-menu">
    <summary>${label}<span aria-hidden="true">⌄</span></summary>
    <div class="nav-menu-panel">${links}</div>
  </details>`;
}

function renderMobileLinks(title, items) {
  return `<div class="mobile-nav-section">
    <p>${title}</p>
    ${items.map(([label, path]) => `<a href="${absoluteUrl(path)}">${label}</a>`).join("")}
  </div>`;
}

function renderHeader() {
  const primaryLinks = [
    ["Integration", "/integration"],
    ["Download", "/download"],
    ["Pricing", "/pricing"],
    ["Contact us", "/contact-us"],
  ];

  return `<header class="site-header">
    <div class="announcement" data-announcement>
      <a href="${absoluteUrl("/download/server")}">
        <span class="announcement-badge">New</span>
        <span>RustFS 1.0 Beta is available for production-oriented testing.</span>
        <strong>Explore the release <span aria-hidden="true">→</span></strong>
      </a>
      <button type="button" data-dismiss-announcement aria-label="Dismiss announcement">×</button>
    </div>
    <div class="nav-wrap">
      <nav class="nav-bar" aria-label="Main navigation">
        <div class="nav-start">
          <a class="brand" href="https://rustfs.com/" aria-label="RustFS homepage">
            <img src="/rustfs.logo.svg" alt="RustFS" width="118" height="20">
          </a>
          <div class="desktop-nav">
            ${renderNavigationMenu("Product", productNavigation)}
            ${renderNavigationMenu("Resources", resourceNavigation)}
            ${primaryLinks.map(([label, path]) => `<a href="${absoluteUrl(path)}">${label}</a>`).join("")}
          </div>
        </div>
        <div class="nav-actions">
          <a class="github-link" href="https://github.com/rustfs/rustfs" target="_blank" rel="noopener noreferrer" aria-label="RustFS on GitHub">
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8Z"/></svg>
            <span>Stars on GitHub</span>
          </a>
          <a class="icon-link" href="https://x.com/rustfsofficial" target="_blank" rel="noopener noreferrer" aria-label="RustFS on X">𝕏</a>
          <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch color theme"><span aria-hidden="true">☾</span></button>
          <details class="mobile-menu">
            <summary aria-label="Toggle navigation"><span></span><span></span><span></span></summary>
            <div class="mobile-menu-panel">
              ${renderMobileLinks("Product", productNavigation)}
              ${renderMobileLinks("Resources", resourceNavigation)}
              ${renderMobileLinks("Links", primaryLinks)}
              <div class="mobile-social-links">
                <a href="https://github.com/rustfs/rustfs">GitHub</a>
                <a href="https://x.com/rustfsofficial">X / Twitter</a>
              </div>
            </div>
          </details>
        </div>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="site-footer">
    <div class="footer-inner">
      <div>
        <img src="/rustfs.logo.svg" alt="RustFS" width="118" height="20">
        <p>High-performance, S3-compatible object storage built in Rust.</p>
      </div>
      <div class="footer-links">
        <a href="https://rustfs.com/download">Download</a>
        <a href="https://rustfs.com/docs">Documentation</a>
        <a href="https://rustfs.com/blog">Blog</a>
        <a href="https://rustfs.com/contact-us">Contact us</a>
      </div>
      <p class="copyright">© ${new Date().getUTCFullYear()} RustFS. All rights reserved.</p>
    </div>
  </footer>`;
}

async function fetchReadmeMarkdown(env, requestUrl) {
  try {
    const remoteResponse = await fetch(README_URL, {
      headers: {
        Accept: "text/markdown,text/plain;q=0.9,*/*;q=0.8",
        "User-Agent": "rustfs-helm-worker",
      },
      signal: AbortSignal.timeout(README_TIMEOUT_MS),
    });

    if (remoteResponse.ok) {
      return remoteResponse.text();
    }
  } catch {
    // Fall back to the deployed README asset if GitHub is unavailable.
  }

  const localResponse = await env.ASSETS.fetch(new URL("/README.md", requestUrl));
  if (localResponse.ok) {
    return localResponse.text();
  }

  throw new Error("Failed to load the Helm chart documentation");
}

function renderPage(markdownHtml, host) {
  const repositoryUrl = "https://github.com/rustfs/helm";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Install and configure RustFS on Kubernetes with the official Helm chart.">
  <meta name="theme-color" content="#ffffff">
  <title>RustFS Helm Charts</title>
  <script src="/site.js"></script>
  <link rel="stylesheet" href="/site.css">
</head>
<body>
  <a class="skip-link" href="#documentation">Skip to documentation</a>
  ${renderHeader()}
  <main>
    <section class="hero">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow"><span>Kubernetes</span> Cloud-native deployment</p>
          <h1>Deploy RustFS on Kubernetes with Helm</h1>
          <p class="hero-description">Install standalone or distributed RustFS clusters with a chart designed for a clear path from local evaluation to production object storage.</p>
          <div class="hero-actions">
            <a class="button button-primary" href="#documentation">View installation guide <span aria-hidden="true">↓</span></a>
            <a class="button button-secondary" href="${repositoryUrl}" target="_blank" rel="noopener noreferrer">View on GitHub <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div class="install-card">
          <div class="install-card-header"><span>Quick install</span><span class="status-dot">Helm 3</span></div>
          <pre><code>helm repo add rustfs https://${host}
helm repo update
helm install rustfs rustfs/rustfs \
  --namespace rustfs --create-namespace</code></pre>
          <div class="install-card-footer"><a href="/index.yaml">Repository index</a><span>•</span><span>Helm 3</span></div>
        </div>
      </div>
    </section>
    <section class="documentation-section" id="documentation">
      <div class="section-heading">
        <p class="eyebrow">Deployment guide</p>
        <h2>RustFS chart documentation</h2>
        <p>Deployment modes, configuration parameters, ingress, TLS, and operational guidance from the repository README.</p>
      </div>
      <article class="docs-content">${markdownHtml}</article>
    </section>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response("ok", { status: 200 });
    }

    if (url.pathname !== "/" && url.pathname !== "/index.html") {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const cache = caches.default;
    const cacheKey = new Request(new URL(url.pathname, url.origin), {
      method: "GET",
    });
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    try {
      const markdown = await fetchReadmeMarkdown(env, url);
      const response = new Response(
        renderPage(marked.parse(markdown, { renderer: markdownRenderer }), url.host),
        {
        headers: {
          ...SECURITY_HEADERS,
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": `public, max-age=${CACHE_TTL}`,
        },
        },
      );

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch {
      return new Response("Unable to load the RustFS Helm documentation.", {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  },
};
