const evaluateAnswer = require("./ai/evaluationAI");

async function test() {

    const question = "Explain React Hooks.";

    const answer = `
React Hooks are functions introduced in React.
They allow functional components to use state and lifecycle features.
The most common hooks are useState and useEffect.
`;

    try {

        const result = await evaluateAnswer(question, answer);

        console.log(JSON.stringify(result, null, 2));

    } catch (error) {

        console.log(error);

    }

}

test();