namespace Backend.Models
{
    public class ChessBoard
    {
        // Tabla de șah 8x8, null reprezintă pătratul gol
        public ChessPiece?[,] Board { get; set; } = new ChessPiece?[8, 8];

        public ChessBoard()
        {
            InitializeBoard();
        }

        private void InitializeBoard()
        {
            // Inițializare pieselor negre
            Board[0, 0] = new ChessPiece { Type = "rook", Color = "black" };
            Board[0, 1] = new ChessPiece { Type = "knight", Color = "black" };
            Board[0, 2] = new ChessPiece { Type = "bishop", Color = "black" };
            Board[0, 3] = new ChessPiece { Type = "queen", Color = "black" };
            Board[0, 4] = new ChessPiece { Type = "king", Color = "black" };
            Board[0, 5] = new ChessPiece { Type = "bishop", Color = "black" };
            Board[0, 6] = new ChessPiece { Type = "knight", Color = "black" };
            Board[0, 7] = new ChessPiece { Type = "rook", Color = "black" };

            for (int i = 0; i < 8; i++)
            {
                Board[1, i] = new ChessPiece { Type = "pawn", Color = "black" };
            }

            // Inițializare pieselor albe
            Board[7, 0] = new ChessPiece { Type = "rook", Color = "white" };
            Board[7, 1] = new ChessPiece { Type = "knight", Color = "white" };
            Board[7, 2] = new ChessPiece { Type = "bishop", Color = "white" };
            Board[7, 3] = new ChessPiece { Type = "queen", Color = "white" };
            Board[7, 4] = new ChessPiece { Type = "king", Color = "white" };
            Board[7, 5] = new ChessPiece { Type = "bishop", Color = "white" };
            Board[7, 6] = new ChessPiece { Type = "knight", Color = "white" };
            Board[7, 7] = new ChessPiece { Type = "rook", Color = "white" };

            for (int i = 0; i < 8; i++)
            {
                Board[6, i] = new ChessPiece { Type = "pawn", Color = "white" };
            }
        }

        // Convertește matricea internă în formatul așteptat de frontend
        public string?[][] ToBoardState()
        {
            string?[][] result = new string?[8][];
            
            for (int i = 0; i < 8; i++)
            {
                result[i] = new string?[8];
                for (int j = 0; j < 8; j++)
                {
                    result[i][j] = Board[i, j]?.ToString();
                }
            }
            
            return result;
        }

        // Setează tabla într-o stare specificată
        public void SetBoard(string?[][] boardState)
        {
            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    if (boardState[i][j] == null)
                    {
                        Board[i, j] = null;
                    }
                    else
                    {
                        // Verifică dacă boardState[i][j] nu este null înainte de a-l folosi
                        string[] parts = boardState[i][j]!.Split('-');
                        Board[i, j] = new ChessPiece { Type = parts[0], Color = parts[1] };
                    }
                }
            }
        }
    }
}