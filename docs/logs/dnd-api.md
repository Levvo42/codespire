# D&D 5e API

Where our monsters come from: what we call, what we get back, and how the game
uses it.

| Field        | Value                                             |
| ------------ | ------------------------------------------------- |
| **Base URL** | `https://www.dnd5eapi.co`                         |
| **API key**  | none                                              |
| **Docs**     | https://5e-bits.github.io/docs/                   |
| **Used by**  | `src/js/api/monsters.js` (`getMonsterForFloor`)   |
| **Called**   | straight from the browser, not through our server |

The API is free and open, with data from the D&D 5e rules (the 2014 edition,
hence `/api/2014/` in every path). We only read monsters from it, but it has
spells, equipment, classes and more, which could be useful for the
[roadmap](../project/roadmap.md).

## Endpoints we use

### GET /api/2014/monsters?challenge_rating=...

What we use it for: the list of monsters a tower floor can pick from.

| Parameter          | Example      | Notes                                     |
| ------------------ | ------------ | ----------------------------------------- |
| `challenge_rating` | `0.25,0.5,1` | optional; several values, comma-separated |

Response, shortened. Only names and links, no stats:

```json
{
  "count": 2,
  "results": [
    {
      "index": "goblin",
      "name": "Goblin",
      "url": "/api/2014/monsters/goblin"
    },
    {
      "index": "kobold",
      "name": "Kobold",
      "url": "/api/2014/monsters/kobold"
    }
  ]
}
```

| Field   | Type     | Notes                                             |
| ------- | -------- | ------------------------------------------------- |
| `index` | `string` | the monster's id; we track used ones per climb    |
| `url`   | `string` | a path, not a full URL: add the base URL in front |

### GET /api/2014/monsters/{index}

What we use it for: one monster's stats and picture.

Response, shortened to the fields we use:

```json
{
  "index": "goblin",
  "name": "Goblin",
  "hit_points": 7,
  "challenge_rating": 0.25,
  "xp": 50,
  "image": "/api/images/monsters/goblin.png"
}
```

| Field              | Type     | Notes                                                     |
| ------------------ | -------- | --------------------------------------------------------- |
| `hit_points`       | `number` | becomes `maxHp`; also how we pick a monster for a floor   |
| `challenge_rating` | `number` | becomes `challengeRating`; sets how hard the monster hits |
| `xp`               | `number` | becomes `xp`, scaled in `game/player.js`                  |
| `image`            | `string` | a path; becomes `imageUrl`. Some monsters have no image   |

`toMonster()` in `monsters.js` renames these into our own shape (camelCase),
as [javascript.md](../tutorials/javascript.md) says to do at the boundary.

## How the game picks a monster

1. Each floor in `TOWER_LAYOUTS` (`game/constants.js`) lists the challenge
   ratings it allows and an HP range (`minHp`, `maxHp`).
2. We fetch the list for those challenge ratings, shuffle it and skip the
   monsters already used in this climb.
3. We fetch up to 8 of them one by one (`MAX_PICK_ATTEMPTS`) and take the
   first whose HP is inside the range. If none is, we take the closest.
4. Once per climb there is a 3.2% chance of a goblin raid, where every floor is
   a goblin (`RARE_CLIMB_CHANCE`, `ui/goblin-raid.js`).

So one floor can cost up to 9 requests. That's fine for a free API, but it is
why a floor can take a moment to load.

## Good to know

- `url` and `image` are paths, so `monsters.js` puts `https://www.dnd5eapi.co`
  in front of both.
- Some monsters have no `image`; then `imageUrl` is `null`.
  `loadMonsterImage()` in `ui/battle-screen.js` handles that.
- If the API is down or answers with an error, `fetchJson` throws
  `the monster server answered <status>`, and the page shows it with
  `showError`.
- Challenge ratings below 1 are fractions: `0.125`, `0.25`, `0.5`.

## If we move monsters to our own server

The browser calls this API directly today, so the monster's HP and challenge
rating come from the browser too. If battle math moves to the server (see
[AGENTS.md](../../AGENTS.md): the server owns anything a player could cheat
with), the monster has to come from the server as well. Two ways to do that:

- **The Worker calls this API** and passes the monster on, the same way
  `/api/questions` works. Smallest change; still depends on the API being up.
- **Copy the monsters we use into D1**, with a script like
  `scripts/seed-questions.js`. No outside dependency, and we can add our own
  monsters, but we have to keep the copy up to date.

## Changelog

| Date       | Who                   | What                                      |
| ---------- | --------------------- | ----------------------------------------- |
| 2026-10-09 | Mattias (with Claude) | First version, written from `monsters.js` |
