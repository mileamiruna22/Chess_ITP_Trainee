const API_BASE_URL = 'http://localhost:5230/api/Chess'; 

export const ChessApiService = {
  // Crează un joc nou
  createNewGame: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Eroare la crearea jocului: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare la crearea jocului nou:', error);
      throw error;
    }
  },
  
  // Obține starea curentă a jocului
  getGameState: async (gameId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${gameId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Eroare la obținerea stării jocului: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare la obținerea stării jocului:', error);
      throw error;
    }
  },
  
  // Obține mutările valide pentru o piesă
  getValidMoves: async (gameId, row, col) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${gameId}/moves/${row}/${col}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Eroare la obținerea mutărilor valide: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare la obținerea mutărilor valide:', error);
      throw error;
    }
  },
  
  // Execută o mutare
  makeMove: async (gameId, fromRow, fromCol, toRow, toCol) => {
    try {
      // Structura modificată pentru a se potrivi cu clasa Move din back-end
      const move = {
        FromRow: fromRow,
        FromCol: fromCol,
        ToRow: toRow,
        ToCol: toCol
      };
      
      const response = await fetch(`${API_BASE_URL}/${gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(move)
      });
      
      if (!response.ok) {
        throw new Error(`Eroare la efectuarea mutării: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Eroare la efectuarea mutării:', error);
      throw error;
    }
  }
};