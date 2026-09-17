#!/usr/bin/env node
const query = process.argv[2];
const count = Math.min(Math.max(Number(process.argv[3]) || 5, 1), 20);
if (!query) {
  console.error("usage: search.js <query> [count]");
  process.exit(2);
}

const AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";
const clean = (text) =>
  String(text ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#x?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();

async function brave(key) {
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json", "X-Subscription-Token": key },
  });
  if (!response.ok) throw new Error(`brave: ${response.status} ${await response.text()}`);
  const body = await response.json();
  return (body?.web?.results ?? []).map((hit) => ({
    title: clean(hit.title), url: hit.url, snippet: clean(hit.description),
  }));
}

// No key needed. This scrapes the HTML endpoint, so it depends on the current
// markup; if results stop appearing, check the result__a / result__snippet
// class names first.
async function duckduckgo() {
  const response = await fetch("https://html.duckduckgo.com/html/", {
    method: "POST",
    headers: { "User-Agent": AGENT, "Content-Type": "application/x-www-form-urlencoded" },
    body: `q=${encodeURIComponent(query)}`,
  });
  if (!response.ok) throw new Error(`duckduckgo: ${response.status}`);
  const html = await response.text();
  const links = [...html.matchAll(/result__a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gs)];
  const snippets = [...html.matchAll(/result__snippet[^>]*>(.*?)<\/a>/gs)];
  return links.map(([, href, title], i) => {
    const wrapped = href.match(/^\/\/duckduckgo\.com\/l\/.*[?&]uddg=([^&]+)/);
    return {
      title: clean(title),
      url: wrapped ? decodeURIComponent(wrapped[1]) : href,
      snippet: clean(snippets[i]?.[1] ?? ""),
    };
  });
}

const key = process.env.BRAVE_API_KEY;
let hits;
try {
  hits = key ? await brave(key) : await duckduckgo();
} catch (err) {
  console.error(String(err.message ?? err));
  process.exit(1);
}
if (hits.length === 0) {
  console.log("No results.");
  process.exit(0);
}
hits.slice(0, count).forEach((hit, i) => {
  console.log(`${i + 1}. ${hit.title}\n   ${hit.url}\n   ${hit.snippet}\n`);
});
