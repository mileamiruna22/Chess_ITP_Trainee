using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Models.Dtos;
using Backend.Services;
using System;
using System.Collections.Generic;

namespace ChessBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChessController : ControllerBase
    {
        private readonly IChessService _chessService;

        public ChessController(IChessService chessService)
        {
            _chessService = chessService;
        }

        [HttpPost("new")]
        public ActionResult<GameStateDto> NewGame()
        {
            var game = _chessService.CreateNewGame();
            return Ok(new GameStateDto
            {
                Id = game.Id,
                BoardState = game.Board.ToBoardState(),
                CurrentPlayer = game.CurrentPlayer,
                MoveHistory = game.MoveHistory,
                CapturedPieces = game.CapturedPieces,
                Check = game.Check,
                GameOver = game.GameOver,
                Winner = game.Winner
            });
        }

        [HttpGet("{gameId}")]
        public ActionResult<GameStateDto> GetGameState(string gameId)
        {
            try
            {
                var gameState = _chessService.GetGameState(gameId);
                return Ok(gameState);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{gameId}/moves/{row}/{col}")]
        public ActionResult<List<Position>> GetValidMoves(string gameId, int row, int col)
        {
            try
            {
                var validMoves = _chessService.GetValidMoves(gameId, row, col);
                return Ok(validMoves);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{gameId}/move")]
        public ActionResult<GameStateDto> MakeMove(string gameId, [FromBody] MoveDto moveDto)
        {
            try
            {
                // Convertim MoveDto în Move
                var move = new Move
                {
                    FromRow = moveDto.FromRow,
                    FromCol = moveDto.FromCol,
                    ToRow = moveDto.ToRow,
                    ToCol = moveDto.ToCol
                };
                
                var gameState = _chessService.MakeMove(gameId, move);
                return Ok(gameState);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

// Clasa DTO pentru mutare
namespace Backend.Models.Dtos
{
    public class MoveDto
    {
        public int FromRow { get; set; }
        public int FromCol { get; set; }
        public int ToRow { get; set; }
        public int ToCol { get; set; }
    }
}