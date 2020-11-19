# MarbleFinder
Work in progress puzzle solver for the marble game on the opus magnum.

https://shameness.github.io

Usage: (User Interface to be added)
- Open developer console on browser
- execute command `main(input)` or `stringifySolutionSteps(main(input))`


Progress:
### Interactive User Interface
- Generate HexGrid :white_check_mark:
- Create Element Panel :white_check_mark:
- Interactions with Grid :white_check_mark:
- Read grid values :white_check_mark:
- Graphical interactions with solver algorithm :x: (currently available on console)

### JS backed Backtracking algorithm (not optimized) (formerly Breadth First Search)
- Draft Algorithm :white_check_mark:

### Optimize Algorithm:
- Eliminate duplicate steps  :white_check_mark:
- De-prioritize wildcard (salt marbles) :white_check_mark:
- Change to Depth First Search :white_check_mark: (breadth first was wrong choice)
- Improve performance for deep-copying :x:
- Remove grid prop from solution  :x:

### Goals
- Solve 4  piece puzzle under 1 minute : :white_check_mark:
- Solve 10 piece puzzle under 1 minute : :white_check_mark:
- Solve 24 piece puzzle under 1 minute : :white_check_mark:
- Solve 56 piece puzzle under 1 minute : :white_check_mark:
- Solve 56 piece puzzle under 20 seconds::white_check_mark:

Note: Goal archived as approach to problem switched to Backtracking algorithm
from Breadth First Search. This makes timed goals not completely obsolete but
unnecessary.

:white_check_mark: >90% complete, :large_orange_diamond: work in progress, :x: 0%
