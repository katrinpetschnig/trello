
window.TrelloPowerUp.initialize({
  'card-badges': function (t, options) {
    return t.card('checklists.checkItems').then(card => {
      const sum = calculateSum(card.checklists);

      // 👉 nur anzeigen wenn > 0
      if (sum <= 0) return [];

      return [{
        text: formatCurrency(sum),
        color: 'green'
      }];
    });
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