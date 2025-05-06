import React from 'react';
import { useGameContext } from './GameContext';
import './styleComponents/GameInfo.css';

function GameInfo() {
  const { state } = useGameContext();
  const { moveHistory, capturedPieces, whiteTime, blackTime, currentPlayer, gameActive } = state;

  // Formatare timp în format MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Functie pentru a ordona piesele capturate după valoare
  const orderPieces = (pieces) => {
    const pieceValue = {
      'pawn': 1,
      'knight': 3,
      'bishop': 3,
      'rook': 5,
      'queen': 9
    };

    return [...pieces].sort((a, b) => {
      const pieceA = a.split('-')[0];
      const pieceB = b.split('-')[0];
      return pieceValue[pieceB] - pieceValue[pieceA];
    });
  };

  // Render piese capturate cu simbolurile Unicode
  const renderCapturedPieces = (pieces, color) => {
    const symbols = {
      'pawn-white': '♙', 'rook-white': '♖', 'knight-white': '♘',
      'bishop-white': '♗', 'queen-white': '♕', 'king-white': '♔',
      'pawn-black': '♟', 'rook-black': '♜', 'knight-black': '♞',
      'bishop-black': '♝', 'queen-black': '♛', 'king-black': '♚'
    };

    const orderedPieces = orderPieces(pieces);
    
    return (
      <div className={`captured-pieces ${color}`}>
        {orderedPieces.map((piece, index) => (
          <span key={index} className="captured-piece">
            {symbols[piece]}
          </span>
        ))}
      </div>
    );
  };

  // Gruparea mutărilor în perechi (alb/negru)
  const groupMoves = () => {
    const groups = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      groups.push({
        number: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1] || ''
      });
    }
    return groups;
  };

  return (
    <div className="game-info">
      <div className="timer-container">
        <div className={`timer ${currentPlayer === 'black' && gameActive ? 'active' : ''}`}>
          <span className="player-label">Negru:</span>
          <span className="time">{formatTime(blackTime)}</span>
        </div>
        
        <div className={`timer ${currentPlayer === 'white' && gameActive ? 'active' : ''}`}>
          <span className="player-label">Alb:</span>
          <span className="time">{formatTime(whiteTime)}</span>
        </div>
      </div>

      <div className="captured-container">
        <h4>Piese capturate:</h4>
        {renderCapturedPieces(capturedPieces.white, 'white')}
        {renderCapturedPieces(capturedPieces.black, 'black')}
      </div>

      <div className="move-history">
        <h4>Istoric mutări:</h4>
        <div className="move-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Alb</th>
                <th>Negru</th>
              </tr>
            </thead>
            <tbody>
              {groupMoves().map((group) => (
                <tr key={group.number}>
                  <td>{group.number}.</td>
                  <td>{group.white}</td>
                  <td>{group.black}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GameInfo;