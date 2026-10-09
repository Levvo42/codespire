# API logs

One markdown file per external API we use, named after the API:

```text
docs/logs/
├── README.md      ← this file: what to write and how
└── dnd-api.md     ← D&D 5e API: the monsters
```

Our own server (`/api/questions`, `/api/answer`) is documented in
[backend.md](../tutorials/backend.md).

---

## What a log is for

An API's documentation tells you what the API _can_ do. The log is where we
write down what it actually did **for us**: the endpoints we call, what the
fields are really named, and the surprises — the rate limit, the category that
returns an empty list, the field that is sometimes `null`.

Without it, every one of us re-discovers the same things with `console.log`,
and the answers disappear when the browser console is cleared.

The log is also our source for the API section of the README when we write it.

---

## Who writes it, and when

Whoever writes or changes a function in `src/js/api/` — ideally in the same
pull request, while it's still fresh. A week later nobody remembers why
`difficulty` had to be lowercase.

This is notes, not paperwork. You don't log every request you ever made; you
log the things that were **not** obvious from the API's own documentation.
Two lines is a perfectly good log entry.

---

## What the code does at runtime

Nothing is written to these files automatically. JavaScript running in a
browser has no access to the repo — it can only write to the browser console.

So when a request fails, the code does two things, and neither of them is a
file: `console.error` for us, and an `alert` for the player with the reason
("we are out of requests for now", and so on). How that works — `api/` throws,
the page script catches and calls `showError()` — is in
[javascript.md](../tutorials/javascript.md#who-handles-the-error).

If a failure keeps happening, that's exactly the kind of thing worth two lines
in the log here.

---

## Template

Copy this into a new file when you start working with an API. Replace
everything in `<angle brackets>`, and delete the parts that don't apply.

````md
# <API name>

| Field        | Value                         |
| ------------ | ----------------------------- |
| **Base URL** | `<https://...>`               |
| **API key**  | `<VITE_...>` in `.env` / none |
| **Docs**     | <link to the official docs>   |
| **Used by**  | `src/js/api/<file>.js`        |

## Endpoints we use

### <GET /path>

What we use it for: <one line>.

Parameters we send:

| Parameter | Example   | Notes             |
| --------- | --------- | ----------------- |
| `<name>`  | `<value>` | required/optional |

Response — a real one, shortened to the fields we use:

```json
{ "<field>": "<value>" }
```

Fields we use:

| Field          | Type     | Notes                           |
| -------------- | -------- | ------------------------------- |
| `<field_name>` | `<type>` | <what it means, if not obvious> |

## Good to know

- <rate limit, odd behaviour, a field that is sometimes missing or null>
- <what it returns for a bad request: 404? empty list? an error object?>

## Changelog

| Date         | Who    | What                    |
| ------------ | ------ | ----------------------- |
| <YYYY-MM-DD> | <name> | <first version / added> |
````

---

Related: [javascript.md](../tutorials/javascript.md) (how we write `api/`
functions) · [project-structure.md](../project-structure.md) (secrets)
