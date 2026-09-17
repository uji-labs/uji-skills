---
name: web-search
description: Search the web and read pages. No API key needed. Use for current information, documentation, and error messages you do not recognise.
---

# Web Search

Run the scripts by their full path; `{baseDir}` is this folder.

No setup and no key. Searching uses DuckDuckGo; set `BRAVE_API_KEY` and it uses
the Brave Search API instead, which is steadier but needs an account.

## Search

```bash
{baseDir}/search.js "rust lifetime elision" [count]
```

Prints numbered results as title, url and snippet. Default 5, maximum 20.

## Read a page

```bash
{baseDir}/content.js https://doc.rust-lang.org/nomicon/ [max-bytes]
```

Prints the page as text with markup removed, truncated to the byte budget
(default 20000) and told you where it cut.
