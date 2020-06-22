import React from 'react'

export default function QuestionList(props) {
    const questionData = props.state.questionData;
    let questionList = questionData.map(question => (
        <li key={question.id}>
            {question.questionString}
            <ol>
                {question.answerOptions.map(answer =>
                    <li key={answer.id}>{answer.answerString}</li>)}
            </ol>
            <button className="btn btn-primary" onClick={() => props.stateHandler("edit", question)}>Edit</button>
            <button className="btn btn-primary" onClick={() => props.stateHandler("delete", question)}>Delete</button>
        </li>
    ))
    return (
        <ol>
            <button className="btn btn-primary" onClick={() => props.stateHandler("newQuestion", null)} >New question</button>
            {questionList}
        </ol>
    )
}