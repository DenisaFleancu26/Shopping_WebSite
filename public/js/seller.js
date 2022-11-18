


let user = JSON.parse(sessionStorage.user || null) //user primeste contul care este logat

let message = document.querySelector('#seller-message');
message.innerHTML += user.name; // adaugam numele managerului in mesaj

//manager login

let userIcon = document.querySelector('.u-item');
let userLoginIcon = document.querySelector('.u-login');

userIcon.addEventListener('click', () => userLoginIcon.classList.toggle('active'));

let text = userLoginIcon.querySelector('p');
let actionBtn = userLoginIcon.querySelector('a');


if(user != null){ //user is logged in
    text.innerHTML = `Log in as, ${user.name}`;
    actionBtn.innerHTML = 'Logout';
    actionBtn.addEventListener('click', () => logout());
}else{
    text.innerHTML = 'Login to your account!';
    actionBtn.innerHTML = 'Login';
    actionBtn.addEventListener('click', () => location.href = '/login');
}

//logout function
const logout = () => {
    sessionStorage.clear();
    location.replace('/');
}


const setupProducts = () => {
    fetch('/get-products', {
        method: 'post',
        headers: new Headers({'Content-Type' : 'application/json'}),
        body: JSON.stringify({email : user.email})
    })
    .then(res => res.json())
    .then(data => {
        if(data != 'no product'){
            data.forEach(product => createProduct(product));
        }
    })
}

setupProducts();