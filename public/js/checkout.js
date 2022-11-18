 window.onload = () => {
    if(!sessionStorage.user){
        location.replace('/login');
    }
 }

 //select place oreder button
 const placeOrderBtn = document.querySelector('.place-order-btn');

 placeOrderBtn.addEventListener('click', () => {
    let address = getAddress();
    
    //send data to backend
    fetch('/order', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({
            items: JSON.parse(localStorage.cart),
            address: address,
            email: JSON.parse(sessionStorage.user).email
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data);
    })
 })

 const getAddress = () => {
    //form validation
    let address = document.querySelector('#address').value;
    let fullname = document.querySelector('#fullname').value;
    let city = document.querySelector('#city').value;
    let pincode = document.querySelector('#pincode').value;
    let phone = document.querySelector('#phone').value;

    if(!address.length || !fullname.length || !city.length || !pincode.length || !phone.length){
        return showFormError("Fill all the inputs");
    }else{
        location.replace('/placed')
        return {address, fullname, city, pincode, phone}
    }
 }