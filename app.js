/* =========================================================
   Mercati & Meteo — logica del sito
   Fonti gratuite, senza chiave: CoinGecko, Frankfurter (BCE),
   ExchangeRate-API (riserva), Open-Meteo.
   ========================================================= */

// ---------- ICONE (SVG in linea) ----------
const ICONE = {
  cerca: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  posizione: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  scambia: '<polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  sole: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
  luna: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  nuvola: '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
  pioggia: '<line x1="16" y1="13" x2="16" y2="21"/><line x1="8" y1="13" x2="8" y2="21"/><line x1="12" y1="15" x2="12" y2="23"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',
  pioviggine: '<line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/>',
  neve: '<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="8" y1="20" x2="8.01" y2="20"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="12" y1="22" x2="12.01" y2="22"/><line x1="16" y1="16" x2="16.01" y2="16"/><line x1="16" y1="20" x2="16.01" y2="20"/>',
  temporale: '<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/>',
  nebbia: '<line x1="5" y1="6" x2="19" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="14" x2="21" y2="14"/><line x1="5" y1="18" x2="19" y2="18"/>',
  vento: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>',
  goccia: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  alba: '<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/>',
  tramonto: '<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/>',
  occhio: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  pressione: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  ombrello: '<path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>',
  freccia: '<polygon points="12 2 19 21 12 17 5 21 12 2"/>',
  stella: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pausa: '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>',
  barre: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
  moneta: '<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2A3 3 0 0 0 12 8h-.5a2.5 2.5 0 0 0 0 5h1a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-2.8-1.2"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="18" x2="12" y2="20"/>',
  aereo: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  ancora: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  termometro: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>'
};
const icona = (nome, classe = "") => `<svg class="icona ${classe}" viewBox="0 0 24 24" aria-hidden="true">${ICONE[nome]}</svg>`;
document.querySelectorAll("[data-icona]").forEach(el => el.innerHTML = icona(el.dataset.icona));

// ---------- UTILITÀ ----------
// Il sito ha più pagine: ogni pagina contiene solo alcune sezioni.
// esiste() dice se un elemento c'è nella pagina corrente;
// $() restituisce un elemento "finto" se manca, così il codice non va in errore.
const esiste = id => document.getElementById(id) !== null;
const $ = id => document.getElementById(id) || document.createElement("div");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const memoria = {
  leggi(k) { try { return localStorage.getItem(k); } catch { return null; } },
  scrivi(k, v) { try { localStorage.setItem(k, v); } catch { } }
};
const fmtEuro = v => v.toLocaleString("it-IT", {
  style: "currency", currency: "EUR", useGrouping: "always",
  minimumFractionDigits: v < 1 ? 4 : 2, maximumFractionDigits: v < 1 ? 4 : 2
});
const fmtCompatto = v => v.toLocaleString("it-IT", { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 1 });
const fmtNum = (v, dec = 4) => v.toLocaleString("it-IT", { useGrouping: "always", minimumFractionDigits: 2, maximumFractionDigits: dec });
const fmtPct = v => (v > 0 ? "+" : "") + v.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%";
const oraAttuale = () => new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

function badgeVariazione(v) {
  if (v == null || isNaN(v)) return `<span class="variazione neutra">—</span>`;
  const cls = v >= 0 ? "su" : "giu";
  return `<span class="variazione ${cls}">${v >= 0 ? "▲" : "▼"} ${fmtPct(Math.abs(v)).replace("+", "")}</span>`;
}

