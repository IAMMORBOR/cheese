import React from 'react';
import { Piece } from '../types/chess';

interface SquareProps {
  piece: Piece | null;
  position: { row: number; col: number };
  isSelected: boolean;
  isValidMove: boolean;
  onClick: () => void;
}

export const Square: React.FC<SquareProps> = ({
  piece,
  position,
  isSelected,
  isValidMove,
  onClick,
}) => {
  const isDark = (position.row + position.col) % 2 === 1;
  
  const baseClasses = `
    w-20 h-20 flex items-center justify-center relative
    transition-all duration-200 cursor-pointer
  `;

  const backgroundClasses = isDark
    ? 'bg-gray-600'
    : 'bg-gray-300';

  const stateClasses = isSelected
    ? 'ring-4 ring-blue-400 ring-inset'
    : isValidMove
    ? 'ring-4 ring-green-400 ring-opacity-50 ring-inset'
    : '';

  const getPieceSymbol = (piece: Piece) => {
    const symbols: Record<string, string> = {
      'white-pawn': '♙',
      'white-rook': '♖',
      'white-knight': '♘',
      'white-bishop': '♗',
      'white-queen': '♕',
      'white-king': '♔',
      'black-pawn': '♟',
      'black-rook': '♜',
      'black-knight': '♞',
      'black-bishop': '♝',
      'black-queen': '♛',
      'black-king': '♚',
    };
    return symbols[piece];
  };

  return (
    <div
      className={`${baseClasses} ${backgroundClasses} ${stateClasses}`}
      onClick={onClick}
    >
      {piece && (
        <span
          className={`text-5xl ${
            piece.startsWith('white') ? 'text-white' : 'text-black'
          }`}
        >
          {getPieceSymbol(piece)}
        </span>
      )}
    </div>
  );
};