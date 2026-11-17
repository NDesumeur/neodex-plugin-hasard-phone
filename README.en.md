# Hasard (Chance)

Let chance decide, in pixel art: a wheel with your own choices, rolling dice, a spinning coin, a number drawn between two limits and teams formed at random. Every draw has its little sound.

*Version française : [README.md](README.md)*

## Phone version

- **One tab per game** (wheel, dice, coin, number, teams) instead of six cards to scroll.
- Same draws and lists as on PC (same id `neodex.hasard`).

## The wheel

- Write your choices in **Wheel choices**, one per line (24 at most; at first: pizza, sushi, burger, pasta, tacos, salad). The wheel redraws at once, one slice per choice.
- **Click the wheel**, **Spin** or press **Space**: it turns several times, clicking, and slows down; the winning slice lights up and its name shows in big letters.
- **Remove the winner**: each winner leaves the wheel and joins the **running order**, until everyone has gone. **Put all back** starts again; your list itself does not change.

## Dice

Pick **1 to 6 dice** and their number of **sides**: 4, 6, 8, 10, 12, 20 or 100. **Roll** throws them on a mat: they bounce off the edges (with the sound), change faces as they roll, then stop; the **total** shows below. Six-sided dice show pips, the others their number.

## Heads or tails

**Flip the coin**: it rises spinning (a ting at each half turn), falls and bounces, then **HEADS** or **TAILS** shows, fifty-fifty.

## Random number

Give a minimum and a maximum (**From** … to …, negative numbers included), then **Draw**: the digits scroll then stop on a whole number between the two, limits included.

## Teams

Write the names, one per line, pick **2 to 8 teams**, then **Make teams**: the names are shuffled and split into teams of the same size (give or take one person), each in its own colour.

## Data and sync

Your wheel choices, names and settings are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → To discover → Chance → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