// Disegna un piccolo grafico a linea (sparkline) in SVG
function sparkline(valori, larghezza = 110, altezza = 36) {
  if (!valori || valori.length < 2) return "";
  const min = Math.min(...valori), max = Math.max(...valori);
  const range = max - min || 1;
  const passo = larghezza / (valori.length - 1);
  const punti = valori.map((v, i) => [i * passo, altezza - 2 - ((v - min) / range) * (altezza - 4)]);
  const linea = punti.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const colore = valori[valori.length - 1] >= valori[0] ? "var(--su)" : "var(--giu)";
  const idGrad = "g" + Math.random().toString(36).slice(2, 8);
  return `<svg class="sparkline" width="${larghezza}" height="${altezza}" viewBox="0 0 ${larghezza} ${altezza}" aria-hidden="true">
    <defs><linearGradient id="${idGrad}" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="${colore}" stop-opacity=".22"/><stop offset="100%" stop-color="${colore}" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${linea} L${larghezza} ${altezza} L0 ${altezza} Z" fill="url(#${idGrad})"/>
    <path d="${linea}" fill="none" stroke="${colore}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

function mostraErrore(el, messaggio, riprova) {
  el.innerHTML = `<div class="errore-box">${messaggio} <button type="button">Riprova</button></div>`;
  el.querySelector("button").addEventListener("click", riprova);
}

// ---------- TEMA CHIARO / SCURO ----------
function applicaTema(tema) {
  if (tema) document.documentElement.dataset.theme = tema;
  const scuro = tema ? tema === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  $("tema").innerHTML = icona(scuro ? "sole" : "luna");
}
$("tema").addEventListener("click", () => {
  const attuale = document.documentElement.dataset.theme ||
    (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const nuovo = attuale === "dark" ? "light" : "dark";
  memoria.scrivi("tema", nuovo);
  applicaTema(nuovo);
  if (typeof disegnaWidget === "function") disegnaWidget();
});
applicaTema(memoria.leggi("tema"));

// ---------- OROLOGIO ----------
function aggiornaOrologio() {
  $("orologio").textContent = new Date().toLocaleString("it-IT", {
    weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
  });
}
aggiornaOrologio();
setInterval(aggiornaOrologio, 30000);

// Stato condiviso (serve per ticker e convertitore)
const stato = { crypto: null, cambi: null };

// =========================================================
// CRIPTOVALUTE (CoinGecko)
// =========================================================
async function caricaCrypto() {
  try {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc" +
      "&per_page=10&page=1&sparkline=true&price_change_percentage=24h,7d";
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const dati = await r.json();
    if (!Array.isArray(dati) || !dati.length) throw new Error("dati vuoti");
    stato.crypto = dati;
    disegnaCrypto(dati);
    $("agg-crypto").textContent = "Aggiornato alle " + oraAttuale();
  } catch (e) {
    console.warn("Crypto:", e);
    if (!stato.crypto) {
      if (esiste("crypto-corpo")) mostraErrore($("crypto-corpo").parentElement.parentElement, "Impossibile caricare le criptovalute.", () => location.reload());
      if (esiste("crypto-lista")) mostraErrore($("crypto-lista"), "Criptovalute non disponibili in questo momento.", caricaCrypto);
    }
  }
}

function disegnaCrypto(dati) {
  $("crypto-corpo").innerHTML = dati.map(c => {
    const prezzi = c.sparkline_in_7d?.price || [];
    // riduciamo i punti per un grafico più pulito
    const ridotti = prezzi.filter((_, i) => i % 4 === 0);
    return `<tr>
      <td class="col-num">${c.market_cap_rank ?? ""}</td>
      <td><div class="moneta">
        <img src="${esc(c.image)}" alt="" loading="lazy">
        <span><span class="moneta-nome">${esc(c.name)}</span><span class="moneta-simbolo">${esc(c.symbol)}</span></span>
      </div></td>
      <td class="destra"><strong>${fmtEuro(c.current_price)}</strong></td>
      <td class="destra">${badgeVariazione(c.price_change_percentage_24h_in_currency)}</td>
      <td class="destra nascondi-mobile">${badgeVariazione(c.price_change_percentage_7d_in_currency)}</td>
      <td class="destra nascondi-mobile">${fmtCompatto(c.market_cap)}</td>
      <td class="nascondi-mobile"><div class="sparkline-cella">${sparkline(ridotti, 120, 34)}</div></td>
    </tr>`;
  }).join("");

  // Elenco breve nella Home
  $("crypto-lista").innerHTML = dati.slice(0, 6).map(c => `
    <li class="riga-lista">
      <span class="moneta"><img src="${esc(c.image)}" alt="" loading="lazy"><span class="moneta-nome">${esc(c.name)}</span></span>
      <span class="valore-lista">${fmtEuro(c.current_price)}</span>
      ${badgeVariazione(c.price_change_percentage_24h_in_currency)}
    </li>`).join("");
}

// =========================================================
// CAMBI VALUTE (Frankfurter con storico, poi riserva)
// =========================================================
const VALUTE = ["USD", "GBP", "CHF", "JPY", "CAD", "AUD", "CNY", "SEK"];
const NOMI_VALUTE = {
  EUR: "Euro", USD: "Dollaro USA", GBP: "Sterlina britannica", CHF: "Franco svizzero",
  JPY: "Yen giapponese", CAD: "Dollaro canadese", AUD: "Dollaro australiano",
  CNY: "Yuan cinese", SEK: "Corona svedese"
};

async function daFrankfurter() {
  const inizio = new Date(Date.now() - 40 * 864e5).toISOString().slice(0, 10);
  const r = await fetch(`https://api.frankfurter.dev/v1/${inizio}..?base=EUR&symbols=${VALUTE.join(",")}`);
  if (!r.ok) throw new Error("HTTP " + r.status);
  const d = await r.json();
  const date = Object.keys(d.rates).sort();
  if (!date.length) throw new Error("dati vuoti");
  const ultimi = d.rates[date[date.length - 1]];
  const precedenti = date.length > 1 ? d.rates[date[date.length - 2]] : null;
  const storico = {};
  VALUTE.forEach(v => storico[v] = date.map(g => d.rates[g][v]).filter(x => x != null));
  return { fonte: "Frankfurter (BCE)", data: date[date.length - 1], tassi: ultimi, precedenti, storico };
}

async function daExchangeRateApi() {
  const r = await fetch("https://open.er-api.com/v6/latest/EUR");
  if (!r.ok) throw new Error("HTTP " + r.status);
  const d = await r.json();
  if (!d.rates || !d.rates.USD) throw new Error("dati mancanti");
  return { fonte: "ExchangeRate-API", data: d.time_last_update_utc, tassi: d.rates, precedenti: null, storico: null };
}

async function caricaCambi() {
  for (const fonte of [daFrankfurter, daExchangeRateApi]) {
    try {
      stato.cambi = await fonte();
      disegnaCambi(stato.cambi);
      preparaConvertitore();
      return;
    } catch (e) {
      console.warn("Cambi: fonte non disponibile", fonte.name, e);
    }
  }
  if (esiste("cambi-corpo")) mostraErrore($("cambi-corpo").parentElement.parentElement, "Impossibile caricare i cambi.", () => location.reload());
  if (esiste("cambi-lista")) mostraErrore($("cambi-lista"), "Cambi non disponibili in questo momento.", caricaCambi);
}

function variazioneCambio(c, v) {
  if (!c.precedenti || !c.precedenti[v]) return null;
  return (c.tassi[v] / c.precedenti[v] - 1) * 100;
}

function disegnaCambi(c) {
  $("cambi-corpo").innerHTML = VALUTE.filter(v => c.tassi[v]).map(v => `
    <tr>
      <td><strong>EUR/${v}</strong><div class="muted piccolo">${NOMI_VALUTE[v]}</div></td>
      <td class="destra"><strong>${fmtNum(c.tassi[v])}</strong></td>
      <td class="destra">${badgeVariazione(variazioneCambio(c, v))}</td>
      <td class="nascondi-mobile"><div class="sparkline-cella">${c.storico ? sparkline(c.storico[v], 64, 28) : '<span class="muted">—</span>'}</div></td>
    </tr>`).join("");
  $("cambi-fonte").textContent = `Fonte ${c.fonte}, dati del ${new Date(c.data).toLocaleDateString("it-IT")}.`;

  // Elenco breve nella Home
  $("cambi-lista").innerHTML = ["USD", "GBP", "CHF", "JPY"].filter(v => c.tassi[v]).map(v => `
    <li class="riga-lista">
      <span><span class="moneta-nome">EUR/${v}</span> <span class="muted piccolo">${NOMI_VALUTE[v]}</span></span>
      <span class="valore-lista">${fmtNum(c.tassi[v])}</span>
      ${badgeVariazione(variazioneCambio(c, v))}
    </li>`).join("");
}

