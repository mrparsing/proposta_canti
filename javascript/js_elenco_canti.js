function filter_search_bar_2() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const authorValue = document.getElementById('authorInput').value.toLowerCase();
    const typeValue = document.getElementById('typeSelect').value;
    const tempoValue = document.getElementById('tempoSelect').value;

    const list = document.getElementById('list');
    const items = list.getElementsByTagName('li');

    // Nascondi tutte le lettere prima di filtrare
    const headers = document.getElementsByClassName('letter-header');
    for (let j = 0; j < headers.length; j++) {
        headers[j].style.display = 'none';
    }

    // Filtra e mostra i canti corrispondenti
    for (let i = 0; i < items.length; i++) {
        const canto = items[i];
        const cantoText = canto.querySelector('span').textContent.toLowerCase();
        const cantoAuthors = canto.getAttribute('data-author') ? canto.getAttribute('data-author').toLowerCase() : '';
        const cantoType = canto.getAttribute('data-type') || '';
        const cantoTempo = canto.getAttribute('data-tempo') || '';

        const matchSearch = cantoText.includes(searchValue);

        // Allow partial matching for authors
        const matchAuthor = !authorValue || cantoAuthors.split(',').some(author => author.trim().includes(authorValue));
        
        // Check if the selected type matches any of the types in the cantoType
        const matchType = !typeValue || cantoType.split(',').map(type => type.trim()).includes(typeValue);
        const matchTempo = !tempoValue || cantoTempo === tempoValue;

        if (matchSearch && matchAuthor && matchType && matchTempo) {
            canto.style.display = ''; // Mostra l'elemento

            // Mostra anche la lettera corrispondente (intestazione)
            const letter = canto.getAttribute('data-letter');
            const header = document.querySelector(`.letter-header[data-letter="${letter}"]`);
            if (header) {
                header.style.display = '';
            }
        } else {
            canto.style.display = 'none'; // Nascondi l'elemento
        }
    }
}
