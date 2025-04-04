// Un serviciu pentru salvarea și încărcarea partidelor din localStorage

export const GameStorageService = {
    // Salvează jocul curent în localStorage
    saveGame: (gameState, saveName) => {
      try {
        // Extrage doar informațiile relevante pentru salvare
        const gameToSave = {
          boardState: gameState.boardState,
          currentPlayer: gameState.currentPlayer,
          moveHistory: gameState.moveHistory,
          capturedPieces: gameState.capturedPieces,
          check: gameState.check,
          gameOver: gameState.gameOver,
          winner: gameState.winner,
          date: new Date().toISOString()
        };
        
        // Generează un ID pentru salvare dacă nu este furnizat unul
        const saveId = saveName || `chess_save_${new Date().getTime()}`;
        
        // Obține lista existentă de salvări
        const savedGames = JSON.parse(localStorage.getItem('chessGameSaves') || '{}');
        
        // Adaugă noul joc salvat
        savedGames[saveId] = gameToSave;
        
        // Salvează înapoi în localStorage
        localStorage.setItem('chessGameSaves', JSON.stringify(savedGames));
        
        return saveId;
      } catch (error) {
        console.error('Eroare la salvarea jocului:', error);
        return null;
      }
    },
    
    // Încarcă un joc salvat din localStorage
    loadGame: (saveId) => {
      try {
        const savedGames = JSON.parse(localStorage.getItem('chessGameSaves') || '{}');
        return savedGames[saveId] || null;
      } catch (error) {
        console.error('Eroare la încărcarea jocului:', error);
        return null;
      }
    },
    
    // Obține lista tuturor jocurilor salvate
    getAllSavedGames: () => {
      try {
        const savedGames = JSON.parse(localStorage.getItem('chessGameSaves') || '{}');
        
        // Transformă obiectul într-o listă cu ID și metadate
        return Object.entries(savedGames).map(([id, game]) => ({
          id,
          date: game.date,
          currentPlayer: game.currentPlayer,
          moveCount: game.moveHistory.length,
          status: game.gameOver ? 'Terminat' : 'În desfășurare'
        }));
      } catch (error) {
        console.error('Eroare la obținerea jocurilor salvate:', error);
        return [];
      }
    },
    
    // Șterge un joc salvat
    deleteSavedGame: (saveId) => {
      try {
        const savedGames = JSON.parse(localStorage.getItem('chessGameSaves') || '{}');
        
        if (savedGames[saveId]) {
          delete savedGames[saveId];
          localStorage.setItem('chessGameSaves', JSON.stringify(savedGames));
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Eroare la ștergerea jocului salvat:', error);
        return false;
      }
    }
  };