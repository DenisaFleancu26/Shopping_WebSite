productId = null;

const getProducts = (tags) => {
    return fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({tags: tags})
    }).then(res => res.json())
    .then(data => {
        return data
    })
}


const createProductCards = (data, title, ele) =>{
    let container = document.querySelector(ele);
    container.innerHTML += `
         <h1 class="section-title">Search results for:     ${title}</h1>
         <div class="product-cont">
            ${createCards(data,title)}
        </div>
    `;
}

const createCards = (data,title) => {
    let cards = '';

    data.forEach(item => {
        if(item.id != productId && (item.name == title || item.tags == title)){
            cards += `
        <div class="product-container" onclick="location.href = '/product/${item.id}'">
            <div class="product-card">
                <img src="${item.image}" class="product-img" alt="">
                <p class="price">$${item.price}</p> 
                <p class="product-name">${item.shortDes}</p>
            </div> 
        </div>
        `
        }
    })
        return cards;
    
}

const add_product_to_cart = product => {
    updateCartCounter();
    let cart = JSON.parse(localStorage.getItem('cart'));

    if(cart == null){
        cart = [];
    }

    product = {
        item: 1,
        name: product.name,
        price: product.price,
        shortDes: product.shortDes,
        image: product.image
    }

    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    return 'added';
}