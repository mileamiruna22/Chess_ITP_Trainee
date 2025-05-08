import React from 'react';
import Square from './Square';
import Piece from './Piece';
import { useGameContext, GameActions } from './GameContext';
import { ChessApiService } from './ChessApiService';
import './styleComponents/Board.css';

function Board() {
  const { state, dispatch } = useGameContext();
  const { 
    gameId,
    boardState, 
    currentPlayer, 
    selectedPiece, 
    possibleMoves, 
    check,
    gameSettings,
    gameOver
  } = state;

  const handleSquareClick = async (row, col) => {
    
    if (gameOver) return;

    
    if (selectedPiece && possibleMoves.some(move => move[0] === row && move[1] === col)) {
      try {
        
        const gameState = await ChessApiService.makeMove(
          gameId, 
          selectedPiece.row, 
          selectedPiece.col, 
          row, 
          col
        );
        
        
        dispatch({
          type: GameActions.SET_GAME_STATE,
          payload: gameState
        });
        
        
        dispatch({ type: GameActions.RESET_SELECTION });
      } catch (error) {
        console.error('Eroare la efectuarea mutării:', error);
        
        dispatch({ type: GameActions.RESET_SELECTION });
      }
    } 
   
    else if (boardState[row][col]) {
      const piece = boardState[row][col];
      const pieceColor = piece.includes('white') ? 'white' : 'black';
      
     
      if (pieceColor === currentPlayer) {
        try {
         
          const validMoves = await ChessApiService.getValidMoves(gameId, row, col);
          
          if (validMoves && validMoves.length > 0) {
            dispatch({
              type: GameActions.SELECT_PIECE,
              payload: {
                piece: { row, col, type: piece },
                moves: validMoves
              }
            });
          }
        } catch (error) {
          console.error('Eroare la obținerea mutărilor valide:', error);
        }
      }
    } else {
      
      dispatch({ type: GameActions.RESET_SELECTION });
    }
  };

  const renderBoard = () => {
    const board = [];
    
   
    const rows = gameSettings.flipBoard
      ? [...Array(8).keys()]
      : [...Array(8).keys()].reverse();
    
    const cols = gameSettings.flipBoard
      ? [...Array(8).keys()].reverse()
      : [...Array(8).keys()];
    
    for (const i of rows) {
      const row = [];
      for (const j of cols) {
        const isEvenRow = i % 2 === 0;
        const isEvenColumn = j % 2 === 0;
        const squareColor = (isEvenRow && isEvenColumn) || (!isEvenRow && !isEvenColumn) ? 'white' : 'black';
        const piece = boardState[i][j];
        
        
        const isHighlighted = gameSettings.showPossibleMoves && 
                              possibleMoves.some(move => move[0] === i && move[1] === j);
        
        
        const isSelected = selectedPiece && selectedPiece.row === i && selectedPiece.col === j;
        
        const isCheck = piece && 
                        (piece === 'king-white' && check.white) || 
                        (piece === 'king-black' && check.black);
        
        row.push(
          <Square 
            key={`${i}-${j}`} 
            color={squareColor}
            highlighted={isHighlighted}
            selected={isSelected}
            check={isCheck}
            onClick={() => handleSquareClick(i, j)}
            coordinates={{ row: i, col: j }}
            showCoordinates={true}
          >
            {piece && <Piece piece={piece} />}
          </Square>
        );
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
    return board;
  };

  return (
    <div className="board-container">
      <div className={`player-indicator ${gameOver ? 'game-over' : ''}`}>
        {gameOver ? (
          <div>
            Joc terminat: {gameOver}
            {state.winner === 'draw' ? ' - Remiză' : ` - ${state.winner === 'white' ? 'Albul' : 'Negrul'} a câștigat`}
          </div>
        ) : (
          <div>
            {currentPlayer === 'white' ? 'Albul la mutare' : 'Negrul la mutare'}
            {check[currentPlayer] ? ' - ȘAH!' : ''}
          </div>
        )}
      </div>
      <div className="board">{renderBoard()}</div>
    </div>
  );
}

export default Board;