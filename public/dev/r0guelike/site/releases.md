# Patch notes

Every change a player can see in Old Legends: Grim Awakening, as it lands.
The Patch notes page and the hub's Latest box are drawn from this file:
what is on main now, newest day first, then every Version so far.

## [Unreleased]

### 2026-10-17

#### New

- Added switches that face one way: a switch may answer to one side of its
  wall only, and from the other side it is just wall.
- Added puzzle doors: a door of one look that opens only once every switch
  and lever wired to it has been thrown, and that no boot or lockpick will
  move. A switch that belongs to one tells you something shifted, and a
  door opening out of sight is heard.
- Added the floor lever: it opens the door it is wired to, pulled once by
  hand where you stand. Stepping onto it does nothing.
- Added projectile flight: arrows, stones and thrown things now cross the
  floor cell by cell, and so does a stone thrown at you. Any key skips it.
- Added the Keys screen: press ? for every key the game knows and what it
  does.
- Added log scrolling: read the log back with [ and ] or the mouse wheel.
  Anything that moves play on returns it to the newest line.

#### Changes

- Looking at a flipped switch or a pulled lever now says so.
- The action menu now leads with what the thing beside you does, and the
  row says what it uses: "Drink from the fountain".
- A click on a cell one step away with one thing to do now does it at
  once; with more than one, it opens the menu.
- u now uses the one thing beside you without asking which way.
- The game is now titled Old Legends: Grim Awakening, and the tab says so.
- The wall lever is now a switch. It flips once, by hand or by walking into
  it, and shows when it has been flipped.

#### Bug Fixes

- Fixed an issue where a puzzle door that would not move was followed by
  the offer to kick it down or pick its lock.

### 2026-10-16

#### New

- Added altars outside the shrines: an altar now stands on some floors of
  the Mines, rarely, and in the dungeon that is never the same twice.
- Added asking at an altar: ask for a blessing on what you wear, for a curse
  to be lifted, or for a gift, if the deep thinks you have earned it.
- Added drinking at the fountain on the City's plaza: stand beside it and
  press u.
- Added Magic Points, shown beside health and on the character screen. A
  fountain refills them; nothing spends them yet.

#### Changes

- An offering no longer brings anything back on its own. The deep gives
  only what is asked for.
- Resting is no longer free healing in the Roguelike Modes: away from a
  fountain it stops at half health. Beside a fountain it is quick and runs
  to full. An Adventurer heals faster everywhere.
- The City's fountain is now a single basin you can walk all the way round.

#### Balance

- The goblin king now drinks at most twice in a fight, steps back to throw
  his stones, and shouts half as often.
- An orc warlord now calls one or two orcs to its side once, when badly
  hurt, instead of other warlords again and again, and has fewer hit points.
- Reworked armour: heavy gear now turns most of a hit aside instead of
  stopping it at one point, a weak blow can glance off it entirely, and a
  critical hit always lands.

#### Bug Fixes

- Fixed an issue where a cursed potion of healing took your hit points. It
  now poisons you for a few turns, which can be waited out or cured.
- Fixed an issue where a character left open in another browser tab saved
  its older self over your progress. Continue a character in a new tab and
  the old tab goes back to the roster.

### 2026-10-15

#### New

- Added the action menu: one key opens a menu of what you can do where you
  stand. The mouse opens the same menu for your cell and the cells around
  you.
- Added looking around: press l to move a cursor over the map, and @ to see
  your character.
- Added altars: an altar stands at the centre of a round shrine. Step onto
  it and press u to offer something from your pack; pale flames take it,
  and what comes back is the deep's to decide.
- Added the altar's memory: the deep remembers what you offer, and your
  character screen says how that feels now.

#### Changes

- A click on a far monster now looks at it; aim with t. A click on your own
  cell opens the menu, where Pick up is the first row.
- Aiming now skips the people who are not your enemies.
- An Artifact's name is now spelled in the log as it is on its card.

### 2026-10-14

#### New

- Added the first person to talk to: someone waits by the stairs in the City
  with something to give you. Press C and a direction to talk; walking into
  them talks too.
- Added the warded way down: the stairs out of the Shallows run through a
  room the miners sealed, and only what you were given in the City breaks
  the seal. Everything they shut in is still there.
- Added the first strange finds: the level below the goblin king's hall
  holds eight of them in its alcoves, one a book you can read, and two more
  lie somewhere in the Mines.

