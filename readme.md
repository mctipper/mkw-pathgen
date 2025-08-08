# Mario Kart World Path Generator

![Typescript 5.8.3](https://img.shields.io/badge/Typescript-5.8.3-3178C6)
![Vite 7.0.4](https://img.shields.io/badge/Vite-7.0.4-7F00FF)

Generate random cups, rallies, vs-mode (of all lengths) paths. Just for shits and gigs, a fun excuse to play with DFS traversal and building a spiffy little website for no particular reason.

Select a track by clicking its icon, then generate a path using the options provided and clicking the 'Generate Path' button. Will do a DFS traversal and return a path, by drawing it crudely on the map and also as a list below.

Options provides are what kind of path wanted:

- 'Grand Prix' starts with a single-track, then 3 intermissions.
- 'Knockout Tour' has 5 intermissions.
- '_x_ races' is basically mimicking VS Mode 'Connected' type, with number of races to be used in generating the path.
- 'End with Selected' causes the path to _end_ with the selected track, else the path _beings_ with it.
- 'Include Single-Track Race(s)' is only applicable for the VS Mode options, and allows single-track (ie. 3 lap) races to be included in the output path.

## Features

Just some deets on the stuff going on in the background.

### Traversing

Uses depth-first-search, with caveats. An adjacency list of tracks and their linked tracks was put together (found in `./public/data/tracks.json` and `./public/data/adjacency.json`) by looking at all the VS options, and is used to store the graph of connectivity between all the tracks.

The caveats as mentioned are either universal or specific to the mode selected.

- **All modes** prevent the exact same traversal to be repeated, so once have driven A-B that path cannot repeat in the traversal again (includes single-track (ie. 3 lap) races from occuring again). I put the code in to prevent _reverse_ traversal but decided to comment it out as its really a different track tbh: 'A-B' and 'B-A' should be considered distinct.

- **All modes** also prevent 'u-turns', so A-B-A is not permitted, this is to prevent back-and-forth loops. However A-B-B-A or A-B-C-D-B-A are both permitted, as there was another race before the reverse traversal (also see prev paragraph).

**Grand Prix** always starts with a single-track (ie. 3 lap) race, followed by 3 intermissions. Track revisiting is not permitted.

**Knockout Tour** is 5 intermissions. Track revisiting is not permitted.

**VS Mode** length depends on the option selected. Track revisiting is permitted, with single-track race inclusion also able to be configured.

If a path cannot be found (ie. starting from Rainbow Road), an empty path is returned and a little message displayed just to inform. The number of permutations is in the millions so being unable to find a path is almost zero% chance of occuring otherwise.

## TODO

- would like to get % breakdowns of each track/intermissions (with ranges for path branching) so can return the % of road coverage for the returned path.
- some colour (monochrome) rendering on the map based on the resutling path remaining 'colour' and the rest going black and white
- with the drawing animation, make the icons increase in size _as each path arrives at that track_
- store generated paths, allow going 'back' and 'forward' though history (stored locally, session only because who cares)
- fix up that dashed line animation yucks
- generate a list of 00s of 'mario themed' items and give a random name to each generated path ('Poison Mushroom Cup' / 'Goomba Shoe Rally' etc...). Maybe use the % breakdown of track covered (dot-point-1) to 'guide' these so have 'ice' themed or 'lava' themed names have greater chance of being used if >x% of the track is lava etc...
- the dreaded post-completion refactor: some of the modules are serving multiple purposes so should tidy that up, and give future self a hand and comment it out better. Some unit tests would have been a good idea.

## Setup

Build with `vite` and `TS`, I haven't bothered with dev or prod builds or any of that guff as this is a side-proj nothing more. Versions are above in the fancy badge things. `npm install` to build the little node env, then `npm run dev` to get it up and running. There is also a `devcontainer` set up already to make it easier because isolation just makes everything better.

## Credits

Mario Kart World Map images provided by [u/Cube_play_8](https://www.reddit.com/user/Cube_play_8/) on [r/NintendoSwitch2](https://www.reddit.com/r/NintendoSwitch2/comments/1k00wfp/mario_kart_world_hires_map_image_extracted_from/). I cropped out the "track icons" and tidied them up a bit but this was the source.

Everything is owned by Nintendo obviously. I did this for fun and aint making a single cent nor an iota of clout from it.
