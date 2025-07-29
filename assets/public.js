const DATA_URL = 'data/dylan.json';

const state = { all: [] };

async function load() {
  const res = await fetch(DATA_URL + '?t=' + Date.now());
  state.all = await res.json();
  applyFilters();
}

function applyFilters() {
  const term = document.getElementById('search').value.toLowerCase();
  const ed   = document.getElementById('editionFilter').value;
  const cond = document.getElementById('conditionFilter').value;
  const own  = document.getElementById('ownedFilter').value;

  const filtered = state.all.filter(c => {
    const matchTerm = !term || c.title.toLowerCase().includes(term) || String(c.number).includes(term);
    const matchEd   = !ed   || c.edition === ed;
    const matchCond = !cond || c.condition === cond;
    const matchOwn  = !own  || String(c.owned) === own;
    return matchTerm && matchEd && matchCond && matchOwn;
  });

  render(filtered);
}

function render(items) {
  document.getElementById('count').textContent = `Totale: ${items.length}`;
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  items.forEach(c => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${c.image || 'assets/placeholder.jpg'}" alt="Cover #${c.number}">
      <h3>#${c.number} – ${c.title}</h3>
      <p><strong>Edizione:</strong> ${c.edition}<br>
         <strong>Condizione:</strong> ${c.condition}${c.notes ? `<br><strong>Note:</strong> ${c.notes}` : ''}</p>`;
    cards.appendChild(div);
  });
}

['search','editionFilter','conditionFilter','ownedFilter'].forEach(id => {
  document.getElementById(id).addEventListener('input', applyFilters);
});

document.getElementById('year').textContent = new Date().getFullYear();

load();
