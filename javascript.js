function calcolaPasqua(anno) {
    const a = anno % 19;
    const b = Math.floor(anno / 100);
    const c = anno % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mese = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = aprile
    const giorno = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(anno, mese - 1, giorno); // Mese è 0-indexed in JS
}

function tipologia_anno(anno) {
    if (anno % 3 === 2) {
        return "b";
    } else {
        return "b";
    }
}

function calcolaDomenicheAvvento(anno) {
    const natale = new Date(anno, 11, 25); // 25 dicembre
    const quartaDomenicaAvvento = new Date(natale);
    quartaDomenicaAvvento.setDate(natale.getDate() - (natale.getDay() + 1)); // Domenica precedente Natale

    const terzaDomenicaAvvento = new Date(quartaDomenicaAvvento);
    terzaDomenicaAvvento.setDate(quartaDomenicaAvvento.getDate() - 7);
    const secondaDomenicaAvvento = new Date(quartaDomenicaAvvento);
    secondaDomenicaAvvento.setDate(quartaDomenicaAvvento.getDate() - 14);
    const primaDomenicaAvvento = new Date(quartaDomenicaAvvento);
    primaDomenicaAvvento.setDate(quartaDomenicaAvvento.getDate() - 21);

    return [
        primaDomenicaAvvento,
        secondaDomenicaAvvento,
        terzaDomenicaAvvento,
        quartaDomenicaAvvento
    ];
}

function calcolaQuaresima(anno) {
    const pasqua = calcolaPasqua(anno);
    const mercolediCeneri = new Date(pasqua);
    mercolediCeneri.setDate(pasqua.getDate() - 46); // 46 giorni prima della Pasqua

    const inizioQuaresima = mercolediCeneri;
    const fineQuaresima = new Date(pasqua);
    fineQuaresima.setDate(pasqua.getDate() - 7); // Domenica delle Palme

    return { inizioQuaresima, fineQuaresima };
}

function prossima_domenica(data) {
    const giorniFinoADomenica = 7 - data.getDay();
    const prossimaDomenica = new Date(data);
    prossimaDomenica.setDate(data.getDate() + giorniFinoADomenica);
    return prossimaDomenica;
}

function isBisestile(anno) {
    return (anno % 4 === 0 && anno % 100 !== 0) || (anno % 400 === 0);
}

function calcolaTempoOrdinario(anno) {
    const pasqua = calcolaPasqua(anno);
    const mercolediCeneri = new Date(pasqua);
    mercolediCeneri.setDate(pasqua.getDate() - 46); // 46 giorni prima della Pasqua

    const epifania = new Date(anno, 0, 6); // 6 gennaio
    let battesimoDelSignore;
    if (epifania.getDay() === 0) { // Se l'Epifania è di domenica
        battesimoDelSignore = new Date(epifania);
        battesimoDelSignore.setDate(epifania.getDate() + 1); // Il lunedì successivo
    } else {
        battesimoDelSignore = prossima_domenica(epifania); // Domenica successiva
    }

    const pentecoste = new Date(pasqua);
    pentecoste.setDate(pasqua.getDate() + 49); // 50 giorni dopo la Pasqua

    const cristoRe = prossima_domenica(new Date(anno, 10, 20)); // Circa fine novembre

    // Prima parte del Tempo Ordinario
    const inizioTempoOrdinario1 = new Date(battesimoDelSignore);
    inizioTempoOrdinario1.setDate(battesimoDelSignore.getDate() + 1);
    const fineTempoOrdinario1 = new Date(mercolediCeneri);
    fineTempoOrdinario1.setDate(mercolediCeneri.getDate() - 1);

    // Seconda parte del Tempo Ordinario
    const inizioTempoOrdinario2 = new Date(pentecoste);
    inizioTempoOrdinario2.setDate(pentecoste.getDate() + 1);
    const fineTempoOrdinario2 = cristoRe;

    return {
        primaParte: { inizio: inizioTempoOrdinario1, fine: fineTempoOrdinario1 },
        secondaParte: { inizio: inizioTempoOrdinario2, fine: fineTempoOrdinario2 }
    };
}

function calcolaDomenicheTempoOrdinario(anno) {
    const tempoOrdinario = calcolaTempoOrdinario(anno);
    const domeniche = [];
    let inizio = tempoOrdinario.primaParte.inizio;

    // Aggiungi tutte le domeniche della prima parte del Tempo Ordinario
    while (inizio <= tempoOrdinario.primaParte.fine) {
        domeniche.push(new Date(inizio)); // Aggiungi una copia della data
        inizio.setDate(inizio.getDate() + 7);
    }

    inizio = tempoOrdinario.secondaParte.inizio;

    // Aggiungi tutte le domeniche della seconda parte del Tempo Ordinario
    while (inizio <= tempoOrdinario.secondaParte.fine) {
        domeniche.push(new Date(inizio)); // Aggiungi una copia della data
        inizio.setDate(inizio.getDate() + 7);
    }

    // Aggiusta le date delle domeniche se è un anno bisestile
    if (isBisestile(anno)) {
        for (let i = 0; i < domeniche.length; i++) {
            const dataDomenica = domeniche[i];
            if (dataDomenica.getMonth() > 1) { // Se è dopo febbraio
                dataDomenica.setDate(dataDomenica.getDate() - 1); // Sottrai un giorno
            }
        }
    }

    return domeniche;
}

function calcolaDomenicaCorrente() {
    const oggi = new Date();
    const giorniFinoADomenica = (7 - oggi.getDay()) % 7; // Giorni fino alla prossima domenica
    const domenicaCorrente = new Date(oggi);
    domenicaCorrente.setDate(oggi.getDate() + giorniFinoADomenica); // Aggiungi giorni fino alla domenica
    return domenicaCorrente;
}

