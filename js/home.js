const d = (tag)=> document.getElementById(tag)
const f = {
    logout: ()=> d('logout')
}



f.logout().addEventListener('click', logout)

function logout(){
    firebase.auth().signOut()
    .then(()=>{
        window.location.href = '../index.html'
    })
    .catch(()=>{
        alert("erro ao fazer logout!")
    })
}