import React, { useState, useEffect } from 'react';
import { useGameContext, GameActions } from './GameContext';
import { GameStorageService } from './GameStorageService';
import './styleComponents/LoadGameComponent.css';

function LoadGameComponent() {
  const { dispatch } = useGameContext();
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Încărcăm jocurile salvate la montarea componentei
  useEffect(() => {
    try {
      const games = GameStorageService.getAllSavedGames();
      setSavedGames(games);
      setLoading(false);
    } catch (err) {
      console.error('Eroare la încărcarea jocurilor salvate:', err);
      setError('A apărut o eroare la încărcarea jocurilor salvate.');
      setLoading(false);
    }
  }, []);

  const handleLoadGame = (saveId) => {
    try {
      const loadedGame = GameStorageService.loadGame(saveId);
      
      if (loadedGame) {
        // Implementăm un nou tip de acțiune pentru a încărca jocul
        dispatch({
          type: 'LOAD_GAME',  // Asigurați-vă că adăugați acest tip de acțiune în reducer
          payload: loadedGame
        });
      }
    } catch (err) {
      console.error('Eroare la încărcarea jocului:', err);
      setError('A apărut o eroare la încărcarea jocului.');
    }
  };

  const handleDeleteGame = (saveId, event) => {
    // Oprim propagarea evenimentului pentru a preveni declanșarea handleLoadGame
    event.stopPropagation();
    
    try {
      const confirmed = window.confirm('Ești sigur că vrei să ștergi acest joc salvat?');
      
      if (confirmed) {
        const result = GameStorageService.deleteSavedGame(saveId);
        
        if (result) {
          // Actualizăm lista după ștergere
          setSavedGames(savedGames.filter(game => game.id !== saveId));
        }
      }
    } catch (err) {
      console.error('Eroare la ștergerea jocului:', err);
      setError('A apărut o eroare la ștergerea jocului.');
    }
  };

  if (loading) {
    return <div className="loading">Se încarcă jocurile salvate...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (savedGames.length === 0) {
    return <div className="no-games">Nu există jocuri salvate.</div>;
  }

  return (
    <div className="load-game-container">
      <h3>Jocuri Salvate</h3>
      
      <div className="saved-games-list">
        {savedGames.map(game => (
          <div 
            key={game.id} 
            className="saved-game-item"
            onClick={() => handleLoadGame(game.id)}
          >
            <div className="game-info">
              <div className="game-name">{game.id}</div>
              <div className="game-meta">
                <span>Data: {new Date(game.date).toLocaleString()}</span>
                <span>Jucător: {game.currentPlayer === 'white' ? 'Alb' : 'Negru'}</span>
                <span>Mutări: {game.moveCount}</span>
                <span className={`game-status ${game.status === 'Terminat' ? 'ended' : ''}`}>
                  {game.status}
                </span>
              </div>
            </div>
            
            <button 
              className="delete-button" 
              onClick={(e) => handleDeleteGame(game.id, e)}
            >
              Șterge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadGameComponent;