// random image display
const card = document.querySelector('#image_container');
const imgBtn = document.querySelector('#refresh_img');

//email validation
const email = document.querySelector('#email_input');
const emailMsg = document.querySelector("#input_msg");
const emailBtn = document.querySelector("#email_submit");
const emailRegex = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/;
const emailNullMsg = "Please enter your email";
const emailFormatMsg = "Please enter a valid email";
const emailSuccessMsg = "Success! your email has been linked to the image";
const repeatImgMsg = "Image is aleardy Linked to email Address";
//email and image shorage
let db = []

//Image search
const search = document.querySelector('#search_input');
const searchMsg = document.querySelector("#search_msg");
const searchBtn = document.querySelector("#search_submit");
const imageGallery = document.querySelector('#image_gallery');
const searchNotFoundMsg = "Email address not recognised";

//Fetch functions

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .catch(error => console.log('looks like there was a problem', error))
}

Promise.all([
    fetchData('https://picsum.photos/200')   
])
.then(data => {
    let randomImage = data[0].url;
    
    generateImage(randomImage);
})

//helper Functions 

function checkStatus(response) {
    if(response.ok){
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}


function generateImage(data) {
    const html = `
    <img src='${data}' alt='Random Image'>
    `;
    card.innerHTML = html;
}

function changeImage() {
    const img = card.querySelector('img');
    fetchData('https://picsum.photos/200') 
        .then(data => {
            img.src = data.url;
            img.alt = 'Random Image';
        })
}

//validate email

function validateEmail() {
    const img = card.querySelector('img'); 
    if (email.value === '') {
        html = emailNullMsg;      
    } else if (!email.value.match(emailRegex)) {
        html = emailFormatMsg;
    } else if (checkImageRepeats(email.value, img.src) === true) {
        html = repeatImgMsg; 
    } else {
        pushToDB(email.value, img.src);
        html = emailSuccessMsg;   
    }
    emailMsg.textContent = html;
}

function checkImageRepeats(emailIn, image) {
    for (let i = 0; i < db.length; i++) {
        if (db[i].email === emailIn) {
            let imageExists;
            for (let j = 0; j < db[i].images.length; j++) {
                if (image === db[i].images[j]) {
                    imageExists = true;
                    break;
                } else {
                    imageExists = false;    
                }
            }
            if (imageExists) {
                return true
            }
        }
    }
}

//pust object to databass

function pushToDB(emailIn, image) {
    let emailExists;
    for (let i = 0; i < db.length; i++) {
        if (db[i].email === emailIn) {
            db[i].images.push(image)
            emailExists = true;
            break;
        } else {
            emailExists = false;
        }
    }
    if (!emailExists) {
        db.push({email: email.value, images: [image]});
    }
}


//retrieve images 

function retrieveImages() {
    let searchExists;
    for (let i = 0; i < db.length; i++) {
        if (db[i].email === search.value) {
            imageGallery.innerHTML = '';
            for (let j = 0; j < db[i].images.length; j++) {
                let html = `
                <img src='${db[i].images[j]}'>
                `;
                imageGallery.innerHTML += html;
            }
            searchExists = true;
            break;
        } else {
            searchExists = false;
        }
    }
    if (!searchExists) {
        searchMsg.textContent = searchNotFoundMsg;    
    }  
}

//Event Listeners
imgBtn.addEventListener('click', changeImage);
emailBtn.addEventListener('click', validateEmail);
searchBtn.addEventListener('click', retrieveImages);







