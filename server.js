import express from "express";
import bcrypt from "bcrypt";


import { initializeApp } from "firebase/app";
import { getFirestore, doc, collection, setDoc, getDoc,  updateDoc, serverTimestamp, query, where, getDocs, deleteDoc} from "firebase/firestore";
import stripe from 'stripe'; 
import nodemailer from "nodemailer";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD66uo45jeCTN6RQWtjekFUP_k0PxdICpg",
  authDomain: "sneakerssss-8bc48.firebaseapp.com",
  projectId: "sneakerssss-8bc48",
  storageBucket: "sneakerssss-8bc48.appspot.com",
  messagingSenderId: "663271667088",
  appId: "1:663271667088:web:3cd794b4472dddcc06af15"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore();

//init server
const app = express();

//middlewares
app.use(express.static("public"));
app.use(express.json()) //enables form sharing

//aws
import aws from "aws-sdk";
import "dotenv/config";

//routes
//home route 
app.get('/', (req, res) => {
        res.sendFile("index.html", { root: "public" });
})

//search
app.get('/search', (req, res) => {
    res.sendFile("search.html", { root: "public" });
})

//seller
app.get('/seller', (req, res) => {
    res.sendFile("seller.html", { root: "public" });
})

//search
app.get('/search/:key', (req, res) => {
    res.sendFile("search.html", { root: "public" });
})

//add-product
app.get('/add-product', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})

app.get('/add-product/:id', (req, res) => {
    res.sendFile("add-product.html", { root: "public" });
})

app.post('/add-product', (req, res) => {
    let { name, shortDes, detail, price, sizes, image, tags, draft, id} = req.body;

    if(!draft){
        if(!name.length){
            res.json({'alert' : 'should enter product name'});
        }else if(!shortDes.length){
            res.json({'alert' : 'short des must be 80 letters long'});
        }else if(!price.length || !Number(price)){
            res.json({'alert' : 'enter valid price'});
        }else if(!detail.length){
            res.json({'alert' : 'must enter the details'});
        }else if(!tags.length){
            res.json({'alert' : 'enter tags'});
        }else if(!sizes.length){
            res.json({'alert' : 'select sizes'});
        }
    }
    let docName;
    //add-product
       
    docName = id == undefined ? `${name.toLowerCase()}-${Math.floor(Math.random() * 50000)}` : id;
        
    

    let products = collection(db, "products");
    setDoc(doc(products, docName), req.body).then(data => {
        res.json({'product': name})
    })
    .catch(err => {
        res.json({'alert' : 'some error occured'})
    })
})

//product
app.get('/product', (req, res) => {
    res.sendFile("product.html", { root: "public" });
})

//signup
app.get('/signup', (req, res)  => {
    res.sendFile("signup.html", { root : "public"})
})

app.post('/signup', (req, res) => {
    const {name, email, password, number} = req.body;

    //form validation
    if(number.length < 10) {
        res.json({ 'alert' : 'Invalid phone number!'});
    }else  if(password.length < 8) {
        res.json({ 'alert' : 'Password must be 8 letters long!'});
    }else if(name.length < 3) {
        res.json({ 'alert' : 'Password must be 3 letters long!'});
    }else{
        //store the data in db
        const users = collection(db, "users");

        getDoc(doc(users, email)).then(user => {
            if(user.exists()){
             return res.json({'alert' : 'Email already exists!'})
            }else{
                //encrypt password
                bcrypt.genSalt(10, (err,salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        req.body.seller = false;

                        //set the doc
                        setDoc(doc( users, email), req.body).then(data => {
                            res.json({
                                name: req.body.name,
                                email: req.body.email,
                                seller: req.body.seller
                            })
                        })
                    })
                })
            }
        })
    }
})


//login
app.get('/login', (req, res)  => {
    res.sendFile("login.html", { root : "public"})
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email.length || !password.length){
        res.json({ 'alert' : 'Your data is invalid!'});
    }

    const users = collection(db, "users");

    getDoc(doc(users, email)).then(user => {
        if(!user.exists()){
            return  res.json({'alert' : 'Your data is invalid!'});
        }else{
            bcrypt.compare(password, user.data().password, (err, result) => {
                if(result){
                    let data = user.data();
                    return res.json({
                        name: data.name,
                        email: data.email,
                        seller: data.seller
                    })
                }else{
                    return res.json({'alert' : 'Password is incorrect!'})
                }
            })
        }
    })
})

//get-products
app.post('/get-products', (req, res) => {
    let { email, id } = req.body

    let products = collection(db, "products");
    let docRef;

    if(id){
        docRef = getDoc(doc(products, id));
    }else{
        docRef = getDocs(products);
    }

    docRef.then(products => {
        if(products.empty){
            return res.json('no product');
        }

        let productArr = [];

        if(id){
            return res.json(products.data());
        }else{
            products.forEach(item => {
            let data = item.data();
            data.id = item.id;
            productArr.push(data);
        }) 
        }
       

        res.json(productArr);
    })
})

//stripe payment
let stripeGateway = stripe(process.env.stripe_key);

let DOMAIN = process.env.DOMAIN;

app.post('/stripe-checkout', async (req, res)  => {
    const session = await stripeGateway.checkout.session.creat({
        payment_method_types: ["cart"],
        mode: "payment",
        success_url: `${DOMAIN}/success`,
        cancel_url: `${DOMAIN}/checkout`,
        line_items: req.body.items.map(item => {
            return{
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        description: item.shortDes,
                        images: [item.image]
                    }
                }
            }
        })
    })
})

//delete-product
app.post('/delete-products', (req, res) => {
    let { id } = req.body;

    deleteDoc(doc(collection(db, "products"), id))
    .then(data => {
        res.json('success');
    }).catch(err => {
        res.json('err');
    })
})

//cart
app.get('/cart', (req, res)  => {
    res.sendFile("cart.html", { root : "public"})
})

//product
app.get('/product/:id', (req, res)  => {
    res.sendFile("product.html", { root : "public"})
    
    const { checkBtn } = req.body;

    if(checkBtn == 0){
        res.json({ 'alert' : 'Select your size!'});
    }
})

//checkout
app.get('/checkout', (req, res)  => {
    res.sendFile("checkout.html", { root : "public"})
})

//placed
app.get('/placed', (req, res)  => {
    res.sendFile("placed.html", { root : "public"})
})

//order
app.post('/order', (req, res) => {
    const {items, email, address} = req.body;

    let docName = email + Math.floor(Math.random() * 123456789);

    const orders = collection(db, "order");
    setDoc(doc(orders, docName), req.body)
    .then(data => {
        
    })
})

app.listen(3000, () => {
    console.log('listening on port 3000');
})
