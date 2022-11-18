//a user is logged
window.onload = () => {
    if(sessionStorage.user){
        user = JSON.parse(sessionStorage.user);
        if(user.email){
            location.replace('/');
        }
    }
}


//form
 let formBtn = document.querySelector('.submit-btn');

 formBtn.addEventListener('click', () => {
    let fullname = document.querySelector('#name') || null;
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let number = document.querySelector('#number') || null;

    

    if(fullname != null){ //signup page
        //form validation
        if(number.value.length < 10) {
            showFormError('Invalid phone number!');
        }else  if(password.value.length < 8) {
            showFormError('Password must be 8 letters long!');
        }else if(fullname.value.length < 3) {
            showFormError('Name must be 3 letters long!');
            //submit form
        }else{
            sendData('/signup', {
                name: fullname.value,
                email: email.value,
                password: password.value,
                number: number.value
            })
        }
     }else{ //login page
        if(!email.value.length || !password.value.length){
            showFormError('Your data is invalid!');
        }else{
            //submit form
            sendData('/login', {
                email: email.value,
                password: password.value
            }) 
        }

     }
})

