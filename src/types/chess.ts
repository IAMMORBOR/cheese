export type Piece = 
  | 'white-pawn' | 'white-rook' | 'white-knight' | 'white-bishop' | 'white-queen' | 'white-king'
  | 'black-pawn' | 'black-rook' | 'black-knight' | 'black-bishop' | 'black-queen' | 'black-king';

export interface Position {
  row: number;
  col: number;
}