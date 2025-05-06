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

// Starea inițială - vom prelua valorile reale de la backend
const initialState = {
  gameId: null,
  boardState: Array(8).fill(null).map(() => Array(8).fill(null)),
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
  
  // Creăm un joc nou când se încarcă aplicația
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const newGame = await ChessApiService.createNewGame();
        dispatch({ type: GameActions.SET_GAME_ID, payload: newGame.id });
        dispatch({ type: GameActions.SET_GAME_STATE, payload: newGame });
      } catch (error) {
        console.error('Eroare la inițializarea jocului:', error);
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