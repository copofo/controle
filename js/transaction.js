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
    saveButton: ()=> d('saveButton')
}

f.date().addEventListener('change', onChangeDate)
f.value().addEventListener('change', onchangeValue)
f.value().addEventListener('input', onchangeValue)
f.transactionType().addEventListener('change', onChangeTransactionType)



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