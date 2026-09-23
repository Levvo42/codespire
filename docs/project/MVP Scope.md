
# Our MVP scope


<h2><ruby>
  M o <rp>(</rp><rt>Must-</rt><rp>)</rp> S <rp>(</rp><rt>Should-</rt><rp>)</rp>C<rp>(</rp><rt>Could-</rt><rp>)</rp> o W <rp>(</rp><rt>Wont-</rt><rp>)</rp>
</ruby> - haves</h2>


### Must Haves
 These are the core features **required** to be fully functional for a **M**inimum **V**iable **P**roduct.

| Feature                         | Description                                                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Working HTML/CSS/JavaScript** | All required pages and core functionality work correctly in the browser.                                   |
| **Monsters**                    | Monsters are retrieved from a D&D 5e API and displayed in the game.                                        |
| **HP**                  | Monsters have HP that  decreases when the player answers correctly. Player HP decreases when the player answers incorrectly.
| **Challenge Rating**            | Monsters have a Challenge Rating that can be displayed and/or used to determine difficulty.                |
| **Battles**                     | A functional battle system where the player encounters a monster and answers trivia questions to progress. |
| **Trivia / Questions**          | Programming questions covering **Java, HTML, CSS and C#**. Different difficulty tiers for each floor or clear of respective tower.                                                |
| **Towers**                      | Each programming subject is represented as a tower containing multiple battles/monsters including a "final" boss. 
| **Tower Progression**           | The player must clear the monsters/floors in a tower to complete it and make it more difficult.                                       |
| **API Integration**             | The game can successfully retrieve relevant D&D monster information/images from external APIs.             |
| **Basic Game UI**               | The player can navigate between the main menu, tower selection, battles and results/completion screens.    |


### Should Haves
Important features to better the experience for end-users but not necessary for **core** concept.

| Feature                |Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| **Hero Levels**        | Player gains experience and levels up after completing battles.    |
| **Items**              | Player can obtain/use items that affect battles or progression.    |
| **Character Creation** | Player can choose/customize their hero before starting.            |
| **Savepoints**         | Player's progress through towers can be saved and continued later. |


### Could haves

<ul>These would be nice to add after the full core is done.
<li>Multiplayer
<li>Shop
<li>Loadingscreen
<li>Animated menus
<li>Sound effects/music
<li>Better character customization
<li>Additional towers for more programming languages
<li>More D&D content, such as classes/player stats and monster stats
<li>Statistics
<li>Achievements
</ul>

<h3>Won't Have</h3> 
<ul>Outside our MVP scope and only a future possibility.
<li>Account/Login systems
<li>Database
<br>
<hr>

### Core Gameplay Cycle

The player's primary gameplay cycle is:

**Select Tower → Encounter Monster → Answer Question → Deal/Receive Damage → Defeat Monster → Progress → Clear Tower**

Each tower focuses on a different programming language or subject:

| Tower      | |
| ---------- | ------- |
| Java Tower | ☕    |
| HTML Tower | 🌐    |
| CSS Tower  | 🎨     |
| C# Tower   | ⚙️      |

Monsters are retrieved from the D&D 5e API and used as the enemies within the towers. Their information, such as **name, image, HP and Challenge Rating**, is displayed during encounters.

The quiz questions determine the outcome of each battle. Correct answers allow the player to damage the monster, while incorrect answers result in the player taking damage.

The player continues fighting monsters until either:

* The player is defeated, or
* The player clears all encounters within the tower.

Successfully clearing a tower allows the player to return to the tower selection and continue with another programming subject.
