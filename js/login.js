const f = {
    email: () => document.getElementById('email'),
    password: () => document.getElementById("password"),
    btnRec: () => document.getElementById('btnRec'),
    btnLogin: () => document.getElementById('btnLogin')

}

f.email().addEventListener('change', validateFields)
f.password().addEventListener('change', validateFields)

function validateFields() {
    const emailValid = isEmailValid()
    f.btnRec().disabled = !emailValid;

    const passwordValid = isPasswordValid()
    f.btnLogin().disabled = !emailValid || !passwordValid
}

function isEmailValid() {
    const email = f.email().value
    if (!email) {
        return false
    }
    return validateEmail(email)
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

//teste