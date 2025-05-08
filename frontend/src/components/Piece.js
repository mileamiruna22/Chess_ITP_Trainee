import React from 'react';
import '../components/styleComponents/Piece.css'; 

function Piece({ piece }) {
 
  let pieceSymbol = '';
  switch (piece) {
    case 'pawn-white': pieceSymbol = '♙'; break;
    case 'rook-white': pieceSymbol = '♖'; break;
    case 'knight-white': pieceSymbol = '♘'; break;
    case 'bishop-white': pieceSymbol = '♗'; break;
    case 'queen-white': pieceSymbol = '♕'; break;
    case 'king-white': pieceSymbol = '♔'; break;
    case 'pawn-black': pieceSymbol = '♟'; break;
    case 'rook-black': pieceSymbol = '♜'; break;
    case 'knight-black': pieceSymbol = '♞'; break;
    case 'bishop-black': pieceSymbol = '♝'; break;
    case 'queen-black': pieceSymbol = '♛'; break;
    case 'king-black': pieceSymbol = '♚'; break;
    default: break;
  }

  return <div className="piece">{pieceSymbol}</div>;
}

export default Piece;