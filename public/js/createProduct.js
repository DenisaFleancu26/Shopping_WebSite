const createProduct = (data) => {
    let productContainer = document.querySelector('.product-cont');
    
    productContainer.innerHTML += `
    <div class="product-container">
     <div class="product-card">
        <button class="btn edit-btn" onclick="location.href = '/add-product/${data.id}'"><img class="image" src="images/edit.png" alt=""></button>
        <button class="btn open-btn" onclick="location.href = '/product/${data.id}'"><img class="image" src="images/open.png" alt=""></button>
        <button class="btn delete-btn" onclick="deleteItem('${data.id}')"><img class="image" src="images/delete.png" alt=""></button>
        <img src="${data.image}" class="product-img" alt="">
        <p class="price">$${data.price}</p> 
        <p class="product-name">${data.shortDes}</p>
       
    </div> 
</div>
    `;

}

const deleteItem = (id) => {
    fetch('/delete-products', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({id : id})
    })
    .then(res => res.json())
    .then(data => {
        //process data
        if(data == 'success'){
            location.reload();
        }else {
            showAlert('some error occured');
        }
    })
}