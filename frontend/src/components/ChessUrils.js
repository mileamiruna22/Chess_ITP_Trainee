
export function getValidMoves(boardState, piece, row, col, currentPlayer) {
    
    const pieceColor = piece.includes('white') ? 'white' : 'black';
    if (pieceColor !== currentPlayer) return [];
  
  
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
  
  
  function getPawnMoves(boardState, row, col, pieceColor) {
    const moves = [];
    const direction = pieceColor === 'white' ? -1 : 1;
    const startRow = pieceColor === 'white' ? 6 : 1;
    
    
    if (isWithinBoard(row + direction, col) && !boardState[row + direction][col]) {
      moves.push([row + direction, col]);
      
     
      if (row === startRow && !boardState[row + 2 * direction][col]) {
        moves.push([row + 2 * direction, col]);
      }
    }
    
    
    const captureOffsets = [[-1, 1], [1, 1]]; 
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
    
   
    return moves;
  }
  

  function isWithinBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }
  
 
  export function isKingInCheck(boardState, playerColor) {
 
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
    
    
    const opponentColor = playerColor === 'white' ? 'black' : 'white';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.includes(opponentColor)) {
          const validMoves = getValidMoves(boardState, piece, row, col, opponentColor);
          
         
          if (validMoves.some(([r, c]) => r === kingRow && c === kingCol)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
  
 
  export function isCheckMateOrStaleMate(boardState, playerColor) {
    const inCheck = isKingInCheck(boardState, playerColor);
   
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.includes(playerColor)) {
          const validMoves = getValidMoves(boardState, piece, row, col, playerColor);
          
          
          for (const [newRow, newCol] of validMoves) {
           
            const tempBoardState = boardState.map(r => [...r]);
            const movingPiece = tempBoardState[row][col];
            tempBoardState[newRow][newCol] = movingPiece;
            tempBoardState[row][col] = null;
            
            
            if (!isKingInCheck(tempBoardState, playerColor)) {
              
              return false;
            }
          }
        }
      }
    }
    
   
    return {
      checkmate: inCheck,      
      stalemate: !inCheck      
    };
  }