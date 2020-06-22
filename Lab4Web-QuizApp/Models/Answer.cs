using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models
{
    public class Answer
    {
        public int Id { get; set; }
        public virtual int QuestionId { get; set; }
        public string AnswerString { get; set; }
        public bool IsCorrectAnswer { get; set; }
    }
}
