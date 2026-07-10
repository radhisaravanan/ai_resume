const fs = require("fs");
const path = require("path");

const parseResume = require("./services/resumeParser");

async function test() {
  const folder = path.join(__dirname, "uploads", "resume");

  const files = fs.readdirSync(folder);

  console.log("Files in folder:");
  console.log(files);

  const latestFile = files
    .map((file) => ({
      file,
      time: fs.statSync(path.join(folder, file)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time)[0].file;

  console.log("\nReading file:");
  console.log(latestFile);

  const text = await parseResume(path.join(folder, latestFile));

  console.log("\nResume Content:\n");
  console.log(text);
}

test();
