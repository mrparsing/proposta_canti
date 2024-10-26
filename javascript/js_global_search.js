document.getElementById("global_search").addEventListener("keyup", searchCanti);

async function searchCanti(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("global_search").value.toLowerCase();

        if (input.includes("salmo")) {
            const jsonFile = "db/salmi/elenco_salmi.json";

            try {
                const response = await fetch(jsonFile);
                const data = await response.json();
                const salmi = data.salmi;

                const words = input.split(" ");
                const filters = { number: null, year: null, romanNumber: null, season: null };

                // Analizza le parole per numero arabo, numero romano, anno e tempo liturgico
                words.forEach(word => {
                    if (/^\d+$/.test(word)) {
                        filters.number = word; // Numero arabo
                    } else if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x)$/i.test(word)) {
                        filters.romanNumber = word.toLowerCase(); // Numero romano
                    } else if (word.includes("anno") || ["a", "b", "c"].includes(word)) {
                        filters.year = word.replace("anno", "").trim().toUpperCase(); // Anno
                    } else if (["ordinario", "quaresima", "pasqua", "avvento"].includes(word)) {
                        filters.season = word; // Tempo liturgico
                    }
                });

                // Filtra i salmi in base ai criteri
                const results = salmi.filter(salmo => {
                    const matchesTitle = salmo.titolo.toLowerCase().includes(input);
                    const matchesNumber = filters.number ? salmo.numero_arabo === filters.number : true;
                    const matchesRomanNumber = filters.romanNumber ? salmo.numero_romano === filters.romanNumber : true;
                    const matchesYear = filters.year ? salmo.anno === filters.year : true;
                    const matchesSeason = filters.season ? salmo.titolo.toLowerCase().includes(filters.season) : true;

                    return matchesTitle && matchesNumber && matchesRomanNumber && matchesYear && matchesSeason;
                });

                // Salva i risultati in localStorage
                localStorage.setItem("searchResults", JSON.stringify(results));

                // Reindirizza alla pagina dei risultati
                window.location.href = "nav-bar/risultati.html";
            } catch (error) {
                console.error("Errore nel caricamento del file JSON:", error);
            }
        }
    }
}