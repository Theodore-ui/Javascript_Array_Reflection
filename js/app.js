//colours amd boxshadows

const $darkGreen = '#25a25a';
const $greenBoxShadow = 'rgba(37, 162, 90, 0.25) 0px 54px 55px, rgba(37, 162, 90, 0.12) 0px -12px 30px, rgba(37, 162, 90, 0.12) 0px 4px 6px, rgba(37, 162, 90, 0.17) 0px 12px 13px, rgba(37, 162, 90, 0.09) 0px -3px 5px';
const $blueBoxShadow = 'rgba(42, 110, 198, 0.25) 0px 54px 55px, rgba(42, 110, 198, 0.12) 0px -12px 30px, rgba(42, 110, 198, 0.12) 0px 4px 6px, rgba(42, 110, 198, 0.17) 0px 12px 13px, rgba(42, 110, 198, 0.09) 0px -3px 5px';
// random image display
const card = document.querySelector('#image_container');
const imgBtn = document.querySelector('.refresh_img');
const url = 'https://picsum.photos/405';


//email validation
const email = document.querySelector('#email_input');
const emailMsg = document.querySelector(".input_msg");
const emailBtn = document.querySelector(".email_submit");
const emailRegex = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/;
const emailNullMsg = "Please enter an email";
const emailFormatMsg = "Please enter a valid email";
const emailSuccessMsg = "Success! your email has been linked to the image";
const repeatImgMsg = "Image is aleardy Linked to email";
const pod = document.querySelector('.link_img');
 
//email and image shorage
let db = [];

//Image search
const search = document.querySelector('#search_input');
const searchMsg = document.querySelector(".search_msg");
const searchBtn = document.querySelector(".search_submit");
const imageGallery = document.querySelector('.image_gallery');
const searchNotFoundMsg = "Email address not recognised";
const imageGalleryCont = document.querySelector('#image_gallery_container');
const exitBtn = document.querySelector('.exit');
const subTitle = document.querySelector('.sub_title');

//Fetch functions

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .catch(error => console.log('looks like there was a problem', error))
}

Promise.all([
    fetchData(url)   
])

.then(data => {
    let randomImage = data[0].url;
    
    generateImage(randomImage);
})

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
    fetchData(url) 
        .then(data => {
            img.src = data.url;
            img.alt = 'Random Image';
        })
}

//validate email

function validateEmail() { 
    const emailInput = email.value.toLowerCase();
    const img = card.querySelector('img');
    if (email.value === '') {
        html = emailNullMsg; 
        emailMsg.style.color = 'red';     
    } else if (!email.value.match(emailRegex)) {
        html = emailFormatMsg;
        emailMsg.style.color = 'red';
    } else if (checkImageRepeats(emailInput, img.src) === true) {
        html = repeatImgMsg;
        emailMsg.style.color = 'red'; 
    } else {
        html = emailSuccessMsg; 
        emailMsg.style.color = $darkGreen; 
        pushToDB(emailInput, img.src); 
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
    const img = imageGallery.querySelector('img');
    let emailExists;
    for (let i = 0; i < db.length; i++) {
        if (db[i].email === emailIn) {
            db[i].images.push(image)
            emailExists = true;
            if (imageGallery.classList.contains(emailIn) && imageGalleryCont.style.display === 'flex') {
                retrieveImages()   
            }
            break;
        } else {
            emailExists = false;
        }
    }
    if (!emailExists) {
        db.push({email: emailIn, images: [image]});
    }
    pushToDBAnimations() 
}

function pushToDBAnimations() {
    pod.style.boxShadow = 'none';
    pod.style.boxShadow = $greenBoxShadow;
    emailBtn.style.display = 'none';
    setTimeout( function() {
        changeImage()
        pod.style.boxShadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px';
        emailMsg.textContent = '';
        emailBtn.style.display = 'block';
    },1500);
}

//retrieve images 

function retrieveImages() {
    const searchInput = search.value.toLowerCase();
    let searchExists;
    for (let i = 0; i < db.length; i++) {
        if (db[i].email === searchInput) {
            imageGalleryCont.style.display = 'flex';
            subTitle.textContent = searchInput;
            imageGallery.innerHTML = '';
            for (let j = 0; j < db[i].images.length; j++) {
                let html = `
                <img src='${db[i].images[j]}' alt='${db[i].email}'>
                `;
                imageGallery.innerHTML += html;
                imageGallery.className = '';
                imageGallery.classList.add('image_gallery', searchInput);
            }
            for (i of imageGallery.querySelectorAll('img')) {
                i.addEventListener('click', removeImage);
            }
            searchExists = true;
            retrieveImagesAnimations()
            break;
        } else {
            searchExists = false;
        }
    }
    if (!searchExists) {
        searchMsg.style.color = 'red';
        searchMsg.textContent = searchNotFoundMsg;    
    }
    setTimeout( function() {
        searchMsg.textContent = '';
    },1500); 
}

function retrieveImagesAnimations() {
    pod.style.boxShadow = 'none';
    pod.style.boxShadow = $blueBoxShadow;
    setTimeout( function() {
        pod.style.boxShadow = 'rgba(0, 0, 0, 0.35) 0px 5px 15px';
    },1500);
}

//closing the gallery 

function closeGallery () {
    imageGalleryCont.style.display = 'none';
}

//removing an image from the gallery



function removeImage(e) {
    e.target.remove();

    const index = db.find(item => item.email === subTitle.textContent).images.indexOf(e.target);
        
    db[subTitle.textContent].images.splice(index,1);
}
//Event Listeners

    


imgBtn.addEventListener('click', changeImage);
emailBtn.addEventListener('click', validateEmail);
searchBtn.addEventListener('click', retrieveImages);
exitBtn.addEventListener('click', closeGallery);







