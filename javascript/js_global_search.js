document.getElementById("global_search").addEventListener("keyup", searchCanti);

async function searchCanti(event, page) {
    if (event.key === "Enter") {
        const input = document.getElementById("global_search").value.toLowerCase();

        // Salva l'input nella memoria locale
        localStorage.setItem("searchInput", input);

        // Gestione della ricerca dei Salmi
        if (input.includes("salmo")) {
            let jsonFile = "";
            let linkRisultati = "";

            if (page === "index" || page === "celebrazioni") {
                jsonFile = "db/salmi/elenco_salmi.json";
                linkRisultati = "nav-bar/risultati.html";
            } else if (page === "anno") {
                jsonFile = "../../db/salmi/elenco_salmi.json";
                linkRisultati = "../risultati.html";
            } else {
                jsonFile = "../db/salmi/elenco_salmi.json";
                linkRisultati = "risultati.html";
            }

            try {
                const response = await fetch(jsonFile);
                const data = await response.json();
                const salmi = data.salmi;

                // Filtri di ricerca
                const words = input.split(" ");
                const filters = { number: null, romanNumber: null, year: null, season: null };

                words.forEach(word => {
                    if (/^\d+$/.test(word)) {
                        filters.number = word;
                    } else if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|x|xi|xii|xiii|xiv|xv|xvi|xvii|xviii|xix|xx|xxi|xxii|xxiii|xxiv|xxv|xxvi|xxvii|xxviii|xxix|xxx|xxxi|xxxii|xxxiii)$/i.test(word)) {
                        filters.romanNumber = word.toLowerCase();
                    } else if (["a", "b", "c"].includes(word)) {
                        filters.year = word.toUpperCase();
                    } else if (["ordinario", "quaresima", "pasqua", "avvento"].includes(word)) {
                        filters.season = word;
                    }
                });

                const results = salmi.filter(salmo => {
                    return (
                        salmo.titolo.toLowerCase().includes("salmo") &&
                        (!filters.number || salmo.numero_arabo === filters.number) &&
                        (!filters.romanNumber || salmo.numero_romano === filters.romanNumber) &&
                        (!filters.year || salmo.anno === filters.year) &&
                        (!filters.season || salmo.titolo.toLowerCase().includes(filters.season))
                    );
                });

                localStorage.setItem("searchResults", JSON.stringify(results));
                localStorage.setItem("tipologia", "salmo");

                window.location.href = linkRisultati;
            } catch (error) {
                console.error("Errore nel caricamento del file JSON:", error);
            }
        } else if (input.includes("messa") || input.includes("celebrazione") || input.includes("domenica")) {
            const jsonPaths = {
                "ordinario": "db/tempi_liturgici/tempo_ordinario/*.json",
                "avvento": "db/tempi_liturgici/avvento/*.json",
                "quaresima": "db/tempi_liturgici/quaresima/*.json"
            };

            let paths = [];
            let year = input.match(/\b([abc])\b/);

            for (const [key, path] of Object.entries(jsonPaths)) {
                if (input.includes(key)) {
                    paths.push((page === "index" || page === "celebrazioni") ? path
                        : (page === "anno") ? "../../" + path
                            : "../" + path);
                }
            }

            if (paths.length && year) {
                paths = paths.map(path => path.replace('*.json', `celebrazioni_anno_${year[1].toLowerCase()}.json`));
            } else if (year) {
                paths.push(`db/tempi_liturgici/celebrazioni_anno_${year[1].toLowerCase()}.json`);
            }

            linkRisultati = (page === "index" || page === "celebrazioni") ? "nav-bar/risultati.html"
                : (page === "anno") ? "../risultati.html"
                    : "risultati.html";

            if (paths.length) {
                try {
                    const dataArray = await Promise.all(paths.map(path => fetch(path).then(response => response.json())));

                    const results = [];
                    const numeroDomenica = parseInt(input.match(/\b(\d+)\b/)) || convertRomanToInt(input.match(/\b([ivxlc]+)\b/gi)[0]);

                    dataArray.forEach(data => {
                        data.celebrazioni.forEach(item => {
                            if (item.numero === numeroDomenica && item.anno.toLowerCase() === year[1].toLowerCase()) {
                                results.push(item);
                            }
                        });
                    });

                    if (results.length > 0) {
                        localStorage.setItem("searchResults", JSON.stringify(results));
                        localStorage.setItem("tipologia", "messa");
                        window.location.href = linkRisultati;
                    } else {
                        console.log("Nessun risultato trovato.");
                    }
                } catch (error) {
                    console.error('Errore nel caricamento dei dati JSON:', error);
                }
            } else {
                console.log("Nessun file JSON specificato per la ricerca.");
            }
        }
    }

    function convertRomanToInt(roman) {
        const romanNumerals = { 'i': 1, 'v': 5, 'x': 10 };
        let total = 0;
        let prevValue = 0;

        for (let char of roman) {
            const currentValue = romanNumerals[char.toLowerCase()];
            total += currentValue > prevValue ? currentValue - 2 * prevValue : currentValue;
            prevValue = currentValue;
        }

        return total;
    }
}