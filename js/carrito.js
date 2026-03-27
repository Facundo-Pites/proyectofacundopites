let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar
function agregarAlCarrito(nombre, precio, imagen) {
    const producto = { nombre, precio, imagen };
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContador();

    Swal.fire({
        icon: "success",
        title: "Producto agregado 🛒",
        timer: 1200,
        showConfirmButton: false
    });
}

// Actualiza el número rojo del carrito
function actualizarContador() {
    const contador = document.getElementById("contador-carrito");
    if (contador) {
        contador.innerText = carrito.length;
    }
}

// Función para mostrar los productos en la página carrito.html
function renderizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total");
    if (!lista) return;

    lista.innerHTML = "";
    let total = 0;

    carrito.forEach((prod, index) => {
        total += prod.precio;
        const div = document.createElement("div");
        div.className = "item-carrito d-flex align-items-center mb-3 p-2 border-bottom";
        div.innerHTML = `
            <img src="../${prod.imagen}" width="50" class="me-3">
            <p class="mb-0 flex-grow-1">${prod.nombre} - $${prod.precio.toLocaleString()}</p>
            <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${index})">X</button>
        `;
        lista.appendChild(div);
    });

    totalElemento.innerText = `Total: $${total.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    renderizarCarrito();
    actualizarContador();
}

function finalizarCompra() {
    if (carrito.length === 0) return alert("El carrito está vacío");
    Swal.fire("¡Gracias!", "Tu compra se ha procesado", "success");
    vaciarCarrito();
}

// Ejecutar al cargar
actualizarContador();
if (document.getElementById("lista-carrito")) renderizarCarrito();