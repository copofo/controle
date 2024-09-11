// Funções auxiliares para manipulação de DOM
const d = (tag) => document.getElementById(tag);
const cr = (tag) => document.createElement(tag);

// Objeto para acessar elementos DOM
const f = {
    logout: () => d('logout'),
    btnNewTransaction: () => d('btnNewTransaction')
};

// Adiciona eventos aos botões
f.btnNewTransaction().addEventListener('click', newTransaction);
f.logout().addEventListener('click', logout);

// Adiciona um evento de mudança ao seletor de data
const datePicker = d('datePicker');
datePicker.addEventListener('change', handleDateChange);

// Adiciona um evento ao botão para mostrar todas as transações
const showAllButton = d('showAll');
showAllButton.addEventListener('click', () => {
    datePicker.value = ''; // Limpa a data para mostrar todas as transações
    handleDateChange(); // Chama a função de alteração de data para mostrar todas as transações
});

// Função para converter data para o formato "dia/mês/ano"
function formatDateForFirestore(date) {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Função para lidar com mudanças na data selecionada
function handleDateChange() {
    const selectedDate = datePicker.value ? formatDateForFirestore(datePicker.value) : null;
    const isShowingAll = !datePicker.value; // Verifica se está mostrando todas as transações
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            findTransactions(user, isShowingAll ? null : selectedDate); // Passa null para buscar todas as transações
        }
    });
}

// Função para redirecionar para a página de nova transação
function newTransaction() {
    window.location.href = 'transaction.html';
}

// Função para realizar o logout
function logout() {
    firebase.auth().signOut()
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch(() => {
            alert("Erro ao fazer logout!");
        });
}

// Função para buscar transações com base na data ou todas
function findTransactions(user, date) {
    showLoading();
    let query = firebase.firestore().collection('transactions')
        .where('user.uid', '==', user.uid)
        .orderBy('date', 'desc');

    if (date) {
        query = query.where('date', '==', date); // Filtra por data específica
    }

    query.get()
        .then(snapshot => {
            hideLoading();
            const transactions = snapshot.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            }));
            
            addTransactionToScreen(transactions);
            calculateAndDisplaySummary(transactions);
        })
        .catch(error => {
            hideLoading(); // Assegura que o carregamento seja escondido em caso de erro
            console.log('Error retrieving transactions:', error); // Diagnóstico
            alert('Erro ao recuperar transações!');
        });
}

// Função para adicionar transações à tela
function addTransactionToScreen(transactions) {
    const orderList = d('transaction');
    orderList.innerHTML = ''; // Limpa a lista antes de adicionar novas transações

    transactions.forEach(transaction => {
        const li = cr('li');
        li.classList.add(transaction.type, "li-get");
        li.addEventListener('dblclick', () => {
            window.location.href = 'transaction.html?uid=' + transaction.uid;
        });
        
        const date = cr('p');
        date.innerHTML = "DATA: " + formatDate(transaction.date);
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

// Função para formatar datas
function formatDate(date) {
    const [day, month, year] = date.split('/');
    return `${day}/${month}/${year}`;
}

// Função para formatar valores monetários
function formatMoney(money) {
    return `${money.currency}: $${money.value.toFixed(2)}`;
}

// Função para calcular e exibir o resumo financeiro
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
                    console.warn('Tipo não é "income" nem "expense":', transaction.type);
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

// Função para mostrar a tela de carregamento
function showLoading() {
    d('loading').style.display = 'block';
}

// Função para esconder a tela de carregamento
function hideLoading() {
    d('loading').style.display = 'none';
}

// Inicializa o seletor de data para a data atual ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
    datePicker.value = today; // Define a data atual como padrão

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            findTransactions(user, formatDateForFirestore(today)); // Chama com a data atual
        }
    });
});
