using System.Collections.Generic;

namespace Backend.Models
{

    
    public class GameState
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public ChessBoard Board { get; set; } = new ChessBoard();
        public string CurrentPlayer { get; set; } = "white";
        public List<string> MoveHistory { get; set; } = new List<string>();
        public Dictionary<string, List<string>> CapturedPieces { get; set; } = new Dictionary<string, List<string>> 
        {
            { "white", new List<string>() },
            { "black", new List<string>() }
        };
        public Dictionary<string, bool> Check { get; set; } = new Dictionary<string, bool>
        {
            { "white", false },
            { "black", false }
        };
        public string? GameOver { get; set; } = null;
        public string? Winner { get; set; } = null;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime LastUpdated { get; set; } = DateTime.Now;
    }

    
}