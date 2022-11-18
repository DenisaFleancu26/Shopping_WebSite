const sendData = (path, data) => {
    fetch(path, {
        method: 'post',
        headers: new Headers({'Content-Type': 'application/json'}),
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => processData(data));
}

const processData = (data) => {
   
     if(data.alert){
         showFormError(data.alert);
     }else if(data.name){
        sessionStorage.user = JSON.stringify(data);
        let user = JSON.parse(sessionStorage.user || null);
        if(user.seller == true){  //if user is a manager 
            location.replace('/seller'); //send him to seller page
        }else if(data.product){
            location.replace('/seller');
        }else
            location.replace('/');
     }
}


const showFormError = (err) => {
    let errorForm = document.querySelector('.error');
    errorForm.innerHTML = err;
    errorForm.classList.add('show');

    setTimeout(() => {
        errorForm.classList.remove('show')
    }, 2000)
}