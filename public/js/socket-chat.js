var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y la sala son obligatorios');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}



socket.on('connect', function() {
    socket.emit('entrarChat', usuario, function(resp) {
        renderizarUsuarios(resp);
    });
});


// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});



// Escuchar información
socket.on('enviarMensaje', function(mensaje) {
    renderizarMensajes(mensaje, false); // pinta el mensaje que han escrito otros usuarios  
});

socket.on('listaPersonas', function(personas) {
    //se dispara cuando hay cambios en las personas conectadas
    renderizarUsuarios(personas);
});



// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('privado', mensaje);
});