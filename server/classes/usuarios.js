class Usuarios {

    constructor() {
        this.personas = []; // array de las personas conectadas al chat
    }


    // agregar una persona al chat
    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };
        this.personas.push(persona);
        return this.personas;
    }

    // obtener informacion de una persona
    getPersona(id) {
        let personaEncontrada = this.personas.filter(persona => {
            return persona.id === id;
        })[0]; // la funcion 'filter' devuelve un array, por lo que se pone [0], para tomar el primer elemento del mismo
        // también se puede poner así:  --->  let personaEncontrada = this.personas.filter(persona => persona.id === id)[0];
        return personaEncontrada; // si no encuentra ninguna devuelve 'undefined'
    }

    // listar todas las personas activas en el chat
    getPersonas() {
        return this.personas;
    }

    // listado de todas las personas de una sala
    getPersonasSala(sala) {
        let personasEnSala = this.personas.filter(persona => persona.sala === sala);
        return personasEnSala;
    }

    // eliminar una persona del array de personas (por desconexión, banneo, etc)
    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        if (personaBorrada != undefined) {
            // devuelve un array de todas las personas cuyo id no es el enviado por parametro y lo vuelve a asignar a 'this.personas'
            this.personas = this.personas.filter(persona => {
                return persona.id != id;
            })
        }
        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}