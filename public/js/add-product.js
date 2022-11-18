

let user = JSON.parse(sessionStorage.user || null);

window.onload = () => {
    if(user == null){
        location.replace('/login');
    }
}


let editables =  [...document.querySelectorAll('*[contenteditable="true"]')];

editables.map((element) => {
    let placeholder = element.getAttribute('data-placeholder');
    element.innerHTML = placeholder;
    element.addEventListener('focus', () => {
        if(element.innerHTML == placeholder){
            element.innerHTML = '';
        }
    })
    element.addEventListener('focusout', () => {
        if(!element.innerHTML.length){
            element.innerHTML = placeholder;
        }
    })
})

const uploadeImage = document.querySelector("#upload-image");
const uploadOverlay = document.querySelector("#upload-overlay");
const img = document.querySelector('.product-img');
let imagePath = '../images/noImage.png';//default image




 
uploadeImage.addEventListener('change', function() {
    const file = this.files[0];
    //imagePath = URL.createObjectURL(this.files[0]);
    if(file){
        const reader = new FileReader();
        reader.onload = function(){
        document.getElementById("img").src = reader.result;
       
    }
    
    reader.readAsDataURL(file);
    imagePath = ('../images/shoes/'+this.files[0].name);
    
}
})

let addProductBtn = document.querySelector('.add-product-btn');
//let saveDraft = document.querySelector('.draft-btn');
let sizes = []; //will store all the sizes

let productName = document.querySelector('.product--title');
let shortDes = document.querySelector('.product-des');
let price = document.querySelector('.price');
let detail = document.querySelector('.des');
let tags = document.querySelector('.tags');

//store size function
const storeSize = () => {
    sizes = [];
    let sizeCheckbox = document.querySelectorAll('.size');
    sizeCheckbox.forEach(item => {
        if(item.checked){
            sizes.push(item.value);
        }
    })
}

addProductBtn.addEventListener('click', () => {
    storeSize();
    //verification
    if(productName.innerHTML == productName.getAttribute('data-placeholder')){
        showFormError('should enter product name');
    }else if(shortDes.innerHTML == shortDes.getAttribute('data-placeholder')){
        showFormError('short des must be 80 letters long');
    }else if(price.innerHTML == price.getAttribute('data-placeholder') || !Number(price.innerHTML)){
        showFormError('enter valid price');
    }else if(detail.innerHTML == detail.getAttribute('data-placeholder')){
        showFormError('must enter the details');
    }else if(tags.innerHTML == tags.getAttribute('data-placeholder')){
        showFormError('enter tags');
    }else if(!sizes.length){
        showFormError('select sizes');
    }else{
        //submit form
        let data = productData();
        if(productId){
            data.id = productId;
        }
        sendData('/add-product', data);
        location.replace('/seller');
    }
})

const productData = () => {
    let tagsArr = tags.innerText.split(",");
    tagsArr.forEach((item, i) => tagsArr[i].trim().toLowerCase());

    return{
        name: productName.innerText,
        shortDes: shortDes.innerText,
        price: price.innerText,
        detail: detail.innerText,
        tags: tags.innerText,
        sizes: sizes,
        image: imagePath,
        draft: false
    }
}
//draft

/*saveDraft.addEventListener('click', () => {
    storeSize();
    let data = productData();
    data.draft = true;
    if(productId) {
        data.id = productId;
    }
    sendData('/add-product', data);
    
    location.replace('/seller');
})*/


//edit page

const fetchProductData = () => {
    addProductBtn.innerHTML = 'Save Product';
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({id : productId})
    }).then(res => res.json())
    .then(data => {
        setFormData(data)
    })
    .catch(err => console.log(err))
}

let productId = null;
if(location.pathname != '/add-product'){
    productId = decodeURI(location.pathname.split('/').pop());
    fetchProductData();
}

const setFormData = (data) => {
    productName.innerHTML = data.name;
    shortDes.innerHTML = data.shortDes;
    price.innerHTML = data.price;
    detail.innerHTML = data.detail;
    tags.innerHTML = data.tags;
    sizes = data.sizes;
    
   let productImg = document.querySelector('.product-img');
    productImg.src = imagePath = data.image;

    let sizeCheckbox = document.querySelectorAll('.size');
    sizeCheckbox.forEach(item => {
        if(sizes.includes(item.value)){
            item.setAttribute('checked', '');
        }
    })
}





