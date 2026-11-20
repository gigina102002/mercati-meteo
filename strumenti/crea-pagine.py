# Genera le pagine del sito con intestazione e piè di pagina comuni.
# Uso:  python3 strumenti/crea-pagine.py   (dalla cartella del sito)
import hashlib, pathlib
qui = pathlib.Path(__file__).resolve().parent.parent
# numero di versione dei file: cambia a ogni modifica, così il browser non usa copie vecchie
def versione(nome):
    return hashlib.sha1((qui / nome).read_bytes()).hexdigest()[:8]
V_CSS, V_JS = versione("style.css"), versione("app.js")

MENU = [("index.html", "Home"), ("titoli.html", "I miei titoli"), ("indici.html", "Indici"),
        ("crypto.html", "Crypto"), ("valute.html", "Valute"), ("notizie.html", "Notizie"), ("meteo.html", "Meteo"),
        ("voli.html", "Voli"), ("navi.html", "Navi")]


CIELO = '''  <section id="cielo" class="cielo" data-fase="giorno" data-tempo="sereno">
    <div class="cielo-arco" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M58 80 A19 58 0 0 1 96 80" vector-effect="non-scaling-stroke"/></svg>
      <span class="astro"></span>
    </div>
    <div class="contenitore cielo-contenuto">
      {strumenti}
      <div id="cielo-testo" class="cielo-testo"><p class="cielo-sotto">Sto guardando il cielo…</p></div>
    </div>
    <svg class="onda" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
      <path class="onda-lontana" d="M0,52 C180,30 360,70 560,50 C760,30 960,64 1160,46 C1280,36 1370,44 1440,48 L1440,90 L0,90 Z"/>
      <path class="onda-vicina" d="M0,66 C220,50 420,84 640,68 C860,52 1080,82 1300,66 C1360,62 1410,64 1440,66 L1440,90 L0,90 Z"/>
    </svg>
  </section>
'''


def pagina(file, titolo, descrizione, contenuto, cielo=""):
    menu = "\n".join(f'        <a href="{f}">{n}</a>' for f, n in MENU)
    titolo_completo = "Mercati e Meteo" if file == "index.html" else f"{titolo} – Mercati e Meteo"
    return f'''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{descrizione}">
  <meta name="theme-color" content="#0B4F8A">
  <title>{titolo_completo}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css?v={V_CSS}">
</head>
<body>
  <header class="topbar">
    <div class="contenitore topbar-interno">
      <a href="index.html" class="logo" aria-label="Mercati e Meteo, pagina iniziale">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <circle cx="16" cy="13" r="6.5" fill="#E8674A"/>
          <path d="M2 21c4.5-3.6 9.5-3.6 14 0s9.5 3.6 14 0" fill="none" stroke="#0B4F8A" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M2 27c4.5-3.6 9.5-3.6 14 0s9.5 3.6 14 0" fill="none" stroke="#0B4F8A" stroke-width="2.6" stroke-linecap="round" opacity=".45"/>
        </svg>
        <span>Mercati e Meteo</span>
      </a>
      <nav class="menu" aria-label="Pagine">
{menu}
      </nav>
      <div class="topbar-destra">
        <span id="orologio" class="orologio"></span>
        <button id="tema" class="btn-icona" aria-label="Cambia tema chiaro o scuro" title="Tema chiaro o scuro"></button>
      </div>
    </div>
  </header>

  <div class="ticker" id="tv-ticker" aria-label="Quotazioni in tempo reale"></div>
{cielo}
  <main class="contenitore">
{contenuto}
  </main>

  <footer class="piede">
    <div class="contenitore piede-interno">
      <p><strong>Mercati e Meteo</strong><br><span class="muted">Dati aggiornati automaticamente durante la giornata.</span></p>
      <p class="muted piccolo">Fonti: TradingView, CoinGecko, Banca Centrale Europea (Frankfurter), ExchangeRate-API, Open-Meteo, Windy, Meteociel, ADSB.lol, airplanes.live, MarineTraffic.<br>
      Le quotazioni di borsa possono essere di fine giornata o ritardate. Le informazioni servono solo a scopo informativo e non sono consulenza finanziaria.</p>
    </div>
  </footer>

  <script src="app.js?v={V_JS}"></script>
</body>
</html>
'''


