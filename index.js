// Hasard : laisse le hasard décider. Une roue avec tes choix (et un mode qui retire le gagnant, pour tirer un ordre de passage), des dés qui roulent,
// une pièce qui tourne, un nombre tiré entre deux bornes et des équipes formées au hasard. Pixel art dessiné à la main ; il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Hasard</span><span class="hint">Touche la roue pour la faire tourner</span></div>
  <div class="rdTabs" id="rdTabs"><button class="tab px on" data-g="roue">ROUE</button><button class="tab px" data-g="des">DÉS</button><button class="tab px" data-g="piece">PIÈCE</button><button class="tab px" data-g="nombre">NOMBRE</button><button class="tab px" data-g="equipes">ÉQUIPES</button></div>
  <div class="rdGrid">
    <div class="sysCard rdWheelCard" data-g="roue"><b>ROUE</b><canvas id="rdWheel" width="320" height="320" role="img" aria-label="Roue"></canvas><canvas id="rdResult" class="rdBig" width="320" height="34" role="img" aria-label=""></canvas>
      <div class="row"><button class="btn main" id="rdSpinBtn">TOURNER</button><label class="rdChk"><input type="checkbox" id="rdRemove"> Retirer le gagnant</label></div>
      <div class="rdOrder" id="rdOrderBox" hidden><div class="hint">Ordre de passage</div><ol id="rdOrder"></ol><button class="btn" id="rdReset">TOUT REMETTRE</button></div></div>
    <div class="sysCard" data-g="roue"><b>CHOIX DE LA ROUE</b><div class="hint">Un par ligne (24 au plus)</div><textarea class="rdText" id="rdList" rows="10" spellcheck="false"></textarea></div>
    <div class="sysCard" data-g="des"><b>DÉS</b><div class="row"><select class="gSel" id="rdCount"></select><select class="gSel" id="rdFaces"></select></div>
      <canvas id="rdDice" class="rdTray" width="320" height="120" role="img" aria-label="Dés"></canvas><canvas id="rdDiceRes" class="rdBig" width="320" height="34"></canvas><div class="row"><button class="btn main" id="rdRoll">LANCER</button></div></div>
    <div class="sysCard" data-g="piece"><b>PILE OU FACE</b><canvas id="rdCoin" class="rdTray" width="320" height="120" role="img" aria-label="Pièce"></canvas><canvas id="rdCoinRes" class="rdBig" width="320" height="34"></canvas><div class="row"><button class="btn main" id="rdFlip">LANCER LA PIÈCE</button></div></div>
    <div class="sysCard" data-g="nombre"><b>NOMBRE AU HASARD</b><div class="row"><span>De</span><input class="rdIn" id="rdMin" value="1" inputmode="numeric"><span>à</span><input class="rdIn" id="rdMax" value="100" inputmode="numeric"></div>
      <canvas id="rdNumRes" class="rdBig rdHuge" width="320" height="60" role="img" aria-label=""></canvas><div class="row"><button class="btn main" id="rdNum">TIRER</button></div></div>
    <div class="sysCard rdTeamsCard" data-g="equipes"><b>ÉQUIPES</b><div class="hint">Les noms, un par ligne</div><textarea class="rdText" id="rdNames" rows="6" spellcheck="false"></textarea>
      <div class="row"><select class="gSel" id="rdTeamN"></select><button class="btn main" id="rdTeams">FORMER LES ÉQUIPES</button></div><div class="rdTeams" id="rdTeamList"></div></div>
  </div>
</div>`;
const CSS = `.rdGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:18px;align-items:start}
.rdGrid .sysCard{display:flex;flex-direction:column;gap:10px}
.rdWheelCard{align-items:center;grid-row:span 2}
#rdWheel{width:min(100%,420px);height:auto;aspect-ratio:1;image-rendering:pixelated;cursor:var(--cp,pointer)}
.rdBig{width:100%;height:auto;image-rendering:pixelated}
.rdTray{width:100%;height:auto;image-rendering:pixelated;background:#05010b}
.rdText{font:16px/26px monospace;min-height:150px;resize:vertical;color:#f4f0f8;background:#120a1e;border:0;box-shadow:0 0 0 2px #05010b,0 0 0 4px #62566e;padding:6px 10px;outline:0}
.rdText:focus{box-shadow:0 0 0 2px #05010b,0 0 0 4px #ffd84a}
.rdIn{width:90px;font:16px monospace;color:#f4f0f8;background:#120a1e;border:0;box-shadow:0 0 0 2px #05010b,0 0 0 4px #62566e;padding:6px 8px;outline:0}
.rdIn:focus{box-shadow:0 0 0 2px #05010b,0 0 0 4px #ffd84a}
.rdChk input{width:18px;height:18px;accent-color:#ffd84a}
.rdOrder{align-self:stretch}
.rdOrder ol{margin:6px 0 10px 28px;padding:0;color:#ffd84a;columns:2;font:15px/24px monospace}
.rdTeams{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
.rdTeam{padding:8px 10px;background:#120a1e;box-shadow:0 0 0 2px #05010b,inset 0 4px 0 var(--c)}
.rdTeam b{display:block;color:var(--c);margin:4px 0 6px}
.rdTeam div{color:#f4f0f8;line-height:22px}
/* téléphone : un onglet par jeu (roue, dés, pièce, nombre, équipes) au lieu de six cartes à faire défiler */
.rdTabs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}
.rdTabs .tab{flex:1 1 auto;width:auto;padding:10px 8px;font-size:12px}
.rdGrid{grid-template-columns:minmax(0,1fr);gap:12px}
.rdWheelCard{grid-row:auto}
.rdGrid .row{flex-wrap:wrap}
.rdGrid .btn.main{min-height:48px;flex:1 1 auto}
.rdIn{width:96px;min-height:40px}
.rdOrder ol{columns:1}
.rdGrid>[hidden]{display:none!important}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const { el, toast } = ctx.host;
  const folder = ctx.folder, legacy = ctx.legacy || {};
  ctx.host.addStyle(CSS);
  view.innerHTML = HTML;
  {  // téléphone : les onglets montrent une seule carte (ou deux pour la roue et ses choix)
    const show = g => { view.querySelectorAll('#rdTabs .tab').forEach(b => b.classList.toggle('on', b.dataset.g === g)); view.querySelectorAll('.rdGrid>[data-g]').forEach(c => c.hidden = c.dataset.g !== g); };
    view.querySelector('#rdTabs').onclick = e => { const b = e.target.closest('.tab'); if (b) show(b.dataset.g); };
    show('roue');
  }
  const $ = id => view.querySelector('#' + id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  let prefs = await doc('prefs');
  if (prefs == null) {  // première ouverture : tu retrouves tes réglages d'avant
    prefs = {}; const old = legacy.settings ? await legacy.settings().catch(() => ({})) : {};
    if (Array.isArray(old.wheel) && old.wheel.length) prefs.wheel = old.wheel;
    if (!prefs.wheel) { const loc = (await doc('local')) || {}; let v = loc.neoWheel ?? (legacy.local ? await legacy.local('neoWheel') : null); try { v = JSON.parse(v); } catch { v = null; } if (Array.isArray(v) && v.length) prefs.wheel = v; }
    if (Object.keys(prefs).length) await folder.write('prefs', prefs);
  }
  const keep = () => { clearTimeout(keep.t); keep.t = setTimeout(() => folder.write('prefs', prefs).catch(() => {}), 500); };
  const T = { k: '#0c0816', k2: '#160e24', fill: '#221632', fillOn: '#2e1e44', hl: '#3a2a52', line: '#62566e', acc: '#ffd84a', accL: '#fff4b0', accS: '#c89a1a', accD: '#3a2a08', acc2: '#e01ec8',
    rivet: '#f0f0f8', btn: '#3a2a52', btnHi: '#62566e', btnLo: '#160e24', btnHov: '#4a3866', btnHovHi: '#82768e', text: '#f4f0f8', muted: '#c0b8cc', gold: '#ffd84a', orange: '#ff8a3a', red: '#ff4a3a', green: '#7ee07a', green2: '#2f8a3a',
    bg: '#100a18', bgDot: '#221632', bgDot2: '#160e24', spark: '#3a2a08', spark2: '#ffd84a',
    tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................', '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] };
  pxSkin(view.querySelector('.appWrap'), { title: 'HASARD', T,
    emblem: ['..kkkkkkkk..', '.kwwwwwwwwk.', 'kwwkwwwwkwwk', 'kwwwwwwwwwwk', 'kwwwwkkwwwwk', 'kwwwwkkwwwwk', 'kwwwwwwwwwwk', 'kwwkwwwwkwwk', 'kwwwwwwwwwwk', '.kwwwwwwwwk.', '..kkkkkkkk..', '............'],
    icons: [[/^TOURNER|^LANCER|^TIRER|^FORMER/, 'play']] });
  // les sons : de petits bips, chacun le sien
  let ac = null; const beep = (f, d, type = 'square', slide = 0, vol = .035, at = 0) => { try { ac ??= new AudioContext(); const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + at; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t + d); } catch {} };
  const clack = (vol = .05) => { try { ac ??= new AudioContext(); const n = ac.createBufferSource(), b = ac.createBuffer(1, 1400, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length) ** 3; const f = ac.createBiquadFilter(), g = ac.createGain(); f.type = 'bandpass'; f.frequency.value = 1800 + Math.random() * 900; g.gain.value = vol; n.buffer = b; n.connect(f).connect(g).connect(ac.destination); n.start(); } catch {} };
  const ding = () => [784, 1047, 1319].forEach((f, i) => beep(f, .18, 'triangle', 0, .04, i * .07));
  // un texte en grosses lettres pixel, centré, réduit s'il est trop large
  function big(cv, text, color = T.gold, max = 0) {
    const g = cv.getContext('2d'), W = cv.width, H = cv.height; g.clearRect(0, 0, W, H); if (!text) { cv.setAttribute('aria-label', ''); return; }
    let s = max || Math.floor(H / PXK.H); while (s > 1 && PXK.layout(text).w * s > W - 6) s--;
    const y = Math.round((H - PXK.H * s) / 2 + 9 * s); PXK.fill(g, text, W / 2 + s, y + s, '#05010b', s, 'center'); PXK.fill(g, text, W / 2, y, color, s, 'center'); cv.setAttribute('aria-label', text);
  }

  /* ---------- la roue : dessinée pixel par pixel sur 80 px puis agrandie sans lissage ; le mode « retirer le gagnant » tire un ordre de passage ---------- */
  const RD_DEFAULT = ['Pizza', 'Sushis', 'Burger', 'Pâtes', 'Tacos', 'Salade'];
  let rdEntries = prefs.wheel?.length ? prefs.wheel : RD_DEFAULT, drawn = [], rdAngle = 0, rdSpinning = false, flash = -1;
  const RD_COLORS = ['#8a5cf0', '#e01ec8', '#7fe0ee', '#ffd07a', '#8ee8a0', '#ff9a3c', '#ff5ad9', '#3b5bdb'];
  const RD_PX = 80, rdBuf = document.createElement('canvas'), RD_RGB = RD_COLORS.map(c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))), TAU = Math.PI * 2;
  rdBuf.width = rdBuf.height = RD_PX;
  const active = () => rdEntries.map((t, i) => ({ t, i })).filter(e => !drawn.includes(e.i));
  const under = (angle, n) => { const at = ((-angle % TAU) + TAU) % TAU; return Math.floor(at / TAU * n) % n; };  // la part sous la flèche (angle 0, à droite)
  function rdWheel() {
    const cv = $('rdWheel'), g = cv.getContext('2d'), A = active(), n = A.length || 1, S = cv.width / RD_PX, R = RD_PX / 2 - 2, c0 = RD_PX / 2;
    const b = rdBuf.getContext('2d'), img = b.createImageData(RD_PX, RD_PX), d = img.data;
    for (let y = 0; y < RD_PX; y++) for (let x = 0; x < RD_PX; x++) {
      const dx = x + .5 - c0, dy = y + .5 - c0, dist = Math.hypot(dx, dy), o = (y * RD_PX + x) * 4;
      if (dist > R + 1) continue;
      let col = [19, 10, 32];
      if (A.length && dist <= R && dist > 6) {
        const a = ((Math.atan2(dy, dx) - rdAngle) % TAU + TAU) % TAU, f = a / TAU * n, i = Math.floor(f) % n, edge = Math.min(f - Math.floor(f), Math.ceil(f) - f) * TAU / n * dist;
        if (edge > .7) { col = i === flash ? [255, 255, 255] : RD_RGB[A[i].i % RD_RGB.length]; if (dist > R - 2) col = col.map(v => v * .72); else if (dist < 12) col = col.map(v => Math.min(255, v * 1.12)); }
      } else if (dist <= 4) col = [243, 234, 255];
      d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2]; d[o + 3] = 255;
    }
    b.putImageData(img, 0, 0);
    g.clearRect(0, 0, cv.width, cv.height); g.imageSmoothingEnabled = false; g.drawImage(rdBuf, 0, 0, cv.width, cv.height);
    A.forEach(({ t }, i) => {  // le texte de chaque part, en lettres pixel ; la moitié gauche est retournée pour ne jamais lire à l'envers
      const mid = rdAngle + (i + .5) / n * TAU, left = Math.cos(mid) < 0, s = n > 12 ? 1 : 2; let txt = t; while (txt.length > 1 && PXK.layout(txt).w * s > R * S - 40) txt = txt.slice(0, -1);
      g.save(); g.translate(cv.width / 2, cv.width / 2); g.rotate(left ? mid + Math.PI : mid);
      const tx = left ? -(R * S - 12) : R * S - 12; PXK.fill(g, txt, tx + 1, 4 * s + 1, 'rgba(255,255,255,.5)', s, left ? 'left' : 'right'); PXK.fill(g, txt, tx, 4 * s, '#130a20', s, left ? 'left' : 'right'); g.restore();
    });
    if (!A.length) big(cv, '', T.gold);
    const P = ['#.....', '###...', '#####.', '######', '#####.', '###...', '#.....'], px0 = cv.width - 6 * 4 - 2, py0 = cv.width / 2 - 14;  // la flèche, à droite
    P.forEach((row, j) => [...row].forEach((ch, k) => { if (ch === '#') { g.fillStyle = '#130a20'; g.fillRect(px0 + (5 - k) * 4 - 2, py0 + j * 4 - 2, 8, 8); } }));
    P.forEach((row, j) => [...row].forEach((ch, k) => { if (ch === '#') { g.fillStyle = j === 3 || k === 0 ? '#ffd07a' : '#fff'; g.fillRect(px0 + (5 - k) * 4, py0 + j * 4, 4, 4); } }));
    cv.setAttribute('aria-label', 'Roue : ' + (A.length ? A.map(e => e.t).join(', ') : 'tout le monde est passé'));
  }
  function order() {
    $('rdOrderBox').hidden = !drawn.length; $('rdOrder').replaceChildren(...drawn.map(i => el('li', '', rdEntries[i])));
  }
  function rdSpin(fast) {
    const A = active(); if (rdSpinning) return;
    if (!A.length) { big($('rdResult'), 'TOUT LE MONDE EST PASSÉ', T.muted); return; }
    rdSpinning = true; flash = -1; big($('rdResult'), '…', T.muted);
    const start = rdAngle, turn = TAU * (5 + Math.random() * 4), t0 = performance.now(), dur = 3800; let last = under(start, A.length);
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - (1 - k) ** 4; rdAngle = start + turn * e; rdWheel();
      const u = under(rdAngle, A.length); if (u !== last) { last = u; beep(1500, .02, 'square', 0, .02); }  // le cliquetis à chaque part
      if (k < 1) return requestAnimationFrame(step);
      const i = under(rdAngle, A.length), win = A[i]; flash = i; rdWheel(); big($('rdResult'), win.t.toUpperCase(), T.gold); ding();
      setTimeout(() => { flash = -1; if ($('rdRemove').checked) { drawn.push(win.i); order(); } rdWheel(); rdSpinning = false; }, 1100);
    };
    if (fast) { rdAngle += turn; const i = under(rdAngle, A.length); rdSpinning = false; if ($('rdRemove').checked) { drawn.push(A[i].i); order(); } rdWheel(); big($('rdResult'), A[i].t.toUpperCase(), T.gold); return; }  // tirage instantané (vérification)
    requestAnimationFrame(step); beep(220, .25, 'sawtooth', 440, .03);
  }
  $('rdList').value = rdEntries.join('\n');
  $('rdList').oninput = () => { rdEntries = $('rdList').value.split('\n').map(s => s.trim()).filter(Boolean).slice(0, 24); drawn = []; order(); prefs.wheel = rdEntries; keep(); rdWheel(); };
  $('rdSpinBtn').onclick = () => { $('rdSpinBtn').blur(); rdSpin(); }; $('rdWheel').onclick = () => rdSpin();
  $('rdRemove').checked = !!prefs.remove; $('rdRemove').onchange = () => { prefs.remove = $('rdRemove').checked; keep(); };
  $('rdReset').onclick = () => { drawn = []; order(); rdWheel(); big($('rdResult'), ''); };
  document.addEventListener('keydown', e => { if (!view.classList.contains('on') || e.key !== ' ' || /INPUT|SELECT|TEXTAREA|BUTTON/.test(e.target.tagName)) return; e.preventDefault(); rdSpin(); });

  /* ---------- les dés : ils roulent sur un tapis vert, rebondissent sur les bords (clac) et montrent des faces au hasard avant de s'arrêter ---------- */
  const fillSel = (sel, list, v) => { sel.replaceChildren(...list.map(([val, txt]) => { const o = el('option', '', txt); o.value = val; return o; })); sel.value = v; };
  fillSel($('rdCount'), [1, 2, 3, 4, 5, 6].map(n => [n, n + (n > 1 ? ' dés' : ' dé')]), prefs.count || 2);
  fillSel($('rdFaces'), [4, 6, 8, 10, 12, 20, 100].map(n => [n, n + ' faces']), prefs.faces || 6);
  $('rdCount').onchange = () => { prefs.count = +$('rdCount').value; keep(); }; $('rdFaces').onchange = () => { prefs.faces = +$('rdFaces').value; keep(); };
  const PIPS = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
  let dice = [], diceRaf = 0;
  function drawDie(g, d) {
    const S = 32, x = Math.round(d.x - S / 2), y = Math.round(d.y - S / 2), sq = d.sq ? 2 : 0;
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x + 3, y + 4, S, S);
    g.fillStyle = '#05010b'; g.fillRect(x - 1 + sq, y - 1, S + 2 - sq * 2, S + 2); g.fillStyle = '#f4f0ff'; g.fillRect(x + sq, y, S - sq * 2, S);
    g.fillStyle = '#c8bce8'; g.fillRect(x + sq, y + S - 4, S - sq * 2, 4); g.fillRect(x + S - 4 - sq, y, 4, S); g.fillStyle = '#ffffff'; g.fillRect(x + 2 + sq, y + 2, S - 8 - sq * 2, 2);
    if (d.faces === 6) for (const [i, j] of PIPS[d.v]) { g.fillStyle = d.v === 1 ? '#e83a4a' : '#130a20'; g.fillRect(x + 6 + i * 8 + (sq ? 1 : 0), y + 5 + j * 8, 5, 5); }
    else PXK.fill(g, String(d.v), x + S / 2 - 2, y + S / 2 + 6, '#130a20', d.v >= 100 ? 1 : 2, 'center');
  }
  function drawTray() {
    const cv = $('rdDice'), g = cv.getContext('2d'), W = cv.width, H = cv.height; g.imageSmoothingEnabled = false;
    g.fillStyle = '#1e5a32'; g.fillRect(0, 0, W, H); g.fillStyle = '#226a3a'; for (let y = 0; y < H; y += 4) for (let x = (y / 4 % 2) * 2; x < W; x += 4) g.fillRect(x, y, 1, 1);
    g.fillStyle = '#5a3a1a'; g.fillRect(0, 0, W, 4); g.fillRect(0, H - 4, W, 4); g.fillRect(0, 0, 4, H); g.fillRect(W - 4, 0, 4, H); g.fillStyle = '#8a5a2a'; g.fillRect(0, 0, W, 1); g.fillRect(0, 0, 1, H);
    for (const d of dice) drawDie(g, d);
  }
  function roll(fast) {
    const count = +$('rdCount').value, faces = +$('rdFaces').value, cv = $('rdDice'), W = cv.width, H = cv.height; cancelAnimationFrame(diceRaf);
    dice = Array.from({ length: count }, (_, i) => ({ x: 20 + Math.random() * 30, y: 26 + (i % 3) * 34 + Math.random() * 8, vx: 7 + Math.random() * 5, vy: (Math.random() - .5) * 7, faces, v: 1 + Math.floor(Math.random() * faces), final: 1 + Math.floor(Math.random() * faces), t: 0, sq: 0 }));
    big($('rdDiceRes'), '…', T.muted); let n = 0;
    const step = () => {
      let moving = false;
      for (const d of dice) {
        d.x += d.vx; d.y += d.vy; d.vx *= .955; d.vy *= .955; d.sq = 0;
        if (d.x < 21 || d.x > W - 21) { d.vx = -d.vx * .75; d.x = Math.max(21, Math.min(W - 21, d.x)); d.sq = 1; if (!fast) clack(); }
        if (d.y < 21 || d.y > H - 21) { d.vy = -d.vy * .75; d.y = Math.max(21, Math.min(H - 21, d.y)); d.sq = 1; if (!fast) clack(.035); }
        const sp = Math.hypot(d.vx, d.vy); if (sp > .35) { moving = true; if (++d.t % Math.max(2, Math.round(9 - sp)) === 0) d.v = 1 + Math.floor(Math.random() * faces); } else { d.vx = d.vy = 0; d.v = d.final; }
      }
      for (let i = 0; i < dice.length; i++) for (let j = i + 1; j < dice.length; j++) { const a = dice[i], b = dice[j], dx = b.x - a.x, dy = b.y - a.y, dd = Math.hypot(dx, dy) || 1;  // deux dés qui se touchent s'écartent
        if (dd < 35) { const push = (35 - dd) / 2, ux = dx / dd, uy = dy / dd; a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push; [a.vx, b.vx] = [b.vx * .8, a.vx * .8]; [a.vy, b.vy] = [b.vy * .8, a.vy * .8]; if (!fast && Math.random() < .5) clack(.03); } }
      drawTray();
      if ((moving && ++n < 400) && !fast) { diceRaf = requestAnimationFrame(step); return; }
      for (const d of dice) { d.v = d.final; d.vx = d.vy = 0; } drawTray();
      const v = dice.map(d => d.v); big($('rdDiceRes'), count > 1 ? v.join(' + ') + ' = ' + v.reduce((a, b) => a + b, 0) : String(v[0]), T.gold); $('rdDice').setAttribute('aria-label', 'Dés : ' + v.join(', ')); if (!fast) ding();
    };
    if (fast) step(); else { clack(); diceRaf = requestAnimationFrame(step); }
    return dice.map(d => d.final);
  }
  $('rdRoll').onclick = () => { $('rdRoll').blur(); roll(); };

  /* ---------- la pièce : lancée en l'air, elle tourne (tintement à chaque demi-tour), retombe et rebondit sur la face tirée ---------- */
  let coinRaf = 0;
  function drawCoin(phi, hgt, res) {
    const cv = $('rdCoin'), g = cv.getContext('2d'), W = cv.width, H = cv.height, R = 30, cx = W / 2, cy = H - 40 - hgt, c = Math.cos(phi), w = Math.max(2, Math.abs(c) * R), front = c >= 0;
    g.fillStyle = '#1a1030'; g.fillRect(0, 0, W, H); g.fillStyle = '#221632'; for (let y = 0; y < H; y += 4) for (let x = (y / 4 % 2) * 2; x < W; x += 4) g.fillRect(x, y, 1, 1);
    g.fillStyle = '#2a1e40'; g.fillRect(0, H - 14, W, 14);
    const sw = Math.round(R * (1 - Math.min(.7, hgt / 120))); g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(Math.round(cx - sw), H - 12, sw * 2, 4);
    const [rim, face, light, dark] = front ? ['#7a3c10', '#e8a838', '#ffd07a', '#b8641c'] : ['#4a4a5a', '#b8bcc8', '#eef0f8', '#7a7e8a'];
    for (let dy = -R; dy <= R; dy++) { const hw = Math.round(w * Math.sqrt(1 - (dy / R) ** 2)); if (hw <= 0) continue;
      g.fillStyle = rim; g.fillRect(Math.round(cx - hw), Math.round(cy + dy), hw * 2, 1);
      const iw = Math.round((w - 3) * Math.sqrt(Math.max(0, 1 - (dy / (R - 3)) ** 2))); if (iw > 0 && Math.abs(dy) < R - 2) { g.fillStyle = dy < -R / 3 ? light : dy > R / 3 ? dark : face; g.fillRect(Math.round(cx - iw), Math.round(cy + dy), iw * 2, 1); } }
    if (Math.abs(c) > .55) PXK.fill(g, front ? 'P' : 'F', cx, cy + 12, front ? '#7a3c10' : '#3a3e4a', 3, 'center');
    cv.setAttribute('aria-label', res ? 'Pièce : ' + res : 'Pièce');
  }
  function flip(fast) {
    cancelAnimationFrame(coinRaf); const pile = Math.random() < .5, turns = 6 + Math.floor(Math.random() * 3), end = turns * TAU + (pile ? 0 : Math.PI), dur = 80; let t = 0, lastSide = 1;
    big($('rdCoinRes'), '…', T.muted); if (!fast) beep(600, .08, 'triangle', 1200);
    const step = () => {
      t++; const k = Math.min(1, t / dur), phi = end * (1 - (1 - k) ** 2), hgt = k < .85 ? Math.sin(k / .85 * Math.PI) * 60 : Math.abs(Math.sin((k - .85) / .15 * Math.PI)) * 6;
      const side = Math.sign(Math.cos(phi)); if (side !== lastSide && !fast) { lastSide = side; beep(1700 + k * 600, .03, 'sine', 0, .025); }  // tintement à chaque demi-tour
      drawCoin(phi, hgt);
      if (k < 1 && !fast) { coinRaf = requestAnimationFrame(step); return; }
      drawCoin(end, 0, pile ? 'pile' : 'face'); big($('rdCoinRes'), pile ? 'PILE' : 'FACE', pile ? T.gold : '#d8dce8');
      if (!fast) { beep(1250, .12, 'triangle', 0, .04); beep(1660, .25, 'sine', 0, .03, .05); }
    };
    if (fast) t = dur - 1; step(); return pile;
  }
  $('rdFlip').onclick = () => { $('rdFlip').blur(); flip(); };

  /* ---------- le nombre : les chiffres défilent comme une machine à sous, puis s'arrêtent ---------- */
  const num = s => { const v = parseFloat(String(s).replace(/[\s  ]/g, '').replace(',', '.')); return isFinite(v) ? Math.round(v) : NaN; };
  $('rdMin').value = prefs.min ?? 1; $('rdMax').value = prefs.max ?? 100;
  function draw(fast) {
    const a = num($('rdMin').value), b = num($('rdMax').value); if (!(b >= a)) { toast('Le maximum doit être plus grand que le minimum', true); return null; }
    prefs.min = a; prefs.max = b; keep();
    const pick = () => a + Math.floor(Math.random() * (b - a + 1)), res = pick(); let k = 0;
    const step = () => { if (fast || ++k > 22) { big($('rdNumRes'), String(res), T.gold); if (!fast) ding(); return; } big($('rdNumRes'), String(pick()), T.muted); beep(900 + k * 30, .02, 'square', 0, .02); setTimeout(step, 30 + k * 4); };
    step(); return res;
  }
  $('rdNum').onclick = () => { $('rdNum').blur(); draw(); };

  /* ---------- les équipes : les noms mélangés puis distribués un par un, pour des équipes de tailles égales (à un près) ---------- */
  const TEAM_C = ['#ffd84a', '#5ac8ff', '#ff6a8a', '#7ee07a', '#c88aff', '#ff9a3c', '#7fe0ee', '#e8e4ec'];
  fillSel($('rdTeamN'), [2, 3, 4, 5, 6, 7, 8].map(n => [n, n + ' équipes']), prefs.teams || 2);
  $('rdTeamN').onchange = () => { prefs.teams = +$('rdTeamN').value; keep(); };
  $('rdNames').value = (prefs.names || ['Alice', 'Bilal', 'Chloé', 'David', 'Emma', 'Farid']).join('\n');
  $('rdNames').oninput = () => { prefs.names = $('rdNames').value.split('\n').map(s => s.trim()).filter(Boolean); keep(); };
  const split = (names, n) => { const a = names.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } const t = Array.from({ length: n }, () => []); a.forEach((x, i) => t[i % n].push(x)); return t; };
  function teams() {
    const names = $('rdNames').value.split('\n').map(s => s.trim()).filter(Boolean), n = +$('rdTeamN').value;
    if (names.length < n) { toast('Il faut au moins un nom par équipe', true); return null; }
    const t = split(names, n);
    $('rdTeamList').replaceChildren(...t.map((m, i) => { const c = el('div', 'rdTeam'); c.style.setProperty('--c', TEAM_C[i % TEAM_C.length]); c.append(el('b', '', 'ÉQUIPE ' + (i + 1)), ...m.map(x => el('div', '', x))); return c; }));
    t.forEach((_, i) => beep(523 * 2 ** (i * 2 / 12), .1, 'triangle', 0, .035, i * .06)); return t;
  }
  $('rdTeams').onclick = () => { $('rdTeams').blur(); teams(); };

  // vérification : la part sous la flèche, le tirage sans remise, les équipes égales, dés, pièce et nombre dans leurs bornes
  function rdCheck() {
    const bad = [];
    for (const n of [1, 2, 5, 24]) for (let i = 0; i < n; i++) { const ang = -(i + .5) / n * TAU; if (under(ang, n) !== i) { bad.push('roue ' + n + '/' + i); break; } }
    const keepE = rdEntries, keepD = drawn; rdEntries = ['A', 'B', 'C']; drawn = [1]; if (active().map(e => e.t).join() !== 'A,C') bad.push('retirer'); drawn = [0, 1, 2]; if (active().length) bad.push('tous passés'); rdEntries = keepE; drawn = keepD;
    for (const [k, n] of [[7, 3], [6, 2], [2, 2], [9, 4]]) { const names = Array.from({ length: k }, (_, i) => 'n' + i), t = split(names, n), sz = t.map(x => x.length);
      if (t.length !== n || Math.max(...sz) - Math.min(...sz) > 1 || t.flat().sort().join() !== names.sort().join()) bad.push('équipes ' + k + '/' + n); }
    return bad.join(' | ') || 'ok';
  }
  { const c = rdCheck(); console.assert(c === 'ok', 'hasard', c); view.dataset.selfcheck = c; }
  $('rdWheel').__rd = { check: rdCheck, spin: fast => rdSpin(fast), roll: fast => roll(fast), flip: fast => flip(fast), draw: fast => draw(fast), teams, state: () => ({ spinning: rdSpinning, drawn: drawn.slice(), active: active().map(e => e.t), entries: rdEntries.slice() }) };
  ctx.onOpen(() => { rdWheel(); order(); if (!dice.length) { dice = [{ x: 120, y: 60, faces: 6, v: 5, vx: 0, vy: 0 }, { x: 190, y: 64, faces: 6, v: 2, vx: 0, vy: 0 }]; drawTray(); } drawCoin(0, 0); });
}
