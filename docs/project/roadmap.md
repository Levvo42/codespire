# Roadmap

What codeSpire can do today, and what we want to add. This replaces the MVP
scope from the school project: the MVP is done, so the list below is ideas to
pick from, grouped by area, not a promise or a schedule.

When you start on something here, make an issue for it. When it ships, move it
to [In the game today](#in-the-game-today).

---

## In the game today

- Three towers: **HTML**, **CSS** and **JavaScript**, each with EASY, MEDIUM
  and HARD climbs.
- Monsters from the D&D 5e API, picked by challenge rating and HP for each
  floor, with a boss at the top. Rarely, a whole climb is a goblin raid.
- Three starter classes: **warrior**, **mage** and **rogue**, with their own
  stats and critical hit chance.
- Health potions and loot drops.
- Saves in the browser (`localStorage`), with tower progress and prestige
  levels.
- Questions and answer checks from our own server and database, so the correct
  answers never reach the browser.
- Story pages, a tutorial, credits, music and settings, and a bug report page.

---

## Next: prestige mode

After clearing HARD, a tower can be climbed again in prestige mode, using only
**EXTREME** questions. The questions are already in the database.

---

## Server and database

- **Saves on the server.** Today the save file lives in the browser, where a
  player can read and edit it. Moving it to the database stops that kind of
  cheating.
- **Accounts**, holding:
  - stats
  - gear
  - an email address for updates
- **Leaderboards.**
- **Achievements.**
- **Loot tables on the server**, so drops can't be rolled by the browser
  either.

## Items

- Gear.
- More kinds of potions.
- Spellbooks (idea).

## Magic

- **Mana**, used to cast spells.
- **Spells**, for example:
  - Fireball and other damage spells.
  - 50/50: removes half of the wrong answers.
  - Remove one wrong answer (idea).

## Singleplayer

- **New classes:**
  - **Scholar:** changes the questions themselves.
  - **Cleric:** heals. Ultimate: revive a teammate, or yourself.
  - **Bard:** Song of Rest and buffs for the whole party.
- **A timer on questions.**
- **No copying the question text**, so it can't be pasted into a search.
- **Custom game:** add your own study questions to a private tower for a
  study session.

## Multiplayer

- Team dungeons.
- A new battle system and damage math for groups.
- Questions on a timer.
