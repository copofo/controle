const d = (tag)=> document.getElementById(tag)
const cr = (tag) => document.createElement(tag)
const f = {
    logout: ()=> d('logout'),
    btnNewTransaction: ()=> d('btnNewTransaction')
}


f.btnNewTransaction().addEventListener('click', newTransaction)

firebase.auth().onAuthStateChanged(user =>{
    if(user){
        findTransactions(user)
    }
})


function newTransaction(){
    window.location.href = 'transaction.html'
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


function findTransactions(user){
        showLoading()
        firebase.firestore()
            .collection('transactions')
            .where('user.uid', '==', user.uid)
            .orderBy('date', 'desc')
            .get()
            .then(snapshot =>{
                hideLoading()
                const transaction = snapshot.docs.map(doc => doc.data())
                addTransactionToScreen(transaction)
            })
            .catch(erro =>{
                console.log(erro)
                alert('Erro ao recuperar transações!')
            })
}

function addTransactionToScreen(transaction){
    const orderList = d('transaction')

    transaction.forEach(transaction => {
        const li = cr('li')

        li.classList.add(transaction.type)

        const date = cr('p')
        date.innerHTML = formatDate(transaction.date)
        li.appendChild(date)

        const money = cr('p')
        money.innerHTML = formatMoney(transaction.money)
        li.appendChild(money)

        const type = cr('p')
        type.innerHTML = transaction.transactionType
        li.appendChild(type)

        if(transaction.description){
            const description = cr('p')
            description.innerHTML = transaction.description
            li.appendChild(description)
        }


        orderList.appendChild(li)
    });
}

function formatDate(date){
    return new Date(date).toLocaleDateString('pt-br')
}

function formatMoney(money){
    return `${money.currency} ${money.value.toFixed(2)}`
}
