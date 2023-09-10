const l = (tag) => document.getElementById(tag)

const f = {

    email: () => l("email"),
    password: () => l("password"),
    btnRec: () => l('btnRec'),
    btnLogin: () => l('btnLogin'),
    imailObg: () => l("imailObg"),
    emailInvalid: ()=> l("emailInvalid"),
    passObg: ()=> l('passObg')

}




f.email().addEventListener('change', onChangeEmail)
f.password().addEventListener('change', onChangePassword)

function onChangeEmail() {
    toggleButtonDisabled()
    toggleEmailErrors()
    
}

function onChangePassword(){
    toggleButtonDisabled()
    togglePasswordErrors()
}

function isEmailValid() {
    const email = f.email().value
    if (!email) {
        return false
    }
    return validateEmail(email)
}

function toggleButtonDisabled(){
    const emailValid = isEmailValid()
    f.btnRec().disabled = !emailValid;

    const passwordValid = isPasswordValid()
    f.btnLogin().disabled = !emailValid || !passwordValid
}

function toggleEmailErrors(){
    const email = f.email().value
    f.imailObg().style.display = email ? 'none' : 'block'

    f.emailInvalid().style.display = validateEmail(email) ? "none" : "block"
}

function togglePasswordErrors(){
    const password = f.password().value

    f.passObg().style.display = password ? 'none' : "block"
}

function isPasswordValid(){
    const password = f.password().value
    if(!password){
        return false
    }
    return true
}



//parei na aula 5