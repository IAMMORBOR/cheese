import { Piece, Position } from '../types/chess';

export const getValidMoves = (board: (Piece | null)[][], position: Position): Position[] => {
  const piece = board[position.row][position.col];
  if (!piece) return [];

  const [color, type] = piece.split('-');
  const moves: Position[] = [];

  // Basic move validation - this is a simplified version
  // In a full implementation, you'd need to check for:
  // - Check/checkmate conditions
  // - En passant
  // - Castling
  // - Piece-specific move patterns

  switch (type) {
    case 'pawn':
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      // Forward move
      if (!board[position.row + direction]?.[position.col]) {
        moves.push({ row: position.row + direction, col: position.col });
        
        // Double move from starting position
        if (position.row === startRow && !board[position.row + 2 * direction]?.[position.col]) {
          moves.push({ row: position.row + 2 * direction, col: position.col });
        }
      }

      // Captures
      [-1, 1].forEach(offset => {
        const targetPiece = board[position.row + direction]?.[position.col + offset];
        if (targetPiece && targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
          moves.push({ row: position.row + direction, col: position.col + offset });
        }
      });
      break;

    case 'rook':
      // Horizontal and vertical moves
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        let r = position.row + dr;
        let c = position.col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
            moves.push({ row: r, col: c });
          }
          if (targetPiece) break;
          r += dr;
          c += dc;
        }
      });
      break;

    case 'knight':
      [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ].forEach(([dr, dc]) => {
        const r = position.row + dr;
        const c = position.col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
            moves.push({ row: r, col: c });
          }
        }
      });
      break;

    case 'bishop':
      // Diagonal moves
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => {
        let r = position.row + dr;
        let c = position.col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
            moves.push({ row: r, col: c });
          }
          if (targetPiece) break;
          r += dr;
          c += dc;
        }
      });
      break;

    case 'queen':
      // Combination of rook and bishop moves
      [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ].forEach(([dr, dc]) => {
        let r = position.row + dr;
        let c = position.col + dc;
        while (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
            moves.push({ row: r, col: c });
          }
          if (targetPiece) break;
          r += dr;
          c += dc;
        }
      });
      break;

    case 'king':
      // One square in any direction
      [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ].forEach(([dr, dc]) => {
        const r = position.row + dr;
        const c = position.col + dc;
        if (r >= 0 && r < 8 && c >= 0 && c < 8) {
          const targetPiece = board[r][c];
          if (!targetPiece || targetPiece.startsWith(color === 'white' ? 'black' : 'white')) {
            moves.push({ row: r, col: c });
          }
        }
      });
      break;
  }

  return moves;
};

export const isCheckmate = (board: (Piece | null)[][], player: 'white' | 'black'): boolean => {
  // Simplified checkmate detection
  // In a full implementation, you'd need to:
  // - Check if the king is in check
  // - Check if any move can get the king out of check
  // - Check if any piece can block the check
  // - Check if any piece can capture the attacking piece
  
  let kingFound = false;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === `${player}-king`) {
        kingFound = true;
        break;
      }
    }
    if (kingFound) break;
  }
  
  return !kingFound;
};