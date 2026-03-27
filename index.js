//  Traer carrito
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//  Agregar producto
function agregarAlCarritoAsync(producto) {
  return new Promise((resolve) => {
    setTimeout(() => {
      carrito.push(producto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      resolve();
    }, 500);
  });
}

async function agregarAlCarrito(nombre, precio, imagen) {
  const producto = { nombre, precio, imagen };

  await agregarAlCarritoAsync(producto);

  actualizarContador();

  Swal.fire({
    position: "top-center",
    icon: "success",
    title: "Producto agregado al carrito 🛒",
    showConfirmButton: false,
    timer: 1500
  });
}

//  Mostrar carrito
function mostrarCarrito() {
  const contenedor = document.getElementById("lista-carrito");
  const totalHTML = document.getElementById("total");

  if (!contenedor || !totalHTML) return;

  contenedor.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    contenedor.innerHTML += `
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
        <img src="${producto.imagen}" style="width: 60px;">
        <p>${producto.nombre} - $${producto.precio}</p>
        <button onclick="eliminarProducto(${index})" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;">
          X
        </button>
      </div>
    `;
    
    total += producto.precio;
  });

  totalHTML.innerText = "Total: $" + total;
}

//  Vaciar carrito
function vaciarCarrito() {
  Swal.fire({
    title: "¿Vaciar carrito?",
    text: "Se eliminarán todos los productos",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, vaciar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("carrito");
      carrito = [];

      Swal.fire({
        icon: "success",
        title: "Carrito vaciado 🧹",
        timer: 1200,
        showConfirmButton: false
      });

      setTimeout(() => location.reload(), 1200);
    }
  });
}

//  Contador
function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;

  contador.innerText = carrito.length;
}

//  Eliminar producto 
function eliminarProducto(index) {
  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  mostrarCarrito();
  actualizarContador();

  Swal.fire({
    icon: "info",
    title: "Producto eliminado",
    timer: 1000,
    showConfirmButton: false
  });
}

// Async compra
function finalizarCompraAsync() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (carrito.length === 0) {
        reject("El carrito está vacío");
      } else {
        resolve("¡Gracias por tu compra!");
      }
    }, 1000);
  });
}

async function finalizarCompra() {
  try {
    const mensaje = await finalizarCompraAsync();

    await Swal.fire({
      icon: "success",
      title: mensaje,
      text: "Tu pedido fue procesado correctamente 🎉",
      confirmButtonText: "Genial",
    });

    localStorage.removeItem("carrito");
    carrito = [];

    actualizarContador();
    location.reload();

  } catch (error) {
    Swal.fire({
      icon: "warning",
      title: "Ups...",
      text: error + " 🛒",
      confirmButtonText: "Ok",
    });
  }
}

// Cargar productos
async function cargarProductos() {
  const contenedor = document.getElementById("contenedor-productos");

  if (!contenedor) return;

  contenedor.innerHTML = "Cargando productos...";

  try {
    const res = await fetch('../productos.json');
    const productos = await res.json();

    contenedor.innerHTML = "";

    productos.forEach((producto) => {
      contenedor.innerHTML += `
        <div class="menu-compra">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
          <p>$${producto.precio}</p>
          <button onclick="agregarAlCarrito(\`${producto.nombre}\`, ${producto.precio}, \`${producto.imagen}\`)">
            Agregar
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error cargando productos:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudieron cargar los productos"
    });
  }
}


cargarProductos();
mostrarCarrito();
actualizarContador();