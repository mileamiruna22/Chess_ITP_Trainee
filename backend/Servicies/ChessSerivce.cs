using Backend.Models;
using Backend.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Backend.Services
{
    public class ChessService : IChessService
    {

        private readonly Dictionary<string, GameState> _activeGames = new Dictionary<string, GameState>();

        public GameState CreateNewGame()
        {
            // Creează un id unic pentru joc
            string gameId = Guid.NewGuid().ToString();
            
            // Inițializează un nou joc
            var game = new GameState
            {
                Id = gameId,
                Board = new ChessBoard(), // ChessBoard inițializează tabla cu piesele în poziția de start
                CurrentPlayer = "white", // În șah, albul mută primul
                MoveHistory = new List<string>(),
                CapturedPieces = new Dictionary<string, List<string>>
                {
                    { "white", new List<string>() },
                    { "black", new List<string>() }
                },
                Check = new Dictionary<string, bool>
                {
                    { "white", false },
                    { "black", false }
                },
                GameOver = null,
                Winner = null
            };
            
            // Adaugă jocul în colecția de jocuri active
            _activeGames[gameId] = game;
            
            return game;
        }

        public GameStateDto GetGameState(string gameId)
        {
            // Verifică dacă jocul există
            if (!_activeGames.ContainsKey(gameId))
            {
                throw new KeyNotFoundException($"Jocul cu ID-ul {gameId} nu a fost găsit.");
            }
            
            var game = _activeGames[gameId];
            
            // Convertește starea jocului în DTO pentru a fi trimis client-ului
            return new GameStateDto
            {
                Id = game.Id,
                BoardState = game.Board.ToBoardState(),
                CurrentPlayer = game.CurrentPlayer,
                MoveHistory = game.MoveHistory,
                CapturedPieces = game.CapturedPieces,
                Check = game.Check,
                GameOver = game.GameOver,
                Winner = game.Winner
            };
        }

        public List<Position> GetValidMoves(string gameId, int row, int col)
        {
            // Verifică dacă jocul există
            if (!_activeGames.ContainsKey(gameId))
            {
                throw new KeyNotFoundException($"Jocul cu ID-ul {gameId} nu a fost găsit.");
            }
            
            var game = _activeGames[gameId];
            
            // Verifică dacă există o piesă la poziția specificată
            var piece = GetPieceAt(game.Board, row, col);
            if (piece == null)
            {
                return new List<Position>(); // Returnează listă goală dacă nu există piesă
            }
            
            // Verifică dacă piesa aparține jucătorului curent
            if (piece.Color != game.CurrentPlayer)
            {
                return new List<Position>(); // Returnează listă goală dacă piesa nu aparține jucătorului curent
            }
            
            // Obține mutările valide pentru piesa de la poziția specificată
            return GetValidMovesForPiece(game, row, col);
        }

        public GameStateDto MakeMove(string gameId, Move move)
        {
            var game = _activeGames[gameId];
            
            // Verifică dacă jocul s-a încheiat deja
            if (game.GameOver != null)
            {
                throw new InvalidOperationException("Jocul s-a încheiat deja.");
            }
            
            // Verifică dacă mutarea este validă
            var validMoves = GetValidMoves(gameId, move.FromRow, move.FromCol);
            bool isValidMove = validMoves.Any(pos => pos.Row == move.ToRow && pos.Col == move.ToCol);
            
            if (!isValidMove)
            {
                throw new InvalidOperationException("Mutare invalidă.");
            }
            
            // Executarea mutării
            var capturedPiece = MovePiece(game.Board, move.FromRow, move.FromCol, move.ToRow, move.ToCol);
            
            // Dacă o piesă a fost capturată, o adăugăm la lista pieselor capturate
            if (capturedPiece != null)
            {
                game.CapturedPieces[game.CurrentPlayer].Add($"{capturedPiece.Type}-{capturedPiece.Color}");
            }
            
            // Adăugăm mutarea la istoricul mutărilor
            string moveNotation = GenerateMoveNotation(move, GetPieceAt(game.Board, move.ToRow, move.ToCol), capturedPiece);
            game.MoveHistory.Add(moveNotation);
            
            // Verificăm dacă regele adversarului este în șah
            string opponent = game.CurrentPlayer == "white" ? "black" : "white";
            game.Check[opponent] = IsKingInCheck(game, opponent);
            
            // Schimbăm jucătorul curent
            game.CurrentPlayer = opponent;
            
            // Verificăm dacă jocul s-a încheiat (șah mat sau remiză)
            CheckGameOver(game);
            
            // Actualizăm timestamp-ul ultimei modificări
            game.LastUpdated = DateTime.Now;
            
            // Returnăm starea actualizată a jocului
            return GetGameState(gameId);
        }


        #region Metode helper private

        // Obține piesa de la poziția specificată
       private ChessPiece? GetPieceAt(ChessBoard board, int row, int col)
        {
             if (row < 0 || row >= 8 || col < 0 || col >= 8)
             return null;
            
             return board.Board[row, col];
        }
        
        // Mută o piesă pe tablă și returnează orice piesă capturată
        private ChessPiece MovePiece(ChessBoard board, int fromRow, int fromCol, int toRow, int toCol)
        {
            var piece = board.Board[fromRow, fromCol];
            var capturedPiece = board.Board[toRow, toCol];
            
            // Mută piesa
            board.Board[toRow, toCol] = piece;
            board.Board[fromRow, fromCol] = null;
            
            return capturedPiece;
        }
        
        // Verifică dacă o mutare ar pune propriul rege în șah
        private bool WouldMoveExposeKing(GameState game, int fromRow, int fromCol, int toRow, int toCol)
        {
            var board = game.Board;
            var currentPlayer = game.CurrentPlayer;
            
            // Salvează starea curentă
            var originalPiece = board.Board[fromRow, fromCol];
            var targetPiece = board.Board[toRow, toCol];
            
            // Simulează mutarea
            board.Board[toRow, toCol] = originalPiece;
            board.Board[fromRow, fromCol] = null;
            
            // Verifică dacă regele este în șah după mutare
            bool wouldExposeKing = IsKingInCheck(game, currentPlayer);
            
            // Restaurează starea originală
            board.Board[fromRow, fromCol] = originalPiece;
            board.Board[toRow, toCol] = targetPiece;
            
            return wouldExposeKing;
        }
        
        // Obține toate mutările valide pentru o piesă
        private List<Position> GetValidMovesForPiece(GameState game, int row, int col, bool checkForCheck = true)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            
            if (piece == null) return new List<Position>();
            
            var possibleMoves = new List<Position>();
            
            switch (piece.Type)
            {
                case "pawn":
                    possibleMoves = GetPawnMoves(game, row, col);
                    break;
                case "rook":
                    possibleMoves = GetRookMoves(game, row, col);
                    break;
                case "knight":
                    possibleMoves = GetKnightMoves(game, row, col);
                    break;
                case "bishop":
                    possibleMoves = GetBishopMoves(game, row, col);
                    break;
                case "queen":
                    possibleMoves = GetQueenMoves(game, row, col);
                    break;
                case "king":
                    possibleMoves = GetKingMoves(game, row, col);
                    break;
            }
            
            // Dacă checkForCheck este true, eliminăm mutările care ar pune propriul rege în șah
            if (checkForCheck)
            {
                possibleMoves = possibleMoves.Where(pos => 
                    !WouldMoveExposeKing(game, row, col, pos.Row, pos.Col)).ToList();
            }
            
            return possibleMoves;
        }
        
        // Obține mutările valide pentru un pion
        private List<Position> GetPawnMoves(GameState game, int row, int col)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            var moves = new List<Position>();
            
            if (piece == null || piece.Type != "pawn") return moves;
            
            int direction = piece.Color == "white" ? -1 : 1; // Direcția de deplasare (sus sau jos)
            int startingRank = piece.Color == "white" ? 6 : 1; // Rândul de start pentru pionii albi/negri
            
            // Mutare înainte cu o poziție
            if (GetPieceAt(board, row + direction, col) == null)
            {
                moves.Add(new Position { Row = row + direction, Col = col });
                
                // Mutare înainte cu două poziții (doar dacă este la poziția inițială)
                if (row == startingRank && GetPieceAt(board, row + 2 * direction, col) == null)
                {
                    moves.Add(new Position { Row = row + 2 * direction, Col = col });
                }
            }
            
            // Capturare diagonală
            for (int dCol = -1; dCol <= 1; dCol += 2)
            {
                if (col + dCol >= 0 && col + dCol < 8) // Verificăm să nu ieșim din tablă
                {
                    var targetPiece = GetPieceAt(board, row + direction, col + dCol);
                    if (targetPiece != null && targetPiece.Color != piece.Color)
                    {
                        moves.Add(new Position { Row = row + direction, Col = col + dCol });
                    }
                }
            }
            
            return moves;
        }
        
        // Obține mutările valide pentru o tură
        private List<Position> GetRookMoves(GameState game, int row, int col)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            var moves = new List<Position>();
            
            if (piece == null) return moves;
            
            // Direcțiile pentru tură: sus, jos, stânga, dreapta
            int[][] directions = new int[][] 
            {
                new int[] {-1, 0}, // Sus
                new int[] {1, 0},  // Jos
                new int[] {0, -1}, // Stânga
                new int[] {0, 1}   // Dreapta
            };
            
            foreach (var dir in directions)
            {
                for (int i = 1; i < 8; i++)
                {
                    int newRow = row + i * dir[0];
                    int newCol = col + i * dir[1];
                    
                    // Verificăm să nu ieșim din tablă
                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8)
                        break;
                    
                    var targetPiece = GetPieceAt(board, newRow, newCol);
                    
                    if (targetPiece == null)
                    {
                        // Pătratul este gol, putem muta aici
                        moves.Add(new Position { Row = newRow, Col = newCol });
                    }
                    else if (targetPiece.Color != piece.Color)
                    {
                        // Este o piesă adversă, putem captura
                        moves.Add(new Position { Row = newRow, Col = newCol });
                        break; // Nu putem continua în această direcție
                    }
                    else
                    {
                        // Este o piesă a noastră, nu putem muta aici
                        break;
                    }
                }
            }
            
            return moves;
        }
        
        // Obține mutările valide pentru un cal
        private List<Position> GetKnightMoves(GameState game, int row, int col)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            var moves = new List<Position>();
            
            if (piece == null) return moves;
            
            // Toate posibilele mutări ale calului (în formă de "L")
            int[][] knightMoves = new int[][]
            {
                new int[] {-2, -1}, new int[] {-2, 1}, // Sus 2, stânga/dreapta 1
                new int[] {-1, -2}, new int[] {-1, 2}, // Sus 1, stânga/dreapta 2
                new int[] {1, -2}, new int[] {1, 2},   // Jos 1, stânga/dreapta 2
                new int[] {2, -1}, new int[] {2, 1}    // Jos 2, stânga/dreapta 1
            };
            
            foreach (var move in knightMoves)
            {
                int newRow = row + move[0];
                int newCol = col + move[1];
                
                // Verificăm să nu ieșim din tablă
                if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8)
                    continue;
                
                var targetPiece = GetPieceAt(board, newRow, newCol);
                
                // Putem muta acolo dacă pătratul este gol sau conține o piesă adversă
                if (targetPiece == null || targetPiece.Color != piece.Color)
                {
                    moves.Add(new Position { Row = newRow, Col = newCol });
                }
            }
            
            return moves;
        }
        
        // Obține mutările valide pentru un nebun
        private List<Position> GetBishopMoves(GameState game, int row, int col)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            var moves = new List<Position>();
            
            if (piece == null) return moves;
            
            // Direcțiile pentru nebun: diagonale
            int[][] directions = new int[][] 
            {
                new int[] {-1, -1}, // Stânga-sus
                new int[] {-1, 1},  // Dreapta-sus
                new int[] {1, -1},  // Stânga-jos
                new int[] {1, 1}    // Dreapta-jos
            };
            
            foreach (var dir in directions)
            {
                for (int i = 1; i < 8; i++)
                {
                    int newRow = row + i * dir[0];
                    int newCol = col + i * dir[1];
                    
                    // Verificăm să nu ieșim din tablă
                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8)
                        break;
                    
                    var targetPiece = GetPieceAt(board, newRow, newCol);
                    
                    if (targetPiece == null)
                    {
                        // Pătratul este gol, putem muta aici
                        moves.Add(new Position { Row = newRow, Col = newCol });
                    }
                    else if (targetPiece.Color != piece.Color)
                    {
                        // Este o piesă adversă, putem captura
                        moves.Add(new Position { Row = newRow, Col = newCol });
                        break; // Nu putem continua în această direcție
                    }
                    else
                    {
                        // Este o piesă a noastră, nu putem muta aici
                        break;
                    }
                }
            }
            
            return moves;
        }
        
        // Obține mutările valide pentru o regină
        private List<Position> GetQueenMoves(GameState game, int row, int col)
        {
            // Regina combină mișcările turei și ale nebunului
            var rookMoves = GetRookMoves(game, row, col);
            var bishopMoves = GetBishopMoves(game, row, col);
            
            return rookMoves.Concat(bishopMoves).ToList();
        }
        
        // Obține mutările valide pentru un rege
        private List<Position> GetKingMoves(GameState game, int row, int col)
        {
            var board = game.Board;
            var piece = GetPieceAt(board, row, col);
            var moves = new List<Position>();
            
            if (piece == null) return moves;
            
            // Toate direcțiile posibile pentru rege (8 direcții)
            for (int dRow = -1; dRow <= 1; dRow++)
            {
                for (int dCol = -1; dCol <= 1; dCol++)
                {
                    // Sărim peste poziția actuală (0,0)
                    if (dRow == 0 && dCol == 0)
                        continue;
                    
                    int newRow = row + dRow;
                    int newCol = col + dCol;
                    
                    // Verificăm să nu ieșim din tablă
                    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8)
                        continue;
                    
                    var targetPiece = GetPieceAt(board, newRow, newCol);
                    
                    // Putem muta acolo dacă pătratul este gol sau conține o piesă adversă
                    if (targetPiece == null || targetPiece.Color != piece.Color)
                    {
                        moves.Add(new Position { Row = newRow, Col = newCol });
                    }
                }
            }
            
            // Aici s-ar putea adăuga și logica pentru rocadă (castling)
            
            return moves;
        }

        // Generează notația mutării (de exemplu: "e2-e4" sau "Nc3xd5")
        private string GenerateMoveNotation(Move move, ChessPiece? movedPiece, ChessPiece? capturedPiece)
        {
            if (movedPiece == null)
                return string.Empty;
                
            // Implementare simplificată a notației șah
            string pieceSymbol = movedPiece.Type == "pawn" ? "" : movedPiece.Type.Substring(0, 1).ToUpper();
            string fromSquare = GetSquareNotation(move.FromRow, move.FromCol);
            string toSquare = GetSquareNotation(move.ToRow, move.ToCol);
            string captureSymbol = capturedPiece != null ? "x" : "-";
            
            return $"{pieceSymbol}{fromSquare}{captureSymbol}{toSquare}";
        }
        // Convertește coordonatele rând/coloană în notația standard a șahului (e.g., "e4")
        private string GetSquareNotation(int row, int col)
        {
            char file = (char)('a' + col);
            int rank = 8 - row;
            return $"{file}{rank}";
        }

        // Verifică dacă regele de culoarea specificată este în șah
        private bool IsKingInCheck(GameState game, string color)
        {
            
            Position kingPosition = FindKingPosition(game.Board, color);
            
            if (kingPosition == null)
                return false; 
           
            string opponentColor = color == "white" ? "black" : "white";
           
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    var piece = GetPieceAt(game.Board, row, col);
                    if (piece != null && piece.Color == opponentColor)
                    {
                        var moves = GetValidMovesForPiece(game, row, col, checkForCheck: false);
                        if (moves.Any(pos => pos.Row == kingPosition.Row && pos.Col == kingPosition.Col))
                        {
                            return true;
                        }
                    }
                }
            }
            
            return false;
        }

       
        private Position? FindKingPosition(ChessBoard board, string color)
{
    for (int row = 0; row < 8; row++)
    {
        for (int col = 0; col < 8; col++)
        {
            var piece = GetPieceAt(board, row, col);
            if (piece != null && piece.Type == "king" && piece.Color == color)
            {
                return new Position { Row = row, Col = col };
            }
        }
    }
    
    return null; 
}


        // Verifică dacă jocul s-a încheiat (șah mat sau remiză)
        private void CheckGameOver(GameState game)
        {
            // Verifică dacă jucătorul curent are mutări legale disponibile
            bool hasLegalMoves = false;
            
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    var piece = GetPieceAt(game.Board, row, col);
                    if (piece != null && piece.Color == game.CurrentPlayer)
                    {
                        var moves = GetValidMovesForPiece(game, row, col);
                        if (moves.Count > 0)
                        {
                            hasLegalMoves = true;
                            break;
                        }
                    }
                }
                
                if (hasLegalMoves)
                {
                    break;
                }
            }
            
            // Dacă nu există mutări legale, jocul s-a încheiat
            if (!hasLegalMoves)
            {
                game.GameOver = "true";
                
                // Dacă regele este în șah, este șah mat
                if (game.Check[game.CurrentPlayer])
                {
                    game.Winner = game.CurrentPlayer == "white" ? "black" : "white";
                }
                // Altfel, este remiză (pat)
                else
                {
                    game.Winner = null; // Remiză
                }
            }
            
            // Aici s-ar putea adăuga și alte verificări pentru remiză (de exemplu, regula celor 50 de mutări)
        }

        // Realizează o copie profundă a stării jocului
        private GameState DeepCopyGameState(GameState original)
        {
            var copy = new GameState
            {
                Id = original.Id,
                Board = new ChessBoard(),
                CurrentPlayer = original.CurrentPlayer,
                MoveHistory = new List<string>(original.MoveHistory),
                CapturedPieces = new Dictionary<string, List<string>>(),
                Check = new Dictionary<string, bool>(),
                GameOver = original.GameOver,
                Winner = original.Winner,
                CreatedAt = original.CreatedAt,
                LastUpdated = original.LastUpdated
            };
            
            // Copiem tabla de șah
            for (int row = 0; row < 8; row++)
            {
                for (int col = 0; col < 8; col++)
                {
                    var piece = original.Board.Board[row, col];
                    if (piece != null)
                    {
                        copy.Board.Board[row, col] = new ChessPiece
                        {
                            Type = piece.Type,
                            Color = piece.Color
                        };
                    }
                    else
                    {
                        copy.Board.Board[row, col] = null;
                    }
                }
            }
            
            // Copiem piesele capturate
            foreach (var color in original.CapturedPieces.Keys)
            {
                copy.CapturedPieces[color] = new List<string>(original.CapturedPieces[color]);
            }
            
            // Copiem starea de șah
            foreach (var color in original.Check.Keys)
            {
                copy.Check[color] = original.Check[color];
            }
            
            return copy;
        }

        #endregion
    }
}