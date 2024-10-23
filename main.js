const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const productoLista = document.querySelector('.contenedor-items');
const valorTotal = document.querySelector('.total-pagar');
const countProduct = document.querySelector('#contador-productos');

let allProducts = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para formatear el precio
const formatPrice = (price) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

// Evento para mostrar/ocultar el carrito usando el operador AND
btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

// Evento para agregar productos al carrito
productoLista.addEventListener('click', (e) => {
    if (e.target.classList.contains('boton-item')) {
        const product = e.target.parentElement;

        // Usamos desestructuración para obtener los valores del producto
        const { textContent: title } = product.querySelector('.titulo-item');
        const price = parseFloat(product.querySelector('.precio-item').textContent.replace(/\./g, "").replace("$", ""));

        // Información del producto
        const infoProduct = { quantity: 1, title, price };

        // Actualizar cantidad o agregar producto, optimizado con operador ternario
        const existe = allProducts.find(p => p.title === infoProduct.title);
        existe ? existe.quantity++ : allProducts.push(infoProduct);

        // Usamos el operador AND para mostrar el carrito si está oculto
        containerCartProducts.classList.contains('hidden-cart') && containerCartProducts.classList.remove('hidden-cart');

        showHTML();
    }
});

// Evento para quitar productos del carrito
rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.closest('.cart-product');
        const { textContent: title } = product.querySelector('.titulo-producto-carrito');

        // Usamos el operador spread para crear una nueva lista de productos sin el eliminado
        allProducts = [...allProducts.filter(p => p.title !== title)];

        showHTML();

        // Ocultar carrito si ya no hay productos
        !allProducts.length && containerCartProducts.classList.add('hidden-cart');
    }
});

// Mostrar HTML del carrito
const showHTML = () => {
    // Si no hay productos, mostramos un mensaje y reseteamos valores
    if (!allProducts.length) {
        rowProduct.innerHTML = `<p class="cart-empty">No hay productos agregados al carrito.</p>`;
        valorTotal.innerText = formatPrice(0);
        countProduct.innerText = 0;
        localStorage.removeItem('carrito');  // Eliminar del storage si el carrito está vacío
        return;
    }

    rowProduct.innerHTML = '';
    let total = 0;

    // Mostrar cada producto en el carrito
    allProducts.forEach(product => {
        const { quantity, title, price } = product; // Desestructuración del producto
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        const totalPrice = formatPrice(price * quantity);
        containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${quantity}</span>
                <p class="titulo-producto-carrito">${title}</p>
                <span class="precio-producto-carrito">(${totalPrice})</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="icon-close">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `;

        rowProduct.append(containerProduct);
        total += price * quantity; // Sumar el total
    });

    // Actualizar el total a pagar y el contador de productos
    valorTotal.innerText = formatPrice(total);
    countProduct.innerText = allProducts.reduce((sum, product) => sum + product.quantity, 0);

    // Guardar el carrito en localStorage
    localStorage.setItem('carrito', JSON.stringify(allProducts));
};

// Inicializar el carrito vacío o con productos recuperados de localStorage
showHTML();
