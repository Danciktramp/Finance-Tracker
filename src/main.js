import './style.css'
const incomeBt = document.getElementById('incomeBt')
const expenseBt = document.getElementById('expenseBt')
const addTransactionBt = document.getElementById('addTransactionBt')
const inputDescription = document.getElementById('inputDescription')
const inputCategory = document.getElementById('inputCategory')
const inputAmount = document.getElementById('inputAmount')
const savedTransactions = localStorage.getItem('transactions')
let selectType = null
let transactions = []
const expenseValue = document.getElementById('expenseValue')
const incomeValue = document.getElementById('incomeValue')
const balanceValue = document.getElementById('balanceValue')
let totalExpense = 0
let totalIncome = 0
let totalBalance = 0
const transactionsList = document.getElementById('transactionsList')
const now = new Date();
const iconDelete = document.getElementById('iconDelete');
const plusPanel = document.getElementById('plusPanel');
const plusBt = document.getElementById('plusBt');
const body = document.body;
const overlay = document.getElementById('overlay');
const categoryAdd = document.getElementById('categoryAdd');
const subcategoryAdd = document.getElementById('subcategoryAdd');
const addFinanceCategory = document.getElementById('addFinanceCategory');
let categories = JSON.parse(localStorage.getItem('categories')) || [
  {id: 1, type:'expense', name:'food', subcategories: []},
  {id: 2, type:'income', name:'salary', subcategories: []}
];
const inputAddCategory = document.getElementById('inputAddCategory');
const addCategoryBt = document.getElementById('addCategoryBt')

const localDateString = now.toLocaleString('ro-RO',{
  year: "numeric",
  month: "long",
  day: "numeric",
})

const localTimeString = now.toLocaleString('ro-RO',{
  hour: '2-digit',
  minute:'2-digit'
})

console.log(localTimeString);

if (savedTransactions){
  transactions = JSON.parse(savedTransactions);
}

updateExpense();
renderList();
//culoarea la income si expense
incomeBt.addEventListener('click', () => {
  document.getElementById('incomeBt').style.backgroundColor = "#31F527";
  document.getElementById('expenseBt').style.backgroundColor = "white";
  selectType = 'income';
  console.log(selectType);
})

expenseBt.addEventListener('click', () => {
  document.getElementById('incomeBt').style.backgroundColor = "white";
  document.getElementById('expenseBt').style.backgroundColor = "red";
  selectType = 'expense';
  console.log(selectType);
})

//functia add transactions
addTransactionBt.addEventListener('click', () => {
  event.preventDefault();
  const now = new Date();
const localDateString = now.toLocaleString('ro-RO',{
  year: "numeric",
  month: "long",
  day: "numeric",
})
const localTimeString = now.toLocaleString('ro-RO',{
  hour: '2-digit',
  minute:'2-digit'
})
  const amount = Number(inputAmount.value);
  const financeDescription = inputDescription.value;
  const financeCategory = selectedCategoryName;
  
  
 
  if(!selectType){
    alert('nu ai selectat tipul de tranzactie');
    return;
  }

const transaction = {
  id: Date.now(),
  type: selectType,
  amount: amount,
  description: financeDescription,
  category:financeCategory,
  time:localTimeString,
  date:localDateString

};
console.log("Tip:", selectType, "Sumă:", amount, "Descriere:", financeDescription, "Categorie:", financeCategory);
transactions.push(transaction);
console.log(transactions);
localStorage.setItem('transactions', JSON.stringify(transactions));
updateExpense();
renderList();
});
//functia calcul total

function updateExpense(){
  totalExpense = 0 
  totalIncome = 0
  
  let diferenta = totalIncome - totalBalance;
  for (let a = 0; a < transactions.length ; a++ ){
    const t = transactions[a];
    console.log(t);
    if(t.type === 'expense'){
      totalExpense += t.amount ;
    } else if(t.type === 'income'){
      totalIncome += t.amount;
    }
    
    
  }

totalBalance = totalIncome - totalExpense;

console.log(totalExpense);
expenseValue.innerHTML =totalExpense +'MDL'
incomeValue.innerHTML = totalIncome + 'MDL'
balanceValue.innerHTML = totalBalance + 'MDL'
}