def testa(titolo, sottotitolo, extra=""):
    return f'''    <header class="pagina-testa">
      <div>
        <h1>{titolo}</h1>
        <p>{sottotitolo}</p>
      </div>
      {extra}
    </header>'''


def blocco_testa(titolo, link_testo="", link_href=""):
    link = f'<a class="link" href="{link_href}">{link_testo}</a>' if link_testo else ""
    return f'<div class="blocco-testa"><h2>{titolo}</h2>{link}</div>'


# ---------------- HOME ----------------
home = '''    <section id="avvisi" class="avvisi" hidden aria-live="polite">
      <div class="blocco-testa"><h2>Avvisi di oggi</h2><span class="muted piccolo">Ti arrivano anche per email da GitHub</span></div>
      <ul id="avvisi-lista" class="avvisi-lista"></ul>
    </section>
    <div class="home-griglia">
      <div class="blocco colonna-sx">
        <section>
          ''' + blocco_testa("I miei titoli", "Grafici", "titoli.html") + '''
          <ol id="titoli-lista" class="lista"><li class="scheletro h-lista"></li></ol>
        </section>
        <section>
          ''' + blocco_testa("Borse", "Tutti gli indici", "indici.html") + '''
          <ol id="borse-lista" class="lista"><li class="scheletro h-lista"></li></ol>
          <p id="titoli-agg" class="nota muted piccolo"></p>
        </section>
      </div>
      <section class="blocco">
        ''' + blocco_testa("Crypto", "Classifica", "crypto.html") + '''
        <ol id="crypto-lista" class="lista"><li class="scheletro h-lista"></li></ol>
        ''' + blocco_testa("Cambi", "Convertitore", "valute.html") + '''
        <ol id="cambi-lista" class="lista"><li class="scheletro h-lista"></li></ol>
      </section>
    </div>
    <section class="sezione">
      ''' + blocco_testa("Notizie dal mondo", "Tutte le notizie", "notizie.html") + '''
      <ol id="notizie-home" class="notizie notizie-due"><li class="scheletro h-lista"></li></ol>
    </section>'''
# ---------------- I MIEI TITOLI ----------------
titoli = testa("I miei titoli", "Le azioni, gli ETF e le crypto che segui. Tocca un titolo per vederne il grafico.") + '''
    <div class="due-colonne">
      <section class="blocco">
        <div id="titoli-tabella" class="tabella-scroll">
          <table class="tabella tabella-titoli">
            <thead>
              <tr>
                <th scope="col">Titolo</th>
                <th class="destra" scope="col">Prezzo</th>
                <th class="destra" scope="col">Oggi</th>
                <th class="destra nascondi-mobile" scope="col">3 mesi</th>
              </tr>
            </thead>
            <tbody id="titoli-corpo">
              <tr><td colspan="4"><div class="scheletro h-righe"></div></td></tr>
            </tbody>
          </table>
        </div>
        <p id="titoli-nota" class="nota muted piccolo"></p>
      </section>
      <section class="blocco">
        ''' + blocco_testa("Grafico") + '''
        <div class="tv-box tv-grafico tv-grafico-grande" id="tv-grafico"></div>
      </section>
    </div>

    <section class="sezione">
      ''' + blocco_testa("Dividendi e appuntamenti") + '''
      <div class="tabella-scroll">
        <table class="tabella">
          <thead>
            <tr>
              <th scope="col">Titolo</th>
              <th scope="col">Prossimo stacco cedola</th>
              <th class="destra" scope="col">Ultimo dividendo</th>
              <th class="destra" scope="col">Rendimento 12 mesi</th>
              <th class="nascondi-mobile" scope="col">Prossimi conti</th>
            </tr>
          </thead>
          <tbody id="calendario-corpo">
            <tr><td colspan="5"><div class="scheletro h-lista"></div></td></tr>
          </tbody>
        </table>
      </div>
      <p class="nota muted piccolo">Dati Yahoo Finance, aggiornati automaticamente. Il rendimento è la somma dei dividendi degli ultimi 12 mesi divisa per il prezzo di oggi. Le date annunciate dalle società possono cambiare.</p>
    </section>'''
