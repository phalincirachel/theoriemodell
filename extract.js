const fs = require('fs');

const ranges = {
    "1skdurer.jpeg": [228, 257],
    "2kmschmidtrottluff.jpeg": [258, 294],
    "3afontana.jpeg": [295, 308],
    "4pmliechtenstein.jpeg": [309, 350],
    "5rktuymans.jpeg": [351, 384],

    "1sknatiluspokal.jpeg": [386, 413],
    "2kmboccioni.jpg": [414, 448],
    "3aduchamp.jpeg": [449, 483],
    "4pmwarhol.jpeg": [484, 508],
    "5rkai.jpeg": [509, 557],

    "1skmichelangelo.jpg": [559, 586],
    "2kmrichier.jpeg": [587, 614],
    "3abeuys.jpeg": [615, 648],
    "4pmkippenberger.jpeg": [649, 672],
    "5rkcattelan.jpeg": [673, 714],

    "1skfrauenkirche.jpeg": [716, 735],
    "2kmlecorbusier.jpeg": [736, 742],
    "3awotruba.jpeg": [743, 769],
    "4pmmoore.jpeg": [770, 785],
    "5rkcielrouge.jpeg": [786, 816],

    "1skplaten": [819, 853],
    "2kmholz": [854, 876],
    "3agomringer": [877, 885],
    "4pmgernhardt": [886, 910],
    "5rkgruenbein": [911, 952],

    "1skmozart.jpg": [954, 975],
    "2kmlachenmann.jpg": [976, 1005],
    "3acagejpg.jpg": [1006, 1030],
    "4pmschnittke.jpg": [1031, 1084],
    "5rkreinholdsen.jpg": [1085, 1106]
};

const textContent = fs.readFileSync('theoriemodell.txt', 'utf-8');
const lines = textContent.split('\n');

let output = "const artworkTexts = {\n";

for (const [key, range] of Object.entries(ranges)) {
    // 1-based index to 0-based index
    const start = range[0] - 1;
    const end = range[1] - 1;

    let block = "";
    let inParagraph = false;

    for (let i = start; i <= end; i++) {
        let line = lines[i].trim();
        if (line.match(/^\d+$/)) continue; // skip page numbers
        if (line === '') {
            if (inParagraph) {
                block += "</p>";
                inParagraph = false;
            }
            continue;
        }

        if (!inParagraph) {
            block += "<p>" + line + " ";
            inParagraph = true;
        } else {
            // merge lines
            block += line + " ";
            // if ends with certain chars or we want to wait for empty line?
            // the text is hard-wrapped. We merge lines.
        }
    }
    if (inParagraph) {
        block += "</p>";
    }

    // clean up double spaces and output
    block = block.replace(/\s+/g, ' ').replace(/"/g, '\\"');
    output += `    "${key}": "${block}",\n`;
}
output += "};\n";

fs.writeFileSync('texte.js', output);
console.log("texte.js created successfully.");
