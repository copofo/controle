const l = (tag) => document.getElementById(tag)

const f = {
    
    email: () => l('email'),
    password: () => l("password"),
    btnRec: () => l('btnRec'),
    btnLogin: () => l('btnLogin'),
    imailObg: () => l("imailObg")

}



f.email().addEventListener('change', validateFields)
f.password().addEventListener('change', validateFields)

function validateFields() {
    toggleButtonDisabled()
    toggleEmailErrors()
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

}

function isPasswordValid(){
    const password = f.password().value
    if(!password){
        return false
    }
    return true
}

function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
}

