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

        let arabicNumbers = input.match(/\b(\d+)\b/g); // Trova i numeri arabi nell'input
        let numeriRomani = input.match(/\b([ivxlc]+)\b/gi); // Trova i numeri romani nell'input

        if (input.includes("messa") || input.includes("celebrazione") || input.includes("domenica")) {
            let found = false; // Variabile per controllare se è stato trovato un percorso

            // Variabile per l'anno
            let anno = '';

            // Controlla l'input per trovare il tempo liturgico e l'anno
            for (const [key, value] of Object.entries(jsonPaths)) {
                if (input.includes(key)) {
                    jsonFile = (page === "index" || page === "celebrazioni") ? value
                        : (page === "anno") ? "../../" + value
                            : "../" + value;

                    found = true; // Segna che abbiamo trovato un percorso
                    break;
                }
            }

            // Verifica se l'input contiene l'anno (a, b, c)
            const match = input.match(/\b([abc])\b/); // Trova l'anno
            if (match) {
                anno = match[1].toLowerCase(); // Prendi l'anno trovato e rendilo maiuscolo
            }

            // Costruisci il percorso JSON completo se abbiamo trovato un anno
            if (found && anno) {
                jsonFile = jsonFile.replace('*.json', `celebrazioni_anno_${anno}.json`);
            } else if (!found && anno) {
                // Se non abbiamo trovato alcun percorso e c'è un anno
                jsonFile = `db/tempi_liturgici/celebrazioni_anno_${anno}.json`;
            }

            // Imposta il link dei risultati
            linkRisultati = (page === "index" || page === "celebrazioni") ? "nav-bar/risultati.html"
                : (page === "anno") ? "../risultati.html"
                    : "risultati.html";

            // Verifica il file JSON
            if (jsonFile) {
                fetch(jsonFile)
                    .then(response => response.json())
                    .then(data => {
                        const results = []; // Lista per raccogliere i risultati
                        const numeroDomenica = arabicNumbers ? parseInt(arabicNumbers[0]) : numeriRomani ? convertRomanToInt(numeriRomani[0]) : null;
                        console.log(numeroDomenica, "numero domenica");
                        data.celebrazioni.forEach(item => {
                            console.log(item.numero);
                            // Verifica se il titolo o il numero corrispondono ai criteri di ricerca
                            if (item.numero === numeroDomenica && item.anno.toLowerCase() === anno) {
                                console.log("item", item);
                                results.push(item);
                            }
                        });

                        // Stampa i risultati
                        if (results.length > 0) {
                            console.log("Risultati trovati:", results);
                            localStorage.setItem("searchResults", JSON.stringify(results));

                            // Reindirizza alla pagina dei risultati
                            window.location.href = linkRisultati;
                        } else {
                            console.log("Nessun risultato trovato.");
                        }
                    })
                    .catch(error => console.error('Errore nel fetching dei dati:', error));
            } else {
                console.log("Nessun file JSON specificato per la ricerca.");
            }
        }

        // Funzione per convertire i numeri romani in arabi
        function convertRomanToInt(roman) {
            const romanNumerals = {
                'i': 1,
                'v': 5,
                'x': 10,
            };

            let total = 0;
            let prevValue = 0;

            for (let char of roman) {
                const currentValue = romanNumerals[char.toLowerCase()];
                if (currentValue > prevValue) {
                    total += currentValue - 2 * prevValue; // Sottrai il valore precedente se necessario
                } else {
                    total += currentValue;
                }
                prevValue = currentValue;
            }

            return total;
        }
    }
}