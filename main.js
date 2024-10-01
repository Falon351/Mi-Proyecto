const btnCart = document.querySelector('.container-cart-icon')
const containerCartProducts = document.querySelector('.container-cart-products')
btnCart.addEventListener('click', () => {
    containerCartProducts.classList.toggle('hidden-cart')
})

const cartInfo = document.querySelector('.cart-product')
const rowProduct = document.querySelector('.row-product')

// Lista de contenedores de producto
const productoLista = document.querySelector('.contenedor-items')

let allProducts = []

const valorTotal = document.querySelector('.total-pagar')

const countProduct = document.querySelector('#contador-productos') 


productoLista.addEventListener('click', e => {
    if(e.target.classList.contains('boton-item')){
        const product = e.target.parentElement

        const infoProduct ={
            quantity: 1,
            title: product.querySelector('span').textContent,
            price: product.querySelector('.precio-item').textContent
            
        }

        const existe = allProducts.some(product => product.title === infoProduct.title)
        if (existe){
            const products = allProducts.map(product => {
                if(product.title === infoProduct.title){
                    product.quantity++;
                    return product
                    
                }else{
                    return product
                }
            })
            allProducts = [...products]
        }else{

            allProducts= [...allProducts, infoProduct]
        }
        
        

        showHTML()
        
    }
    
    
    
    
})


// Mostrar HTML

const showHTML = () => {

    rowProduct.innerHTML = '';

    let total = 0;
    let totalOfProducts = 0;

    allProducts.forEach(product => {
        const containerProduct = document.createElement('div')
        containerProduct.classList.add('cart-product')

        containerProduct.innerHTML = `

        <div class="info-cart-product">
            <span class="cantidad-producto-carrito">${product.quantity}</span>
            <p class="titulo-producto-carrito">${product.title}</p>
            <span class="precio-producto-carrito"> ${product.price}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="icon-close">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
        `

        rowProduct.append(containerProduct);

        total = total + (product.quantity * product.price.slice(1))
        totalOfProducts = totalOfProducts + product.quantity;

    });
    valorTotal.innerText= `$${total}`
    countProduct.innerText = totalOfProducts;

};

