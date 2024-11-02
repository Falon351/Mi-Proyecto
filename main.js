const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
const rowProduct = document.querySelector('.row-product');
const productoLista = document.querySelector('.contenedor-items');
const valorTotal = document.querySelector('.total-pagar');
const countProduct = document.querySelector('#contador-productos');

// Recupera el carrito del almacenamiento local, o establece un carrito vacío
let allProducts = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para formatear el precio a la moneda local
const formatPrice = (price) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);

// Función para mostrar/ocultar el carrito
const toggleCartVisibility = () => {
    containerCartProducts.classList.toggle('hidden-cart');
};

// Función para actualizar el carrito en el DOM
const showHTML = () => {
    if (!allProducts.length) {
        rowProduct.innerHTML = `<p class="cart-empty">No hay productos agregados al carrito.</p>`;
        valorTotal.innerText = formatPrice(0);
        countProduct.innerText = 0;
        localStorage.removeItem('carrito');
        return;
    }

    rowProduct.innerHTML = '';
    let total = 0;

    allProducts.forEach(product => {
        const { quantity, title, price } = product;
        const totalPrice = formatPrice(price * quantity);
        
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');
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
        total += price * quantity;
    });

    valorTotal.innerText = formatPrice(total);
    countProduct.innerText = allProducts.reduce((sum, product) => sum + product.quantity, 0);

    saveCart();
};

// Función para guardar el carrito en localStorage
const saveCart = () => {
    try {
        localStorage.setItem('carrito', JSON.stringify(allProducts));
    } catch (error) {
        console.error('Error al guardar el carrito en localStorage:', error);
    }
};

// Función para agregar un producto al carrito
const addProductToCart = (e) => {
    if (e.target.classList.contains('boton-item')) {
        const product = e.target.parentElement;

        const { textContent: title } = product.querySelector('.titulo-item');
        const price = parseFloat(product.querySelector('.precio-item').textContent.replace(/\./g, "").replace("$", ""));
        
        if (isNaN(price)) {
            console.error('Precio no válido');
            return;
        }

        const infoProduct = { quantity: 1, title, price };

        const existe = allProducts.find(p => p.title === infoProduct.title);
        existe ? existe.quantity++ : allProducts.push(infoProduct);

        containerCartProducts.classList.contains('hidden-cart') && toggleCartVisibility();

        showHTML();
    }
};

// Función para quitar un producto del carrito
const removeProductFromCart = (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.closest('.cart-product');
        const { textContent: title } = product.querySelector('.titulo-producto-carrito');

        allProducts = allProducts.filter(p => p.title !== title);
        showHTML();

        !allProducts.length && toggleCartVisibility();
    }
};

// Eventos
btnCart.addEventListener('click', toggleCartVisibility);
productoLista.addEventListener('click', addProductToCart);
rowProduct.addEventListener('click', removeProductFromCart);

// Inicializa el carrito al cargar la página
showHTML();
