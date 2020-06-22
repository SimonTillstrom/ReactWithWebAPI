using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models.HTTP
{
    public class AnswerRequest
    {
        public int Id { get; set; }
        public string AnswerString { get; set; }
        public bool IsCorrectAnswer { get; set; }
        public virtual int QuestionId { get; set; }
        public virtual Question Question { get; set; }
    }
}
