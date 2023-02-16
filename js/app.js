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
            img.alt = 'Random Image r';
        })
}

//validate email

function validateEmail() {
    if (email.value === '') {
        html = emailNullMsg;
         
    } else if (!email.value.match(emailRegex)) {
        html = emailFormatMsg;
    } else {
        html = emailSuccessMsg;
        
    }
    emailMsg.textContent = html;
}

//pust object to databass

//email and image shorage

db = []

//Event Listeners
emailBtn.addEventListener('click', validateEmail);

imgBtn.addEventListener('click', changeImage);







