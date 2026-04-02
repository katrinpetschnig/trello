window.TrelloPowerUp.initialize({
  'card-badges': function (t, options) {
    return t.card('checklists').then(card => {
      const sum = calculateSum(card.checklists);
    const display = [{
        text: sum + ' €',
        color: 'green'
      }];

      return sum ? display : [];
    });
  }
});

// 🔢 Summenlogik
function calculateSum(checklists) {
  let total = 0;

  checklists.forEach(checklist => {
    if (checklist.checkItems) {
        checklist.checkItems.forEach(item => {
        const value = extractNumber(item.name);
        if (value !== null) {
            total += value;
        }
        });
    }
  });

  return total.toFixed(2);
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