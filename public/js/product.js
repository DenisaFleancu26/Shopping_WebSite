//size element

const sizeBtns = document.querySelectorAll('.size-radio-btn');
let checkedBtn = 0;

sizeBtns.forEach((item, i) => {
    item.addEventListener('click', () => {
        sizeBtns[checkedBtn].classList.remove('check');
        item.classList.add('check');
        checkedBtn = i;
    })
})


//product page setting

let productName = document.querySelector('.product-title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');
let productImg = document.querySelector('.product-image');
let cartBtn = document.querySelector('.buy-btn'); 


const setData = (data) => {
    
    productName.innerHTML  = data.name;
    shortDes.innerHTML =  data.shortDes;
    price.innerHTML = `$${data.price}`;
    detail.innerHTML = data.detail;
   
    productImg.src = imagePath = data.image;

   
    sizeBtns.forEach(item => {
        if(!data.sizes.includes(item.innerHTML)){
            item.style.display = 'none';
        }
    })

    cartBtn.addEventListener('click', () => {
        if(checkedBtn == 0){
            showFormError('Select your size!');
        }else{
        cartBtn.innerHTML = add_product_to_cart(data);
        }
    })
}

const fetchProductData = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({id : productId})
    }).then(res => res.json())
    .then(data => {
        setData(data);
    })
    
}

let productId = null;
if(location.pathname != '/product'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}