#### Changes

- Two of the vaults have moved from the Shallows to the Mines.
- The warded room is now rough stone and rubble, its stairs are hewn into
  the rock, and the climb back up matches.

#### Balance

- Reduced the pack guarding the miners' ward.

### 2026-10-13

#### New

- Added a warning as you arrive at the goblin king's hall.

#### Changes

- The goblin king's hall is now entered from a small room by its door.
- Mines-Bound and Untouched are now earned on the first floor of the Mines,
  not the second floor of the Shallows.

#### Balance

- The goblin king is tougher: his calls now answer at his side, he throws
  stones at a character who keeps away, and he drinks when hurt.

#### Bug Fixes

- Fixed an issue where the things left lying in the City for trying out
  could be cursed.
- Fixed an issue where the bugbear warchief had no face.

### 2026-10-12

#### New

- Added the level below the goblin king's hall: steps cut in the rock lead
  down to narrow corridors, and at the end of the last passage stands the
  Sealed Door. The game stops there for now, and says so.

## [0.3.0-alpha.4] - 2026-10-12

The fourth snapshot: the Mines open under the Shallows, eight floors with
the goblin king's hall at the bottom as the first boss fight, and the
Shallows become the miners' base.

### New

- Added the Mines: eight floors under the Shallows, timbered galleries and
  rail-laid cross-cuts, with rooms and monsters of their own.
- Added caves: the seventh floor of the Mines has no timber left.
- Added the first boss fight: the goblin king waits in his hall at the
  bottom of the Mines.
- Added the miners' base: the Shallows now hold mess halls, bunk rooms and
  storerooms among their rooms.
- Vaults are now full, and a great vault is crowded.

### Changes

- Only a room with a fight in it now stops you at its door.
- A character made before the world changed is now marked on the Roster.
  They can go on, but a new character is recommended.

### Bug Fixes

- Fixed an issue where the City's houses drew without their doors.

## [0.3.0-alpha.3] - 2026-10-10

The third snapshot: what you find is no longer all it seems — unknown
potions, stones and scrolls, curses and blessings, rings and amulets, and
travel that follows a corridor round its corners.

### New

- Added unknown finds: potions, stones and scrolls you do not know go by
  their looks until you try one.
- Added the scroll of identify, to learn what a find is before you put it
  on.
- Added curses and blessings, which turn a find for you or against you.
- Added rings and amulets with powers of their own.
- Added sling bullets, beside the stones.
- Added a rare Artifact on the bare floor of a dungeon level.

### Changes

- Travel now follows a corridor round its corners, and stops when you step
  onto something lying on the floor.

## [0.3.0-alpha.2] - 2026-10-07

The second snapshot: the floors decide what they hold, the vaults have a
character, there are more monsters and more to find, and the first
Artifacts are in the world.

### New

- Added drops: a monster may leave a find where it died.
- Added respawns: a cleared floor does not stay empty, and something may
  arrive out of your sight. The City stays as it is.
- Added vaults with a character: each kind has its own walls and its own
  hoard, and rarely a great vault holds far more.
- Added room notices: a floor tells you when it holds a vault, and a room
  says what you found the first time you see into it.
- Added twenty-one monsters, in the Shallows, the Mines and below them.
- Added more to find: new weapons and armour, better materials deeper down,
  new enchantments, potions and door traps.
- Added three Artifacts: unique items, each with its own name, at most one
  of each in a world.

### Bug Fixes

- Fixed an issue where a vault's, a hall's or a shrine's door drew as wall.

## [0.3.0-alpha.1] - 2026-09-28

The first numbered Version, so this entry says what the game holds rather
than what changed.

### New

- Characters: a name and a Mode at creation, a roster of as many as you
  like, and every action saves.
- The City of Angband, where every new character starts.
- The Shallows: four floors, made the first time you enter them and kept for
  that character's life, each with a Special Room.
- Fog of war: you remember the terrain you have seen, never the monsters.
- Combat: bump to attack, shoot or throw at what you can see, and walk over
  your arrows to have them back.
- Gear: items worn in layers, Item Power on every one, a pack, and piles on
  the floor.
- Doors: they open, close, lock and carry traps, and some are secret.
- Death by your Mode: an Adventurer wakes in the City, and a Roguelike's
  death is final. A Chronicle for every character, a Graveyard and a Hall of
  Fame.
