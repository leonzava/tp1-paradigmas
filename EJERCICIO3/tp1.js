const { crearTarea, agregarTarea, listaDeTareas } = require("./tareas.js");
const { recorrerTareas, mostrarDetalle } = require("./Mostrar.js");
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function menuPrincipal() {
    console.log("\n=== MENÚ PRINCIPAL ===");
    console.log("1. Ver mis tareas");
    console.log("2. Buscar una tarea");
    console.log("3. Agregar una tarea");
    console.log("0. Salir");

    rl.question("Elegí una opción: ", (opcion) => {
        switch (opcion) {
            case "1":
                menuVerTareas();
                break;
            case "2":
                buscarTarea();
                break;
            case "3":
                pedirTitulo();
                break;
            case "0":
                console.log("Saliendo...");
                rl.close();
                break;
            default:
                console.log("Opción no válida. Por favor, elija una opción válida.");
                menuPrincipal();
        }
    });
}

function buscarTarea() {
    rl.question("Introduce el título de una Tarea para buscarla: ", (titulo) => {
        const resultados = listaDeTareas.filter(tarea =>
            tarea.titulo.toLowerCase().includes(titulo.toLowerCase())
        );

        if (resultados.length === 0) {
            console.log("No hay tareas relacionadas con la búsqueda.");
            menuPrincipal();
        } else {
            recorrerTareas(resultados);
            seleccionarTareaDesdeBusqueda(resultados);
        }
    });
}

function seleccionarTareaDesdeBusqueda(lista) {
    rl.question("Introduce el número para verla o 0 para volver: ", (num) => {
        num = parseInt(num);
        if (isNaN(num) || num < 0 || num > lista.length) {
            console.log("Número inválido.");
            seleccionarTareaDesdeBusqueda(lista);
            return;
        }
        if (num === 0) {
            menuPrincipal();
            return;
        }
        const tareaSeleccionada = lista[num - 1];
        mostrarDetalle(tareaSeleccionada);

        rl.question("Si deseas editarla, presiona E, o presiona 0 para volver: ", (opcionEditar) => {
            if (opcionEditar.toLowerCase() === "e") {
                editarTarea(tareaSeleccionada, menuPrincipal);
            } else {
                menuPrincipal();
            }
        });
    });
}

function pedirTitulo() {
    rl.question("Ingrese el título de la nueva tarea: ", (titulo) => {
        if (titulo.trim() === "") {
            console.log("El título no puede estar vacío.");
            pedirTitulo();
            return;
        }
        if (titulo.length > 100) {
            console.log("El título no puede tener más de 100 caracteres.");
            pedirTitulo();
            return;
        }
        pedirDescripcion(titulo);
    });
}

function pedirDescripcion(titulo) {
    rl.question("Ingrese la descripción de la nueva tarea (opcional): ", (descripcion) => {
        if (descripcion.length > 500) {
            console.log("La descripción no puede superar los 500 caracteres.");
            pedirDescripcion(titulo);
            return;
        }
        pedirEstado(titulo, descripcion);
    });
}

function pedirEstado(titulo, descripcion) {
    rl.question("Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada, Enter = Pendiente): ", (opcionEstado) => {
        const letra = opcionEstado.trim().toUpperCase();
        let estado = "Pendiente";
        if (letra === "E") estado = "En Curso";
        else if (letra === "T") estado = "Terminada";
        else if (letra === "C") estado = "Cancelada";
        else if (letra !== "" && letra !== "P") {
            console.log("Letra no reconocida, se usa Pendiente por defecto.");
        }

        pedirDificultad(titulo, descripcion, estado);
    });
}

function pedirDificultad(titulo, descripcion, estado) {
    console.log("Dificultad:");
    console.log("1. Fácil");
    console.log("2. Medio");
    console.log("3. Difícil");
    rl.question("Elija la dificultad (Enter = Fácil): ", (opcionDificultad) => {
        let dificultad = "Facil";
        if (opcionDificultad === "2") dificultad = "Medio";
        else if (opcionDificultad === "3") dificultad = "Dificil";

        pedirVencimiento(titulo, descripcion, estado, dificultad);
    });
}
function parsearFecha(texto) {
    const partes = texto.split(/[\/-]/); // separa por "/" o "-"
    if (partes.length !== 3) return null;

    const [dia, mes, anio] = partes.map(Number);
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null;

    const fecha = new Date(anio, mes - 1, dia); // mes-1 porque en JS enero es 0
    if (isNaN(fecha.getTime())) return null;

    return fecha;
}
function pedirVencimiento(titulo, descripcion, estado, dificultad) {
    rl.question("Ingrese fecha de vencimiento (DD/MM/AAAA o Enter para omitir: ", (fechaVencimiento) => {
        let vencimiento = null;
        if (fechaVencimiento.trim() !== "") {
            const fecha = parsearFecha(fechaVencimiento);
            if (!isNaN(fecha.getTime())) {
                vencimiento = fecha;
            } else {
                console.log("Fecha inválida, se guarda sin vencimiento.");
            }
        }

        const nuevaTarea = crearTarea(titulo, descripcion, estado, dificultad, vencimiento);
        agregarTarea(listaDeTareas, nuevaTarea);
        console.log("\n¡Datos guardados!\n");
        menuPrincipal();
    });
}

