namespace Backend.Models
{
    public class ChessPiece
    {
        public string Type { get; set; } 
        public string Color { get; set; } 
        public override string ToString()
        {
            return $"{Type}-{Color}";
        }
    }
}