const { rl } = require("./rl.js");
const { listaDeTareas } = require("./tareas.js");
const { recorrerTareas, mostrarDetalle } = require("./mostrar.js");
const { pedirTitulo } = require("./agregarTarea.js");
const { editarTarea } = require("./editar.js");

function menuPrincipal() {
    console.log("=== MENÚ PRINCIPAL ===");
    console.log("[1]. Ver mis tareas");
    console.log("[2]. Buscar una tarea");
    console.log("[3]. Agregar una tarea");
    console.log("[0]. Salir");
    console.log("========================");

    rl.question("\nElegí una opción: ", (opcion) => {
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

function menuVerTareas() {
    console.log("\n=== TIPOS DE ESTADOS ===");
    console.log("[1]. Todas");
    console.log("[2]. Pendientes");
    console.log("[3]. En curso");
    console.log("[4]. Terminadas");
    console.log("[5]. Canceladas");
    console.log("[0]. Volver al menú principal");
    console.log("========================");

    rl.question("\nIngrese qué tipo de estado desea ver: ", (ot) => {
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
                console.log("Opción no válida. Intente nuevamente.");
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

module.exports = { menuPrincipal };