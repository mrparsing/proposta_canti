document.getElementById("global_search").addEventListener("keyup", searchCanti);

async function searchCanti(event, page) {
    if (event.key === "Enter") {
        const input = document.getElementById("global_search").value.toLowerCase();

        // Salva l'input nella memoria locale
        localStorage.setItem("searchInput", input);


        if (input.includes("salmo")) {
            let jsonFile = ""
            let linkRisultati = ""
            if (page === "index" | page === "celebrazioni") {
                jsonFile = "db/salmi/elenco_salmi.json";
                linkRisultati = "nav-bar/risultati.html"
            } else if (page === "anno") {
                jsonFile = "../../db/salmi/elenco_salmi.json";
                linkRisultati = "../risultati.html"
            } else {
                jsonFile = "../db/salmi/elenco_salmi.json";
                linkRisultati = "risultati.html"
            }

            try {
                const response = await fetch(jsonFile);
                const data = await response.json();
                const salmi = data.salmi;

                const words = input.split(" ");
                const filters = { number: null, romanNumber: null, year: null, season: null };

                // Analizza l'input per numero arabo, numero romano, anno e tempo liturgico
                words.forEach(word => {
                    if (/^\d+$/.test(word)) {
                        filters.number = word; // Numero arabo
                    } else if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx|xxi|xxii|xxiii|xxiv|xxv|xxvi|xxvii|xxviii|xxix|xxx|xxxi|xxxii|xxxiii)$/i.test(word)) {
                        filters.romanNumber = word.toLowerCase(); // Numero romano
                    } else if (["a", "b", "c"].includes(word)) {
                        filters.year = word.toUpperCase(); // Anno
                    } else if (["ordinario", "quaresima", "pasqua", "avvento"].includes(word)) {
                        filters.season = word; // Tempo liturgico
                    }
                });

                // Filtra i salmi in base ai criteri
                const results = salmi.filter(salmo => {
                    const matchesTitle = salmo.titolo.toLowerCase().includes("salmo");
                    const matchesNumber = filters.number ? salmo.numero_arabo === filters.number : true;
                    const matchesRomanNumber = filters.romanNumber ? salmo.numero_romano === filters.romanNumber : true;
                    const matchesYear = filters.year ? salmo.anno === filters.year : true;
                    const matchesSeason = filters.season ? salmo.titolo.toLowerCase().includes(filters.season) : true;

                    return matchesTitle && matchesNumber && matchesRomanNumber && matchesYear && matchesSeason;
                });

                // Salva i risultati in localStorage
                localStorage.setItem("searchResults", JSON.stringify(results));

                // Reindirizza alla pagina dei risultati
                window.location.href = linkRisultati;
            } catch (error) {
                console.error("Errore nel caricamento del file JSON:", error);
            }
        }

        const jsonPaths = {
            "ordinario": "db/tempi_liturgici/tempo_ordinario/*.json",
            "avvento": "db/tempi_liturgici/avvento/*.json",
            "quaresima": "db/tempi_liturgici/quaresima/*.json"
        };

        let jsonFile = "";
        let linkRisultati = "";

        if ((input.includes("messa") || input.includes("celebrazione")) && !input.includes("salmo")) {
            for (const [key, value] of Object.entries(jsonPaths)) {
                if (input.includes(key)) {
                    jsonFile = (page === "index" || page === "celebrazioni") ? value
                        : (page === "anno") ? "../../" + value
                            : "../" + value;

                    // Imposta il link dei risultati
                    linkRisultati = (page === "index" || page === "celebrazioni") ? "nav-bar/risultati.html"
                        : (page === "anno") ? "../risultati.html"
                            : "risultati.html";
                    break;
                }
            }
            console.log(jsonFile);
        }
    }
}