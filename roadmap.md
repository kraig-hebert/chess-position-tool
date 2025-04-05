\*BUGS

- add isKingInCHeck and isCheckmate to promotionPieceSelect afyer piece
  is chosen

\*REFRACTOR

- swap context for redux....if constant rendering on context change becomes an issue
- move pieceIcons from gamestate to chessUtils

\*BOARD

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
  - add arrows when right click and swipe happens
  - use article https://www.chess.com/forum/view/general/how-to-get-the-pieces-more-as-png to get piece icons for themes and such

\*STUDY DETAILS

- add way to add different lines to a position
- possibly integrate chess engine API calls
  - get best moves
  - get threats
- possibly integrate chatgpt API calls for position explanation
  - only use very direct questions to lower confusion.
  - why is Nb3 the best move in this position?....GOOD
  - what is the best move in this position?....BAD - confuses them
- allow user to add comments to certain positions
- allow to build custom position by selecting piece and setting it on the board
  - helps when studying puzzle positions
- allow user to set replays of positions
  - allow start and end move to rotate through
  - speed control
  - ect.....

\*GAME FILTERS

- add selectors for different filters
  - allow secetion for all pieces or each side
    - possibly only showing the side of whose move it is
    - possibly swapping color to red for attacking side or something along those lines
  - attacking
  - best move arrow
  - threats arrow
  - allow custom color selection
  - add arrows on right click for showing moves
    - allow user to turn this on when studying to show move order visually to help calculations

\*MAGNUM OPUS

- add ability to create studies
