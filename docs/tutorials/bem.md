# BEM — how we name CSS classes

BEM = **Block**, **Element**, **Modifier**. It keeps class names predictable
so nobody has to guess what `.battle__answer--correct` belongs to.

- **Block** — a standalone component: `.battle`
- **Element** — a part *inside* a block, named `block__element`: `.battle__monster`
- **Modifier** — a variant/state of a block or element, named with `--`: `.battle--boss`

```text
BEM
│
├── Block
│   └── .battle
│
├── Element
│   ├── .battle__monster
│   ├── .battle__question
│   └── .battle__answer
│
└── Modifier
    ├── .battle--boss                (variant of the block)
    └── .battle__answer--correct     (state of an element)
```

## In HTML

```html
<section class="battle battle--boss">
  <div class="battle__monster">...</div>

  <div class="battle__question">...</div>

  <button class="battle__answer battle__answer--correct">
    Answer
  </button>
</section>
```

Note: a modifier class is always added **next to** the base class, never
instead of it (`class="battle__answer battle__answer--correct"`).

## In SCSS

SCSS nesting with `&` writes BEM almost by itself:

```scss
.battle {
  &--boss {
    border-color: red;
  }

  &__monster {
    width: 200px;
  }

  &__answer {
    cursor: pointer;

    &--correct {
      background: green;
    }
  }
}
```

This compiles to flat selectors (`.battle`, `.battle--boss`,
`.battle__answer--correct`, ...) — no deep nesting, low specificity, and it
matches our max-3-levels rule from the group contract.

## Rules of thumb

- Names describe **what something is**, not what it looks like:
  `.battle__answer--correct`, not `.green-button`.
- No element-of-element names (`.battle__answers__button` ❌) — every element
  hangs directly off the block: `.battle__answer-button` ✔.
- One block = one SCSS file in `src/scss/components/`.
