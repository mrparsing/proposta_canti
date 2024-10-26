async function searchCanti(event) {
    event.preventDefault(); // Evita il comportamento predefinito del submit

    const input = document.getElementById("global_search").value.toLowerCase();

    // Verifica se l'input contiene la parola "salmo"
    if (input.includes("salmo")) {
        const jsonFile = "db/salmi/elenco_salmi.json";

        try {
            const response = await fetch(jsonFile);
            const data = await response.json();
            const salmi = data.salmi;

            // Estrai i filtri dall'input
            const words = input.split(" ");
            const filters = { number: null, year: null };

            words.forEach(word => {
                if (/^\d+$/.test(word)) {
                    filters.number = word;
                } else if (word.includes("anno")) {
                    filters.year = word.split("anno")[1].trim().toUpperCase();
                } else if (["a", "b", "c"].includes(word)) {
                    filters.year = word.toUpperCase();
                }
            });

            // Filtra i salmi in base ai criteri
            const results = salmi.filter(salmo => {
                const matchesTitle = salmo.titolo.toLowerCase().includes(input);
                const matchesNumber = filters.number ? salmo.numero_arabo === filters.number : true;
                const matchesYear = filters.year ? salmo.anno === filters.year : true;

                return matchesTitle && matchesNumber && matchesYear;
            });

            // Salva i risultati in localStorage
            localStorage.setItem("searchResults", JSON.stringify(results));

            // Reindirizza alla pagina dei risultati
            window.location.href = "risultati.html";
        } catch (error) {
            console.error("Errore nel caricamento del file JSON:", error);
        }
    }
}

// Assegna l'evento di submit
document.getElementById("searchForm").addEventListener("submit", searchCanti);