// Adăugați acest nou tip de acțiune în obiectul GameActionTypes
const GameActionTypes = {
    SELECT_PIECE: 'SELECT_PIECE',
    MOVE_PIECE: 'MOVE_PIECE',
    RESET_SELECTION: 'RESET_SELECTION',
    TOGGLE_PLAYER: 'TOGGLE_PLAYER',
    UPDATE_TIME: 'UPDATE_TIME',
    SET_CHECK: 'SET_CHECK',
    END_GAME: 'END_GAME',
    RESTART_GAME: 'RESTART_GAME',
    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    LOAD_GAME: 'LOAD_GAME'  // Adăugat pentru încărcarea jocurilor salvate
  };
  
  // Apoi adăugați cazul LOAD_GAME în reducer
  function gameReducer(state, action) {
    switch (action.type) {
      // Cazurile existente...
      
      case GameActionTypes.LOAD_GAME:
        // Combinăm jocul încărcat cu starea actuală, păstrând setările actuale
        return {
          ...state,
          boardState: action.payload.boardState,
          currentPlayer: action.payload.currentPlayer,
          moveHistory: action.payload.moveHistory,
          capturedPieces: action.payload.capturedPieces,
          check: action.payload.check,
          gameOver: action.payload.gameOver,
          winner: action.payload.winner,
          selectedPiece: null,
          possibleMoves: []
        };
      
      default:
        return state;
    }
  }