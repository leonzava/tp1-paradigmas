function obtenerIconoDificultad(dificultad) {
    switch (dificultad) {
        case "Facil": return "★☆☆";
        case "Medio": return "★★☆";
        case "Dificil": return "★★★";
        default: return "★☆☆";
    }
}

function recorrerTareas(lista) {
    if (lista.length === 0) {
        console.log("No hay tareas para mostrar.");
        return;
    }
    for (const [index, tarea] of lista.entries()) {
        console.log(`[${index + 1}] ${tarea.titulo}`);
    }
}

function mostrarDetalle(tarea) {
    console.log("\n--- Detalle de la tarea ---");
    console.log(`Título:         ${tarea.titulo}`);
    console.log(`Descripción:    ${tarea.descripcion || "Sin datos"}`);
    console.log(`Estado:         ${tarea.estado}`);
    console.log(`Dificultad:     ${obtenerIconoDificultad(tarea.dificultad)} (${tarea.dificultad})`);
    console.log(`Vencimiento:    ${tarea.vencimiento ? new Date(tarea.vencimiento).toLocaleDateString() : "Sin Datos"}`);
    console.log(`Creación:       ${tarea.creacion.toLocaleDateString()}`);
    console.log(`Última edición: ${tarea.ultimaEdicion.toLocaleDateString()}`);
    console.log("----------------------------\n");
}

module.exports = { recorrerTareas, mostrarDetalle };