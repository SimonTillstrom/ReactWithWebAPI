import authService from './api-authorization/AuthorizeService'

export default async function SubmitQuestionChanges(inputData, question) {
    const answerOptions = question.answerOptions;
    const answer1 = {
        Id: answerOptions[0].id,
        QuestionId: question.id,
        Answerstring: inputData.answer1,
        IsCorrectAnswer: false
    };
    const answer2 = {
        Id: answerOptions[1].id,
        QuestionId: question.id,
        AnswerString: inputData.answer2,
        IsCorrectAnswer: false
    };
    const answer3 = {
        Id: answerOptions[2].id,
        QuestionId: question.id,
        AnswerString: inputData.answer3,
        IsCorrectAnswer: false
    };
    switch (inputData.correctAnswer) {
        case "answer1":
            answer1.IsCorrectAnswer = true;
            break;

        case "answer2":
            answer2.IsCorrectAnswer = true;
            break;

        case "answer3":
            answer3.IsCorrectAnswer = true;
            break;

        default:
            console.log("no correct answer");
            return
    }
    const request = {
        Id: question.id,
        QuestionString: inputData.question,
        AnswerOptions: [answer1, answer2, answer3],
    };
    const token = await authService.getAccessToken();
    return await fetch("questions/" + question.id, {
        method: "PUT",
        headers: !token ?
            {} : { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(request),
    });
}