function menuVerTareas() {
    console.log("\n=== ¿QUÉ TAREAS DESEAS VER? ===");
    console.log("1. Todas");
    console.log("2. Pendientes");
    console.log("3. En curso");
    console.log("4. Terminadas");
    console.log("5. Canceladas");
    console.log("0. Volver al menú principal");

    rl.question("Elegí una opción: ", (ot) => {
        let tareasFiltradas;
        switch (ot) {
            case "0":
                menuPrincipal();
                return;
            case "1":
                tareasFiltradas = listaDeTareas;
                break;
            case "2":
                tareasFiltradas = listaDeTareas.filter(t => t.estado === "Pendiente");
                break;
            case "3":
                tareasFiltradas = listaDeTareas.filter(t => t.estado === "En Curso");
                break;
            case "4":
                tareasFiltradas = listaDeTareas.filter(t => t.estado === "Terminada");
                break;
            case "5":
                tareasFiltradas = listaDeTareas.filter(t => t.estado === "Cancelada");
                break;
            default:
                console.log("Opción no válida.");
                menuVerTareas();
                return;
        }

        recorrerTareas(tareasFiltradas);
        seleccionarTarea(tareasFiltradas);
    });
}

function seleccionarTarea(lista) {
    if (lista.length === 0) {
        menuVerTareas();
        return;
    }
    rl.question("Introduce el número para verla o 0 para volver: ", (num) => {
        num = parseInt(num);
        if (isNaN(num) || num < 0 || num > lista.length) {
            console.log("Número inválido.");
            seleccionarTarea(lista);
            return;
        }
        if (num === 0) {
            menuVerTareas();
            return;
        }
        const tareaSeleccionada = lista[num - 1];
        mostrarDetalle(tareaSeleccionada);

        rl.question("Si deseas editarla, presiona E, o presiona 0 para volver: ", (opcionEditar) => {
            if (opcionEditar.toLowerCase() === "e") {
                editarTarea(tareaSeleccionada, menuVerTareas);
            } else {
                menuVerTareas();
            }
        });
    });
}

function editarTarea(tarea, volver) {
    console.log(`\nEstás editando la tarea "${tarea.titulo}".`);
    console.log("Si deseas mantener el valor de un atributo, déjalo en blanco.");
    console.log("Si deseas dejar en blanco un atributo, escribe un espacio.\n");

    rl.question(`1. Descripción actual: "${tarea.descripcion}". Nueva descripción: `, (nuevaDescripcion) => {
        if (nuevaDescripcion !== "") {
            tarea.descripcion = nuevaDescripcion.trim() === "" ? "" : nuevaDescripcion;
        }

        rl.question(`2. Estado actual: ${tarea.estado}. Nuevo estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada): `, (nuevoEstado) => {
            const letra = nuevoEstado.trim().toUpperCase();
            if (letra === "P") tarea.estado = "Pendiente";
            else if (letra === "E") tarea.estado = "En Curso";
            else if (letra === "T") tarea.estado = "Terminada";
            else if (letra === "C") tarea.estado = "Cancelada";
            else if (letra !== "") console.log("Letra no reconocida, se mantiene el estado actual.");

            rl.question(`3. Dificultad actual: ${tarea.dificultad}. Nueva dificultad ([1] Fácil / [2] Medio / [3] Difícil): `, (nuevaDificultad) => {
                if (nuevaDificultad === "1") tarea.dificultad = "Facil";
                else if (nuevaDificultad === "2") tarea.dificultad = "Medio";
                else if (nuevaDificultad === "3") tarea.dificultad = "Dificil";
                else if (nuevaDificultad.trim() !== "") console.log("Opción no reconocida, se mantiene la dificultad actual.");

                rl.question(`4. Vencimiento actual: ${tarea.vencimiento ? new Date(tarea.vencimiento).toLocaleDateString() : "Sin datos"}. Nuevo vencimiento (AAAA-MM-DD): `, (nuevoVencimiento) => {
                    if (nuevoVencimiento.trim() === " ") {
                        tarea.vencimiento = null;
                    } else if (nuevoVencimiento.trim() !== "") {
                        const fecha = new Date(nuevoVencimiento);
                        if (!isNaN(fecha.getTime())) {
                            tarea.vencimiento = fecha;
                        } else {
                            console.log("Fecha inválida, se mantiene el vencimiento actual.");
                        }
                    }

                    tarea.ultimaEdicion = new Date();
                    console.log("\n¡Datos guardados!\n");
                    volver();
                });
            });
        });
    });
}

menuPrincipal();