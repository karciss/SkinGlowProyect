// Función para inicializar el carrito
function initCarrito() {
    if (!localStorage.getItem('carrito')) {
        localStorage.setItem('carrito', JSON.stringify([]));
    }
    actualizarContadorCarrito();
    actualizarModalCarrito();
}

// Función para actualizar la estructura del modal del carrito
function actualizarModalCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    modalCarrito.innerHTML = `
        <div class="carrito-header">
            <h3>Carrito de Compras</h3>
            <button onclick="document.getElementById('modal-carrito').style.display='none'" class="btn-cerrar-carrito">
                Cerrar
            </button>
        </div>
        <div id="contenido-carrito"></div>
        <div id="total-carrito"></div>
        <button onclick="finalizarCompra()" class="btn-comprar">Comprar</button>
    `;
}


// Función para agregar producto al carrito
function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let productoExistente = carrito.find(item => item.nombre === nombre);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarNotificacion('Producto agregado al carrito');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    let contadorCarrito = document.getElementById('contador-carrito');
    if (contadorCarrito) {
        contadorCarrito.textContent = total;
    }
}

// Función para mostrar/ocultar el carrito
function toggleCarrito() {
    const modal = document.getElementById('modal-carrito');
    if (modal.style.display === 'none' || !modal.style.display) {
        modal.style.display = 'block';
        mostrarCarrito();
    } else {
        modal.style.display = 'none';
    }
}

// Función para mostrar el contenido del carrito
function mostrarCarrito() {
    const modal = document.getElementById('modal-carrito');
    modal.style.display = 'block';
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    let contenidoCarrito = document.getElementById('contenido-carrito');
    let totalCarrito = document.getElementById('total-carrito');
    
    if (contenidoCarrito) {
        contenidoCarrito.innerHTML = '';
        let total = 0;
        
        if (carrito.length === 0) {
            contenidoCarrito.innerHTML = '<p class="text-center">El carrito está vacío</p>';
        } else {
            carrito.forEach((item, index) => {
                total += item.precio * item.cantidad;
                contenidoCarrito.innerHTML += `
                    <div class="item-carrito">
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <div class="producto-info">
                            <h6>${item.nombre}</h6>
                            <p>Precio: Bs. ${item.precio}</p>
                            <div class="cantidad-controles">
                                <button onclick="cambiarCantidad(${index}, -1)">-</button>
                                <span>${item.cantidad}</span>
                                <button onclick="cambiarCantidad(${index}, 1)">+</button>
                            </div>
                        </div>
                        <button onclick="eliminarDelCarrito(${index})" class="btn-eliminar">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            });
        }
        
        totalCarrito.textContent = `Total: Bs. ${total.toFixed(2)}`;
    }
}


// Función para manejar la compra
function comprar() {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío, agrega productos antes de comprar.");
        return;
    }
    
    // Aquí iría la lógica para procesar la compra (puede ser redirigir a una página de pago, por ejemplo)
    alert("¡Compra realizada con éxito!");

    // Vaciar el carrito después de la compra
    localStorage.setItem('carrito', JSON.stringify([]));
    actualizarContadorCarrito();
    mostrarCarrito(); // Actualiza el carrito después de la compra
}


// Función para cambiar la cantidad de un producto
function cambiarCantidad(index, cambio) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito[index].cantidad += cambio;
    
    if (carrito[index].cantidad < 1) {
        carrito[index].cantidad = 1;
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
}

// Función para eliminar producto del carrito
function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito'));
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
    actualizarContadorCarrito();
    mostrarNotificacion('Producto eliminado del carrito');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById('notificacion');
    if (!notificacion) {
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion';
        document.body.appendChild(notificacion);
    }
    
    notificacion.textContent = mensaje;
    notificacion.className = 'mostrar';
    
    setTimeout(() => {
        notificacion.className = notificacion.className.replace('mostrar', '');
    }, 4000);
}
function finalizarCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito'));
    
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío. Añade productos antes de comprar.');
    } else {
        // Redirigir a la página de finalización de compra
        window.location.href = 'compra.html';
    }
}







//buscar productos
function buscarProductos() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const productos = document.querySelectorAll('.card');
    const resultadosContainer = document.getElementById('resultados-busqueda');
    
    if (!resultadosContainer) {
        const container = document.createElement('div');
        container.id = 'resultados-busqueda';
        document.querySelector('.search-form').appendChild(container);
    }

    resultadosContainer.innerHTML = '';
    
    if (searchTerm.length > 0) {
        let encontrados = false;
        productos.forEach(producto => {
            const nombre = producto.querySelector('.card-title').textContent.toLowerCase();
            const marca = producto.querySelector('.card-text').textContent.toLowerCase();
            
            if (nombre.includes(searchTerm) || marca.includes(searchTerm)) {
                encontrados = true;
                const resultado = document.createElement('div');
                resultado.className = 'resultado-item';
                resultado.innerHTML = `
                    <img src="${producto.querySelector('img').src}" alt="${nombre}">
                    <div class="resultado-info">
                        <div>${producto.querySelector('.card-title').textContent}</div>
                        <div class="marca">${producto.querySelector('.card-text').textContent}</div>
                        <div class="precio">${producto.querySelector('.fw-bold').textContent}</div>
                    </div>
                `;
                
                // Al hacer clic en un resultado
                resultado.addEventListener('click', () => {
                    // Remover destacado anterior si existe
                    const destacadoAnterior = document.querySelector('.producto-destacado');
                    if (destacadoAnterior) {
                        destacadoAnterior.classList.remove('producto-destacado');
                    }

                    // Desplazarse al producto
                    producto.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Agregar clase de destacado
                    producto.classList.add('producto-destacado');
                    
                    // Limpiar búsqueda
                    document.getElementById('search-input').value = '';
                    resultadosContainer.style.display = 'none';

                    // Remover destacado después de un tiempo
                    setTimeout(() => {
                        producto.classList.remove('producto-destacado');
                    }, 2000);
                });
                
                resultadosContainer.appendChild(resultado);
            }
        });
        
        resultadosContainer.style.display = encontrados ? 'block' : 'none';
    } else {
        resultadosContainer.style.display = 'none';
    }
}

// Cerrar resultados al hacer clic fuera
document.addEventListener('click', (e) => {
    const resultadosContainer = document.getElementById('resultados-busqueda');
    const searchInput = document.getElementById('search-input');
    
    if (resultadosContainer && !searchInput.contains(e.target) && !resultadosContainer.contains(e.target)) {
        resultadosContainer.style.display = 'none';
    }
});

// Inicializar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initCarrito();
    // Cerrar el carrito al hacer clic fuera de él
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modal-carrito');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});