# uji skills

Capability folders the agent reads and runs. Each is a directory with a
`SKILL.md` declaring `name` and `description`, plus whatever scripts it needs.

Point uji at this directory:

```lua
require("skills").setup({ roots = { "~/Projects/uji-skills" } })
```

The layout follows the [Agent Skills](https://agentskills.io/specification)
convention, so the same folders work from other harnesses that read
`~/.agents/skills` or a project's `.agents/skills`.

## web-search

Search the web and read pages, no API key. Uses DuckDuckGo; set `BRAVE_API_KEY`
to use the Brave Search API instead.
