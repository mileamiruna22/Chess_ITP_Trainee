const API_BASE_URL = 'http://localhost:5230/api/Chess'; 

export const ChessApiService = {
 
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
  
  
  makeMove: async (gameId, fromRow, fromCol, toRow, toCol) => {
    try {
     
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