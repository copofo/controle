const d = (tag) => document.getElementById(tag)

const f = {
    date: () => d("date"),
    dateRequiredError: () => d("dateRequiredError"),
    dateInvalidError: () => d("dateInvalidError"),
    value: ()=> d('value'),
    valueRequiredError: ()=> d('valueRequiredError'),
    valueLessOrEqualToZeroError: ()=> d('valueLessOrEqualToZeroError'),
    transactionType: ()=> d('transactionType'),
    transactionRequiredError: ()=> d('transactionRequiredError'),
    saveButton: ()=> d('saveButton'),
    expense: ()=> d('expense'),
    currency: ()=> d('currency'),
    description: ()=> d('description')
}

f.date().addEventListener('change', onChangeDate)
f.value().addEventListener('change', onchangeValue)
f.value().addEventListener('input', onchangeValue)
f.transactionType().addEventListener('change', onChangeTransactionType)
f.saveButton().addEventListener('click', saveTransaction)

function saveTransaction(){
    showLoading()
    const transaction = createTransaction()

    firebase.firestore()
    .collection('transactions')
    .add(transaction)
    .then(()=>{
        hideLoading()
        window.location.href = 'home.html'
    })
    .catch(()=>{
        alert("Erro ao salvar transação!")
    })
    
}

function createTransaction(){
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

function onChangeDate(){
    const date = f.date().value
    f.dateRequiredError().style.display = !date ? 'block' : 'none'

    toggleSaveButtonDisable()
}

function onchangeValue(){
    const value = f.value().value
    f.valueRequiredError().style.display = !value ? 'block' : 'none'

    f.valueLessOrEqualToZeroError().style.display = value <= 0 ? 'block' : 'none'

    toggleSaveButtonDisable()
}


function onChangeTransactionType(){
    const transactionType = f.transactionType().value

    f.transactionRequiredError().style.display = !transactionType ? 'block' : 'none'

    toggleSaveButtonDisable()
}

function toggleSaveButtonDisable(){
    f.saveButton().disabled = !isFormValid()
}

function isFormValid(){
    const date = f.date().value
    if(!date){
        return false
    }
    const value = f.value().value
    if(!value || value <= 0){
        return false
    }
    const transactionType = f.transactionType().value
    if(!transactionType){
        return false
    }
    return true
}