// =========================================================
// CONVERTITORE
// =========================================================
function preparaConvertitore() {
  if (!esiste("conv-da")) return;
  const da = $("conv-da"), a = $("conv-a");
  if (!da.options.length) {
    const opzioni = ["EUR", ...VALUTE].map(v => `<option value="${v}">${v} — ${NOMI_VALUTE[v]}</option>`).join("");
    da.innerHTML = opzioni; a.innerHTML = opzioni;
    da.value = "EUR"; a.value = "USD";
    [da, a, $("conv-importo")].forEach(el => el.addEventListener("input", converti));
    $("conv-scambia").addEventListener("click", () => {
      [da.value, a.value] = [a.value, da.value];
      converti();
    });
  }
  converti();
}

function converti() {
  if (!stato.cambi || !esiste("conv-da")) return;
  const tasso = v => v === "EUR" ? 1 : stato.cambi.tassi[v];
  const da = $("conv-da").value, a = $("conv-a").value;
  const importo = parseFloat($("conv-importo").value) || 0;
  const t = tasso(a) / tasso(da);
  const risultato = importo * t;
  $("conv-valore").textContent = risultato.toLocaleString("it-IT", { style: "currency", currency: a, maximumFractionDigits: 2 });
  $("conv-tasso").textContent = `1 ${da} = ${fmtNum(t)} ${a}`;
}


// =========================================================
// I MIEI TITOLI E INDICI (widget gratuiti di TradingView)
// Per aggiungere o togliere un titolo basta modificare queste liste.
// Formato simbolo: "BORSA:CODICE" (es. MIL = Borsa di Milano, BINANCE = exchange crypto)
// =========================================================
const I_MIEI_TITOLI = [
  { gruppo: "Azioni Italia", simboli: [
    { s: "MIL:ENEL", d: "Enel" },
    { s: "MIL:ISP", d: "Intesa Sanpaolo" },
    { s: "MIL:HER", d: "Hera" }
  ]},
  { gruppo: "ETF", simboli: [
    { s: "XETR:VWCE", d: "Vanguard FTSE All-World" } // quotazione Xetra (Francoforte); alternativa: "BER:VWCE"
  ]},
  { gruppo: "Crypto", simboli: [
    { s: "BINANCE:BTCUSDT", d: "Bitcoin / Tether" },
    { s: "BINANCE:BTCUSDC", d: "Bitcoin / USD Coin" },
    { s: "BINANCE:ETHBTC", d: "Ethereum / Bitcoin" },
    { s: "BINANCE:XLMUSDT", d: "Stellar / Tether" }
  ]}
];

