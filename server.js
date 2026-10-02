const express = require("express");

const app = express();

app.use(express.static("public"));

const PORT = 3000;

app.listen(PORT, function () {
    console.log(`MindGuess is running at http://localhost:${PORT}`);
});