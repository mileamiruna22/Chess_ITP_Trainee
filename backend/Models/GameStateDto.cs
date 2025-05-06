namespace Backend.Models.Dtos
{
    public class GameStateDto
    {
        public string Id { get; set; }
        public string?[][] BoardState { get; set; }
        public string CurrentPlayer { get; set; }
        public List<string> MoveHistory { get; set; }
        public Dictionary<string, List<string>> CapturedPieces { get; set; }
        public Dictionary<string, bool> Check { get; set; }
        public string? GameOver { get; set; }
        public string? Winner { get; set; }
    }
}