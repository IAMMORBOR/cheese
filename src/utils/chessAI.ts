import { Piece, Position } from '../types/chess';
import { getValidMoves } from './chessRules';

interface Move {
  from: Position;
  to: Position;
  score: number;
}

const PIECE_VALUES: Record<string, number> = {
  'pawn': 1,
  'knight': 3,
  'bishop': 3,
  'rook': 5,
  'queen': 9,
  'king': 100
};

export const evaluateBoard = (board: (Piece | null)[][]): number => {
  let score = 0;
  
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (!piece) return;
      
      const [color, type] = piece.split('-');
      const value = PIECE_VALUES[type];
      const positionBonus = type === 'pawn' ? getPawnPositionBonus(i, j, color) : 0;
      
      score += (color === 'white' ? -1 : 1) * (value + positionBonus);
    });
  });
  
  return score;
};

const getPawnPositionBonus = (row: number, col: number, color: string): number => {
  // Bonus for pawns advancing towards promotion
  const promotionBonus = color === 'black' ? row * 0.1 : (7 - row) * 0.1;
  // Bonus for central pawns
  const centerBonus = Math.abs(3.5 - col) < 2 ? 0.2 : 0;
  return promotionBonus + centerBonus;
};

export const findBestMove = (board: (Piece | null)[][], depth: number = 3): Move | null => {
  const moves: Move[] = [];
  
  // Generate all possible moves for black pieces
  board.forEach((row, i) => {
    row.forEach((piece, j) => {
      if (!piece?.startsWith('black')) return;
      
      const validMoves = getValidMoves(board, { row: i, col: j });
      validMoves.forEach(to => {
        const move: Move = {
          from: { row: i, col: j },
          to,
          score: 0
        };
        
        // Simulate move and evaluate
        const newBoard = simulateMove(board, move);
        move.score = minimax(newBoard, depth - 1, false, -Infinity, Infinity);
        
        moves.push(move);
      });
    });
  });
  
  if (moves.length === 0) return null;
  
  // Sort moves by score and add some randomness for variety
  moves.sort((a, b) => b.score - a.score);
  const topMoves = moves.slice(0, 3); // Consider top 3 moves
  return topMoves[Math.floor(Math.random() * topMoves.length)];
};

const minimax = (
  board: (Piece | null)[][],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number
): number => {
  if (depth === 0) return evaluateBoard(board);
  
  let bestScore = isMaximizing ? -Infinity : Infinity;
  
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (!piece || piece.startsWith(isMaximizing ? 'white' : 'black')) continue;
      
      const validMoves = getValidMoves(board, { row: i, col: j });
      for (const to of validMoves) {
        const newBoard = simulateMove(board, { from: { row: i, col: j }, to, score: 0 });
        const score = minimax(newBoard, depth - 1, !isMaximizing, alpha, beta);
        
        if (isMaximizing) {
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
        } else {
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, score);
        }
        
        if (beta <= alpha) break;
      }
    }
  }
  
  return bestScore;
};

const simulateMove = (board: (Piece | null)[][], move: Move): (Piece | null)[][] => {
  const newBoard = board.map(row => [...row]);
  newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
  newBoard[move.from.row][move.from.col] = null;
  return newBoard;
};