# ---------------- INDICI ----------------
indici = testa("Indici di borsa", "L'ultimo mese in Europa, negli Stati Uniti e in Asia. Tocca un indice per vederne il grafico.") + '''
    <div class="tre-colonne">
      <section class="blocco">''' + blocco_testa("Europa") + '''<div class="tv-box tv-indici" id="tv-indici-europa"></div></section>
      <section class="blocco">''' + blocco_testa("Stati Uniti") + '''<div class="tv-box tv-indici" id="tv-indici-usa"></div></section>
      <section class="blocco">''' + blocco_testa("Asia") + '''<div class="tv-box tv-indici" id="tv-indici-asia"></div></section>
    </div>'''

# ---------------- CRYPTO ----------------
crypto = testa("Criptovalute", "Le dieci più grandi per valore di mercato, con i prezzi in euro.", '<span id="agg-crypto" class="aggiornato">In aggiornamento</span>') + '''
    <section id="crypto" class="blocco">
      <div class="tabella-scroll">
        <table class="tabella">
          <thead>
            <tr>
              <th class="col-num" scope="col">#</th>
              <th scope="col">Nome</th>
              <th class="destra" scope="col">Prezzo</th>
              <th class="destra" scope="col">24 ore</th>
              <th class="destra nascondi-mobile" scope="col">7 giorni</th>
              <th class="destra nascondi-mobile" scope="col">Valore di mercato</th>
              <th class="destra nascondi-mobile" scope="col">Settimana</th>
            </tr>
          </thead>
          <tbody id="crypto-corpo">
            <tr><td colspan="7"><div class="scheletro h-righe"></div></td></tr>
          </tbody>
        </table>
      </div>
      <p class="nota muted piccolo">Fonte CoinGecko. I prezzi si aggiornano ogni 2 minuti.</p>
    </section>'''

# ---------------- VALUTE ----------------
valute = testa("Valute", "I cambi di riferimento della Banca Centrale Europea e un convertitore.") + '''
    <div class="due-colonne due-colonne-pari">
      <section id="valute" class="blocco">
        ''' + blocco_testa("Cambi dell'euro") + '''
        <div class="tabella-scroll">
          <table class="tabella">
            <thead>
              <tr>
                <th scope="col">Coppia</th>
                <th class="destra" scope="col">Tasso</th>
                <th class="destra" scope="col">Rispetto a ieri</th>
                <th class="destra nascondi-mobile" scope="col">Ultimo mese</th>
              </tr>
            </thead>
            <tbody id="cambi-corpo">
              <tr><td colspan="4"><div class="scheletro h-righe"></div></td></tr>
            </tbody>
          </table>
        </div>
        <p id="cambi-fonte" class="nota muted piccolo"></p>
      </section>
      <section class="blocco">
        ''' + blocco_testa("Convertitore") + '''
        <div class="convertitore">
          <label class="campo">
            <span>Importo</span>
            <input id="conv-importo" type="number" value="100" min="0" step="any" inputmode="decimal">
          </label>
          <div class="conv-riga">
            <label class="campo"><span>Da</span><select id="conv-da"></select></label>
            <button type="button" id="conv-scambia" class="btn-icona btn-scambia" title="Inverti le valute" aria-label="Inverti le valute" data-icona="scambia"></button>
            <label class="campo"><span>A</span><select id="conv-a"></select></label>
          </div>
          <div class="conv-risultato" aria-live="polite">
            <div id="conv-valore" class="conv-valore">—</div>
            <div id="conv-tasso" class="muted piccolo"></div>
          </div>
        </div>
      </section>
    </div>'''

