\*REFRACTOR

- move king check and checkmate checks to chessUtils and other functions of the kind

\*BOARD

- show captured pieces for each side
- show controlled squares using color filters of different gradients for amount of control on square
- add replay button to walk step by step through the position.
  - for memorization.
  - allow user to control replay speed, and select which information will show at each position
  - spacebar for pause/ play?
  - plus/minus for speed?
  - stop at forks to allow user choice which line to go into
  - allow users to input PGN and FEN
    - create simple translators for this
  - add status location for checks, checkmate, ect.....

\*STUDY DETAILS

- add move notation list
- add way to add different lines to a position
- possibly integrate chess engine API calls
  - get best moves
  - get threats
- possibly integrate chatgpt API calls for position explanation
  - only use very direct questions to lower confusion.
  - why is Nb3 the best move in this position?....GOOD
  - what is the best move in this position?....BAD - confuses them
- allow user to add comments to certain positions

\*GAME FILTERS

- add selectors for different filters
  - allow secetion for all pieces or each side
    - possibly only showing the side of whose move it is
    - possibly swapping color to red for attacking side or something along those lines
  - attacking
  - best move arrow
  - threats arrow
  - allow custom color selection

\*MAGNUM OPUS

- add ability to create studies
