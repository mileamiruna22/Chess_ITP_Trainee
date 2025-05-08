import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ChessApiService } from './ChessApiService';

export const GameActions = {
  SELECT_PIECE: 'SELECT_PIECE',
  MOVE_PIECE: 'MOVE_PIECE',
  RESET_SELECTION: 'RESET_SELECTION',
  TOGGLE_PLAYER: 'TOGGLE_PLAYER',
  UPDATE_TIME: 'UPDATE_TIME',
  SET_CHECK: 'SET_CHECK',
  END_GAME: 'END_GAME',
  RESTART_GAME: 'RESTART_GAME',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_GAME_ID: 'SET_GAME_ID'
};

function createInitialBoardState() {
  const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Adaugă pionii
  for (let col = 0; col < 8; col++) {
    emptyBoard[1][col] = 'pawn-black'; // Pionii negri
    emptyBoard[6][col] = 'pawn-white'; // Pionii albi
  }
  
  // Adaugă piesele grele pentru negru (rândul 0)
  emptyBoard[0][0] = emptyBoard[0][7] = 'rook-black';
  emptyBoard[0][1] = emptyBoard[0][6] = 'knight-black';
  emptyBoard[0][2] = emptyBoard[0][5] = 'bishop-black';
  emptyBoard[0][3] = 'queen-black';
  emptyBoard[0][4] = 'king-black';
  
  // Adaugă piesele grele pentru alb (rândul 7)
  emptyBoard[7][0] = emptyBoard[7][7] = 'rook-white';
  emptyBoard[7][1] = emptyBoard[7][6] = 'knight-white';
  emptyBoard[7][2] = emptyBoard[7][5] = 'bishop-white';
  emptyBoard[7][3] = 'queen-white';
  emptyBoard[7][4] = 'king-white';
  
  return emptyBoard;
}



const initialState = {
  gameId: null,
  boardState: createInitialBoardState(), // Folosește funcția pentru a inițializa tabla
  currentPlayer: 'white', 
  selectedPiece: null, 
  possibleMoves: [], 
  moveHistory: [], 
  capturedPieces: { white: [], black: [] }, 
  whiteTime: 10 * 60, 
  blackTime: 10 * 60, 
  gameActive: false, 
  check: { white: false, black: false }, 
  gameOver: null, 
  winner: null, 
  gameSettings: {
    timeControl: 10, 
    showPossibleMoves: true, 
    flipBoard: false 
  }
};


function gameReducer(state, action) {
  switch (action.type) {
    case GameActions.SET_GAME_ID: {
      return {
        ...state,
        gameId: action.payload
      };
    }
    
    case GameActions.SET_GAME_STATE: {
      const gameState = action.payload;
      return {
        ...state,
        boardState: gameState.boardState,
        currentPlayer: gameState.currentPlayer,
        moveHistory: gameState.moveHistory || [],
        capturedPieces: gameState.capturedPieces || { white: [], black: [] },
        check: {
          white: gameState.check && gameState.currentPlayer === 'black',
          black: gameState.check && gameState.currentPlayer === 'white'
        },
        gameOver: gameState.gameOver,
        winner: gameState.winner
      };
    }
    
    case GameActions.SELECT_PIECE: {
      return {
        ...state,
        selectedPiece: action.payload.piece,
        possibleMoves: action.payload.moves
      };
    }
    
    case GameActions.RESET_SELECTION: {
      return {
        ...state,
        selectedPiece: null,
        possibleMoves: []
      };
    }
    
    case GameActions.UPDATE_TIME: {
      return {
        ...state,
        whiteTime: action.payload.whiteTime,
        blackTime: action.payload.blackTime
      };
    }
    
    case GameActions.SET_CHECK: {
      const newCheck = { ...state.check };
      newCheck[action.payload.player] = action.payload.inCheck;
      
      return {
        ...state,
        check: newCheck
      };
    }
    
    case GameActions.END_GAME: {
      return {
        ...state,
        gameOver: action.payload.reason,
        winner: action.payload.winner,
        gameActive: false
      };
    }
    
    case GameActions.RESTART_GAME: {
      return {
        ...initialState,
        gameSettings: state.gameSettings, 
        whiteTime: state.gameSettings.timeControl * 60,
        blackTime: state.gameSettings.timeControl * 60
      };
    }
    
    case GameActions.UPDATE_SETTINGS: {
      const newSettings = { ...state.gameSettings, ...action.payload };
      
      const timeUpdated = action.payload.timeControl !== undefined;
      
      return {
        ...state,
        gameSettings: newSettings,
        whiteTime: timeUpdated ? action.payload.timeControl * 60 : state.whiteTime,
        blackTime: timeUpdated ? action.payload.timeControl * 60 : state.blackTime
      };
    }
    
    default:
      return state;
  }
}

const GameContext = createContext();

export const useGameContext = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const newGame = await ChessApiService.createNewGame();
        dispatch({ type: GameActions.SET_GAME_ID, payload: newGame.id });
        
        // Verifică dacă starea tablei a fost returnată corect de la backend
        if (newGame && newGame.boardState && 
            Array.isArray(newGame.boardState) && 
            newGame.boardState.length === 8) {
          dispatch({ type: GameActions.SET_GAME_STATE, payload: newGame });
        } else {
          console.warn('Backend nu a returnat o stare validă a tablei, folosesc starea inițială predefinită');
          // Activăm jocul chiar dacă backend-ul nu a funcționat
          dispatch({ 
            type: GameActions.SET_GAME_STATE, 
            payload: {
              boardState: createInitialBoardState(),
              currentPlayer: 'white',
              moveHistory: [],
              capturedPieces: { white: [], black: [] },
              check: { white: false, black: false },
              gameOver: null,
              winner: null
            }
          });
        }
      } catch (error) {
        console.error('Eroare la inițializarea jocului:', error);
        // Activăm jocul chiar dacă apare o eroare
        dispatch({ 
          type: GameActions.SET_GAME_STATE, 
          payload: {
            boardState: createInitialBoardState(),
            currentPlayer: 'white',
            moveHistory: [],
            capturedPieces: { white: [], black: [] },
            check: { white: false, black: false },
            gameOver: null,
            winner: null
          }
        });
      }
    };
    
    initializeGame();
  }, []);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};