window.TrelloPowerUp.initialize({
  'card-badges': async function (t, options) {
    try {
      const card = await t.card('id', 'checklists');

      let total = 0;

      for (const checklist of card.checklists) {
        const items = await t.get(checklist:${checklist.id}, 'shared', 'checkItems');

        if (!items) continue;

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

    } catch (err) {
      console.error(err);
      return [];
    }
  }
});

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