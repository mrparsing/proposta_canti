async function searchCanti() {
    const input = document.getElementById("global_search").value.toLowerCase();
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = ""; // Pulisce i risultati precedenti

    // Verifica se l'input contiene la parola "salmo"
    if (input.includes("salmo")) {
        const jsonFile = "../db/salmi/elenco_salmi.json";

        try {
            const response = await fetch(jsonFile);
            const data = await response.json();
            const salmi = data.salmi; // Assicurati che il tuo JSON abbia una proprietà "salmi"

            // Estrai i filtri dall'input
            const words = input.split(" ");
            const filters = {
                number: null,
                year: null
            };

            // Estrai numero e anno dai filtri
            words.forEach(word => {
                if (/^\d+$/.test(word)) { // Controlla se è un numero
                    filters.number = word; // Salva il numero
                } else if (word.includes("anno")) {
                    filters.year = word.split("anno")[1].trim().toUpperCase(); // Estrai l'anno
                } else if (["a", "b", "c"].includes(word)) { // Aggiungi supporto per anni specifici
                    filters.year = word.toUpperCase(); // Aggiungi gli anni A, B, C
                }
            });

            // Filtra i salmi in base ai criteri
            const results = salmi.filter(salmo => {
                const matchesTitle = salmo.titolo.toLowerCase().includes(input);
                const matchesNumber = filters.number ? salmo.numero_arabo === filters.number : true;
                const matchesYear = filters.year ? salmo.anno === filters.year : true;

                return matchesTitle && matchesNumber && matchesYear;
            });

            // Mostra i risultati
            if (results.length > 0) {
                results.forEach(salmo => {
                    const resultItem = document.createElement("div");
                    resultItem.innerHTML = `
                        <a href="${salmo.download_link}">${salmo.titolo}</a> - Autore: ${salmo.autore}
                    `;
                    searchResults.appendChild(resultItem);
                });
            } else {
                searchResults.innerHTML = "<div>Nessun risultato trovato.</div>";
            }

            // Mostra il menu dei risultati
            searchResults.classList.add("show");
        } catch (error) {
            console.error("Errore nel caricamento del file JSON:", error);
            searchResults.innerHTML = "<div>Errore nel caricamento dei dati.</div>";
        }
    }
}

// Chiude i risultati se si clicca fuori dal menu
document.addEventListener("click", function (event) {
    const searchResults = document.getElementById("searchResults");
    if (!document.getElementById("global_search").contains(event.target)) {
        searchResults.classList.remove("show");
    }
});