#!/usr/bin/env node
const target = process.argv[2];
const budget = Number(process.argv[3]) || 20000;
if (!target) {
  console.error("usage: content.js <url> [max-bytes]");
  process.exit(2);
}
const response = await fetch(target, {
  headers: { "User-Agent": "Mozilla/5.0 (compatible; uji-skill/1.0)" },
  redirect: "follow",
});
if (!response.ok) {
  console.error(`fetch failed: ${response.status}`);
  process.exit(1);
}
const html = await response.text();
const text = html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<\/(p|div|section|article|li|h[1-6]|tr)>/gi, "\n")
  .replace(/<br\s*\/?>/gi, "\n")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .split("\n").map((line) => line.replace(/[ \t]+/g, " ").trim())
  .filter((line) => line.length > 0).join("\n");
console.log(text.slice(0, budget));
if (text.length > budget) console.log(`\n[truncated at ${budget} of ${text.length} bytes]`);
