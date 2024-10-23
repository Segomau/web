const btnComprar = document.querySelectorAll('.btn-comprar');
const btnDetalle = document.querySelectorAll('.btn-detalle');
const listaPedido = document.getElementById('pedido-lista');
const btnFinalizar = document.getElementById('finalizar-pedido');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const btnAgregarModal = document.getElementById('btn-agregar-modal');

const pedido = [];
let productoSeleccionado = null;

btnComprar.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const producto = e.target.closest('.producto');
        const nombre = producto.querySelector('h3').textContent;
        const precio = parseFloat(producto.querySelector('.precio').textContent.replace('$', '')); // Convertir a número

        // Añadir al carrito
        pedido.push({ nombre, precio });
        actualizarPedido();
    });
});

btnDetalle.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        const producto = e.target.closest('.producto');
        const nombre = producto.querySelector('h3').textContent;
        const descripcion = producto.querySelector('p').textContent;
        const precio = producto.querySelector('.precio').textContent;
        const imgSrc = producto.querySelector('img').src;

        // Actualizar el modal
        document.getElementById('modal-nombre').textContent = nombre;
        document.getElementById('modal-descripcion').textContent = descripcion;
        document.getElementById('modal-precio').textContent = precio;
        document.getElementById('modal-img').src = imgSrc;

        // Mostrar el modal
        modal.style.display = "block";
        productoSeleccionado = { nombre, precio }; // Guardar el producto seleccionado
    });
});

// Cerrar el modal
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Añadir al carrito desde el modal
btnAgregarModal.addEventListener('click', () => {
    if (productoSeleccionado) {
        const precio = parseFloat(productoSeleccionado.precio.replace('$', '')); // Convertir a número
        pedido.push(productoSeleccionado);
        actualizarPedido();
        modal.style.display = "none"; // Cerrar el modal después de añadir
    }
});

function actualizarPedido() {
    listaPedido.innerHTML = ''; // Limpiar el listado
    let total = 0; // Inicializar el total
    if (pedido.length === 0) {
        listaPedido.innerHTML = '<li>No hay productos en el pedido.</li>';
    } else {
        pedido.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.nombre} - ${item.precio}`;
            listaPedido.appendChild(li);
            total += item.precio; // Sumar al total
        });
    }
    // Mostrar el total
    const totalLi = document.createElement('li');
    totalLi.textContent = `Total: $${total.toFixed(2)}`; // Formatear el total
    listaPedido.appendChild(totalLi);
}

// Finalizar Pedido
btnFinalizar.addEventListener('click', () => {
    if (pedido.length > 0) {
        const metodoPago = prompt("¿Método de pago? (digital/efectivo)");
        let local = '';

        if (metodoPago && metodoPago.toLowerCase() === "efectivo") {
            local = prompt("¿En qué local realizará el pago?");
            if (!local) {
                alert("Debe ingresar un local.");
                return;
            }
        } else if (!metodoPago || (metodoPago.toLowerCase() !== "digital" && metodoPago.toLowerCase() !== "efectivo")) {
            alert("Método de pago no válido. Por favor, elige 'digital' o 'efectivo'.");
            return;
        }

        // Mostrar resumen del pedido
        let resumen = 'Resumen de tu pedido:\n';
        pedido.forEach(item => {
            resumen += `${item.nombre} - ${item.precio}\n`;
        });
        resumen += `Total: $${pedido.reduce((acc, item) => acc + item.precio, 0).toFixed(2)}\n`;
        resumen += `Método de pago: ${metodoPago}`;
        if (metodoPago.toLowerCase() === "efectivo") {
            resumen += `\nLocal: ${local}`;
        }

        alert(resumen);
        // Limpiar el carrito
        pedido.length = 0;
        actualizarPedido();
    } else {
        alert('El carrito está vacío.');
    }
});
