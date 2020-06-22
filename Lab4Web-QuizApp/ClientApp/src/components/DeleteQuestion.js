import React from 'react'
import authService from './api-authorization/AuthorizeService'

export default function DeleteQuestion(props) {
    const question = props.question;
    return (
        <div>
            <p>Question: {question.questionString}</p>
            <p>ID: {question.id}</p>
            <ol>
                Answers:
                {question.answerOptions.map(answer =>
                <li key={answer.id}>{answer.answerString}</li>)}
                <br />
                <button className="btn btn-primary" onClick={() => deleteQuestion()}>Delete</button>
            </ol>
            <button className="btn btn-primary" onClick={() => props.stateHandler("list", null)}>Back to the list</button>
        </div>

    )
    async function deleteQuestion() {
        const token = await authService.getAccessToken();
        await fetch('questions/' + question.id, {
            method: 'DELETE',
            headers: !token ?
                {} : { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` }

        })
        await props.stateHandler("list", null);
    }
}