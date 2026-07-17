const generateQuestions = require("./ai/questionAI");

const resumeData = {

    candidateName: "Radhika",

    skills: [
        "React",
        "Node.js",
        "Express",
        "MySQL",
        "JavaScript"
    ],

    experience: "Fresher",

    difficulty: "Beginner"

};

async function test() {

    try {

        const result = await generateQuestions(resumeData);

        console.log(JSON.stringify(result, null, 2));

    } catch (err) {

        console.log(err);

    }

}

test();