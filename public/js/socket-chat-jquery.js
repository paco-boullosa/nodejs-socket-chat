var params = new URLSearchParams(window.location.search);

// referencias jQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');



function renderizarUsuarios(personas) {
    console.log(personas);

    var html = '';
    html += '<li>';
    html += '    <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('sala') + '</span></a>';
    html += '</li>';

    for (var i = 0; i < personas.length; i++) {
        html += '<li>';
        html += '    <a data-id="' + personas[i].id + '" href="javascript:void(0)">';
        html += '       <img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"><span>' + personas[i].nombre + '<small class="text-success">online</small></span>';
        html += '   </a>';
        html += '</li>';
    }
    divUsuarios.html(html);
}



function renderizarMensajes(mensaje, yo) {
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();
    var html = '';

    if (yo) {
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-inverse">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    } else {
        var adminClass = 'info';
        if (mensaje.nombre === 'Admin') {
            adminClass = 'danger';
        }
        html += '<li class="animated fadeIn">';
        if (mensaje.nombre != 'Admin') {
            html += '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        }
        html += '    <div class="chat-content">';
        html += '        <h5>' + mensaje.nombre + '</h5>';
        html += '        <div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>';
        html += '    </div>';
        html += '    <div class="chat-time">' + hora + '</div>';
        html += '</li>';
    }
    divChatbox.append(html);
    scrollBottom();
}




// Listeners

divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');
    if (id) {
        console.log(id);
    }
});


formEnviar.on('submit', function(event) {
    event.preventDefault(); // para evitar que el 'enter' en la caja de texto recargue la página
    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    // si el mensaje tiene contenido => enviar mensaje
    socket.emit('enviarMensaje', {
        nombre: params.get('nombre'),
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        txtMensaje.val('').focus(); // borra la caja de texto y deja el foco en ella
        renderizarMensajes(mensaje, true); // pinta el mensaje que hemos escrito nosotros
    })
});



// scroll abajo de todo
function scrollBottom() {
    // selectors
    var newMessage = divChatbox.children('li:last-child');
    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}