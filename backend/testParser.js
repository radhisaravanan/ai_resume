const parseResume = require("./services/resumeParser");

async function test() {

    const text = await parseResume(
        "./uploads/resume/sample.pdf"
    );

    console.log(text);

}

test();