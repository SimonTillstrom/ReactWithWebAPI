using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models.HTTP
{
    public class QuestionRequest
    {
        public string QuestionString { get; set; }
        public virtual List<Answer> AnswerOptions { get; set; }
    }
}