//functia istoric transactii
function renderList() {
  transactionsList.innerHTML = "";

  for (let a = 0; a < transactions.length; a++) {
    const obj = transactions[a];
    const transactionDiv = document.createElement('div');
    
    // Stilul containerului principal (rândul)
    transactionDiv.className = "flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm gap-4 mx-3";

    // Alegem iconița și culoarea în funcție de tip
    const iconColor = obj.type === 'expense' ? 'text-red-500' : 'text-green-500';
    const svgPath = obj.type === 'expense' 
      ? "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
      : "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 7.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z";

    // Structura nouă care aliniază totul
    transactionDiv.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 ${iconColor}">
        <path fill-rule="evenodd" d="${svgPath}" clip-rule="evenodd" />
      </svg>

      <div class="flex flex-col flex-grow">
        <span class="font-bold text-gray-800 text-lg leading-tight">${obj.category}</span>
        <span class="text-xs text-gray-400">${obj.date} | ${obj.time}</span>
      </div>

      <div class="text-right font-bold ${iconColor} text-xs">
        ${obj.type === 'expense' ? '-' : '+'} ${obj.amount} MDL
      </div>
      <button onclick="deleteTransaction(${obj.id})" class="ml-4 text-gray-400 hover:text-red-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6" id="iconDelete">
  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
</svg>
    </button>

    `;

    transactionsList.prepend(transactionDiv);
  }
}
//stergere transactii
window.deleteTransaction = function(id){
  const idDeSters = Number(id);

  transactions = transactions.filter(t => t.id !== idDeSters);

  localStorage.setItem('transactions', JSON.stringify(transactions) );
  updateExpense();
  renderList();

}

//plus buton

plusBt.addEventListener('click', () => {
 
 plusPanel.classList.toggle('hidden');
 overlay.classList.toggle('hidden');
 
})

addCategoryBt.addEventListener('click', () => {
  const name = inputAddCategory.value.trim();
  const dropdownType = document.getElementById('selectType');
  const selectedType = dropdownType.value;

  if(!name){
    return alert('Didnt select a name for category');
  }
  const newCategory ={
    id: Date.now(),
    type: selectedType,
    name: name,
    subcategories: []
  };

  categories.push(newCategory);
  inputAddCategory.value='';
  console.log(categories);
  localStorage.setItem('categories', JSON.stringify(categories));
})

const cancelBt = document.getElementById('cancelBt');

cancelBt.addEventListener('click', () => {
  addFinanceCategory.classList.toggle('hidden');

})

categoryAdd.addEventListener('click', () => {
  addFinanceCategory.classList.toggle('hidden');
})
const categoryModal = document.getElementById('categoryModal');
const categoryGrid = document.getElementById('categoryGrid');
const closeModal = document.getElementById('closeModal');
let selectedCategoryName = ""; // Variabila care va ține minte alegerea

// 1. Deschide modalul când apeși pe butonul "Select category"
inputCategory.addEventListener('click', (e) => {
  e.preventDefault();
  
  if (!selectType) {
    alert("Te rugăm să selectezi mai întâi Income sau Expense!");
    return;
  }

  // Curățăm grid-ul înainte să-l umplem
  categoryGrid.innerHTML = "";
  categoryModal.classList.remove('hidden');

  // 2. Filtrăm categoriile în funcție de tipul tranzacției
  const filteredCategories = categories.filter(cat => cat.type === selectType);

  // 3. Generăm butoane pentru fiecare categorie
  filteredCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = "p-2 bg-blue-100 rounded-lg hover:bg-blue-500 hover:text-white transition-all";
    btn.innerText = cat.name;
    
    // Când dai click pe o categorie din listă:
    btn.onclick = () => {
      selectedCategoryName = cat.name; // Salvăm numele
      inputCategory.querySelector('span').innerText = cat.name; // Îl scriem pe butonul principal
      categoryModal.classList.add('hidden'); // Închidem modalul
    };
    
    categoryGrid.appendChild(btn);
  });
});

// Închide modalul la butonul Cancel
closeModal.onclick = () => categoryModal.classList.add('hidden');


