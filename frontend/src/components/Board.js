import React from 'react';
import Square from './Square';
import Piece from './Piece';
import { useGameContext, GameActions } from './GameContext';
import { getValidMoves, isKingInCheck, isCheckMateOrStaleMate } from '../components/ChessUrils';
import './styleComponents/Board.css';

function Board() {
  const { state, dispatch } = useGameContext();
  const { 
    boardState, 
    currentPlayer, 
    selectedPiece, 
    possibleMoves, 
    check,
    gameSettings
  } = state;

  const handleSquareClick = (row, col) => {
    // Verifică dacă jocul s-a terminat
    if (state.gameOver) return;

    // Dacă există o piesă selectată și se dă click pe o poziție validă
    if (selectedPiece && possibleMoves.some(move => move[0] === row && move[1] === col)) {
      // Execută mutarea
      dispatch({
        type: GameActions.MOVE_PIECE,
        payload: {
          fromRow: selectedPiece.row,
          fromCol: selectedPiece.col,
          toRow: row,
          toCol: col
        }
      });
      
      // După mutare, verifică dacă celălalt jucător este în șah
      const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
      
      // Creăm o copie temporară a tablei pentru a simula mutarea
      const tempBoardState = boardState.map(r => [...r]);
      tempBoardState[row][col] = tempBoardState[selectedPiece.row][selectedPiece.col];
      tempBoardState[selectedPiece.row][selectedPiece.col] = null;
      
      // Verifică dacă adversarul este în șah după mutare
      const isInCheck = isKingInCheck(tempBoardState, nextPlayer);
      dispatch({
        type: GameActions.SET_CHECK,
        payload: {
          player: nextPlayer,
          inCheck: isInCheck
        }
      });
      
      // Verifică dacă este șah mat sau pat
      if (isInCheck) {
        const gameState = isCheckMateOrStaleMate(tempBoardState, nextPlayer);
        if (gameState.checkmate) {
          dispatch({
            type: GameActions.END_GAME,
            payload: {
              reason: 'checkmate',
              winner: currentPlayer
            }
          });
        }
      } else {
        const gameState = isCheckMateOrStaleMate(tempBoardState, nextPlayer);
        if (gameState.stalemate) {
          dispatch({
            type: GameActions.END_GAME,
            payload: {
              reason: 'stalemate',
              winner: 'draw'
            }
          });
        }
      }
    } 
    // Dacă se dă click pe o piesă proprie
    else if (boardState[row][col]) {
      const piece = boardState[row][col];
      const pieceColor = piece.includes('white') ? 'white' : 'black';
      
      if (pieceColor === currentPlayer) {
        const validMoves = getValidMoves(boardState, piece, row, col, currentPlayer);
        
        if (validMoves.length > 0) {
          dispatch({
            type: GameActions.SELECT_PIECE,
            payload: {
              piece: { row, col, type: piece },
              moves: validMoves
            }
          });
        }
      }
    } else {
      // Click pe un pătrat gol, resetează selecția
      dispatch({ type: GameActions.RESET_SELECTION });
    }
  };

  const renderBoard = () => {
    const board = [];
    
    // Decide ordinea de afișare în funcție de setarea 'flipBoard'
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
        
        // Verifică dacă pătratul este unul din mișcările posibile
        const isHighlighted = gameSettings.showPossibleMoves && 
                              possibleMoves.some(move => move[0] === i && move[1] === j);
        
        // Verifică dacă pătratul conține piesa selectată
        const isSelected = selectedPiece && selectedPiece.piece.row === i && selectedPiece.piece.col === j;
        
        // Verifică dacă pătratul conține un rege în șah
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
      <div className={`player-indicator ${state.gameOver ? 'game-over' : ''}`}>
        {state.gameOver ? (
          <div>
            Joc terminat: {state.gameOver}
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