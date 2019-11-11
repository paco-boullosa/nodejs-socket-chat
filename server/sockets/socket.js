const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');

const usuarios = new Usuarios();


io.on('connection', (client) => {

    // El objeto client que se recibe en el socket, contiene eventos y propiedades, pero también con un ID.
    // El ID es único por cada cliente que se conecta al servidor y por lo tanto podemos utilizarlo como identificador del usuario

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y la sala son obligatorios'
            });
        }

        // se asocia el usuario a una sala
        client.join(data.sala);

        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasSala(data.sala));
        client.broadcast.to(data.sala).emit('enviarMensaje', crearMensaje('Admin', `${ data.nombre } se ha unido al chat.`));
        callback(usuarios.getPersonasSala(data.sala))
    });


    client.on('enviarMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        // se envia solo a los usuarios de la sala. No tenemos el data.sala, pero podemos obtener la sala de 'persona.sala'
        client.broadcast.to(persona.sala).emit('enviarMensaje', mensaje);
        callback(mensaje);
        // al usar el callback le podemos comunicar al emisor que se ha enviado su mensaje correctamente para, por ejemplo, borrar la caja de texto en donde se escribe
    });


    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('enviarMensaje', crearMensaje('Admin', `${ personaBorrada.nombre } ha abandonado el chat.`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasSala(personaBorrada.sala));
    });


    // Mensaje privado
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.destinatario).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });

});