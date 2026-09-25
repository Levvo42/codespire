# Group Contract — Group 8

**Team:** Mattias Carlstedt, Konan M, Alena T, Felix J

We work according to agile methods: daily standups, backlog refinement,
sprint planning, and retrospectives. New contract questions are collected in
[Open questions](#open-questions) and answered at an upcoming meeting.

## What we want to avoid

Bad experiences from previous group work, and what we commit to instead:

- **No-shows.** We show up to agreed meetings, and give notice when we can't.
- **Silent deadline crunches.** We tell the team early how much we have or
  haven't done, so problems are visible before the deadline and the group can
  help finish tasks in time.
- **Struggling in silence.** If a task is hard to finish, we ask for help or
  guidance instead of doing nothing and stressing about it. Everyone in the
  group is willing to help.

## Roles & task distribution

- **Scrum master:** Mattias.
- **Task assignment:** the scrum master assigns tasks.
- **Expertise:** members with expertise in an area oversee that area — but
  everyone works on every kind of task, so everyone learns all parts of the
  project.

## Strengths & weaknesses

### Per member

| Member      | Strengths                                                                   | Weaknesses                                                               |
| ----------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Alena**   | Graphic design<br>HTML/CSS (re-engineering)                                 | JavaScript<br>GitHub                                                     |
| **Felix**   | Information gathering<br>Troubleshooting                                    | Conventions & standardization<br>Graphic design                          |
| **Konan**   | Object-oriented programming<br>GitHub (Scrum & git features)<br>UX / design | JavaScript<br>Conventions & standardization<br>Group leadership          |
| **Mattias** | Architecture OCD<br>Organizational skills<br>Design structure               | OCD / control needs<br>Over-ambitious<br>Short experience in development |

### Per area

Who to ask for help (strong), and who to pair up with when working in an
area (weak). Based on the table above.

| Area                                | Strong                | Weak         |
| ----------------------------------- | --------------------- | ------------ |
| Graphic design / UX                 | Alena, Konan, Mattias | Felix        |
| HTML/CSS                            | Alena                 | —            |
| JavaScript / programming            | Konan (OOP)           | Alena, Konan |
| GitHub / git                        | Konan                 | Alena        |
| Conventions & standards / structure | Mattias               | Felix, Konan |
| Research & troubleshooting          | Felix                 | —            |
| Organization & leadership           | Mattias               | Konan        |

## Meetings

| Meeting                   | When                 |
| ------------------------- | -------------------- |
| Daily standup             | Every weekday, 11:00 |
| Afternoon check-in        | 15:00                |
| Backlog refinement (~1 h) | Monday / Wednesday   |
| Sprint planning (1–2 h)   | Monday               |
| Retrospective (~1 h)      | Monday / Friday      |

- **Format:** camera on, and come prepared — have what you will present ready
  before the meeting starts.
- **Logbook:** an entry with the daily standup **must** be written every
  weekday — in English, on a rotating basis — in `docs/team/meetings/`.

## Communication

- **Channel:** Discord. Email and phone numbers are shared within the group.
- **Response time:** at the latest the next morning.
- **Unavailability:** notify the day before, or at the latest 1 hour before;
  same-day notice only for emergencies.
- **Urgent matters:** something that affects the whole project and needs
  everyone's attention. If you can't reach Discord or can't join, send a text
  message to a team member.

## Participation & consequences

- **1 warning** = being unreachable without a reason.
- **3 warnings** = the member is removed from the group.

## Working style

- We mix live coding together with working independently.
- **Merges into `main`:** twice a day — once after lunch, once at the end of
  the day. Merges and conflicts are always announced in the Discord channel.
- **Merge conflicts:** back up your work first, decide together which version
  takes priority, then merge/rebase and restore from the backup as needed.
  See [daily-git-operations.md](../tutorials/daily-git-operations.md).

## Feedback & code review

- **Feedback time:** the same day — within the hour during working hours.
- **Pull requests** need a green CI check and **1 approval** from another
  member before they can be merged. Everyone reads each other's code. See
  [code-quality.md](../tutorials/code-quality.md#pull-requests-and-github).
- Code is shown and discussed at the morning standup.
- Design work is based in Figma and follows the predetermined color theme;
  feedback is given via Discord screen sharing.

## Coding standards

- **Commit messages:** [Conventional Commits](https://www.conventionalcommits.org/)
  — see [daily-git-operations.md](../tutorials/daily-git-operations.md).
- **Linting & formatting:** Prettier, ESLint, Stylelint and html-validate.
  Run `npm run check` before every push — see
  [code-quality.md](../tutorials/code-quality.md).
- **JavaScript:** see [javascript.md](../tutorials/javascript.md).
- **CSS class names:** BEM — see [bem.md](../tutorials/bem.md).
- **Nesting:** maximum 3 levels of parent–child indentation (enforced for SCSS
  by Stylelint).
- **Language:** English everywhere in code, including CSS selectors and comments.
- **Comments:** each file gets an index comment when it is done; use
  collapsible regions where the editor supports them.

## Ambition

Sky high.

## Open questions

None right now. Add new contract questions here, and move the answer up into
the right section once the team has agreed on it.

## Signatures

- Mattias Carlstedt
- Konan M
- Alena T
- Felix J
