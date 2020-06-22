using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models
{
    public class Question
    {
        public int Id { get; set; }
        public string QuestionString { get; set; }
        public virtual List<Answer> AnswerOptions { get; set; }
    }
}
