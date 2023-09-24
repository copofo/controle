const d = (tag) => document.getElementById(tag)

const f = {
    date: () => d("date"),
    dateRequiredError: () => d("dateRequiredError"),
    dateInvalidError: () => d("dateInvalidError"),

    btnRegister: () => d("btnRegister"),
    emailObg: () => d("emailObg"),
    emailInvalid: () => d("emailInvalid"),
    passwordObg: () => d("passwordObg"),
    passwordMinLength: () => d("passwordMinLength"),
    passwordMatchError: () => d("passwordMatchError"),
    btnLogin: () => d('btnLogin')
}

f.date().addEventListener('change', onChangeDate)
f.value().addEventListener('change', onchangeValue)

function onChangeDate(){
    const date = f.date().value
    f.dateRequiredError().style.display = !date ? 'block' : 'none'
}

