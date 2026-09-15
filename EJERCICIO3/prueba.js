const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('¿Cómo te llamás? ', (respuesta) => {
    console.log(`Hola, ${respuesta}!`);
    rl.close();
});