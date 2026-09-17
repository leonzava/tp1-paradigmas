const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Atajo para no repetir rl.question en todos lados
function preguntar(texto, callback) {
    rl.question(texto, callback);
}

module.exports = { rl, preguntar };