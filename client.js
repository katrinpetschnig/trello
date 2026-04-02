window.TrelloPowerUp.initialize({
  'card-badges': async function (t, options) {
    try {
      const card = await t.card('id', 'checklists');

      let total = 0;

      for (const checklist of card.checklists) {
        const items = await fetchCheckItems(checklist.id);

        items.forEach(item => {
          const value = extractNumber(item.name);
          if (value !== null) total += value;
        });
      }

      if (total <= 0) return [];

      return [{
        text: formatCurrency(total),
        color: 'green'
      }];

    } catch (e) {
      console.error(e);
      return [];
    }
  }
});

async function fetchCheckItems(checklistId) {
  const key = 'c41f170272652b42c8af1a9670473cd5';
  const token = '6ff2295627856e2ed47fd2309aa985335a5b36014ec4490031d8122a1fbcb4a2';

  const url = 'https://api.trello.com/1/checklists/' + checklistId + '/checkItems?key=' + key + '&token=' + token;

  const response = await fetch(url);
  return await response.json();
}

function formatCurrency(value) {
  return value.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' €';
}

function calculateSum(checklists) {
  let total = 0;

  checklists.forEach(checklist => {
    checklist.checkItems.forEach(item => {
      const value = extractNumber(item.name);
      if (value !== null) {
        total += value;
      }
    });
  });

  return total;
}

// 🔍 Zahl am Anfang erkennen
function extractNumber(text) {
  // erkennt: 120 €, 45,50 €, 300€
  const match = text.match(/^(\d+[.,]?\d*)/);

  if (!match) return null;

  let number = match[1];

  // Komma → Punkt
  number = number.replace(',', '.');

  return parseFloat(number);
}