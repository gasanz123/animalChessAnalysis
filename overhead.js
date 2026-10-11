/* Top-down animal figures for the Living 2D set. The shapes are drawn as SVG so they stay sharp at every board size. */
(() => {
  "use strict";
  const drawings = {
    k: `<g class="creature">
      <g class="mane" fill="var(--fur-dark)"><circle cx="50" cy="47" r="27"/>
        <circle cx="31" cy="34" r="10"/><circle cx="43" cy="23" r="11"/><circle cx="58" cy="23" r="11"/><circle cx="70" cy="34" r="10"/>
        <circle cx="73" cy="52" r="10"/><circle cx="62" cy="67" r="10"/><circle cx="40" cy="67" r="10"/><circle cx="27" cy="52" r="10"/></g>
      <path d="M24 64 Q18 72 28 77 Q38 83 40 73" fill="none" stroke="var(--fur-dark)" stroke-width="7" stroke-linecap="round" class="tail"/>
      <ellipse cx="50" cy="57" rx="21" ry="22" fill="var(--fur)"/><ellipse cx="50" cy="48" rx="20" ry="21" fill="var(--coat)"/>
      <circle cx="35" cy="32" r="7" fill="var(--fur-dark)"/><circle cx="65" cy="32" r="7" fill="var(--fur-dark)"/>
      <g class="head"><ellipse cx="50" cy="43" rx="17" ry="18" fill="var(--coat)"/>
        <ellipse cx="50" cy="53" rx="12" ry="8" fill="var(--muzzle)"/>
        <circle cx="43" cy="42" r="2.4" fill="var(--ink)"/><circle cx="57" cy="42" r="2.4" fill="var(--ink)"/>
        <path d="M46 51 L54 51 L50 56Z" fill="var(--ink)"/></g></g>`,
    q: `<g class="creature"><ellipse cx="50" cy="60" rx="16" ry="22" fill="var(--fur-dark)"/>
      <g class="wing wing-left"><path d="M45 47 Q30 25 13 21 Q17 42 37 63Z" fill="var(--fur)"/>
        <path d="M39 48 Q26 34 18 30 M37 54 Q25 44 16 39" fill="none" stroke="var(--muzzle)" stroke-width="2"/></g>
      <g class="wing wing-right"><path d="M55 47 Q70 25 87 21 Q83 42 63 63Z" fill="var(--fur)"/>
        <path d="M61 48 Q74 34 82 30 M63 54 Q75 44 84 39" fill="none" stroke="var(--muzzle)" stroke-width="2"/></g>
      <path d="M43 72 L50 84 L57 72" fill="var(--fur-dark)"/><ellipse cx="50" cy="56" rx="12" ry="19" fill="var(--coat)"/>
      <g class="head"><circle cx="50" cy="36" r="12" fill="var(--muzzle)"/>
        <path d="M46 26 Q51 19 56 27" fill="var(--fur)"/><path d="M43 33 L50 19 L57 33" fill="var(--fur)"/>
        <path d="M45 38 L50 48 L55 38Z" fill="var(--gold)"/><circle cx="44" cy="34" r="2" fill="var(--ink)"/><circle cx="56" cy="34" r="2" fill="var(--ink)"/></g></g>`,
    r: `<g class="creature"><ellipse cx="50" cy="61" rx="23" ry="20" fill="var(--fur-dark)"/>
      <g class="ear ear-left"><ellipse cx="26" cy="46" rx="14" ry="22" fill="var(--fur)"/><ellipse cx="27" cy="45" rx="9" ry="16" fill="var(--ear)"/></g>
      <g class="ear ear-right"><ellipse cx="74" cy="46" rx="14" ry="22" fill="var(--fur)"/><ellipse cx="73" cy="45" rx="9" ry="16" fill="var(--ear)"/></g>
      <ellipse cx="50" cy="44" rx="20" ry="23" fill="var(--coat)"/>
      <path d="M35 59 L30 72 L38 62 M65 59 L70 72 L62 62" fill="var(--muzzle)" stroke="var(--muzzle)" stroke-width="2"/>
      <circle cx="42" cy="42" r="2.4" fill="var(--ink)"/><circle cx="58" cy="42" r="2.4" fill="var(--ink)"/>
      <g class="trunk"><path d="M50 45 Q48 35 51 26 Q56 18 49 14" fill="none" stroke="var(--fur-dark)" stroke-width="13" stroke-linecap="round"/>
        <path d="M50 45 Q48 35 51 26 Q56 18 49 14" fill="none" stroke="var(--coat)" stroke-width="9" stroke-linecap="round"/></g></g>`,
    b: `<g class="creature"><ellipse cx="50" cy="63" rx="22" ry="19" fill="var(--fur-dark)"/><ellipse cx="50" cy="61" rx="18" ry="17" fill="var(--coat)"/>
      <g class="neck"><path d="M44 58 Q42 41 46 28 L55 28 Q59 41 56 58Z" fill="var(--coat)"/>
        <circle cx="45" cy="50" r="3" fill="var(--fur)"/><circle cx="55" cy="43" r="3" fill="var(--fur)"/><circle cx="46" cy="35" r="2.6" fill="var(--fur)"/>
        <ellipse cx="50" cy="27" rx="12" ry="15" fill="var(--fur)"/>
        <ellipse cx="35" cy="25" rx="7" ry="3" fill="var(--muzzle)" transform="rotate(-24 35 25)"/>
        <ellipse cx="65" cy="25" rx="7" ry="3" fill="var(--muzzle)" transform="rotate(24 65 25)"/>
        <path d="M44 18 L42 10 M56 18 L58 10" stroke="var(--fur-dark)" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="50" cy="19" rx="9" ry="11" fill="var(--coat)"/><circle cx="44" cy="23" r="2" fill="var(--ink)"/><circle cx="56" cy="23" r="2" fill="var(--ink)"/></g></g>`,
    n: `<g class="creature"><ellipse cx="50" cy="64" rx="21" ry="18" fill="var(--fur-dark)"/><ellipse cx="50" cy="59" rx="19" ry="19" fill="var(--coat)"/>
      <path d="M43 58 Q37 43 40 30 L48 22 L60 28 Q63 43 57 59" fill="var(--fur-dark)"/>
      <g class="head"><path d="M37 29 L39 12 L47 24 M63 29 L61 12 L53 24" fill="var(--fur)"/>
        <path d="M39 31 Q38 19 50 19 Q62 19 61 31 L57 47 Q54 54 50 54 Q46 54 43 47Z" fill="var(--coat)"/>
        <path d="M48 20 Q52 27 50 37" fill="none" stroke="var(--fur-dark)" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="50" cy="43" rx="9" ry="11" fill="var(--muzzle)"/><circle cx="44" cy="34" r="2.2" fill="var(--ink)"/><circle cx="56" cy="34" r="2.2" fill="var(--ink)"/>
        <circle cx="46" cy="47" r="1.7" fill="var(--ink)"/><circle cx="54" cy="47" r="1.7" fill="var(--ink)"/></g></g>`,
    p: `<g class="creature"><g class="tail"><path d="M65 65 Q84 66 79 47 Q88 66 71 76" fill="var(--fur-dark)"/></g>
      <ellipse cx="50" cy="61" rx="20" ry="18" fill="var(--fur-dark)"/><ellipse cx="50" cy="55" rx="18" ry="18" fill="var(--coat)"/>
      <g class="head"><path d="M34 39 L29 14 L43 26 Q50 22 57 26 L71 14 L66 39Z" fill="var(--fur-dark)"/>
        <path d="M36 38 L34 23 L44 31 M64 38 L66 23 L56 31" fill="var(--ear)"/>
        <ellipse cx="50" cy="41" rx="17" ry="17" fill="var(--coat)"/><path d="M43 46 Q50 52 57 46 L54 57 L46 57Z" fill="var(--muzzle)"/>
        <circle cx="43" cy="40" r="2.4" fill="var(--ink)"/><circle cx="57" cy="40" r="2.4" fill="var(--ink)"/>
        <path d="M46 48 L54 48 L50 53Z" fill="var(--ink)"/></g></g>`,
  };
  window.overheadPieceSvg = (piece, uniqueId = "piece") => {
    const id = `overhead-${uniqueId.replace(/[^a-zA-Z0-9-]/g, "-")}`;
    const side = piece.color === "w" ? "light" : "dark";
    return `<svg class="overhead-art overhead-${piece.type}" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs><radialGradient id="${id}-base" cx="37%" cy="28%" r="76%"><stop stop-color="${side === "light" ? "#fffdf1" : "#536975"}"/><stop offset=".72" stop-color="${side === "light" ? "#cbbd9c" : "#1c2b33"}"/><stop offset="1" stop-color="${side === "light" ? "#8a7557" : "#0c171d"}"/></radialGradient>
      <radialGradient id="${id}-coat" cx="35%" cy="24%" r="76%"><stop stop-color="${side === "light" ? "#fff5d9" : "#79939a"}"/><stop offset=".65" stop-color="${side === "light" ? "#d2b889" : "#344951"}"/><stop offset="1" stop-color="${side === "light" ? "#8e6748" : "#13232b"}"/></radialGradient></defs>
      <ellipse cx="51" cy="84" rx="37" ry="9" fill="#08171a" opacity=".34"/>
      <circle cx="50" cy="51" r="42" fill="${side === "light" ? "#806b4f" : "#091820"}"/>
      <circle cx="50" cy="47" r="39" fill="url(#${id}-base)" stroke="${side === "light" ? "#fff2cd" : "#7b989e"}" stroke-width="2"/>
      <circle cx="50" cy="47" r="33" fill="none" stroke="${side === "light" ? "#876a48" : "#0b181e"}" stroke-width="1.7" opacity=".75"/>
      <g style="--coat:url(#${id}-coat);--fur:${side === "light" ? "#d3a66c" : "#526a72"};--fur-dark:${side === "light" ? "#a4713c" : "#263c45"};--muzzle:${side === "light" ? "#fff0cf" : "#a9b8aa"};--ear:${side === "light" ? "#af745f" : "#a16e62"};--ink:${side === "light" ? "#352821" : "#071216"};--gold:#d9a455">
        ${drawings[piece.type]}</g></svg>`;
  };
})();
