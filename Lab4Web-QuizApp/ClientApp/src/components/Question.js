import React from "react"

function Question(props) {
    return (
        <div>
            <p>{props.question.questionString}</p>
            {
                props.question.answerOptions.map(answer => (
                    <button className="btn btn-primary"
                        key={answer.id}
                        onClick={() => props.handler(answer)}
                    >
                        {answer.answerString}
                    </button>
                ))
            }
        </div>
    )
}

export default Question