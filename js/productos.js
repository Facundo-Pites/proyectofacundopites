async function cargarProductos() {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return;

    try {
        // Ajusto la ruta para que funcione desde /paginas/productos.html
        const res = await fetch('./productos.json');
        const productos = await res.json();

        contenedor.innerHTML = "";
        productos.forEach((producto) => {
            const div = document.createElement("div");
            div.className = "menu-compra";
            div.innerHTML = `
                <img src="../${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toLocaleString()}</p>
                <button class="btn-agregar">Agregar</button>
            `;

            div.querySelector(".btn-agregar").addEventListener("click", () => {
                agregarAlCarrito(producto.nombre, producto.precio, producto.imagen);
            });
            contenedor.appendChild(div);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

cargarProductos();