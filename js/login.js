const l = (tag) => document.getElementById(tag)

const f = {

  email: () => l("email"),
  password: () => l("password"),
  btnRec: () => l('btnRec'),
  btnLogin: () => l('btnLogin'),
  imailObg: () => l("imailObg"),
  emailInvalid: () => l("emailInvalid"),
  passObg: () => l('passObg'),
  btnRegis: () => l('btnRegis')

}

window.addEventListener('keydown', (e) => {
  let key = e.keyCode
  if (key == "13" || e.key == "Enter") {
    f.btnLogin().click()
  }


})

let str = []


f.password().addEventListener('input', (e) => {

  str.push(e.data)

  if (e.data == null) {
    str.pop()
  }

  if (e.inputType === 'deleteContentBackward') {
    str.splice(-2, 1)
  }

  if (str.length < 6) {
    f.btnLogin().disabled = true
  } else {
    f.btnLogin().disabled = false
  }

})



f.email().addEventListener('change', onChangeEmail)
f.password().addEventListener('change', onChangePassword)
f.btnLogin().addEventListener("click", login)
f.btnRegis().addEventListener('click', register)

function onChangeEmail() {
  toggleButtonDisabled()
  toggleEmailErrors()

}

function onChangePassword() {
  toggleButtonDisabled()
  togglePasswordErrors()

}

function login() {
  showLoading()
  firebase.auth().signInWithEmailAndPassword(f.email().value, f.password().value)
    .then(res => {
      setTimeout(()=>{
        hideLoading()
        window.location.href = 'pg/home.html'
      },3000)
      
    })
    .catch(erro => {
      setTimeout(()=>{
        hideLoading()
      // alert(getMessageError(erro))
      f.imailObg().innerHTML = getMessageError(erro)
      f.imailObg().style.display = 'block'
      console.log(getMessageError(erro))
      },3000)
      
    })
}

function getMessageError(erro) {
  if (erro.code == "auth/user-not-found") {
    return 'Usuário não encontrado!'
  }

  if (erro.code == "auth/wrong-password") {
    return "A senha está incorreta, você tem mais 2 tentativas antes do bloqueio temporário da sua conta!"
  }
  return erro.message
}

function register() {
  window.location.href = 'pg/register.html'
}

function isEmailValid() {
  const email = f.email().value
  if (!email) {
    return false
  }
  return validateEmail(email)
}

function toggleButtonDisabled() {
  const emailValid = isEmailValid()
  f.btnRec().disabled = !emailValid;

  const passwordValid = isPasswordValid()
  f.btnLogin().disabled = !emailValid || !passwordValid
}

function toggleEmailErrors() {
  const email = f.email().value
  f.imailObg().style.display = email ? 'none' : 'block'

  f.emailInvalid().style.display = validateEmail(email) ? "none" : "block"
}

function togglePasswordErrors() {
  const password = f.password().value

  f.passObg().style.display = password ? 'none' : "block"
}

function isPasswordValid() {
  const password = f.password().value
  if (!password) {
    return false
  }
  return true
}


//parei na aula 11