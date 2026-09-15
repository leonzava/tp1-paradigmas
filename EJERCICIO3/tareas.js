function crearTarea(titulo, descripcion = "", estado = "Pendiente", dificultad = "Facil", vencimiento = null) {
    return {
        titulo,
        descripcion,
        estado,
        dificultad,
        creacion: new Date(),
        ultimaEdicion: new Date(),
        vencimiento: vencimiento
    };
}

function agregarTarea(lista, tarea) {
    lista.push(tarea);
}

const listaDeTareas = [];

module.exports = { crearTarea, agregarTarea, listaDeTareas };