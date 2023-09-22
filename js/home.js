const d = (tag)=> document.getElementById(tag)
const cr = (tag) => document.createElement(tag)
const f = {
    logout: ()=> d('logout')
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

findTransactions()

function findTransactions(){
   
    setTimeout(()=>{
      
        addTransactionToScreen(fakeTransactions)
    },1000)
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
const fakeTransactions = 
[
    {
        type: "expense",
        date: "2023-09-21",
        money: {
            currency: "R$",
            value: 10
        },
        transactionType: "Supermercado"
    },

    {
        type: "income",
        date: "2023-09-19",
        money: {
            currency: "R$",
            value: 5000
        },
        transactionType: "Salário",
        description: "Empresa A"
    },

    {
        type: "expense",
        date: "2023-09-15",
        money: {
            currency: "EUR",
            value: 10
        },
        transactionType: "Transporte",
        description: "Metrô ida e volta"
    },

    {
        type: "expense",
        date: "2023-09-17",
        money: {
            currency: "USD",
            value: 10
        },
        transactionType: "Aluguel",
        description: "Mensalidade"
    },

    
]