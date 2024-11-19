import { useState, useCallback, useEffect } from 'react';
import { Piece, Position } from '../types/chess';
import { getValidMoves, isCheckmate } from '../utils/chessRules';
import { findBestMove } from '../utils/chessAI';

const initialBoard: (Piece | null)[][] = [
  ['black-rook', 'black-knight', 'black-bishop', 'black-queen', 'black-king', 'black-bishop', 'black-knight', 'black-rook'],
  Array(8).fill('black-pawn'),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill('white-pawn'),
  ['white-rook', 'white-knight', 'white-bishop', 'white-queen', 'white-king', 'white-bishop', 'white-knight', 'white-rook'],
];

export const useChessGame = () => {
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const resetGame = () => {
    setBoard(initialBoard);
    setCurrentPlayer('white');
    setSelectedPiece(null);
    setValidMoves([]);
    setWinner(null);
    setIsThinking(false);
  };

  const movePiece = (from: Position, to: Position) => {
    const newBoard = board.map(row => [...row]);
    newBoard[to.row][to.col] = board[from.row][from.col];
    newBoard[from.row][from.col] = null;
    setBoard(newBoard);
    return newBoard;
  };

  // AI move
  useEffect(() => {
    if (currentPlayer === 'black' && !winner) {
      setIsThinking(true);
      // Add a small delay to make the AI move feel more natural
      const timeoutId = setTimeout(() => {
        const bestMove = findBestMove(board);
        if (bestMove) {
          const newBoard = movePiece(bestMove.from, bestMove.to);
          
          if (isCheckmate(newBoard, 'white')) {
            setWinner('black');
          } else {
            setCurrentPlayer('white');
          }
        } else {
          setWinner('white'); // No valid moves for black
        }
        setIsThinking(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [currentPlayer, board, winner]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (winner || currentPlayer === 'black' || isThinking) return;

    const piece = board[row][col];
    
    // If no piece is selected and clicked square has a piece of current player's color
    if (!selectedPiece && piece?.startsWith(currentPlayer)) {
      setSelectedPiece({ row, col });
      setValidMoves(getValidMoves(board, { row, col }));
      return;
    }

    // If a piece is selected and clicked square is a valid move
    if (selectedPiece && validMoves.some(move => move.row === row && move.col === col)) {
      const newBoard = movePiece(selectedPiece, { row, col });
      
      if (isCheckmate(newBoard, 'black')) {
        setWinner('white');
      } else {
        setCurrentPlayer('black');
      }
      
      setSelectedPiece(null);
      setValidMoves([]);
      return;
    }

    // Deselect piece
    setSelectedPiece(null);
    setValidMoves([]);
  }, [board, currentPlayer, selectedPiece, validMoves, winner, isThinking]);

  return {
    board,
    selectedPiece,
    validMoves,
    currentPlayer,
    winner,
    isThinking,
    handleSquareClick,
    resetGame,
  };
};