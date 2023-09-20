window.addEventListener("DOMContentLoaded", ()=>{
    firebase.auth().onAuthStateChanged(user =>{
        if(!user || !user.emailVerified){
            window.location.href = '../index.html'
        } else{
            document.body.style.display = 'block'
        }
    })
})