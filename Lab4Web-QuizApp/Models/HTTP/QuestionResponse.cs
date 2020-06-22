using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Lab4Web_QuizApp.Models.HTTP
{
    public class QuestionResponse
    {
        public string RequestTime { get; set; }
        public int Id { get; set; }
        public string QuestionString { get; set; }
        public virtual IEnumerable<Answer> AnswerOptions { get; set; }
    }
}
