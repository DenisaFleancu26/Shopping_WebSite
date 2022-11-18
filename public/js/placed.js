//create small product cards
const createSmallCards = (data) => {
    return `
    <div class="sm-product">
        <img src="${data.image}" class="sm-product-img" alt="">
        <div class="sm-text">
            <p class="sm-product-name">${data.shortDes}</p>
            <p class="sm-des">${data.name}</p>
        </div>
        
        <p class="sm-price" data-price="${data.price}">${data.item} x $${data.price * data.item}</p>
        
    </div>
    `;
}
let totalBill = 0;


const setCardsProducts = () => {
    const cartContainer = document.querySelector('.cart-container');

    let cart = JSON.parse(localStorage.getItem('cart'));
    if(cart == null || !cart.length){
        cartContainer.innerHTML += `<img src="../images/empty.png" class="empty-img" alt="">`
    }else{
        for(let i = 0; i< cart.length; i++){
            cartContainer.innerHTML += createSmallCards(cart[i]);
            totalBill += Number(cart[i].price * cart[i].item);

            updateBill();

           
        } 
    }
    
}
const updateBill = () => {
    
    let billPrice = document.querySelector('.bill');
    billPrice.innerHTML = `$${totalBill}`;
}





setCardsProducts();
