const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');
btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart');
});

const rowProduct = document.querySelector('.row-product');
const productoLista = document.querySelector('.contenedor-items');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProduct = document.querySelector('#contador-productos');

// Función para formatear el precio usando Intl.NumberFormat

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price);
};

// Evento para agregar productos al carrito

productoLista.addEventListener('click', e => {
    if (e.target.classList.contains('boton-item')) {
        const product = e.target.parentElement;

        const infoProduct = {
            quantity: 1,
            title: product.querySelector('.titulo-item').textContent,
            price: parseFloat(product.querySelector('.precio-item').textContent.replace(/\./g, "").replace("$", ""))
        };

        const existe = allProducts.some(p => p.title === infoProduct.title);
        if (existe) {
            allProducts = allProducts.map(p => {
                if (p.title === infoProduct.title) {
                    p.quantity++;
                }
                return p;
            });
        } else {
            allProducts.push(infoProduct);
        }

        // Mostrar el carrito si está oculto

        if (containerCartProducts.classList.contains('hidden-cart')) {
            containerCartProducts.classList.remove('hidden-cart');
        }
        

        showHTML();
    }
});

// Evento para quitar productos del carrito
rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains('icon-close')) {
        const product = e.target.closest('.cart-product');
        const title = product.querySelector('.titulo-producto-carrito').textContent;

        allProducts = allProducts.filter(p => p.title !== title);
        showHTML();
    }
});

// Mostrar HTML

const showHTML = () => {

    if (!allProducts.length) {
        rowProduct.innerHTML = `<p class="cart-empty">No hay productos agregados al carrito.</p>`;
        valorTotal.innerText = formatPrice(0);
        countProduct.innerText = 0;
        return; 
    }

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div');
        containerProduct.classList.add('cart-product');

        containerProduct.innerHTML = `
        <div class="info-cart-product">
            <span class="cantidad-producto-carrito">${product.quantity}</span>
            <p class="titulo-producto-carrito">${product.title}</p>
            <span class="precio-producto-carrito">${formatPrice(product.price)} (${formatPrice(product.price * product.quantity)})</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="icon-close">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        `;

        rowProduct.append(containerProduct);

        total += product.quantity * product.price;
        totalOfProducts += product.quantity;
    });

    valorTotal.innerText = formatPrice(total);
    countProduct.innerText = totalOfProducts;

};

