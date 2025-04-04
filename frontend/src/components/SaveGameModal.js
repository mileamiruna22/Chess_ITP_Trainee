import React, { useState } from 'react';
import { useGameContext } from './GameContext';
import { GameStorageService } from './GameStorageService';
import '../components/styleComponents/SaveGameModal.css';

function SaveGameModal({ isOpen, onClose }) {
  const { state } = useGameContext();
  const [saveName, setSaveName] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  // Dacă modalul nu este deschis, nu afișăm nimic
  if (!isOpen) return null;

  const handleSave = () => {
    try {
      // Generăm un nume implicit dacă nu este furnizat unul
      const name = saveName.trim() || `Partidă ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
      
      // Salvăm jocul
      const saveId = GameStorageService.saveGame(state, name);
      
      if (saveId) {
        setSaveStatus({
          success: true,
          message: `Jocul a fost salvat cu succes ca "${name}"!`
        });
        
        // Resetăm formul după salvare reușită
        setSaveName('');
        
        // Închide modalul după 2 secunde
        setTimeout(() => {
          onClose();
          setSaveStatus(null);
        }, 2000);
      } else {
        setSaveStatus({
          success: false,
          message: 'A apărut o eroare la salvarea jocului. Încercați din nou.'
        });
      }
    } catch (error) {
      console.error('Eroare la salvarea jocului:', error);
      setSaveStatus({
        success: false,
        message: 'A apărut o eroare la salvarea jocului. Încercați din nou.'
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Salvează Partida</h2>
        
        <div className="form-group">
          <label htmlFor="save-name">Numele salvării:</label>
          <input
            id="save-name"
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Partidă vs Computer 01.04.2025"
          />
        </div>
        
        <div className="game-info-summary">
          <p>Jucător curent: {state.currentPlayer === 'white' ? 'Alb' : 'Negru'}</p>
          <p>Număr de mutări: {state.moveHistory.length}</p>
          <p>Status: {state.gameOver ? `Terminat (${state.gameOver})` : 'În desfășurare'}</p>
        </div>
        
        {saveStatus && (
          <div className={`save-status ${saveStatus.success ? 'success' : 'error'}`}>
            {saveStatus.message}
          </div>
        )}
        
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSave}>
            Salvează
          </button>
          <button className="cancel-button" onClick={onClose}>
            Anulează
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveGameModal;