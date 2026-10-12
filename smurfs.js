/* Local vector artwork and shared styling for the Smurf Village theme. */
(() => {
  "use strict";
  const names = {k:"Papa Smurf", q:"Smurfette", b:"Brainy Smurf", n:"Hefty on a woodland snail", r:"Mushroom house", p:"Village Smurf"};
  const colors = {skin:[.12,.62,.94,1], clothes:[.98,.98,.91,1], red:[.90,.17,.22,1], hair:[1,.77,.19,1], ink:[.035,.09,.16,1], wood:[.44,.25,.12,1], mount:[.40,.70,.37,1]};
  window.smurfTheme = {names, colors, light:[.78,.88,.65,1], dark:[.27,.48,.34,1], whiteBase:[.98,.96,.84,1], blackBase:[.14,.23,.40,1]};
  window.smurfPieceSvg = (piece) => {
    const t=piece.type, white=piece.color === "w", hat=t === "k" ? "#e52b38" : "#fffcec";
    const base=white ? "#fff5d5" : "#243c66", border=white ? "#776443" : "#aecaff";
    const house=`<path d="M30 50h40v28H30z" fill="#fff0cf"/><path d="M15 50Q22 12 50 15Q78 12 85 50Z" fill="#e9494b"/><g fill="#fff8e4"><ellipse cx="36" cy="31" rx="8" ry="5"/><ellipse cx="65" cy="37" rx="7" ry="5"/><circle cx="52" cy="21" r="4"/></g><path d="M43 78V62a7 7 0 0 1 14 0v16" fill="#704629"/><circle cx="34" cy="60" r="5" fill="#83d2ef"/>`;
    const character=`${t === "n" ? '<g class="smurf-mount"><ellipse cx="50" cy="74" rx="31" ry="9" fill="#79af67"/><circle cx="64" cy="67" r="16" fill="#b77d46"/><path d="M64 58q14 10 0 17q-9-1-5-8q5-5 9 1" fill="none" stroke="#6c4229" stroke-width="3"/><path d="M27 70l-3-12m10 12l1-12" stroke="#79af67" stroke-width="4"/></g>' : ''}
      <g class="smurf-character" transform="${t === "n" ? 'translate(8 -5) scale(.78)' : 'translate(0 0)'}">
      ${t === "q" ? '<path d="M26 43Q20 68 30 76h40q10-13 4-34Z" fill="#ffd04a"/>' : ''}
      <g class="smurf-arm"><path d="M34 58Q23 58 24 47" fill="none" stroke="#279fef" stroke-width="8" stroke-linecap="round"/></g>
      <path d="M66 57l10 10" stroke="#279fef" stroke-width="8" stroke-linecap="round"/>
      <path d="M36 52Q50 45 64 52l3 21H33Z" fill="${t === "q" ? '#fffcec' : '#279fef'}"/>
      <path d="M35 69h30v9H35Z" fill="${hat}"/><ellipse cx="40" cy="80" rx="10" ry="4" fill="${hat}"/><ellipse cx="62" cy="80" rx="10" ry="4" fill="${hat}"/>
      <g class="smurf-head"><circle cx="29" cy="41" r="6" fill="#279fef"/><circle cx="71" cy="41" r="6" fill="#279fef"/><ellipse cx="50" cy="40" rx="21" ry="19" fill="#279fef"/>
      <path d="M28 30Q25 5 55 9Q77 6 73 19Q57 14 65 30Z" fill="${hat}" stroke="#29435c" stroke-width="1.5"/>
      <ellipse cx="43" cy="38" rx="5" ry="6" fill="white"/><ellipse cx="58" cy="38" rx="5" ry="6" fill="white"/><g class="smurf-eyes" fill="#12273e"><circle cx="44" cy="39" r="2"/><circle cx="57" cy="39" r="2"/></g><ellipse cx="50" cy="45" rx="7" ry="5" fill="#58b9f5"/>
      ${t === "k" ? '<path d="M30 47Q30 74 50 65Q70 74 70 47l-13 8-7-4-7 4Z" fill="#fffcec"/>' : '<path d="M43 53q7 6 14 0" fill="none" stroke="#17354b" stroke-width="2" stroke-linecap="round"/>'}
      ${t === "b" ? '<g fill="none" stroke="#18334d" stroke-width="2.5"><circle cx="42" cy="39" r="8"/><circle cx="59" cy="39" r="8"/><path d="M49 39h3"/></g>' : ''}
      ${t === "q" ? '<path d="M30 33q4-13 19-12q-5 11-19 12m20-12q19-3 21 14q-10 0-21-14" fill="#ffd04a"/>' : ''}</g>
      ${t === "b" ? '<path d="M63 57l15 5-3 17-15-5Z" fill="#815739" stroke="#fff0c9" stroke-width="2"/>' : ''}
      ${t === "n" ? '<path d="M72 61l3-3 3 3m-3-3v7" stroke="#d52d40" stroke-width="2" fill="none"/>' : ''}
      </g>`;
    return `<svg class="smurf-art smurf-${t}" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><ellipse cx="50" cy="87" rx="38" ry="7" fill="#13293b" opacity=".25"/><ellipse cx="50" cy="83" rx="38" ry="11" fill="${base}" stroke="${border}" stroke-width="2"/>${t === "r" ? `<g class="smurf-house">${house}</g>` : character}<circle cx="80" cy="82" r="11" fill="${base}" stroke="${border}" stroke-width="1.5"/><text x="80" y="86" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="${white ? '#3a3020' : '#fff5db'}">${t.toUpperCase()}</text></svg>`;
  };
})();
