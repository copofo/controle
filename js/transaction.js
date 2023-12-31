const d = (tag) => document.getElementById(tag)

const f = {
    date: () => d("date"),
    dateRequiredError: () => d("dateRequiredError"),
    dateInvalidError: () => d("dateInvalidError"),
    value: () => d('value'),
    valueRequiredError: () => d('valueRequiredError'),
    valueLessOrEqualToZeroError: () => d('valueLessOrEqualToZeroError'),
    transactionType: () => d('transactionType'),
    transactionRequiredError: () => d('transactionRequiredError'),
    saveButton: () => d('saveButton'),
    expense: () => d('expense'),
    income: () => d('income'),
    currency: () => d('currency'),
    description: () => d('description')
}

f.date().addEventListener('change', onChangeDate)
f.value().addEventListener('change', onchangeValue)
f.value().addEventListener('input', onchangeValue)
f.transactionType().addEventListener('change', onChangeTransactionType)
f.saveButton().addEventListener('click', saveTransaction)

if (!isNewTransaction()) {
    const uid = getTransactionUid()
    findTransactionByUid(uid)
}

function findTransactionByUid(uid) {
    showLoading()
    firebase.firestore()
        .collection("transactions")
        .doc(uid)
        .get()
        .then(doc => {
            hideLoading()
            if (doc.exists) {
                fillTransactionScreen(doc.data())
                toggleSaveButtonDisable()

            } else {
                alert('Documento não encontrado!')
                window.location.href = 'home.html'
            }
        })
        .catch(()=>{
            hideLoading()
            alert("Erro ao recuperar o documento!")
            window.location.href = 'home.html'
        })
       
}

function fillTransactionScreen(transaction){
    if(transaction.type == 'expense')
    f.expense().checked = true
    else{
        f.income().checked = true
    }

    f.date().value = transaction.date
    f.currency().value = transaction.money.currency
    f.value().value = transaction.money.value
    f.transactionType().value = transaction.transactionType
    
    if(transaction.description){
        f.description().value = transaction.description
    }
}   





function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('uid')
}

function isNewTransaction() {
    return getTransactionUid() ? false : true
}

function saveTransaction() {
    showLoading()
    const transaction = createTransaction()

    if(isNewTransaction()){
        save(transaction)
    }else{
        update(transaction)
    }
    
}

function save(transaction){
    firebase.firestore()
        .collection('transactions')
        .add(transaction)
        .then(() => {
            hideLoading()
            window.location.href = 'home.html'
        })
        .catch(() => {
            alert("Erro ao salvar transação!")
        })

}

function update(transaction){
    showLoading()
    firebase.firestore()
    .collection("transactions")
    .doc(getTransactionUid())
    .update(transaction)
    .then(()=>{
        hideLoading()
        window.location.href = 'home.html'
    })
    .catch(()=>{
        alert("Erro ao atualizar transação!")
    })
}

function createTransaction() {
    return {

        type: f.expense().checked ? 'expense' : 'income',
        date: f.date().value,
        money: {
            currency: f.currency().value,
            value: parseFloat(f.value().value)
        },
        transactionType: f.transactionType().value,
        description: f.description().value,
        user: {
            uid: firebase.auth().currentUser.uid
        }
    }
}

function onChangeDate() {
    const date = f.date().value
    f.dateRequiredError().style.display = !date ? 'block' : 'none'

    toggleSaveButtonDisable()
}

function onchangeValue() {
    const value = f.value().value
    f.valueRequiredError().style.display = !value ? 'block' : 'none'

    f.valueLessOrEqualToZeroError().style.display = value <= 0 ? 'block' : 'none'

    toggleSaveButtonDisable()
}


function onChangeTransactionType() {
    const transactionType = f.transactionType().value

    f.transactionRequiredError().style.display = !transactionType ? 'block' : 'none'

    toggleSaveButtonDisable()
}

function toggleSaveButtonDisable() {
    f.saveButton().disabled = !isFormValid()
}

function isFormValid() {
    const date = f.date().value
    if (!date) {
        return false
    }
    const value = f.value().value
    if (!value || value <= 0) {
        return false
    }
    const transactionType = f.transactionType().value
    if (!transactionType) {
        return false
    }
    return true
}