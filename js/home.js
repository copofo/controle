const d = (tag) => document.getElementById(tag);
const cr = (tag) => document.createElement(tag);

const f = {
    logout: () => d('logout'),
    btnNewTransaction: () => d('btnNewTransaction')
};

f.btnNewTransaction().addEventListener('click', newTransaction);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        findTransactions(user);
    }
});

function newTransaction() {
    window.location.href = 'transaction.html';
}

f.logout().addEventListener('click', logout);

function logout() {
    firebase.auth().signOut()
    .then(() => {
        window.location.href = '../index.html';
    })
    .catch(() => {
        alert("Erro ao fazer logout!");
    });
}

function findTransactions(user) {
    showLoading();
    firebase.firestore()
        .collection('transactions')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc')
        .get()
        .then(snapshot => {
            hideLoading();
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            addTransactionToScreen(transactions);
            calculateAndDisplaySummary(transactions);
        })
        .catch(erro => {
            console.log(erro);
            alert('Erro ao recuperar transações!');
        });
}

function addTransactionToScreen(transactions) {
    const orderList = d('transaction');
    orderList.innerHTML = ''; // Clear the list before adding new transactions

    transactions.forEach(transaction => {
        const li = cr('li');
        li.classList.add(transaction.type, "li-get");
        li.addEventListener('dblclick', () => {
            window.location.href = 'transaction.html?uid=' + transaction.uid;
        });
        
        const date = cr('p');
        date.innerHTML = "DATA: "+transaction.date
        li.appendChild(date);

        const money = cr('p');
        money.innerHTML = formatMoney(transaction.money);
        li.appendChild(money);

        const type = cr('p');
        type.innerHTML = "ORIGEM/DESTINO: " + transaction.transactionType;
        li.appendChild(type);

        if (transaction.description) {
            const description = cr('p');
            description.innerHTML = "DESCRIÇÃO/RECEBEDOR: " + transaction.description;
            li.appendChild(description);
        }

        orderList.appendChild(li);
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency}: $${money.value.toFixed(2)}`;
}

function calculateAndDisplaySummary(transactions) {
    let totalSum = 0;
    let incomeSum = 0;
    let expenseSum = 0;

    transactions.forEach(transaction => {
        if (transaction.money && typeof transaction.money === 'object') {
            if (typeof transaction.money.value === 'number') {
                totalSum += transaction.money.value;

                if (transaction.type === 'income') {
                    incomeSum += transaction.money.value;
                } else if (transaction.type === 'expense') {
                    expenseSum += transaction.money.value;
                } else {
                    console.warn('O tipo não é nem "income" nem "expense":', transaction.type);
                }
            } else {
                console.warn('O valor de money.value não é um número:', transaction.money.value);
            }
        } else {
            console.warn('O dado não tem a propriedade money ou money não é um objeto:', transaction);
        }
    });

    const resumoFinance = d('resumoFinance');
    const despesas = d('despesas');
    const receitas = d('receitas');
    const lucro = d('lucro');

    despesas.style.color = 'red';
    receitas.style.color = 'blue';
    lucro.style.color = 'green';
    
    despesas.innerHTML = "Despesas: " + formatMoney({ value: expenseSum, currency: "USD" });
    receitas.innerHTML = "Receitas: " + formatMoney({ value: incomeSum, currency: "USD" });
    lucro.innerHTML = "Lucro: " + formatMoney({ value: incomeSum - expenseSum, currency: "USD" });
}

/* Função de busca */

const buscar = d('buscar');
const dadosList = d('transaction');

buscar.addEventListener('keyup', () => {
    const exp = buscar.value.toLowerCase();

    if (exp.length === 1) {
        return;
    }

    const pes = dadosList.getElementsByClassName('li-get');

    Array.from(pes).forEach(item => {
        const conteudoPes = item.innerHTML.toLowerCase();
        item.style.display = conteudoPes.includes(exp) ? "" : "none";
    });
});



/*




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
                const transaction = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }))
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

        li.classList.add(transaction.type, "li-get")

        li.addEventListener('dblclick', ()=>{
            window.location.href = 'transaction.html?uid=' + transaction.uid
        })
        
        const date = cr('p')
        date.innerHTML = "DATA: "+transaction.date/*formatDate(transaction.date)*/
        
  /*
        li.appendChild(date)

        const money = cr('p')
        money.innerHTML = formatMoney(transaction.money)
        li.appendChild(money)

        const type = cr('p')
        type.innerHTML = "ORIGEM/DESTINO: "+transaction.transactionType
        li.appendChild(type)

        if(transaction.description){
            const description = cr('p')
            description.innerHTML ="DESCRIÇÃO/RECEBEDOR: "+ transaction.description
            li.appendChild(description)
        }
        



        orderList.appendChild(li)
    });
    
    
    
    
}

function formatDate(date){
    return new Date(date).toLocaleDateString('pt-br')
}

function formatMoney(money){
    return `${money.currency}: $${money.value.toFixed(2)}`
}





/* Buscando */
/*
var input = document.getElementById('buscar')
var dadosList = document.getElementById('transaction')


buscar.addEventListener('keyup', ()=>{
    
    let exp = buscar.value.toLowerCase()
    
    
    
    
    if(exp.length === 1){
      
        return;
      
    }
  
  
    
    let pes = dadosList.getElementsByClassName('li-get')
    
    
    
    for(let pos in pes){
      
      if(true === isNaN(pos)){
        
        continue;
        
      }
      
      let conteudoPes = pes[pos].innerHTML.toLowerCase();
      
      if(true === conteudoPes.includes(exp)){
        
        pes[pos].style.display = "";
        
        
      } else{
        
        
        pes[pos].style.display = "none"
      }
      
      
    }
    
    
  })
  
  
  /* Fim Buscando */



/*

document.addEventListener('DOMContentLoaded', () => {
    firebase.firestore()
      .collection('transactions')
      .orderBy('date')
      .onSnapshot(function (documentos) {
        // Inicializa as somas totais
        let totalSum = 0;
        let incomeSum = 0;
        let expenseSum = 0;

        // Itera sobre as mudanças nos documentos
        documentos.docChanges().forEach(function (changes) {
          // Obtém o documento
          const doc = changes.doc;
          
          // Obtém os dados do documento
          const dados = doc.data();

          // Verifica se o dado tem a propriedade 'money' e se é um objeto
          if (dados.money && typeof dados.money === 'object') {
            // Verifica se 'money.value' é um número
            if (typeof dados.money.value === 'number') {
              // Adiciona o valor ao total
              totalSum += dados.money.value;

              // Verifica o tipo e acumula o valor correspondente
              if (dados.type === 'income') {
                incomeSum += dados.money.value;
              } else if (dados.type === 'expense') {
                expenseSum += dados.money.value;
              } else {
                console.warn('O tipo não é nem "income" nem "expense":', dados.type);
              }
            } else {
              console.warn('O valor de money.value não é um número:', dados.money.value);
            }
          } else {
            console.warn('O dado não tem a propriedade money ou money não é um objeto:', dados);
          }
        });

        // Função para formatar os valores com duas casas decimais
        function formatCurrency(value) {
          return value.toFixed(2);
        }

        // Exibe os totais acumulados formatados
        console.log('Total Sum:', formatCurrency(totalSum));
        console.log('Total Income:', formatCurrency(incomeSum));
        console.log('Total Expense:', formatCurrency(expenseSum));

        const resumoFinance = document.getElementById('resumoFinance')

        const despesas = document.getElementById('despesas')

        const receitas = document.getElementById('receitas')

        const lucro = document.getElementById('lucro')

        //resumoFinance.innerHTML = `(-- Resumo Financeiro -- Receitas: ${formatCurrency(incomeSum)}  // Despesas: ${formatCurrency(expenseSum)}  //  Lucro Líquido = ${formatCurrency(formatCurrency(incomeSum)-formatCurrency(expenseSum))})`

        despesas.style.color = 'red'
        receitas.style.color = 'blue'
        lucro.style.color = 'green'
        
        despesas.innerHTML += " - " +formatCurrency(expenseSum)
        receitas.innerHTML += " " +formatCurrency(incomeSum)
        lucro.innerHTML += " = "+formatCurrency(incomeSum-expenseSum)

      

      });
});

/*

document.addEventListener('DOMContentLoaded', () => {
    firebase.firestore()
      .collection('transactions')
      .orderBy('date')
      .onSnapshot(function (documentos) {
        
        var totalSum = 0;
        var incomeSum = 0;
        var expenseSum = 0;
        
        
  
        documentos.docChanges().forEach(function (changes) {
          
          var intervalID
          
          const doc = changes.doc
  
            const dados = {
  
              ...doc.data(), uid: doc.id
  
            }

            function formatCurrency(value) {
                return value.toFixed(2);
            }
          
          
            totalSum += dados.money.value;
            
            if(dados.type == 'income'){
                incomeSum += dados.money.value
            }
            
            if(dados.type == "expense"){
                expenseSum += dados.money.value
            }
            //console.log(formatCurrency(totalSum))
  
            
            const resumoFinance = document.getElementById('resumoFinance')

            resumoFinance.innerHTML = formatCurrency(totalSum) + "-------" + formatCurrency(incomeSum)+ "-----------" + formatCurrency(expenseSum)
        })


        
      })
  })
  
  */
  
  
  
  