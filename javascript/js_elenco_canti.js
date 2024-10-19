fetch('../db/canti.json')
.then(response => response.json())
.then(data => {
    const cantiList = document.getElementById('cantiList');
    const groupedCanti = groupCantiByLetter(data.canti);  // Raggruppare i canti per lettera

    Object.keys(groupedCanti).forEach(letter => {
        // Creare un elemento <div> per la lettera (intestazione)
        const letterHeader = document.createElement('div');
        letterHeader.textContent = letter;
        letterHeader.className = 'letter-header';  // Stile per le intestazioni delle lettere
        letterHeader.setAttribute('data-letter', letter);  // Attributo personalizzato per la ricerca
        cantiList.appendChild(letterHeader);

        // Creare un <li> per ciascun canto sotto la lettera corrispondente
        groupedCanti[letter].forEach(canto => {
            const li = document.createElement('li');
            li.onclick = toggleDetails;
            li.setAttribute('data-letter', letter);  // Attributo personalizzato per la ricerca

            const span = document.createElement('span');
            span.textContent = canto.titolo;
            li.appendChild(span);

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'canto-details';
            detailsDiv.style.display = 'none';
            detailsDiv.innerHTML = `<strong>Autore:</strong> ${canto.autore} | <strong>Tipologia:</strong> ${canto.tipologia}`;

            const linksDiv = document.createElement('div');
            const ascoltaLink = document.createElement('a');
            ascoltaLink.href = canto.ascolta;
            ascoltaLink.className = 'link-button';
            ascoltaLink.textContent = 'Ascolta';
            linksDiv.appendChild(ascoltaLink);

            const scaricaLink = document.createElement('a');
            scaricaLink.href = canto.scarica;
            scaricaLink.className = 'link-button';
            scaricaLink.textContent = 'Scarica';
            linksDiv.appendChild(scaricaLink);

            detailsDiv.appendChild(linksDiv);
            li.appendChild(detailsDiv);

            cantiList.appendChild(li);
        });
    });
})
.catch(error => console.error('Errore nel caricamento del file JSON:', error));

// Funzione per mostrare/nascondere i dettagli
function toggleDetails(event) {
const details = event.currentTarget.querySelector('.canto-details');
details.style.display = details.style.display === 'none' ? 'block' : 'none';
}

// Funzione per raggruppare i canti per lettera
function groupCantiByLetter(canti) {
const grouped = {};
canti.sort((a, b) => a.titolo.localeCompare(b.titolo));  // Ordina i canti per titolo

canti.forEach(canto => {
    const firstLetter = canto.titolo.charAt(0).toUpperCase();
    if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
    }
    grouped[firstLetter].push(canto);
});

return grouped;
}

// Funzione per filtrare l'elenco in base alla barra di ricerca
function filter_search_bar() {
const input = document.getElementById('searchInput').value.toUpperCase();
const cantiList = document.getElementById('cantiList');
const items = cantiList.getElementsByTagName('li');
const headers = document.getElementsByClassName('letter-header');

let letterFound = {}; // Oggetto per tenere traccia delle lettere con risultati

// Nascondere o mostrare i canti in base alla ricerca
for (let i = 0; i < items.length; i++) {
    const span = items[i].getElementsByTagName('span')[0];
    const txtValue = span.textContent || span.innerText;
    const cantoLetter = items[i].getAttribute('data-letter');

    if (txtValue.toUpperCase().indexOf(input) > -1) {
        items[i].style.display = '';  // Mostra i canti che corrispondono alla ricerca
        letterFound[cantoLetter] = true;  // Segna la lettera come trovata
    } else {
        items[i].style.display = 'none';  // Nascondi i canti che non corrispondono
    }
}

// Mostrare solo le lettere che hanno risultati
for (let j = 0; j < headers.length; j++) {
    const letter = headers[j].getAttribute('data-letter');
    if (letterFound[letter]) {
        headers[j].style.display = '';  // Mostra la lettera se c'è un risultato
    } else {
        headers[j].style.display = 'none';  // Nascondi la lettera se non ci sono risultati
    }
}
}