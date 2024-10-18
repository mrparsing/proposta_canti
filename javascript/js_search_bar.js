function mostraLettere(visibleLetters) {
    const cantiList = document.getElementById('cantiList');
    const letterHeaders = cantiList.getElementsByClassName('letter-header');

    // Mostra tutte le intestazioni delle lettere, se visibili
    for (let j = 0; j < letterHeaders.length; j++) {
        const headerLetter = letterHeaders[j].textContent;
        letterHeaders[j].style.display = visibleLetters ? (visibleLetters.has(headerLetter) ? '' : 'none') : ''; // Mostra tutte se non ci sono filtri
    }
}

function sortAndGroupCanti() {
    const cantiList = document.getElementById('cantiList');
    const cantiItems = Array.from(cantiList.getElementsByTagName('li'));

    // Ordina gli elementi della lista
    cantiItems.sort((a, b) => a.textContent.localeCompare(b.textContent));

    // Crea un oggetto per raggruppare i canti per lettera
    const groupedCanti = {};
    cantiItems.forEach(item => {
        const letter = item.textContent.trim().charAt(0).toUpperCase();
        if (!groupedCanti[letter]) {
            groupedCanti[letter] = [];
        }
        groupedCanti[letter].push(item);
    });

    // Rimuovi tutti gli elementi della lista e ricostruisci la lista con le lettere in evidenza
    cantiList.innerHTML = '';
    for (const letter in groupedCanti) {
        // Aggiungi l'intestazione per la lettera
        const letterHeader = document.createElement('p');
        letterHeader.textContent = letter;
        letterHeader.classList.add('letter-header'); // Aggiunta della classe
        cantiList.appendChild(letterHeader);

        // Aggiungi i canti per questa lettera
        groupedCanti[letter].forEach(item => cantiList.appendChild(item));
    }
}

function toggleDetails(event) {
    // Evita la propagazione del clic se il link è stato cliccato
    if (event.target.tagName === "A") {
        event.stopPropagation();
        return; // Esci dalla funzione per non eseguire il toggle
    }

    // Toggle del box dei dettagli
    const details = event.currentTarget.querySelector('.canto-details');
    if (details) {
        details.style.display = details.style.display === 'none' || details.style.display === '' ? 'block' : 'none';
    }
}

function filter_search_bar() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cantiList = document.getElementById('cantiList');
    const cantiItems = cantiList.getElementsByTagName('li');
    const visibleLetters = new Set(); // Set per tenere traccia delle lettere visibili

    // Nascondi gli elementi che non corrispondono al filtro
    for (let i = 0; i < cantiItems.length; i++) {
        const canto = cantiItems[i].textContent.toLowerCase();
        const letter = canto.charAt(0).toUpperCase();
        if (canto.includes(input) && !cantiItems[i].classList.contains('letter-header')) {
            cantiItems[i].style.display = '';
            visibleLetters.add(letter); // Aggiungi la lettera al set delle lettere visibili
        } else {
            cantiItems[i].style.display = 'none';
        }
    }

    // Mostra/nascondi le intestazioni delle lettere
    if (input === '') {
        mostraLettere(); // Se l'input è vuoto, mostra tutte le intestazioni
    } else {
        mostraLettere(visibleLetters); // Altrimenti, mostra solo quelle visibili
    }
}

function toggleMenu() {
    const navbar = document.getElementById('myNavbar');
    navbar.classList.toggle('active');
}
