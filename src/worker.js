import { marked } from 'marked';

const README_URL = 'https://raw.githubusercontent.com/rustfs/helm/main/README.md';
const README_TIMEOUT_MS = 5000;

async function fetchReadmeMarkdown(env, requestUrl) {
  try {
    const remoteResponse = await fetch(README_URL, {
      headers: {
        accept: 'text/markdown,text/plain;q=0.9,*/*;q=0.8',
        'user-agent': 'rustfs-helm-worker'
      },
      signal: AbortSignal.timeout(README_TIMEOUT_MS)
    });

    if (remoteResponse.ok) {
      return remoteResponse.text();
    }
  } catch {
    // Fall back to the deployed README asset if GitHub is slow or unreachable.
  }

  const localReadmeUrl = new URL('/README.md', requestUrl);
  const localResponse = await env.ASSETS.fetch(localReadmeUrl);

  if (localResponse.ok) {
    return localResponse.text();
  }

  throw new Error('Failed to fetch README.md from GitHub or local assets');
}

function renderQuickInstall(host) {
  return `<section class="quick-install" aria-labelledby="quick-install-title">
    <div>
      <h2 id="quick-install-title">Quick Install</h2>
      <p>Add this Helm repository and refresh your local chart index:</p>
    </div>
    <pre><code>helm repo add rustfs https://${host}
helm repo update</code></pre>
    <p class="quick-install-links"><a href="/index.yaml">index.yaml</a> | <a href="https://github.com/rustfs/helm">GitHub Repository</a></p>
  </section>`;
}

function insertQuickInstall(markdownHtml, host) {
  const quickInstall = renderQuickInstall(host);
  const helmModeHeading = '<h1>RustFS Helm Mode</h1>';

  if (markdownHtml.includes(helmModeHeading)) {
    return markdownHtml.replace(helmModeHeading, `${quickInstall}\n${helmModeHeading}`);
  }

  return `${quickInstall}\n${markdownHtml}`;
}

function renderPage(markdownHtml, host) {
  const contentHtml = insertQuickInstall(markdownHtml, host);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RustFS Helm Charts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css" media="(prefers-color-scheme: dark)">
  <style>
    :root {
      color-scheme: light;
      --page-bg: #f6f8fa;
      --content-bg: #ffffff;
      --panel-bg: #f6f8fa;
      --panel-accent: #ecfdf3;
      --border: #d0d7de;
      --border-strong: #8c959f;
      --text: #24292f;
      --muted: #57606a;
      --link: #0969da;
      --code-bg: #f6f8fa;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        color-scheme: dark;
        --page-bg: #0d1117;
        --content-bg: #161b22;
        --panel-bg: #161b22;
        --panel-accent: #12261e;
        --border: #30363d;
        --border-strong: #6e7681;
        --text: #e6edf3;
        --muted: #8b949e;
        --link: #58a6ff;
        --code-bg: #1c2128;
      }

      body {
        background: var(--page-bg);
      }

      .page-shell {
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
      }

      .markdown-body {
        color-scheme: dark;
        color: var(--text);
        background: var(--content-bg);
      }

      .markdown-body h1,
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4,
      .markdown-body h5,
      .markdown-body h6 {
        color: var(--text);
        border-bottom-color: var(--border);
      }

      .markdown-body code {
        background: var(--code-bg);
      }

      .markdown-body pre {
        background: var(--code-bg);
        border-color: var(--border);
      }

      .markdown-body table tr {
        background: var(--content-bg);
        border-color: var(--border);
      }

      .markdown-body table tr:nth-child(2n) {
        background: var(--panel-bg);
      }

      .markdown-body table th,
      .markdown-body table td {
        border-color: var(--border);
      }

      .markdown-body blockquote {
        color: var(--muted);
        border-left-color: var(--border-strong);
      }

      .markdown-body hr {
        background-color: var(--border);
      }

      .quick-install {
        background: linear-gradient(180deg, var(--panel-accent), var(--panel-bg));
        border-color: var(--border);
        border-left-color: #1a7f37;
      }

      .quick-install p {
        color: var(--muted);
      }

      .markdown-body .quick-install pre {
        background: var(--code-bg);
        border-color: var(--border);
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-width: 200px;
      margin: 0 auto;
      padding: 48px 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .page-shell {
      max-width: 980px;
      margin: 0 auto;
      background: var(--content-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(31, 35, 40, 0.08);
    }

    a {
      color: var(--link);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    .quick-install {
      margin: 32px 0;
      padding: 20px;
      background: linear-gradient(180deg, var(--panel-accent), var(--panel-bg));
      border: 1px solid var(--border);
      border-left: 4px solid #1a7f37;
      border-radius: 8px;
    }

    .quick-install h2 {
      margin: 0 0 8px;
      padding: 0;
      border: 0;
      font-size: 22px;
      line-height: 1.35;
    }

    .quick-install p {
      margin: 0 0 12px;
      color: var(--muted);
    }

    .markdown-body .quick-install pre {
      margin: 12px 0;
      max-width: 100%;
      overflow-x: visible;
      white-space: pre-wrap !important;
      background: var(--content-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 12px;
    }

    .markdown-body .quick-install code {
      display: block;
      background: transparent;
      font-family: ui-monospace, SFMono-Regular, SFMono, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 14px;
      white-space: pre-wrap !important;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .quick-install .quick-install-links {
      margin: 12px 0 0;
    }

    .markdown-body {
      max-width: 980px;
      padding: 40px;
      background: var(--content-bg);
      color: var(--text);
    }

    .markdown-body h1:first-child {
      margin-top: 0;
    }

    @media (max-width: 767px) {
      body {
        padding: 0;
        background: var(--content-bg);
      }

      .page-shell {
        border: 0;
        border-radius: 0;
        box-shadow: none;
      }

      .markdown-body {
        padding: 24px 16px;
      }

      .quick-install {
        margin: 24px 0;
        padding: 16px;
      }
    }
  </style>
</head>
<body data-color-mode="auto" data-light-theme="light" data-dark-theme="dark">
  <main class="page-shell">
    <article class="markdown-body">
      ${contentHtml}
    </article>
  </main>
</body>
</html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/index.html') {
      try {
        const markdown = await fetchReadmeMarkdown(env, url);
        const html = renderPage(marked.parse(markdown), url.host);

        return new Response(html, {
          headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'no-store'
          }
        });
      } catch (error) {
        return new Response(`Error rendering page: ${error.message}`, { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};