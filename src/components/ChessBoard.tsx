import React from 'react';
import { useChessGame } from '../hooks/useChessGame';
import { Square } from './Square';
import { Trophy, Brain } from 'lucide-react';

export const ChessBoard = () => {
  const {
    board,
    selectedPiece,
    validMoves,
    currentPlayer,
    winner,
    isThinking,
    handleSquareClick,
    resetGame
  } = useChessGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Chess vs AI</h1>
        <p className="text-gray-300 text-lg">
          {winner ? (
            <span className="flex items-center justify-center gap-2">
              <Trophy className="text-yellow-400" />
              {winner} wins!
            </span>
          ) : isThinking ? (
            <span className="flex items-center justify-center gap-2">
              <Brain className="text-blue-400 animate-pulse" />
              AI is thinking...
            </span>
          ) : (
            `${currentPlayer === 'white' ? 'Your' : "AI's"} turn`
          )}
        </p>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg shadow-2xl">
        <div className="grid grid-cols-8 gap-0 w-[640px] h-[640px]">
          {board.map((row, i) =>
            row.map((piece, j) => (
              <Square
                key={`${i}-${j}`}
                piece={piece}
                position={{ row: i, col: j }}
                isSelected={selectedPiece?.row === i && selectedPiece?.col === j}
                isValidMove={validMoves.some(move => move.row === i && move.col === j)}
                onClick={() => handleSquareClick(i, j)}
              />
            ))
          )}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                 transition-colors duration-200 font-semibold shadow-lg"
      >
        New Game
      </button>
    </div>
  );
};