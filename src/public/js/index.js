//------------------------CLIENTE-----------------
const socket = io() //Del lado del cliente

const swal = async()=>{
    const chatBox =  document.getElementById("chatBox")
    try {
        const result = await Swal.fire({ //SweetAlert
            title: "Identificate",
            input: 'text', 
            text: "Ingresa un usuario",
            inputValidator: value =>{
               return !value && "Necesitas ingresar tu nombre para continuar" //Validacion para que no ingrese vacio
            },
            allowOutsideClick:false //Impide que clickee fuera de la caja. Para que no se cierre
            //AUN SE CIERRA SI APRETO ESC. VALIDAR
        })
        const user = result.value;

        socket.emit('newUser', user)

        socket.on('userConnected', user =>{
            Swal.fire({
                text: `Bienvenido ${user} al chat`,
                toast: true,
                position: 'top-right',
                showConfirmButtom: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success'
            })
        })

        chatBox.addEventListener('keyup', (e)=>{
            if(e.key === 'Enter'){
                if(chatBox.value.trim().length > 0){ //Corrobora que no esté lleno de espacios(trim) y luego que no esté vacio (length >0)
                    //CLIENTE EMITE
                    socket.emit('message', {user, message: chatBox.value}) //'message' (el primero) es un evento que creamos en nuestro servidor
                    chatBox.value = ''
                }
            }
        })
    } catch (error) {
        console.log(errror);
    }
}

//CLIENTE ESCUCHA
socket.on('messageLogs', (data)=>{
    const log = document.getElementById('messageLogs');
    let messages = '';

    data.forEach(message => {
        messages = messages + `${message.user}: ${message.message} </br>`
    });

    log.innerHTML = messages
})

swal()