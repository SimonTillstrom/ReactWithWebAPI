using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab4Web_QuizApp.Data;
using Lab4Web_QuizApp.Models;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using IdentityServer4.Extensions;
using IdentityModel;
using System.Security.Claims;

namespace Lab4Web_QuizApp.Controllers
{
    [Authorize]
    [Route("highscore")]
    [ApiController]
    public class HighScoresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public HighScoresController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<HighScore>>> GetHighScore()
        {
            try
            {
                var highScore = await _context.HighScores
                    .OrderByDescending(s => s.Score)
                    .ThenByDescending(d => d.DateSubmitted)
                    .Take(10)
                    .ToListAsync();

                if (highScore.Count() == 0)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "No HighScore found."
                    });
                }
            
                var response = Enumerable.Range(0, highScore.Count())
                            .Select(index => new HighScoreResponse
                            {
                                Id = highScore[index].Id,
                                DateSubmitted = highScore[index].DateSubmitted,
                                Score = highScore[index].Score,
                                Username = highScore[index].Username
                            })
                        .ToArray();
            
                return Ok(response);
            }
            catch(Exception exception)
            {
                return BadRequest(exception.ToString());
            }
        }

        [HttpPost]
        public async Task<ActionResult<HighScore>> PostHighScore([FromBody] HighScoreRequest request)
        {
            if (_context.Database.CanConnect())
            {
                if (request == null)
                {
                    return BadRequest(new {success = false, message = "Body cannot be empty." });
                }
                try
                {
                    var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == request.UserId);
                    if (currentUser == null)
                    {
                        return NotFound(new { success = false, message = "User not found." });
                    }

                    var highScore = new HighScore
                    {
                        Score = request.Score,
                        DateSubmitted = DateTime.Now,
                        Username = currentUser.Email,
                        User = currentUser
                    };

                    _context.HighScores.Add(highScore);
                    await _context.SaveChangesAsync();

                    var response = new HighScoreResponse
                    {
                        Id = highScore.Id,
                        Score = highScore.Score,
                        Username = highScore.Username
                    };

                    return Ok(response);
                }
                catch (Exception exception)
                {
                    return BadRequest(exception.ToString());
                }
            }
            else
            {

                return StatusCode(StatusCodes.Status503ServiceUnavailable, new
                {
                    message = "The database is currently unavailable."
                });
            }
        }
    }
}