# ---------------- NOTIZIE ----------------
notizie = testa("Notizie dal mondo", "Gli articoli delle ultime ore, raccolti da Google News. Scegli una zona; ogni notizia si apre sul sito del giornale.", '<span id="notizie-agg" class="aggiornato"></span>') + '''
    <div id="zone-notizie" class="chips zone-notizie" role="group" aria-label="Zona del mondo"></div>
    <section class="sezione-notizie" aria-live="polite">
      <h2 id="notizie-zona-titolo" class="visivamente-nascosto">Notizie</h2>
      <ol id="notizie-elenco" class="notizie notizie-due"><li class="scheletro h-righe"></li></ol>
    </section>'''

# ---------------- METEO ----------------
RICERCA = '''<div class="cielo-strumenti">
        <div class="ricerca-wrap">
          <form id="form-meteo" class="ricerca" role="search" autocomplete="off">
            <span class="ricerca-icona" data-icona="cerca"></span>
            <input id="citta" type="text" placeholder="Cerca una città" aria-label="Cerca una città">
            <button type="button" id="posizione" class="btn-icona" title="Usa la mia posizione" aria-label="Usa la mia posizione" data-icona="posizione"></button>
          </form>
          <div id="suggerimenti" class="suggerimenti" hidden></div>
        </div>
        <div id="chip-citta" class="chips chips-cielo" role="group" aria-label="Città rapide"></div>
      </div>'''

METEOCIEL_RUC = "https://www.meteociel.fr/modeles/icon-d2-ruc.php"
meteo = f'''    <div id="meteo-corpo" class="meteo-corpo"><div class="scheletro h-meteo"></div></div>

    <section class="sezione">
      <div class="blocco-testa">
        <h2>Radar e mappa</h2>
        <div id="chip-mappa" class="chips" role="group" aria-label="Cosa mostrare sulla mappa">
          <button type="button" class="chip chip-mappa" data-livello="radar">Radar</button>
          <button type="button" class="chip chip-mappa" data-livello="rain">Pioggia</button>
          <button type="button" class="chip chip-mappa" data-livello="temp">Temperatura</button>
          <button type="button" class="chip chip-mappa" data-livello="wind">Vento</button>
          <button type="button" class="chip chip-mappa" data-livello="clouds">Nuvole</button>
        </div>
      </div>
      <iframe id="mappa-meteo" class="mappa" title="Mappa meteo di Windy" loading="lazy"></iframe>
    </section>

    <section class="sezione modelli">
      <div class="modello-principale">
        <h2>Carte del modello ICON-D2 RUC</h2>
        <p>Il modello ad alta risoluzione del servizio meteorologico tedesco, ricalcolato ogni ora. Utile per seguire temporali e piogge nelle prossime 27 ore, con un dettaglio di circa 2 km.</p>
        <a class="pulsante" href="{METEOCIEL_RUC}" target="_blank" rel="noopener">Apri le carte su Meteociel</a>
      </div>
      <ul class="modelli-altri">
        <li><a href="https://www.meteociel.fr/modeles/icon-d2.php" target="_blank" rel="noopener"><strong>ICON-D2</strong><span>Stesso modello, aggiornato ogni 3 ore</span></a></li>
        <li><a href="https://www.meteociel.fr/modeles/icon-eu.php" target="_blank" rel="noopener"><strong>ICON-EU</strong><span>Tutta l'Europa, dettaglio 7 km</span></a></li>
        <li><a href="https://www.meteociel.fr/modeles/icon-d2-eps.php" target="_blank" rel="noopener"><strong>ICON-D2 EPS</strong><span>Insieme di scenari, per capire quanto è sicura la previsione</span></a></li>
      </ul>
    </section>'''