function calcolaDomenicheQuaresima(anno) {
    const quaresima = calcolaQuaresima(anno);
    const primaDomenicaQuaresima = prossima_domenica(quaresima.inizioQuaresima);

    // Array per memorizzare le cinque domeniche di Quaresima
    const domenicheQuaresima = [primaDomenicaQuaresima];

    // Calcola le altre domeniche di Quaresima
    for (let i = 1; i < 5; i++) {
        const domenica = new Date(primaDomenicaQuaresima);
        domenica.setDate(primaDomenicaQuaresima.getDate() + (i * 7)); // Aggiunge 7 giorni per ogni domenica
        domenicheQuaresima.push(domenica);
    }

    return domenicheQuaresima;
}


function calcolaFestivita(anno) {
    const pasqua = calcolaPasqua(anno);
    const domenicheAvvento = calcolaDomenicheAvvento(anno);
    const quaresima = calcolaQuaresima(anno);
    const tempoOrdinario = calcolaTempoOrdinario(anno);
    const domenicheTempoOrdinario = calcolaDomenicheTempoOrdinario(anno);
    const domenicheQuaresima = calcolaDomenicheQuaresima(anno)
    tipologia_anno(anno)
    
    const festivita = [];

    domenicheQuaresima.forEach((domenica, index) => {
        festivita.push({ anno: tipologia_anno(anno), tipologia: "quaresima", numero: `${index + 1}`, data: domenica });
    });
    // Aggiungi Pasqua
    festivita.push({ anno: tipologia_anno(anno), tipologia: "pasqua", numero: 'Pasqua', data: pasqua });

    // Aggiungi Avvento
    domenicheAvvento.forEach((domenica, index) => {
        festivita.push({ anno: tipologia_anno(anno), tipologia: "avvento", numero: `${index + 1}`, data: domenica });
    });

    // Aggiungi inizio e fine Quaresima
    festivita.push({ anno: tipologia_anno(anno), tipologia: "quaresima", numero: 'Mercoledì delle Ceneri', data: quaresima.inizioQuaresima });
    festivita.push({ anno: tipologia_anno(anno), tipologia: "quaresima", numero: 'Domenica delle Palme', data: quaresima.fineQuaresima });

    // Aggiungi domeniche del Tempo Ordinario
    domenicheTempoOrdinario.forEach((domenica, index) => {
        festivita.push({ anno: tipologia_anno(anno), tipologia: "ordinario", numero: `${index + 1}`, data: domenica });
    });
    festivita.sort((a, b) => a.data - b.data);

    return festivita;
}
/*
function visualizzaRisultati(anno, festivita, domenicaSuccessiva) {
    let output = `<h2>Risultati per l'anno ${anno}</h2>`;
    output += `<div class="result"><strong>Festività e Domeniche:</strong></div>`;
    output += `<ul>`;
    festivita.forEach(f => {
        output += `<li>${f.numero}: ${f.data.toLocaleDateString('it-IT')}</li>`;
    });
    output += `</ul>`;

    if (domenicaSuccessiva) {
        output += `<div class="result"><strong>Domenica Successiva:</strong> ${domenicaSuccessiva.toLocaleDateString('it-IT')}</div>`;
    } else {
        output += `<div class="result"><strong>Domenica Successiva:</strong> Non trovata</div>`;
    }

    document.getElementById('output').innerHTML = output;
}

function calcolaDomenicaSuccessiva(festivita) {
    const oggi = new Date();
    const prossimaDomenica = prossima_domenica(oggi);

    // Controlla se la prossima domenica è presente nella lista delle festività
    for (const festivitaItem of festivita) {
        if (
            festivitaItem.data.getFullYear() === prossimaDomenica.getFullYear() &&
            festivitaItem.data.getMonth() === prossimaDomenica.getMonth() &&
            festivitaItem.data.getDate() === prossimaDomenica.getDate()
        ) {
            return prossimaDomenica; // Restituisce la domenica successiva se presente
        }
    }

    return null;
}

let indiceDomenicaCorrente; // Variabile globale
*/
document.addEventListener('DOMContentLoaded', function () {
    const button = document.querySelector('.button'); // Select the button

    button.addEventListener('click', function () {
        const oggi = new Date();
        const festivita = calcolaFestivita(oggi.getFullYear());
        let festa;
        let url = "";

        // Find the next future holiday
        for (const festivitaItem of festivita) {
            if (festivitaItem.data >= oggi) {
                festa = festivitaItem; // Get the next future holiday
                break;
            }
        }
        console.log(festivita);
        // Determine the URL based on the type of holiday
        if (festa) {
            if (festa.tipologia === "ordinario") {
                const numero = festa.numero;
                const anno = festa.anno;
                url = "tempo_ordinario/anno_" + anno + "/" + numero + ".html";
            } else if(festa.tipologia === "avvento") {
                const numero = festa.numero;
                const anno = festa.anno;
                url = "tempo_avvento/anno_" + anno + "/" + numero + ".html";
            } else if(festa.tipologia === "quaresima") {
                const numero = festa.numero;
                const anno = festa.anno;
                url = "tempo_quaresima/anno_" + anno + "/" + numero + ".html";
            }
        console.log(url);
        // Redirect to the URL
        window.location.href = url; // Redirect to the appropriate page

        } else {
            console.log("Nessuna festività futura trovata.");
            alert("Nessuna festività futura trovata."); // Optional: alert if no future holiday found
        }
    });
});