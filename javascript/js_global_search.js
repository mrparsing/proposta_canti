document.getElementById("global_search").addEventListener("keyup", searchCanti);

async function searchCanti(event, page) {
    if (event.key === "Enter") {
        const input = document.getElementById("global_search").value.toLowerCase();
        localStorage.setItem("searchInput", input);

        if (input.includes("salmo")) {
            await searchSalmi(input, page);
        } else if (input.includes("messa") || input.includes("celebrazione") || input.includes("domenica")) {
            await searchCelebrazioni(input, page);
        }
    }
}

// Funzione per la ricerca dei salmi
async function searchSalmi(input, page) {
    let jsonFile = "", linkRisultati = "";
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
            const matchesTitle = salmo.titolo.toLowerCase().includes("salmo");
            const matchesNumber = filters.number ? salmo.numero_arabo === filters.number : true;
            const matchesRomanNumber = filters.romanNumber ? salmo.numero_romano === filters.romanNumber : true;
            const matchesYear = filters.year ? salmo.anno === filters.year : true;
            const matchesSeason = filters.season ? salmo.titolo.toLowerCase().includes(filters.season) : true;

            return matchesTitle && matchesNumber && matchesRomanNumber && matchesYear && matchesSeason;
        });

        localStorage.setItem("searchResults", JSON.stringify(results));
        localStorage.setItem("tipologia", "salmo");
        window.location.href = linkRisultati;
    } catch (error) {
        console.error("Errore nel caricamento del file JSON:", error);
    }
}

// Funzione per la ricerca delle celebrazioni
async function searchCelebrazioni(input, page) {
    const jsonPaths = {
        ordinario: [
            "db/tempi_liturgici/tempo_ordinario/celebrazioni_anno_a.json",
            "db/tempi_liturgici/tempo_ordinario/celebrazioni_anno_b.json",
            "db/tempi_liturgici/tempo_ordinario/celebrazioni_anno_c.json"
        ],
        avvento: [
            "db/tempi_liturgici/avvento/celebrazioni_anno_a.json",
            "db/tempi_liturgici/avvento/celebrazioni_anno_b.json",
            "db/tempi_liturgici/avvento/celebrazioni_anno_c.json"
        ],
        quaresima: [
            "db/tempi_liturgici/quaresima/celebrazioni_anno_a.json",
            "db/tempi_liturgici/quaresima/celebrazioni_anno_b.json",
            "db/tempi_liturgici/quaresima/celebrazioni_anno_c.json"
        ]
    };

    let arabicNumbers = input.match(/\b(\d+)\b/g);
    let numeriRomani = input.match(/\b([ivxlc]+)\b/gi);
    let anno = (input.match(/\b([abc])\b/) || [])[1]?.toLowerCase();
    let tempoLiturgico = Object.keys(jsonPaths).find(key => input.includes(key));
    let numeroDomenica = arabicNumbers ? parseInt(arabicNumbers[0]) : numeriRomani ? convertRomanToInt(numeriRomani[0]) : null;

    if (tempoLiturgico && anno) {
        const filePaths = jsonPaths[tempoLiturgico];
        const results = [];

        for (const filePath of filePaths) {
            try {
                const response = await fetch(filePath);
                const data = await response.json();

                data.celebrazioni.forEach(item => {
                    if (item.numero === numeroDomenica && item.anno.toLowerCase() === anno) {
                        results.push(item);
                    }
                });
            } catch (error) {
                console.error(`Errore nel fetching del file ${filePath}:`, error);
            }
        }

        if (results.length > 0) {
            localStorage.setItem("searchResults", JSON.stringify(results));
            localStorage.setItem("tipologia", "messa");
            const linkRisultati = page === "index" || page === "celebrazioni" ? "nav-bar/risultati.html"
                                : page === "anno" ? "../risultati.html" : "risultati.html";
            window.location.href = linkRisultati;
        } else {
            console.log("Nessun risultato trovato.");
        }
    }
}

// Funzione per convertire i numeri romani in arabi
function convertRomanToInt(roman) {
    const romanNumerals = { 'i': 1, 'v': 5, 'x': 10 };
    let total = 0, prevValue = 0;
    for (let char of roman.toLowerCase()) {
        const currentValue = romanNumerals[char];
        total += currentValue > prevValue ? currentValue - 2 * prevValue : currentValue;
        prevValue = currentValue;
    }
    return total;
}