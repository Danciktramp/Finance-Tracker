
flatpickr("#calendarContainer", {
    inline: true, // Aceasta este setarea magică!
    "locale": "ro",
    dateFormat: "j F Y",
    onChange: function(selectedDates, dateStr){
        console.log('User selected this date:', dateStr);
        renderFilteredTransactions(dateStr);
    }
});

function renderFilteredTransactions(dateStr){
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    console.log("Toate tranzacțiile din memorie:", transactions);
    const filtered = transactions.filter(t => {const dataSalvata = t.date.toLowerCase().trim();
    const dataCalendar = dateStr.toLowerCase().trim();
    
    return dataSalvata === dataCalendar;});
    console.log("Tranzacții găsite pentru data " + dateStr + ":", filtered);
    const noResult = document.getElementById('noResultText'); // Îl definim aici ca să îl avem în ambele cazuri

    if(filtered.length === 0){ // <--- Am corectat "length"
        noResult.innerHTML = "Didn't find any transaction on this date";
        document.getElementById('transactionsArea').innerHTML = "";
        return;
    } else {
        noResult.innerHTML = ""; // <--- Curățăm mesajul dacă găsim date
    }
    const transactionsArea = document.getElementById('transactionsArea');
    transactionsArea.innerHTML = "";
    filtered.forEach(t => {
       const div = document.createElement('div');
       div.innerHTML = `You are at category ${t.category}`;
       div.className = "flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm gap-4 mx-3";

    // Alegem iconița și culoarea în funcție de tip
    const iconColor = t.type === 'expense' ? 'text-red-500' : 'text-green-500';
    const svgPath = t.type === 'expense' 
      ? "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z"
      : "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm.53 7.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v5.69a.75.75 0 0 0 1.5 0v-5.69l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z";

    // Structura nouă care aliniază totul
    div.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 ${iconColor}">
        <path fill-rule="evenodd" d="${svgPath}" clip-rule="evenodd" />
      </svg>

      <div class="flex flex-col flex-grow">
        <span class="font-bold text-gray-800 text-lg leading-tight">${t.category}</span>
        <span class="text-xs text-gray-400">${t.date} | ${t.time}</span>
      </div>

      <div class="text-right font-bold ${iconColor} text-xs">
        ${t.type === 'expense' ? '-' : '+'} ${t.amount} MDL
      </div>
      

    `;

    transactionsArea.prepend(div);
    })
}