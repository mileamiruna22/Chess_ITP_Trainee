// Utilități pentru logica șahului

// Verifică dacă o mutare este validă pentru o piesă dată
export function getValidMoves(boardState, piece, row, col, currentPlayer) {
    // Verifică dacă piesa aparține jucătorului curent
    const pieceColor = piece.includes('white') ? 'white' : 'black';
    if (pieceColor !== currentPlayer) return [];
  
    // În funcție de tipul piesei, apelăm funcția specifică
    if (piece.includes('pawn')) {
      return getPawnMoves(boardState, row, col, pieceColor);
    } else if (piece.includes('rook')) {
      return getRookMoves(boardState, row, col, pieceColor);
    } else if (piece.includes('knight')) {
      return getKnightMoves(boardState, row, col, pieceColor);
    } else if (piece.includes('bishop')) {
      return getBishopMoves(boardState, row, col, pieceColor);
    } else if (piece.includes('queen')) {
      return getQueenMoves(boardState, row, col, pieceColor);
    } else if (piece.includes('king')) {
      return getKingMoves(boardState, row, col, pieceColor);
    }
    
    return [];
  }
  
  // Funcții specifice pentru mutările fiecărei piese
  function getPawnMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const direction = pieceColor === 'white' ? -1 : 1;
    const startRow = pieceColor === 'white' ? 6 : 1;
    
    // Mișcare înainte cu o poziție
    if (isWithinBoard(row + direction, col) && !boardState[row + direction][col]) {
      moves.push([row + direction, col]);
      
      // Mișcare dublă din poziția inițială
      if (row === startRow && !boardState[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
    
    // Capturi diagonale
    const captureOffsets = [[-1, 1], [1, 1]]; // [col offset, row offset]
    for (const [colOffset] of captureOffsets) {
      const newCol = col + colOffset;
      const newRow = row + direction;
      
      if (isWithinBoard(newRow, newCol) && boardState[newRow][newCol]) {
        const targetPiece = boardState[newRow][newCol];
        const targetColor = targetPiece.includes('white') ? 'white' : 'black';
        
        if (targetColor !== pieceColor) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }
  
  function getRookMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const directions = [
      [-1, 0], // sus
      [1, 0],  // jos
      [0, -1], // stânga
      [0, 1]   // dreapta
    ];
    
    for (const [rowDir, colDir] of directions) {
      let currentRow = row + rowDir;
      let currentCol = col + colDir;
      
      while (isWithinBoard(currentRow, currentCol)) {
        const targetPiece = boardState[currentRow][currentCol];
        
        if (!targetPiece) {
          // Pătratul este gol, putem continua
          moves.push([currentRow, currentCol]);
        } else {
          // Am întâlnit o piesă
          const targetColor = targetPiece.includes('white') ? 'white' : 'black';
          
          if (targetColor !== pieceColor) {
            // Putem captura piesa adversă
            moves.push([currentRow, currentCol]);
          }
          
          // Ne oprim din căutare în această direcție
          break;
        }
        
        currentRow += rowDir;
        currentCol += colDir;
      }
    }
    
    return moves;
  }
  
  function getKnightMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    for (const [rowOffset, colOffset] of knightOffsets) {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;
      
      if (isWithinBoard(newRow, newCol)) {
        const targetPiece = boardState[newRow][newCol];
        
        if (!targetPiece || (targetPiece && !targetPiece.includes(pieceColor))) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    return moves;
  }
  
  function getBishopMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const directions = [
      [-1, -1], // stânga-sus
      [-1, 1],  // dreapta-sus
      [1, -1],  // stânga-jos
      [1, 1]    // dreapta-jos
    ];
    
    for (const [rowDir, colDir] of directions) {
      let currentRow = row + rowDir;
      let currentCol = col + colDir;
      
      while (isWithinBoard(currentRow, currentCol)) {
        const targetPiece = boardState[currentRow][currentCol];
        
        if (!targetPiece) {
          moves.push([currentRow, currentCol]);
        } else {
          const targetColor = targetPiece.includes('white') ? 'white' : 'black';
          
          if (targetColor !== pieceColor) {
            moves.push([currentRow, currentCol]);
          }
          
          break;
        }
        
        currentRow += rowDir;
        currentCol += colDir;
      }
    }
    
    return moves;
  }
  
  function getQueenMoves(boardState, row, col, pieceColor) {
    // Regina se mișcă ca turnul și nebunul combinate
    return [
      ...getRookMoves(boardState, row, col, pieceColor),
      ...getBishopMoves(boardState, row, col, pieceColor)
    ];
  }
  
  function getKingMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    for (const [rowDir, colDir] of directions) {
      const newRow = row + rowDir;
      const newCol = col + colDir;
      
      if (isWithinBoard(newRow, newCol)) {
        const targetPiece = boardState[newRow][newCol];
        
        if (!targetPiece || (targetPiece && !targetPiece.includes(pieceColor))) {
          moves.push([newRow, newCol]);
        }
      }
    }
    
    // TODO: Adaugă logica pentru rocadă
    
    return moves;
  }
  
  // Verifică dacă o poziție este în limitele tablei
  function isWithinBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }
  
  // Verifică dacă regele este în șah
  export function isKingInCheck(boardState, playerColor) {
    // Găsim poziția regelui
    let kingRow = -1;
    let kingCol = -1;
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece === `king-${playerColor}`) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    // Verifică dacă vreo piesă adversă poate captura regele
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.includes(opponentColor)) {
          const validMoves = getValidMoves(boardState, piece, row, col, opponentColor);
          
          // Dacă regele e într-una din mutările valide, e în șah
          if (validMoves.some(([r, c]) => r === kingRow && c === kingCol)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
  // Verifică dacă este șah mat sau pat
  export function isCheckMateOrStaleMate(boardState, playerColor) {
    const inCheck = isKingInCheck(boardState, playerColor);
    
    // Verificăm dacă jucătorul curent are vreo mutare validă
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.includes(playerColor)) {
          const validMoves = getValidMoves(boardState, piece, row, col, playerColor);
          
          // Pentru fiecare mutare validă, verificăm dacă după mutare regele nu mai e în șah
          for (const [newRow, newCol] of validMoves) {
            // Simulăm mutarea
            const tempBoardState = boardState.map(r => [...r]);
            const movingPiece = tempBoardState[row][col];
            tempBoardState[newRow][newCol] = movingPiece;
            tempBoardState[row][col] = null;
            
            // Verificăm dacă după mutare regele nu mai e în șah
            if (!isKingInCheck(tempBoardState, playerColor)) {
              // Am găsit o mutare care scapă de șah
              return false;
            }
          }
        }
      }
    }
    
    // Dacă nu am găsit nicio mutare validă
    return {
      checkmate: inCheck,      // Șah mat dacă e în șah
      stalemate: !inCheck      // Pat dacă nu e în șah
    };
  }