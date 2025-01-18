const path = require("path");
const sessionID = `Session-${Date.now()}`;
const tempDirectory = path.join(__dirname, 'uploads', sessionID);
console.log(tempDirectory)