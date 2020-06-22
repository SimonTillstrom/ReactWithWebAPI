using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models
{
    public class HighScoreResponse
    {
        public int Id { get; set; }
        public int Score { get; set; }
        public DateTime DateSubmitted { get; set; }
        public string Username { get; set; }
    }
}
