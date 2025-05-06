namespace Backend.Models
{
    public class ChessPiece
    {
        public string Type { get; set; } // pawn, rook, knight, bishop, queen, king
        public string Color { get; set; } // white, black
        public override string ToString()
        {
            return $"{Type}-{Color}";
        }
    }
}