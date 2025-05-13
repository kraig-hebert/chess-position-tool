# Chess Position Tool Roadmap

## Bugs to Fix

- Add isKingInCheck and isCheckmate to promotionPieceSelect after piece is chosen
- when user is not on the latest move the state gets wonky when you select a piece or move. maybe disable the game
- right now we are validating for checks on save but not checkmate. add checkmate checks properly
- Fix arrow drawing when board is flipped - arrows appear on wrong squares due to coordinate mismatch

## Architecture & Foundation (Priority)

- **Moves List Refactoring**

  - Simplify moves list data structure
  - Improve move navigation logic
  - Centralize move state management
  - Clean up notation creation
  - Add support for variations/branches
  - Improve move history UI
  - Add move metadata (comments, evaluation, etc.)

- **Testing Infrastructure**
  - Set up unit tests for chess logic
  - Implement component tests for UI
  - Add integration tests for game flow
  - Set up CI/CD pipeline

## Board Enhancements

- show overlay for attacks that win a piece and are safe

  - Create button that turns cursor into a pressure selector and when you click a square it highlights which pieces are pressuring the square
  - Allow user to choose between types of pressures
    - Immediate: only show primary pressure
      - Pinned pieces and the like don't show pressure status
    - Total: show all piece pressures even when pinned
  - Allow different versions of filters(DIRECT/INDIRECT)
  - Indirect control could have filters for secondary and tertiary control if a bishop is behind a piece but attacking secondarily
    - Ex: square pressures can show board sides pressure or combine to only show who has control of the square
      - Have counter for each color on dark and light square color control
      - When showing square control take piece value into account as well...maybe show control by total pieces but also asterix if queen involved or minor piece and pawn totals are mismatched

- Add replay button to walk step by step through the position
  - For memorization
  - Allow user to control replay speed, and select which information will show at each position
  - Spacebar for pause/play
  - Plus/minus for speed
  - Stop at forks to allow user choice which line to go into
  - Allow users to input PGN and FEN
    - Create simple translators for this
  - Add status location for checks, checkmate, etc.
  - Add arrows when right click and swipe happens
    - add ability to control color selections with keys
  - Use article https://www.chess.com/forum/view/general/how-to-get-the-pieces-more-as-png to get piece icons for themes and such

## Study Details

- Add way to add different lines to a position
- Possibly integrate chess engine API calls
  - Get best moves
  - Get threats
- Possibly integrate chatgpt API calls for position explanation
  - Only use very direct questions to lower confusion
  - Why is Nb3 the best move in this position?....GOOD
  - What is the best move in this position?....BAD - confuses them
- Allow user to add comments to certain positions
- Allow to build custom position by selecting piece and setting it on the board
  - Helps when studying puzzle positions
- Allow user to set replays of positions
  - Allow start and end move to rotate through
  - Speed control
  - etc.
  - before each move you can show checks captures ect......
- **Opening/Endgame Database Integration**
  - Connect to established opening databases

## Game Filters

- Add selectors for different filters
  - Allow selection for all pieces or each side
    - Possibly only showing the side of whose move it is
    - Possibly swapping color to red for attacking side or something along those lines
  - Attacking
  - Best move arrow
  - Threats arrow
  - Allow custom color selection
  - Add arrows on right click for showing moves
    - Allow user to turn this on when studying to show move order visually to help calculations

## User Experience

- **Keyboard Navigation**
  - Support for all actions without mouse
  - Shortcuts for common operations

## User Data

- **User Profiles & Saving**
  - Save study progress
  - Track improvement metrics over time
- **Backend Integration** (Future)
  - User authentication
  - Cloud storage for positions and studies

## Magnum Opus

- Add ability to create studies

## Timeline

### Phase 1: Foundation (Current)

- Fix existing bugs
- Implement moves list refactoring
- Set up testing infrastructure

### Phase 2: Core Functionality

- Basic board enhancements:
  - Square control visualization
  - PGN/FEN input/output support
- Keyboard navigation
- Add replay functionality

### Phase 3: Study & Analysis Features

- Position saving/loading
- Basic opening database integration
- Add ability to create different lines for a position

### Phase 4: User Interface Improvements

- Game filters implementation
- Position replay controls
- Arrow drawing functionality

### Phase 5: User Data & Backend

- User profiles & saving
- Basic backend integration
- Authentication system

### Phase 6: Integration & Completion

- Chess engine API integration
- ChatGPT integration for position explanations
- Full study creation system (Magnum Opus)
