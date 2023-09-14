const d = (tag) => document.getElementById(tag)

const f = {
    email: () => d("email"),
    password: () => d("password"),
    confirmPassword: () => d("confirmPassword"),
    btnRegister: () => d("btnRegister"),
    emailObg: () => d("emailObg"),
    emailInvalid: () => d("emailInvalid"),
    passwordObg: () => d("passwordObg"),
    passwordMinLength: () => d("passwordMinLength"),
    passwordMatchError: () => d("passwordMatchError"),
    btnLogin: ()=> d('btnLogin')
}

f.email().addEventListener("change", onChangeEmail)
f.password().addEventListener("change", onChangePassword)
f.confirmPassword().addEventListener('change', onChangeConfirmPassword)
f.btnRegister().addEventListener('click', register)


f.btnLogin().addEventListener('click', ()=>{
    window.location.href = '../index.html'
})

var currentUser

function onChangeEmail() {
    const email = f.email().value
    f.emailObg().style.display = email ? "none" : "block"

    f.emailInvalid().style.display = validateEmail(email) ? "none" : "block"

    toggleResgisterButtonDisable()
}

function validatePasswordMacth() {
    const confirmPassword = f.confirmPassword().value
    const password = f.password().value

    f.passwordMatchError().style.display = confirmPassword == password ? "none" : "block"
    toggleResgisterButtonDisable()
}

function onChangePassword() {
    const password = f.password().value

    f.passwordObg().style.display = password ? "none" : "block"

    f.passwordMinLength().style.display = password.length >= 6 ? "none" : "block"

    validatePasswordMacth()
    toggleResgisterButtonDisable()
}

function register() {

    showLoading()

    firebase.auth().createUserWithEmailAndPassword(f.email().value, f.password().value)
        .then(user => {


                    firebase.auth().onAuthStateChanged((user) => {
                        hideLoading()
                        currentUser = user
                        firebase.auth().languageCode = "pt"
                        if (user.emailVerified) {
                            window.location.href = "../index.html"
                        } else {
                            hideLoading()

                            user.sendEmailVerification()
                                .then(() => {
                                    alert('Email de Verificação Enviado')
                                    window.location.href = "../index.html"
                                })
                            
                        }


                    })

                })

                .catch(erro => {
                    hideLoading()

                    alert(getMessageError(erro))




                })


        


}


function getMessageError(erro){

    if(erro.code == "auth/email-already-in-use"){

        return 'O endereço de e-mail já está em uso!'

    }


    return erro.message
}


function toggleResgisterButtonDisable() {
    f.btnRegister().disabled = !isFormValid()
}

function isFormValid() {
    const email = f.email().value

    if (!email || !validateEmail(email)) {
        return false
    }

    const password = f.password().value
    if (!password || password.length < 6) {
        return false
    }

    const confirmPassword = f.confirmPassword().value
    if (confirmPassword != password) {
        return false
    }

    return true
}

function onChangeConfirmPassword() {
    validatePasswordMacth()
    toggleResgisterButtonDisable()
}