# ---------------- VOLI E NAVI ----------------
def pagina_mappa(tipo, titolo, sottotitolo, luoghi, nota, pulsante, fonti=None):
    pulsanti = "\n".join(
        f'            <button type="button" class="chip chip-luogo" data-lat="{la}" data-lon="{lo}" data-zoom="{z}">{n}</button>'
        for n, la, lo, z in luoghi)
    scelta_fonti = ""
    if fonti:
        scelta_fonti = '<div id="chip-fonti" class="chips chips-destra"><span class="muted piccolo etichetta-chips">Fonte</span>' + "".join(
            f'<button type="button" class="chip chip-fonte" data-fonte="{k}">{n}</button>' for k, n in fonti) + '</div>'
    return testa(titolo, sottotitolo, f'<a id="apri-esterno" class="pulsante" href="#" target="_blank" rel="noopener">{pulsante}</a>') + f'''
    <section class="blocco">
      <div class="blocco-testa">
        <div id="chip-luoghi" class="chips">
{pulsanti}
        </div>
        {scelta_fonti}
      </div>
      <iframe id="mappa-esterna" data-tipo="{tipo}" class="mappa mappa-alta" title="{titolo}" allowfullscreen></iframe>
      <p class="muted piccolo nota">{nota}</p>
    </section>'''


voli = pagina_mappa("voli", "Voli in tempo reale", "Gli aerei in volo, visti dai ricevitori radio della comunità ADSB.lol e airplanes.live.", [
    ("Italia", 42.0, 12.5, 6), ("Roma Fiumicino", 41.80, 12.25, 10), ("Milano Malpensa", 45.63, 8.72, 10),
    ("Napoli", 40.88, 14.29, 10), ("Venezia", 45.50, 12.35, 10), ("Europa", 48.0, 10.0, 4)],
    "Clicca un aereo per vedere volo, quota e velocità. Se la mappa non compare, prova l’altra fonte oppure apri Flightradar24.",
    "Apri su Flightradar24", [("adsblol", "ADSB.lol"), ("airplaneslive", "airplanes.live")])

navi = pagina_mappa("navi", "Navi in tempo reale", "Il traffico marittimo intorno all'Italia, con i dati AIS di VesselFinder e MarineTraffic.", [
    ("Italia", 41.0, 12.5, 5), ("Golfo di Napoli", 40.70, 14.20, 10), ("Stretto di Messina", 38.20, 15.60, 11),
    ("Genova", 44.35, 8.90, 10), ("Venezia", 45.35, 12.40, 10), ("Mediterraneo", 38.0, 15.0, 4)],
    "Tocca una nave per vederne nome, tipo e destinazione. Se la mappa non compare, prova l’altra fonte oppure apri MarineTraffic.",
    "Apri su MarineTraffic", [("vesselfinder", "VesselFinder"), ("marinetraffic", "MarineTraffic")])

PAGINE = [
  ("index.html", "Home", "Panoramica di mercati, titoli seguiti e meteo.", home),
  ("titoli.html", "I miei titoli", "Quotazioni e grafici dei titoli seguiti.", titoli),
  ("indici.html", "Indici di borsa", "Indici di borsa di Europa, Stati Uniti e Asia.", indici),
  ("crypto.html", "Criptovalute", "Prezzi delle principali criptovalute in euro.", crypto),
  ("valute.html", "Valute", "Cambi valute BCE e convertitore.", valute),
  ("notizie.html", "Notizie", "Le ultime notizie dal mondo, divise per zona.", notizie),
  ("meteo.html", "Meteo", "Meteo attuale, previsioni orarie e a 7 giorni, radar e carte dei modelli.", meteo),
  ("voli.html", "Voli", "Mappa degli aerei in volo in tempo reale.", voli),
  ("navi.html", "Navi", "Mappa del traffico marittimo in tempo reale.", navi),
]
for f, t, d, c in PAGINE:
    cielo = ""
    if f == "index.html":
        cielo = CIELO.replace("{strumenti}", "")
    elif f == "meteo.html":
        cielo = CIELO.replace("{strumenti}", RICERCA)
    (qui / f).write_text(pagina(f, t, d, c, cielo))
    print("creata", f)
