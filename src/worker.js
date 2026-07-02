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

function renderPage(markdownHtml, host) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RustFS Helm Charts</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css">
  <style>
    :root {
      color-scheme: dark;
      --page-bg: #0d1117;
      --panel-bg: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --link: #58a6ff;
    }

    * {
      box-sizing: border-box;
    }

    body {
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      padding: 40px 24px;
      background: var(--page-bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .header-banner {
      padding: 16px;
      margin-bottom: 24px;
      background: var(--panel-bg);
      border: 1px solid var(--border);
      border-radius: 6px;
    }

    .header-banner h1 {
      margin: 0 0 12px;
      font-size: 22px;
      line-height: 1.3;
      font-weight: 600;
    }

    .header-banner p {
      margin: 8px 0;
    }

    .header-banner a {
      color: var(--link);
      text-decoration: none;
    }

    .header-banner a:hover {
      text-decoration: underline;
    }

    .header-banner pre {
      margin: 12px 0;
      overflow-x: auto;
      background: rgba(110, 118, 129, 0.18);
      border-radius: 6px;
      padding: 12px;
    }

    .header-banner code {
      font-family: ui-monospace, SFMono-Regular, SFMono, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 85%;
    }

    .markdown-body {
      max-width: 980px;
      padding: 32px;
      background: var(--page-bg);
    }

    @media (max-width: 767px) {
      body {
        padding: 16px;
      }

      .markdown-body {
        padding: 16px 0;
      }
    }
  </style>
</head>
<body data-color-mode="dark" data-light-theme="light" data-dark-theme="dark">
  <header class="header-banner">
    <h1>RustFS Helm Repository</h1>
    <p>To use this repository, add it to your Helm client:</p>
    <pre><code>helm repo add rustfs https://${host}
helm repo update</code></pre>
    <p><a href="/index.yaml">index.yaml</a> | <a href="https://github.com/rustfs/helm">GitHub Repository</a></p>
  </header>
  <article class="markdown-body">
    ${markdownHtml}
  </article>
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