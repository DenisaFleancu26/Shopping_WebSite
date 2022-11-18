const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () =>{
    if(scrollY >= 180){
        navbar.classList.add('bg');
    }else{
        navbar.classList.remove('bg');
    }
})



const createNav = () => {
    let nav = document.querySelector('.navbar'); //gaseste primul element navbar

    //atribuim codul HTML al lui navbar
    nav.innerHTML = `
    <div class="nav"> <!-- logo, searchbox, butonul de search, user, manager si cos de cumparaturi -->
            <img src="../images/logo.png" class="brand-logo" alt="Logo-ul brandului Sneakerssss">
            <div class="nav-items">
                <div class="search">
                    <input type="text" class="search-box" placeholder="search brand, product">
                    <button class="search-button">search</button>
                </div>
                <div class="cart" onclick="location.href = '/cart'">
                    <img src="../images/cart.png" class="cart-item" alt="">
                   
                </div>
                <div class="user">
                    <img src="../images/user.png" class="user-item" alt="">
                    <div class="user-login">
                        <p>Login to your account!</p>
                        <a>Login</a> 
                    </div>
                </div>
            </div>
        </div>
        <section class="categories">
            <div class="categorie-container">
                <div class="product-categ">
                    <img src="../images/home.png" class="categorie-img" alt="" onclick="location.href = '/'">
                    <p class="categorie-name">➠</p> 
                </div>
                <div class="product-categ">
                    <img src="../images/women.png" class="categorie-img" alt="" onclick="location.href = '/search/women'">
                    <p class="categorie-name">➠</p> 
                </div>
                <div class="product-categ">
                    <img src="../images/men.png" class="categorie-img" alt="" onclick="location.href = '/search/men'">
                    <p class="categorie-name">➠</p> 
                </div>
                <div class="product-categ">
                    <img src="../images/kids.png" class="categorie-img" alt="" onclick="location.href = '/search/kids'">
                    <p class="categorie-name">➠</p> 
                </div>
            </div>
        </section>

        `;
}

createNav();

//user login

let userIcon = document.querySelector('.user-item');
let userLoginIcon = document.querySelector('.user-login');

userIcon.addEventListener('click', () => userLoginIcon.classList.toggle('active'));

let text = userLoginIcon.querySelector('p');
let actionBtn = userLoginIcon.querySelector('a');
let user = JSON.parse(sessionStorage.user || null);

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
    location.reload();
}

// search box

let searchBtn = document.querySelector('.search-button');
let searchBox = document.querySelector('.search-box');

  searchBtn.addEventListener('click', () => {
    if(searchBox.value.length){
        location.href = `/search/${searchBox.value}`;
    }
  })

  //nav cart

  const updateCartCounter = () => {
    //let cartCounter = document.querySelector('.cart-item-count');

    let cartItem = JSON.parse(localStorage.getItem('cart'));

   /* if(cartItem == null) {
        cartCounter.innerHTML = '00';
    }else{
        if(cartItem.length > 9){
            cartCounter.innerHTML = '9+';
        }else if(cartItem.length <= 9){
            cartCounter.innerHTML = `0${cartItem.length}`;
        }
    }*/
  }

  updateCartCounter();