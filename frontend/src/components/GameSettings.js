import React, { useState } from 'react';
import { useGameContext, GameActions } from './GameContext';
import SaveGameModal from './SaveGameModal';
// import '../styleComponents/GameSettings.css';

function GameSettings() {
  const { state, dispatch } = useGameContext();
  const { gameSettings } = state;
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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

  const handleRestartGame = () => {
    if (window.confirm('Ești sigur că vrei să reîncepi jocul?')) {
      dispatch({ type: GameActions.RESTART_GAME });
    }
  };

  const openSaveModal = () => {
    setIsSaveModalOpen(true);
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
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
        <button className="save-button" onClick={openSaveModal}>
          Salvează Joc
        </button>
      </div>
      
      <SaveGameModal isOpen={isSaveModalOpen} onClose={closeSaveModal} />
      
      <div className="future-feature">
        <h4>Viitoare integrare cu .NET Core</h4>
        <ul>
          <li>Salvarea jocurilor</li>
          <li>Multiplayer online</li>
          <li>Statistici jucători</li>
          <li>Autentificare utilizatori</li>
        </ul>
      </div>
    </div>
  );
}

export default GameSettings;