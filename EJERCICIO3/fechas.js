function parsearFecha(texto) {
    const partes = texto.split(/[\/-]/); // separa por "/" o "-"
    if (partes.length !== 3) return null;

    const [dia, mes, anio] = partes.map(Number);
    if (isNaN(dia) || isNaN(mes) || isNaN(anio)) return null;

    const fecha = new Date(anio, mes - 1, dia); // mes-1 porque en JS enero es 0
    if (isNaN(fecha.getTime())) return null;

    return fecha;
}

module.exports = { parsearFecha };