const INDICI = {
  Europa: [
    { s: "INDEX:FTSEMIB", d: "FTSE MIB" },
    { s: "INDEX:SX5E", d: "Euro Stoxx 50" },
    { s: "INDEX:DEU40", d: "DAX" },
    { s: "INDEX:CAC40", d: "CAC 40" },
    { s: "FOREXCOM:UKXGBP", d: "FTSE 100" }
  ],
  USA: [
    { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
    { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
    { s: "FOREXCOM:DJI", d: "Dow Jones" }
  ],
  Asia: [
    { s: "INDEX:NKY", d: "Nikkei 225" },
    { s: "INDEX:HSI", d: "Hang Seng" },
    { s: "SSE:000001", d: "Shanghai Composite" },
    { s: "BSE:SENSEX", d: "Sensex" }
  ]
};

let simboloGrafico = memoria.leggi("grafico") || I_MIEI_TITOLI[0].simboli[0].s;

const temaScuro = () => {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
};

// Inserisce un widget TradingView dentro un elemento
function widgetTV(contenitore, nomeScript, config) {
  const el = typeof contenitore === "string" ? $(contenitore) : contenitore;
  if (!el) return;
  el.innerHTML = "";
  const box = document.createElement("div");
  box.className = "tradingview-widget-container";
  const interno = document.createElement("div");
  interno.className = "tradingview-widget-container__widget";
  box.appendChild(interno);
  const script = document.createElement("script");
  script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${nomeScript}.js`;
  script.async = true;
  script.textContent = JSON.stringify(config);
  box.appendChild(script);
  el.appendChild(box);
}

function disegnaGrafico() {
  if (!esiste("tv-grafico")) return;
  const tema = temaScuro() ? "dark" : "light";
  widgetTV("tv-grafico", "advanced-chart", {
    autosize: true, symbol: simboloGrafico, interval: "D", timezone: "Europe/Rome",
    theme: tema, style: "3", locale: "it", allow_symbol_change: true,
    hide_side_toolbar: true, hide_volume: true, calendar: false,
    backgroundColor: tema === "dark" ? "#0f1e33" : "#ffffff",
    gridColor: tema === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.05)",
    support_host: "https://www.tradingview.com"
  });
  document.querySelectorAll(".chip-simbolo").forEach(b => b.classList.toggle("attivo", b.dataset.s === simboloGrafico));
}

function disegnaWidget() {
  const tema = temaScuro() ? "dark" : "light";
  const tutti = I_MIEI_TITOLI.flatMap(g => g.simboli);

  widgetTV("tv-ticker", "ticker-tape", {
    symbols: [
      { proName: "INDEX:FTSEMIB", title: "FTSE MIB" },
      { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
      { proName: "FOREXCOM:NSXUSD", title: "Nasdaq 100" },
      { proName: "INDEX:DEU40", title: "DAX" },
      { proName: "INDEX:NKY", title: "Nikkei 225" },
      ...tutti.map(x => ({ proName: x.s, title: x.d }))
    ],
    showSymbolLogo: true, isTransparent: true, displayMode: "adaptive", colorTheme: tema, locale: "it"
  });

  widgetTV("tv-indici-home", "market-quotes", {
    width: "100%", height: "100%",
    symbolsGroups: [{ name: "Indici", originalName: "Indici", symbols: [
      { name: "INDEX:FTSEMIB", displayName: "FTSE MIB" }, { name: "INDEX:SX5E", displayName: "Euro Stoxx 50" },
      { name: "INDEX:DEU40", displayName: "DAX" }, { name: "FOREXCOM:SPXUSD", displayName: "S&P 500" },
      { name: "FOREXCOM:NSXUSD", displayName: "Nasdaq 100" }, { name: "INDEX:NKY", displayName: "Nikkei 225" }
    ]}],
    showSymbolLogo: true, isTransparent: true, colorTheme: tema, locale: "it"
  });

  widgetTV("tv-titoli", "market-quotes", {
    width: "100%", height: "100%",
    symbolsGroups: I_MIEI_TITOLI.map(g => ({
      name: g.gruppo, originalName: g.gruppo,
      symbols: g.simboli.map(x => ({ name: x.s, displayName: x.d }))
    })),
    showSymbolLogo: true, isTransparent: true, colorTheme: tema, locale: "it"
  });

  Object.entries(INDICI).forEach(([area, simboli]) => {
    widgetTV("tv-indici-" + area.toLowerCase(), "market-overview", {
      colorTheme: tema, dateRange: "1M", showChart: true, locale: "it",
      width: "100%", height: "100%", largeChartUrl: "", isTransparent: true,
      showSymbolLogo: true, showFloatingTooltip: true,
      plotLineColorGrowing: tema === "dark" ? "#10b981" : "#059669",
      plotLineColorFalling: tema === "dark" ? "#f87171" : "#dc2626",
      belowLineFillColorGrowing: "rgba(16,185,129,0.12)",
      belowLineFillColorFalling: "rgba(220,38,38,0.12)",
      belowLineFillColorGrowingBottom: "rgba(16,185,129,0)",
      belowLineFillColorFallingBottom: "rgba(220,38,38,0)",
      symbolActiveColor: "rgba(37,99,235,0.12)",
      tabs: [{ title: area, originalTitle: area, symbols: simboli }]
    });
  });

  disegnaGrafico();
}

// Pulsanti per scegliere il titolo da vedere nel grafico
$("chip-titoli").innerHTML = I_MIEI_TITOLI.flatMap(g => g.simboli).map(x =>
  `<button type="button" class="chip chip-simbolo" data-s="${esc(x.s)}">${esc(x.s.split(":")[1])}</button>`).join("");
$("chip-titoli").addEventListener("click", e => {
  const b = e.target.closest(".chip-simbolo");
  if (!b) return;
  simboloGrafico = b.dataset.s;
  memoria.scrivi("grafico", simboloGrafico);
  disegnaGrafico();
});

// =========================================================
// METEO (Open-Meteo: previsioni + qualità dell'aria)
// =========================================================
const CITTA_RAPIDE = [
  { nome: "Roma", dettaglio: "Lazio, Italia", lat: 41.89, lon: 12.51 },
  { nome: "Milano", dettaglio: "Lombardia, Italia", lat: 45.46, lon: 9.19 },
  { nome: "Napoli", dettaglio: "Campania, Italia", lat: 40.85, lon: 14.27 },
  { nome: "Torino", dettaglio: "Piemonte, Italia", lat: 45.07, lon: 7.69 },
  { nome: "Firenze", dettaglio: "Toscana, Italia", lat: 43.77, lon: 11.25 },
  { nome: "Bologna", dettaglio: "Emilia-Romagna, Italia", lat: 44.49, lon: 11.34 }
];
let luogoAttuale = null;
let livelloMappa = "radar";

function meteoInfo(codice, giorno = true) {
  const m = (testo, ic, cls) => ({ testo, ic, cls });
  if (codice === 0) return giorno ? m("Sereno", "sole", "c-sole") : m("Sereno", "luna", "c-luna");
  if (codice === 1) return giorno ? m("Prevalentemente sereno", "sole", "c-sole") : m("Prevalentemente sereno", "luna", "c-luna");
  if (codice === 2) return m("Parzialmente nuvoloso", "nuvola", "c-nuvola");
  if (codice === 3) return m("Coperto", "nuvola", "c-nuvola");
  if (codice === 45 || codice === 48) return m("Nebbia", "nebbia", "c-nuvola");
  if (codice >= 51 && codice <= 57) return m("Pioviggine", "pioviggine", "c-pioggia");
  if (codice >= 61 && codice <= 67) return m(codice >= 65 ? "Pioggia forte" : "Pioggia", "pioggia", "c-pioggia");
  if (codice >= 71 && codice <= 77) return m("Neve", "neve", "c-neve");
  if (codice >= 80 && codice <= 82) return m("Rovesci", "pioggia", "c-pioggia");
  if (codice === 85 || codice === 86) return m("Rovesci di neve", "neve", "c-neve");
  if (codice >= 95) return m("Temporale", "temporale", "c-temporale");
  return m("—", "nuvola", "c-nuvola");
}

// =========================================================
// IL CIELO in cima a Home e Meteo: colore secondo l'ora e il tempo,
// con il sole (o la luna) che si sposta lungo un arco tra alba e tramonto
// =========================================================
const minuti = iso => iso ? (+iso.slice(11, 13)) * 60 + (+iso.slice(14, 16)) : null;

function applicaCielo(m) {
  const el = $("cielo"), c = m.current, d = m.daily;
  const ora = minuti(c.time), alba = minuti(d.sunrise?.[0]), tramonto = minuti(d.sunset?.[0]);
  let fase;
  if (alba == null || tramonto == null) fase = c.is_day ? "giorno" : "notte";
  else if (ora < alba - 30 || ora > tramonto + 30) fase = "notte";
  else if (ora < alba + 60) fase = "alba";
  else if (ora > tramonto - 60) fase = "tramonto";
  else fase = "giorno";
  const k = c.weather_code;
  el.dataset.fase = fase;
  el.dataset.tempo = k >= 95 ? "temporale" : (k >= 71 && k <= 77) || k === 85 || k === 86 ? "neve"
    : k >= 51 ? "pioggia" : k === 45 || k === 48 ? "nebbia" : k >= 2 ? "nuvoloso" : "sereno";

  // p = 0 all'alba (o al tramonto, di notte), 1 al tramonto (o all'alba)
  let p = 0.5;
  if (alba != null && tramonto != null) {
    if (fase === "notte") {
      const durata = 1440 - (tramonto - alba);
      p = (ora > tramonto ? ora - tramonto : ora + 1440 - tramonto) / durata;
    } else {
      p = (ora - alba) / (tramonto - alba);
    }
  }
  p = Math.min(1, Math.max(0, p));
  // l'arco occupa la metà destra del cielo, così il sole non copre le scritte
  el.style.setProperty("--astro-x", (77 - 19 * Math.cos(Math.PI * p)).toFixed(2) + "%");
  el.style.setProperty("--astro-y", (80 - 58 * Math.sin(Math.PI * p)).toFixed(2) + "%");
}

function frasesole(m) {
  const ora = minuti(m.current.time), d = m.daily;
  const alba = minuti(d.sunrise?.[0]), tramonto = minuti(d.sunset?.[0]);
  if (alba == null) return "";
  if (ora < alba) return `Il sole sorge alle ${oraDa(d.sunrise[0])}.`;
  if (ora < tramonto) return `Il sole tramonta alle ${oraDa(d.sunset[0])}.`;
  return d.sunrise?.[1] ? `Domani il sole sorge alle ${oraDa(d.sunrise[1])}.` : "";
}

const puntoCardinale = gradi => ["N", "NE", "E", "SE", "S", "SO", "O", "NO"][Math.round(gradi / 45) % 8];
const oraDa = iso => iso ? iso.slice(11, 16) : "—";

function livelloUV(uv) {
  if (uv == null) return { t: "—", c: "" };
  if (uv < 3) return { t: "Basso", c: "liv-1" };
  if (uv < 6) return { t: "Moderato", c: "liv-3" };
  if (uv < 8) return { t: "Alto", c: "liv-4" };
  if (uv < 11) return { t: "Molto alto", c: "liv-5" };
  return { t: "Estremo", c: "liv-6" };
}
function livelloAria(aqi) {
  if (aqi == null) return { t: "—", c: "" };
  if (aqi <= 20) return { t: "Buona", c: "liv-1" };
  if (aqi <= 40) return { t: "Discreta", c: "liv-2" };
  if (aqi <= 60) return { t: "Moderata", c: "liv-3" };
  if (aqi <= 80) return { t: "Scadente", c: "liv-4" };
  if (aqi <= 100) return { t: "Molto scadente", c: "liv-5" };
  return { t: "Pessima", c: "liv-6" };
}

async function caricaMeteo(luogo) {
  luogoAttuale = luogo;
  $("meteo-corpo").innerHTML = `<div class="scheletro h-meteo"></div>`;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${luogo.lat}&longitude=${luogo.lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day,pressure_msl,precipitation` +
      `&hourly=temperature_2m,precipitation_probability,weather_code,is_day,visibility` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,sunrise,sunset,uv_index_max,wind_speed_10m_max` +
      `&timezone=auto&forecast_days=7`;
    const urlAria = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${luogo.lat}&longitude=${luogo.lon}&current=european_aqi,pm2_5,pm10`;
    const [r, aria] = await Promise.all([
      fetch(url),
      fetch(urlAria).then(x => x.ok ? x.json() : null).catch(() => null) // la qualità dell'aria è facoltativa
    ]);
    if (!r.ok) throw new Error("HTTP " + r.status);
    disegnaMeteo(luogo, await r.json(), aria);
    aggiornaMappa();
  } catch (e) {
    console.warn("Meteo:", e);
    mostraErrore($("meteo-corpo"), "Impossibile caricare il meteo.", () => caricaMeteo(luogo));
  }
}

function graficoOrario(m) {
  const h = m.hourly;
  const adesso = m.current.time.slice(0, 13) + ":00";
  let inizio = h.time.indexOf(adesso);
  if (inizio < 0) inizio = 0;
  const N = 24, L = 32, W = N * L, H = 210;
  const idx = Array.from({ length: N }, (_, i) => inizio + i).filter(i => i < h.time.length);
  const temp = idx.map(i => h.temperature_2m[i]);
  const min = Math.min(...temp), max = Math.max(...temp), range = max - min || 1;
  const yT = t => 112 - ((t - min) / range) * 58; // la linea della temperatura sta tra y=54 e y=112
  const punti = temp.map((t, k) => [k * L + L / 2, yT(t)]);
  const linea = punti.map((p, k) => (k ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  let svg = `<svg class="grafico-orario" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Temperatura e probabilità di pioggia nelle prossime 24 ore">
    <defs><linearGradient id="gradTemp" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity=".28"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </linearGradient></defs>
    <path d="${linea} L${punti[punti.length - 1][0]} 130 L${punti[0][0]} 130 Z" fill="url(#gradTemp)"/>
    <path d="${linea}" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>`;
  idx.forEach((i, k) => {
    const x = k * L + L / 2;
    const pioggia = h.precipitation_probability?.[i] ?? 0;
    const hBar = (pioggia / 100) * 34;
    svg += `<rect x="${x - 9}" y="${168 - hBar}" width="18" height="${hBar}" rx="3" fill="var(--mare)" opacity=".35"/>`;
    if (k % 2 === 0) {
      const info = meteoInfo(h.weather_code[i], h.is_day[i] === 1);
      svg += `<g class="${info.cls}" transform="translate(${x - 9} 8)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONE[info.ic]}</svg></g>`;
      svg += `<text x="${x}" y="${punti[k][1] - 9}" text-anchor="middle" class="g-temp">${Math.round(temp[k])}°</text>`;
      svg += `<circle cx="${x}" cy="${punti[k][1]}" r="2.6" fill="var(--sfondo)" stroke="#f59e0b" stroke-width="1.8"/>`;
      svg += `<text x="${x}" y="186" text-anchor="middle" class="g-pioggia">${pioggia ? pioggia + "%" : ""}</text>`;
      svg += `<text x="${x}" y="204" text-anchor="middle" class="g-ora">${k === 0 ? "Ora" : h.time[i].slice(11, 13)}</text>`;
    }
  });
  return svg + `<line x1="0" x2="${W}" y1="168.5" y2="168.5" stroke="var(--linea)"/></svg>`;
}

function disegnaMeteo(luogo, m, aria) {
  const c = m.current, d = m.daily;
  const ora = meteoInfo(c.weather_code, c.is_day === 1);
  const iOra = Math.max(0, m.hourly.time.indexOf(c.time.slice(0, 13) + ":00"));
  const visibilita = m.hourly.visibility?.[iOra];
  const uv = livelloUV(d.uv_index_max?.[0]);
  const aqi = aria?.current?.european_aqi;
  const qa = livelloAria(aqi);

  applicaCielo(m);
  $("cielo-testo").innerHTML = `
    <h1 class="cielo-titolo">${esc(luogo.nome)}</h1>
    <p class="cielo-sotto">${esc(luogo.dettaglio || "")}${luogo.dettaglio ? ", " : ""}ore ${oraDa(c.time)}</p>
    <div class="cielo-temp">${Math.round(c.temperature_2m)}°</div>
    <p class="cielo-frase">${ora.testo}. Percepita ${Math.round(c.apparent_temperature)}°, massima ${Math.round(d.temperature_2m_max[0])}°, minima ${Math.round(d.temperature_2m_min[0])}°.<br>${frasesole(m)}</p>`;

  const voce = (ic, etichetta, valore, extra = "") =>
    `<div class="dato"><dt>${icona(ic)}${etichetta}</dt><dd>${valore}${extra ? `<span class="dato-extra">${extra}</span>` : ""}</dd></div>`;

  const minAss = Math.min(...d.temperature_2m_min), maxAss = Math.max(...d.temperature_2m_max), amp = maxAss - minAss || 1;
  const giorni = d.time.map((data, i) => {
    const info = meteoInfo(d.weather_code[i]);
    const nome = i === 0 ? "Oggi" : new Date(data + "T12:00").toLocaleDateString("it-IT", { weekday: "short", day: "numeric" });
    const sx = ((d.temperature_2m_min[i] - minAss) / amp) * 100;
    const dx = 100 - ((d.temperature_2m_max[i] - minAss) / amp) * 100;
    return `<li class="giorno">
      <span class="giorno-nome">${nome}</span>
      <span class="giorno-icona ${info.cls}" title="${info.testo}">${icona(info.ic)}</span>
      <span class="giorno-desc muted">${info.testo}</span>
      <span class="giorno-pioggia" title="Probabilità di pioggia">${icona("ombrello")}${d.precipitation_probability_max?.[i] ?? 0}%</span>
      <span class="giorno-min muted">${Math.round(d.temperature_2m_min[i])}°</span>
      <span class="barra-temp"><span style="left:${sx}%;right:${dx}%"></span></span>
      <span class="giorno-max">${Math.round(d.temperature_2m_max[i])}°</span>
    </li>`;
  }).join("");

  const direzione = c.wind_direction_10m;
  const mm = v => (v ?? 0).toLocaleString("it-IT", { maximumFractionDigits: 1 });
  $("meteo-corpo").innerHTML = `
    <div class="meteo-griglia">
      <section>
        <h2>Adesso</h2>
        <dl class="dati">
          ${voce("goccia", "Umidità", c.relative_humidity_2m + "%")}
          ${voce("vento", "Vento",
            `${Math.round(c.wind_speed_10m)} km/h <span class="freccia-vento" style="transform:rotate(${(direzione + 180) % 360}deg)">${icona("freccia")}</span>`,
            `da ${puntoCardinale(direzione)}, raffiche ${Math.round(c.wind_gusts_10m)} km/h`)}
          ${voce("pressione", "Pressione", Math.round(c.pressure_msl) + " hPa")}
          ${voce("occhio", "Visibilità", visibilita != null ? (visibilita >= 10000 ? "oltre 10 km" : mm(visibilita / 1000) + " km") : "—")}
          ${voce("ombrello", "Pioggia oggi", mm(d.precipitation_sum?.[0]) + " mm")}
          ${voce("sole", "Indice UV", `${d.uv_index_max?.[0] != null ? Math.round(d.uv_index_max[0]) : "—"} <span class="livello ${uv.c}">${uv.t}</span>`)}
          ${voce("vento", "Qualità dell'aria", `${aqi != null ? Math.round(aqi) : "—"} <span class="livello ${qa.c}">${qa.t}</span>`,
            aria?.current ? `PM2,5 ${Math.round(aria.current.pm2_5)} e PM10 ${Math.round(aria.current.pm10)} µg/m³` : "")}
          ${voce("alba", "Alba", oraDa(d.sunrise?.[0]))}
          ${voce("tramonto", "Tramonto", oraDa(d.sunset?.[0]))}
        </dl>
      </section>
      <section>
        <h2>Prossime 24 ore</h2>
        <div class="orario-scroll">${graficoOrario(m)}</div>
        <p class="legenda piccolo muted"><span class="leg leg-temp"></span>Temperatura <span class="leg leg-pioggia"></span>Probabilità di pioggia</p>
        <h2>Prossimi 7 giorni</h2>
        <ol class="giorni">${giorni}</ol>
      </section>
    </div>`;
}

// ---- Mappa meteo animata (Windy) ----
function aggiornaMappa() {
  if (!luogoAttuale) return;
  const p = new URLSearchParams({
    lat: luogoAttuale.lat, lon: luogoAttuale.lon, detailLat: luogoAttuale.lat, detailLon: luogoAttuale.lon,
    zoom: 6, level: "surface", overlay: livelloMappa, product: "ecmwf", menu: "", message: "true",
    marker: "true", calendar: "now", pressure: "", type: "map", location: "coordinates", detail: "",
    metricWind: "km/h", metricTemp: "°C", radarRange: "-1"
  });
  const src = "https://embed.windy.com/embed.html?" + p.toString();
  const iframe = $("mappa-meteo");
  if (iframe.src !== src) iframe.src = src;
  document.querySelectorAll(".chip-mappa").forEach(b => b.classList.toggle("attivo", b.dataset.livello === livelloMappa));
}
$("chip-mappa").addEventListener("click", e => {
  const b = e.target.closest(".chip-mappa");
  if (!b) return;
  livelloMappa = b.dataset.livello;
  aggiornaMappa();
});

// ---- Ricerca città con suggerimenti ----
function ricordaCitta(luogo) {
  memoria.scrivi("citta", JSON.stringify(luogo));
  let recenti = [];
  try { recenti = JSON.parse(memoria.leggi("recenti")) || []; } catch { }
  recenti = [luogo, ...recenti.filter(x => x.nome !== luogo.nome)].slice(0, 4);
  memoria.scrivi("recenti", JSON.stringify(recenti));
  disegnaChipCitta();
}

function disegnaChipCitta() {
  let recenti = [];
  try { recenti = JSON.parse(memoria.leggi("recenti")) || []; } catch { }
  const lista = [...recenti, ...CITTA_RAPIDE.filter(c => !recenti.some(r => r.nome === c.nome))].slice(0, 8);
  $("chip-citta").innerHTML = lista.map((c, i) =>
    `<button type="button" class="chip${luogoAttuale && luogoAttuale.nome === c.nome ? " attivo" : ""}" data-i="${i}">${esc(c.nome)}</button>`).join("");
  $("chip-citta").onclick = e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    const luogo = lista[+b.dataset.i];
    ricordaCitta(luogo);
    caricaMeteo(luogo).then(disegnaChipCitta);
  };
}

let suggerimenti = [], timerRicerca = null;
async function cercaCitta(nome) {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=6&language=it`);
  const d = await r.json();
  return (d.results || []).map(l => ({
    nome: l.name, dettaglio: [l.admin1, l.country].filter(Boolean).join(", "), lat: l.latitude, lon: l.longitude
  }));
}
function chiudiSuggerimenti() { $("suggerimenti").hidden = true; }
function scegli(luogo) {
  chiudiSuggerimenti();
  $("citta").value = "";
  ricordaCitta(luogo);
  caricaMeteo(luogo).then(disegnaChipCitta);
}

$("citta").addEventListener("input", () => {
  clearTimeout(timerRicerca);
  const testo = $("citta").value.trim();
  if (testo.length < 2) return chiudiSuggerimenti();
  timerRicerca = setTimeout(async () => {
    try {
      suggerimenti = await cercaCitta(testo);
      const box = $("suggerimenti");
      box.innerHTML = suggerimenti.length
        ? suggerimenti.map((s, i) => `<button type="button" data-i="${i}"><strong>${esc(s.nome)}</strong><span class="muted piccolo">${esc(s.dettaglio)}</span></button>`).join("")
        : `<div class="vuoto muted piccolo">Nessuna città trovata</div>`;
      box.hidden = false;
    } catch { chiudiSuggerimenti(); }
  }, 300);
});
$("suggerimenti").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (b) scegli(suggerimenti[+b.dataset.i]);
});
$("form-meteo").addEventListener("submit", async e => {
  e.preventDefault();
  const testo = $("citta").value.trim();
  if (!testo) return;
  if (!suggerimenti.length) { try { suggerimenti = await cercaCitta(testo); } catch { } }
  if (suggerimenti.length) scegli(suggerimenti[0]);
});
document.addEventListener("click", e => { if (!e.target.closest(".ricerca-wrap")) chiudiSuggerimenti(); });

$("posizione").addEventListener("click", () => {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    p => scegli({ nome: "La tua posizione", dettaglio: `${p.coords.latitude.toFixed(2)}, ${p.coords.longitude.toFixed(2)}`, lat: p.coords.latitude, lon: p.coords.longitude }),
    () => alert("Non è stato possibile ottenere la tua posizione.")
  );
});

// =========================================================
// METEO IN BREVE (riquadro della Home)
// =========================================================
async function caricaMeteoMini(luogo) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${luogo.lat}&longitude=${luogo.lon}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=5`;
    const r = await fetch(url);
    if (!r.ok) throw new Error("HTTP " + r.status);
    const m = await r.json(), c = m.current, d = m.daily;
    const ora = meteoInfo(c.weather_code, c.is_day === 1);
    const h = new Date().getHours();
    const saluto = h < 5 ? "Buonanotte" : h < 13 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera";
    applicaCielo(m);
    $("cielo-testo").innerHTML = `
      <p class="cielo-sotto">${new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}</p>
      <h1 class="cielo-titolo">${saluto}</h1>
      <p class="cielo-frase">${esc(luogo.nome)}: <strong>${Math.round(c.temperature_2m)}°</strong>, ${ora.testo.toLowerCase()}. ${frasesole(m)}</p>
      <ol class="cielo-giorni">${d.time.map((g, i) => {
        const info = meteoInfo(d.weather_code[i]);
        const nome = i === 0 ? "Oggi" : new Date(g + "T12:00").toLocaleDateString("it-IT", { weekday: "short" });
        return `<li><span class="cielo-giorno-nome">${nome}</span>${icona(info.ic)}<span><strong>${Math.round(d.temperature_2m_max[i])}°</strong> ${Math.round(d.temperature_2m_min[i])}°</span></li>`;
      }).join("")}</ol>
      <a class="cielo-link" href="meteo.html">Previsioni complete</a>`;
  } catch (e) {
    console.warn("Meteo Home:", e);
    $("cielo-testo").innerHTML = `<h1 class="cielo-titolo">Mercati e meteo</h1><p class="cielo-frase">Il meteo non è disponibile in questo momento. <button type="button" class="cielo-link" id="riprova-meteo">Riprova</button></p>`;
    $("riprova-meteo").addEventListener("click", () => caricaMeteoMini(luogo));
  }
}

// =========================================================
// MAPPE VOLI E NAVI (Flightradar24 e MarineTraffic)
// =========================================================
function mostraMappaEsterna(lat, lon, zoom) {
  ultimoLuogo = [lat, lon, zoom];
  const iframe = $("mappa-esterna");
  if (iframe.dataset.tipo === "voli") {
    // Mappe "globe" della comunità ADS-B (permettono di essere mostrate nel sito)
    const fonte = memoria.leggi("fonte-voli") || "adsblol";
    const host = fonte === "airplaneslive" ? "https://globe.airplanes.live" : "https://globe.adsb.lol";
    iframe.src = `${host}/?lat=${lat}&lon=${lon}&zoom=${zoom}&hideSidebar`;
    document.querySelectorAll(".chip-fonte").forEach(b => b.classList.toggle("attivo", b.dataset.fonte === fonte));
    $("apri-esterno").href = `https://www.flightradar24.com/${(+lat).toFixed(2)},${(+lon).toFixed(2)}/${zoom}`;
  } else {
    // VesselFinder e MarineTraffic offrono uno script da inserire nella pagina: lo carichiamo dentro l'iframe
    const fonte = memoria.leggi("fonte-navi") || "vesselfinder";
    const altezza = Math.max(300, iframe.clientHeight || 600);
    const script = fonte === "marinetraffic"
      ? `<script>width="100%";height="${altezza}";border="0";shownames="true";latitude="${lat}";longitude="${lon}";zoom="${zoom}";maptype="1";trackvessel="0";fleet="";<\/script>
         <script src="https://www.marinetraffic.com/js/embed.js"><\/script>`
      : `<script>var width="100%";var height="${altezza}";var latitude="${lat}";var longitude="${lon}";var zoom="${zoom}";var names=true;var show_names=true;<\/script>
         <script src="https://www.vesselfinder.com/aismap.js"><\/script>`;
    iframe.srcdoc = `<!DOCTYPE html><html><head><style>html,body{margin:0;height:100%;overflow:hidden}</style></head><body>${script}</body></html>`;
    document.querySelectorAll(".chip-fonte").forEach(b => b.classList.toggle("attivo", b.dataset.fonte === fonte));
    $("apri-esterno").href = `https://www.marinetraffic.com/it/ais/home/centerx:${lon}/centery:${lat}/zoom:${zoom}`;
  }
  document.querySelectorAll(".chip-luogo").forEach(b =>
    b.classList.toggle("attivo", b.dataset.lat === String(lat) && b.dataset.lon === String(lon)));
}
let ultimoLuogo = null;
$("chip-fonti").addEventListener("click", e => {
  const b = e.target.closest(".chip-fonte");
  if (!b) return;
  memoria.scrivi("fonte-" + $("mappa-esterna").dataset.tipo, b.dataset.fonte);
  if (ultimoLuogo) mostraMappaEsterna(...ultimoLuogo);
});
$("chip-luoghi").addEventListener("click", e => {
  const b = e.target.closest(".chip-luogo");
  if (b) mostraMappaEsterna(b.dataset.lat, b.dataset.lon, b.dataset.zoom);
});

// =========================================================
// AVVIO: ogni pagina carica solo quello che le serve
// =========================================================
// Evidenzia nel menu la pagina corrente
const paginaCorrente = location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".menu a").forEach(a => a.classList.toggle("attivo", a.getAttribute("href") === paginaCorrente));

