import Chart from 'chart.js/auto';

// 1. Selecția elementelor din HTML
const monthFilter = document.getElementById('monthFilter');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const categoryListEl = document.getElementById('categoryList');

let myChart = null; // Variabilă globală pentru a păstra instanța graficului

// 2. Funcția de desenare a graficului (Doughnut Chart)
function updateChart(categoryData) {
    const ctx = document.getElementById('categoryChart').getContext('2d');

    // Distrugem graficul vechi dacă există, pentru a evita suprapunerea
    if (myChart) {
        myChart.destroy();
    }

    const labels = Object.keys(categoryData);
    const values = Object.values(categoryData);

    // Culori predefinite pentru categorii
    const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
    ];

    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Suma (MDL)',
                data: values,
                backgroundColor: colors,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// 3. Funcția principală care procesează datele și le afișează
function renderData(dataToDisplay) {
    let totalI = 0;
    let totalE = 0;
    const categoryData = {}; 

    // Calculăm totalurile și grupăm pe categorii
    dataToDisplay.forEach(t => {
        const amount = Number(t.amount);
        if (t.type === 'income') {
            totalI += amount;
        } else if (t.type === 'expense') {
            totalE += amount;
            // Adunăm suma la categoria corespunzătoare
            categoryData[t.category] = (categoryData[t.category] || 0) + amount;
        }
    });

    // Actualizăm valorile în cardurile de sus
    totalIncomeEl.innerText = `${totalI} MDL`;
    totalExpenseEl.innerText = `${totalE} MDL`;

    // Generăm lista de procente sub grafic
    categoryListEl.innerHTML = ""; // Ștergem lista veche

    Object.keys(categoryData).forEach(cat => {
        const suma = categoryData[cat];
        const procent = totalE > 0 ? ((suma / totalE) * 100).toFixed(1) : 0;

        const row = document.createElement('div');
        row.className = "flex justify-between items-center p-3 border-b border-gray-100 hover:bg-gray-50 transition-colors";
        row.innerHTML = `
            <span class="font-medium text-gray-700 capitalize">${cat}</span>
            <div class="text-right">
                <span class="text-gray-900 font-bold">${suma} MDL</span>
                <span class="text-sm text-blue-600 ml-2 font-semibold">${procent}%</span>
            </div>
        `;
        categoryListEl.appendChild(row);
    });

    // Trimitem datele către grafic (doar dacă avem cheltuieli)
    if (Object.keys(categoryData).length > 0) {
        updateChart(categoryData);
    } else if (myChart) {
        myChart.destroy(); // Dacă nu avem date, curățăm graficul
    }
}

// 4. Listener pentru schimbarea perioadei (Luna)
monthFilter.addEventListener('change', () => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const selected = monthFilter.value;

    let filtered;
    if (selected === 'all') {
        filtered = transactions;
    } else {
        // Filtrăm tranzacțiile unde string-ul datei conține numele lunii (ex: "ianuarie")
        filtered = transactions.filter(t => 
            t.date.toLowerCase().includes(selected.toLowerCase())
        );
    }

    renderData(filtered);
});

// 5. Execuția inițială la încărcarea paginii
const initialData = JSON.parse(localStorage.getItem('transactions')) || [];
renderData(initialData);