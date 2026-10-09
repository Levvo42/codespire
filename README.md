# codeSpire

**Play it:** https://codespire.opuswright.com

codeSpire started as a school project (a group assignment in HTML, CSS and
JavaScript) and is now developed further on its own.

## Project Idea

codeSpire is an educational browser-based RPG where the player progresses by answering programming and web-development questions.

The game world is divided into different towers representing subjects such as:

- HTML
- CSS
- JavaScript
- C#
- Python

The player chooses a tower and battles monsters by answering trivia questions. Correct answers damage the monster, while incorrect answers damage the player.

Questions come from our own server and database (a Cloudflare Worker with D1), which also checks the answers so they can't be read in the browser. Monsters come from the D&D 5e API.

### Core game loop

1. Enter player name.
2. Enter the lobby.
3. Choose a programming tower.
4. Encounter a monster.
5. Answer coding questions.
6. Correct answers damage the monster.
7. Incorrect answers remove player health.
8. Defeat the monster to complete the encounter.
9. Completing towers increases their level.
10. Higher tower levels increase the difficulty of questions and enemies.

Difficulty should dynamically increase as the player progresses.

### Main features

- Coding trivia from our own question database
- D&D-inspired monsters
- Monster images
- Programming-category towers
- Dynamic difficulty
- Player health represented by hearts
- Monster health
- Tower progression
- Tutorial / hints
- Responsive interface
- Accessible interface
- Credits screen

### Possible future features

- Character classes
- Items / equipment
- Boss encounters
- Local progression/save data
- Achievements
- Leaderboards
- Multiplayer / co-op
- User accounts

## Development

### Getting started

- [Installation & local development](docs/tutorials/setup.md)
- [Backend: server, database and adding questions](docs/tutorials/backend.md)
- [Git workflow](docs/tutorials/daily-git-operations.md)
- [Code quality: formatting & linting](docs/tutorials/code-quality.md)
- [Where files belong](docs/tutorials/indexing.md)
- [Semantic HTML](docs/tutorials/semantic-html.md)
- [BEM CSS naming](docs/tutorials/bem.md)
- [JavaScript conventions](docs/tutorials/javascript.md)

### Project documentation

- [Project structure](docs/project-structure.md)
- [Story points](docs/project/story-points.md)
- [API logs](docs/logs/README.md)
- [Roadmap](docs/project/roadmap.md)
