import React, { useEffect } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import GameSettings from './components/GameSettings';
import { GameProvider, useGameContext, GameActions } from './components/GameContext';
import './App.css';

function ChessGame() {
  const { state, dispatch } = useGameContext();
  const { currentPlayer, gameActive, whiteTime, blackTime } = state;

  
  useEffect(() => {
    let timerId;
    
    if (gameActive) {
      timerId = setInterval(() => {
        const whiteUpdatedTime = currentPlayer === 'white' ? whiteTime - 1 : whiteTime;
        const blackUpdatedTime = currentPlayer === 'black' ? blackTime - 1 : blackTime;
        
        dispatch({
          type: GameActions.UPDATE_TIME,
          payload: {
            whiteTime: whiteUpdatedTime >= 0 ? whiteUpdatedTime : 0,
            blackTime: blackUpdatedTime >= 0 ? blackUpdatedTime : 0
          }
        });
        
        
        if ((currentPlayer === 'white' && whiteUpdatedTime <= 0) || 
            (currentPlayer === 'black' && blackUpdatedTime <= 0)) {
          dispatch({
            type: GameActions.END_GAME,
            payload: {
              reason: 'timeout',
              winner: currentPlayer === 'white' ? 'black' : 'white'
            }
          });
        }
      }, 1000);
    }
    
    return () => clearInterval(timerId);
  }, [currentPlayer, gameActive, whiteTime, blackTime, dispatch]);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dispatch({ type: GameActions.RESET_SELECTION });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="chess-app">
      <h1>Șah React</h1>
      <div className="game-container">
        <GameSettings />
        <Board />
        <GameInfo />
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <ChessGame />
    </GameProvider>
  );
}

export default App;