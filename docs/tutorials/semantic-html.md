# Semantic HTML — which element to use

Use the element that describes the content's *meaning*, not its looks.
Screen readers, search engines, and teammates all read the structure.

Typical page skeleton:

```text
<body>
│
├── <header>
│   └── <nav>
│
├── <main>
│   │
│   ├── <section>
│   │   └── <article>
│   │
│   └── <section>
│
└── <footer>
```

## Cheat sheet

| Element | Use for |
|---|---|
| `<header>` | Introductory content / top of page (logo, title, nav) |
| `<nav>` | Navigation links |
| `<main>` | The primary content — exactly **one** per page |
| `<section>` | Grouped content with a common subject (give it a heading) |
| `<article>` | Independent, self-contained content |
| `<aside>` | Related but secondary content (sidebar, tips) |
| `<footer>` | Footer information |
| `<button>` | Anything the user clicks to *do* something (answers, actions) |
| `<a>` | Anything the user clicks to *go* somewhere (links between pages) |
| `<div>` | Only when no semantic element fits (pure layout/grouping) |
| `<span>` | Inline equivalent of `<div>` |

Quick self-check: if your page is mostly `<div>`s, ask which of the elements
above actually describes the content.
