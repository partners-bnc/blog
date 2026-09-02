# Graph Report - .  (2026-09-01)

## Corpus Check
- Corpus is ~2,929 words - fits in a single context window. You may not need a graph.

## Summary
- 123 nodes · 134 edges · 10 communities (9 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow
- Storyblok React Flow

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `value()` - 7 edges
4. `scripts` - 5 edges
5. `blocks()` - 4 edges
6. `BlogPost()` - 4 edges
7. `ArticleGrid()` - 4 edges
8. `Page()` - 3 edges
9. `Hero()` - 3 edges
10. `ArticleCard()` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "Storyblok React Flow"
Cohesion: 0.08
Nodes (25): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+17 more)

### Community 1 - "Storyblok React Flow"
Cohesion: 0.08
Nodes (23): DOM, src, vite/client, compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx (+15 more)

### Community 2 - "Storyblok React Flow"
Cohesion: 0.10
Nodes (19): node, vite.config.ts, compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection (+11 more)

### Community 3 - "Storyblok React Flow"
Cohesion: 0.13
Nodes (4): App(), StoriesResponse, Story, StoryResponse

### Community 4 - "Storyblok React Flow"
Cohesion: 0.30
Nodes (11): ArticleCard(), ArticleGrid(), Block, blocks(), BlogPost(), CtaBanner(), Hero(), ImageBlock() (+3 more)

### Community 5 - "Storyblok React Flow"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 6 - "Storyblok React Flow"
Cohesion: 0.22
Nodes (9): dependencies, react, react-dom, react-router-dom, @storyblok/react, react, react-dom, react-router-dom (+1 more)

## Knowledge Gaps
- **64 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+59 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Storyblok React Flow` to `Storyblok React Flow`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Storyblok React Flow` to `Storyblok React Flow`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _64 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Storyblok React Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Storyblok React Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Storyblok React Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Storyblok React Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._