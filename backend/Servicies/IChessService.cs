using Backend.Models;
using Backend.Models.Dtos;

namespace Backend.Services
{
    public interface IChessService
    {
        GameState CreateNewGame();
        GameStateDto GetGameState(string gameId);
        List<Position> GetValidMoves(string gameId, int row, int col);
        GameStateDto MakeMove(string gameId, Move move);
    
    }
}
