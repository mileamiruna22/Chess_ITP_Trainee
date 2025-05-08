import React from 'react';
import { useGameContext, GameActions } from './GameContext';
import { ChessApiService } from './ChessApiService';
import './styleComponents/GameSettings.css';

function GameSettings() {
  const { state, dispatch } = useGameContext();
  const { gameSettings } = state;

  const handleTimeControlChange = (event) => {
    const timeInMinutes = parseInt(event.target.value);
    dispatch({
      type: GameActions.UPDATE_SETTINGS,
      payload: { timeControl: timeInMinutes }
    });
  };

  const handleToggleSetting = (setting) => {
    dispatch({
      type: GameActions.UPDATE_SETTINGS,
      payload: { [setting]: !gameSettings[setting] }
    });
  };

  const handleRestartGame = async () => {
    if (window.confirm('Ești sigur că vrei să reîncepi jocul?')) {
      try {
        
        const newGame = await ChessApiService.createNewGame();
        
        
        dispatch({ type: GameActions.SET_GAME_ID, payload: newGame.id });
        dispatch({ type: GameActions.SET_GAME_STATE, payload: newGame });
        
      
        dispatch({ 
          type: GameActions.UPDATE_TIME, 
          payload: {
            whiteTime: gameSettings.timeControl * 60,
            blackTime: gameSettings.timeControl * 60
          }
        });
      } catch (error) {
        console.error('Eroare la crearea unui joc nou:', error);
        alert('A apărut o eroare la reinițializarea jocului.');
      }
    }
  };

  return (
    <div className="game-settings">
      <h3>Setări Joc</h3>
      
      <div className="setting-group">
        <label>Timp de joc per jucător:</label>
        <select 
          value={gameSettings.timeControl} 
          onChange={handleTimeControlChange}
        >
          <option value="5">5 minute</option>
          <option value="10">10 minute</option>
          <option value="15">15 minute</option>
          <option value="30">30 minute</option>
        </select>
      </div>
      
      <div className="setting-group checkbox">
        <label>
          <input 
            type="checkbox" 
            checked={gameSettings.showPossibleMoves} 
            onChange={() => handleToggleSetting('showPossibleMoves')}
          />
          Afișează mutările posibile
        </label>
      </div>
      
      <div className="setting-group checkbox">
        <label>
          <input 
            type="checkbox" 
            checked={gameSettings.flipBoard} 
            onChange={() => handleToggleSetting('flipBoard')}
          />
          Inversează tabla
        </label>
      </div>
      
      <div className="setting-actions">
        <button className="restart-button" onClick={handleRestartGame}>
          Restart Joc
        </button>
      </div>
    </div>
  );
}

export default GameSettings;