let cittaSalvata = null;
try { cittaSalvata = JSON.parse(memoria.leggi("citta")); } catch { }
const cittaIniziale = cittaSalvata || CITTA_RAPIDE[0];

disegnaWidget();

if (esiste("crypto-corpo") || esiste("crypto-lista")) {
  caricaCrypto();
  setInterval(caricaCrypto, 120000);                 // crypto ogni 2 minuti
}
if (esiste("cambi-corpo") || esiste("cambi-lista") || esiste("conv-da")) {
  caricaCambi();
  setInterval(caricaCambi, 60 * 60 * 1000);          // cambi ogni ora
}
if (esiste("meteo-corpo")) {
  caricaMeteo(cittaIniziale).then(disegnaChipCitta);
  disegnaChipCitta();
  setInterval(() => luogoAttuale && caricaMeteo(luogoAttuale), 30 * 60 * 1000);
}
if (esiste("mappa-esterna")) {
  const primo = document.querySelector(".chip-luogo");
  mostraMappaEsterna(primo.dataset.lat, primo.dataset.lon, primo.dataset.zoom);
}
if (esiste("cielo") && !esiste("meteo-corpo")) {
  caricaMeteoMini(cittaIniziale);
  setInterval(() => caricaMeteoMini(cittaIniziale), 30 * 60 * 1000);
}
