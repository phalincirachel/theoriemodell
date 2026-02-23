const fs = require('fs');

const coreArtworkLinks = {
  '1skdurer.jpeg': 'https://en.wikipedia.org/wiki/Self-Portrait_(D%C3%BCrer,_Munich)',
  '1sknatiluspokal.jpeg': 'https://de.wikipedia.org/wiki/Nautiluspokal',
  '1skmichelangelo.jpg': 'https://de.wikipedia.org/wiki/Michelangelo',
  '1skfrauenkirche.jpeg': 'https://de.wikipedia.org/wiki/Frauenkirche_(Dresden)',
  '1skmozart.jpg': 'https://www.youtube.com/watch?v=_BnfZLdePCM',
  '2kmschmidtrottluff.jpeg': 'https://de.wikipedia.org/wiki/Karl_Schmidt-Rottluff',
  '2kmboccioni.jpg': 'https://it.wikipedia.org/wiki/Sviluppo_di_una_bottiglia_nello_spazio',
  '2kmrichier.jpeg': 'https://de.wikipedia.org/wiki/Germaine_Richier',
  '2kmlecorbusier.jpeg': 'https://de.wikipedia.org/wiki/Notre-Dame-du-Haut_(Ronchamp)',
  '2kmlachenmann.jpg': 'https://www.youtube.com/watch?v=kQzE42VrbXg',
  '3afontana.jpeg': 'https://de.wikipedia.org/wiki/Lucio_Fontana',
  '3aduchamp.jpeg': 'https://de.wikipedia.org/wiki/Fountain_(Duchamp)',
  '3abeuys.jpeg': 'https://de.wikipedia.org/wiki/Joseph_Beuys',
  '3awotruba.jpeg': 'https://de.wikipedia.org/wiki/Wotrubakirche',
  '3acagejpg.jpg': 'https://www.youtube.com/watch?v=AWVUp12XPpU',
  '4pmliechtenstein.jpeg': 'https://de.wikipedia.org/wiki/Roy_Lichtenstein',
  '4pmwarhol.jpeg': 'https://de.wikipedia.org/wiki/Brillo_Box',
  '4pmkippenberger.jpeg': 'https://de.wikipedia.org/wiki/Martin_Kippenberger',
  '4pmmoore.jpeg': 'https://de.wikipedia.org/wiki/Piazza_d%E2%80%99Italia',
  '4pmschnittke.jpg': 'https://www.youtube.com/watch?v=JOKSfsC4Q64',
  '5rktuymans.jpeg': 'https://de.wikipedia.org/wiki/Luc_Tuymans',
  '5rkai.jpeg': 'https://en.wikipedia.org/wiki/Dropping_a_Han_Dynasty_Urn',
  '5rkcattelan.jpeg': 'https://en.wikipedia.org/wiki/The_Ninth_Hour',
  '5rkcielrouge.jpeg': 'https://de.wikipedia.org/wiki/Spezial:Suche?search=Ciel+rouge',
  '5rkreinholdsen.jpg': 'https://www.youtube.com/watch?v=tRnyyd94ApI'
};

async function checkUrl(key, url) {
  try {
    const response = await fetch(url, { method: 'GET', redirect: 'follow' });
    return {
      key,
      url,
      ok: response.ok,
      status: response.status,
      finalUrl: response.url
    };
  } catch (error) {
    return {
      key,
      url,
      ok: false,
      status: 0,
      finalUrl: '',
      error: String(error.message || error)
    };
  }
}

async function main() {
  const entries = Object.entries(coreArtworkLinks);
  const checks = await Promise.all(entries.map(([key, url]) => checkUrl(key, url)));
  const report = {
    generatedAt: new Date().toISOString(),
    total: checks.length,
    ok: checks.filter(r => r.ok).length,
    failed: checks.filter(r => !r.ok).length,
    results: checks
  };

  fs.writeFileSync('core-links-report.json', JSON.stringify(report, null, 2), 'utf8');

  const lines = checks.map(item => {
    const flag = item.ok ? 'OK ' : 'ERR';
    const status = item.status || '-';
    return `${flag} ${status} ${item.key} -> ${item.finalUrl || item.url}`;
  });
  console.log(lines.join('\n'));
  console.log(`\nReport written to core-links-report.json`);
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
