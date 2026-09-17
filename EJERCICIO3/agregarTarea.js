const { rl } = require("./rl.js");
const { parsearFecha } = require("./fechas.js");
const { crearTarea, agregarTarea, listaDeTareas } = require("./tareas.js");

function pedirTitulo() {
    rl.question("Ingrese el título de la nueva tarea: ", (titulo) => {
        if (titulo.trim() === "") {
            console.log("El título no puede estar vacío.");
            pedirTitulo();
            return;
        }
        pedirDescripcion(titulo);
    });
}

function pedirDescripcion(titulo) {
    rl.question("Ingrese la descipcion de la nueva tarea o presione ENTER para dejarla vacia : ", (descripcion) => {
        if (descripcion.trim() === "") {
            console.log("Usted subio una descripcion vacia!.\n");
        } else {
            console.log("Descripcion agregada!.\n");
        }
        pedirEstado(titulo, descripcion);
    });
}

function pedirEstado(titulo, descripcion) {
    console.log("ENTER = [P] Pendiente");
    console.log("Estados: [P] Pendiente , [E] En curso , [T] Terminada, [C] Cancelada \n");
    rl.question("Elija el estado de su tarea: ", (opcionEstado) => {
        const letra = opcionEstado.trim().toUpperCase();
        let estado = "Pendiente";

        if (letra === "E") {
            estado = "En Curso";
            console.log("La tarea se cargó con estado: En Curso!\n");
        } else if (letra === "T") {
            estado = "Terminada";
            console.log("La tarea se cargó con estado: Terminada!\n");
        } else if (letra === "C") {
            estado = "Cancelada";
            console.log("La tarea se cargó con estado: Cancelada!\n");
        } else if (letra === "" || letra === "P") {
            console.log("La tarea se cargó con estado: Pendiente!\n");
        } else {
            console.log("❌ Letra no reconocida, por favor vuelva a agregar el estado de la tarea!\n");
            return pedirEstado(titulo, descripcion);
        }

        pedirDificultad(titulo, descripcion, estado);
    });
}

function pedirDificultad(titulo, descripcion, estado) {
    console.log("Dificultades: [1] Facil , [2] Medio , [3] Dificil");
    console.log("ENTER = [1] Facil");
    rl.question("Elija la dificultad de su tarea: ", (opcionDificultad) => {
        const numerodif = opcionDificultad.trim();
        let dificultad = "Facil";

        if (numerodif === "2") {
            dificultad = "Medio";
            console.log("¡Che, agregaste la dificultad \"Medio\" a tu tarea!\n");
        } else if (numerodif === "3") {
            dificultad = "Dificil";
            console.log("¡Che, agregaste la dificultad \"Dificil\" a tu tarea!\n");
        } else if (numerodif === "" || numerodif === "1") {
            console.log("¡Che, agregaste la dificultad \"Facil\" a tu tarea!\n");
        } else {
            console.log("❌ Valor invalido! Por favor ingrese una dificultad válida.\n");
            return pedirDificultad(titulo, descripcion, estado);
        }

        pedirVencimiento(titulo, descripcion, estado, dificultad);
    });
}

function pedirVencimiento(titulo, descripcion, estado, dificultad) {
    rl.question("Ingrese fecha de vencimiento (DD/MM/AAAA) o Enter para omitir: ", (fechaVencimiento) => {
        let vencimiento = null;
        if (fechaVencimiento.trim() !== "") {
            const fecha = parsearFecha(fechaVencimiento);
            if (fecha !== null) {
                vencimiento = fecha;
            } else {
                console.log("Fecha inválida, se guarda sin vencimiento.");
            }
        }

        const nuevaTarea = crearTarea(titulo, descripcion, estado, dificultad, vencimiento);
        agregarTarea(listaDeTareas, nuevaTarea);
        console.log("====================================");
        console.log("✅ Tarea agregada con éxito.");
        console.log("====================================\n");

        // require acá adentro (no arriba del archivo) para evitar el ciclo
        // agregarTarea.js <-> menus.js, ya que menus.js también necesita a pedirTitulo
        const { menuPrincipal } = require("./menus.js");
        menuPrincipal();
    });
}

module.exports = { pedirTitulo };