import React from 'react';
import Square from '../components/Square';
import Piece from '../components/Piece';
import '../components/styleComponents/Board.css';

const initialBoardState = [
    ['rook-black', 'knight-black', 'bishop-black', 'queen-black', 'king-black', 'bishop-black', 'knight-black', 'rook-black'],
    ['pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black', 'pawn-black'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white', 'pawn-white'],
    ['rook-white', 'knight-white', 'bishop-white', 'queen-white', 'king-white', 'bishop-white', 'knight-white', 'rook-white'],
  ];
  
  function Board() {
    const board = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        const isEvenRow = i % 2 === 0;
        const isEvenColumn = j % 2 === 0;
        const color = (isEvenRow && isEvenColumn) || (!isEvenRow && !isEvenColumn) ? 'white' : 'black';
        const piece = initialBoardState[i][j];
        row.push(
            <Square key={`<span class="math-inline">\{i\}\-</span>{j}`} color={color}>
            {piece && <Piece piece={piece} />}
          </Square>
        );
      }
      board.push(<div key={i} className="board-row">{row}</div>);
    }
  
    return <div className="board">{board}</div>;
  }
  
  export default Board;