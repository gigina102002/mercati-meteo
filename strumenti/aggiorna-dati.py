"""Scarica i prezzi di borsa da Yahoo Finance e li salva in un file JSON.

Lo esegue GitHub Actions (vedi .github/workflows/dati.yml): il sito poi legge
il file dal ramo "dati" del repository. Uso:  python3 strumenti/aggiorna-dati.py USCITA.json

Per aggiungere un titolo: aggiungi una riga qui sotto (simbolo Yahoo, nome)
e la stessa voce in I_MIEI_TITOLI dentro app.js.
"""
import json, os, sys, time, datetime

TITOLI = [
    ("ENEL.MI", "Enel"),
    ("ISP.MI", "Intesa Sanpaolo"),
    ("HER.MI", "Hera"),
    ("VWCE.DE", "Vanguard FTSE All-World"),
    # crypto: il sito usa Binance in tempo reale, questi servono solo di riserva
    ("BTC-USD", "Bitcoin"),
    ("ETH-BTC", "Ethereum / Bitcoin"),
    ("XLM-USD", "Stellar"),
]
INDICI = [
    ("FTSEMIB.MI", "FTSE MIB"), ("^STOXX50E", "Euro Stoxx 50"), ("^GDAXI", "DAX"),
    ("^FCHI", "CAC 40"), ("^FTSE", "FTSE 100"), ("^GSPC", "S&P 500"), ("^NDX", "Nasdaq 100"),
    ("^DJI", "Dow Jones"), ("^N225", "Nikkei 225"), ("^HSI", "Hang Seng"),
    ("000001.SS", "Shanghai Composite"), ("^BSESN", "Sensex"),
]
import yfinance as yf   # installata dall'automazione (vedi .github/workflows/dati.yml)


def numero(v):
    try:
        v = float(v)
        return None if v != v else v   # scarta i "NaN"
    except (TypeError, ValueError):
        return None


def leggi(simbolo, nome):
    t = yf.Ticker(simbolo)
    storico_df = t.history(period="3mo", interval="1d", auto_adjust=False)
    if storico_df.empty:
        raise ValueError("nessun dato")
    storico = [round(v, 6) for v in storico_df["Close"].dropna().tolist()]
    oggi_df = t.history(period="1d", interval="5m", auto_adjust=False)
    oggi = [round(v, 6) for v in oggi_df["Close"].dropna().tolist()] if not oggi_df.empty else []
    info = t.fast_info
    prezzo = numero(getattr(info, "last_price", None)) or storico[-1]
    ultimo = (oggi_df if not oggi_df.empty else storico_df).index[-1]
    # chiusura precedente: dallo storico giornaliero (più affidabile di fast_info)
    chiusure_df = storico_df["Close"].dropna()
    if chiusure_df.index[-1].date() == ultimo.date():
        prec = float(chiusure_df.iloc[-2]) if len(chiusure_df) > 1 else None
    else:
        prec = float(chiusure_df.iloc[-1])
    return {
        "simbolo": simbolo, "nome": nome, "valuta": getattr(info, "currency", None),
        "prezzo": prezzo, "chiusura_prec": prec,
        "var": (prezzo - prec) if prec else None,
        "var_pct": ((prezzo / prec - 1) * 100) if prec else None,
        "ora": int(ultimo.timestamp()),
        "oggi": oggi, "storico": storico,
    }


# =========================================================
# NOTIZIE: solo titoli e link degli articoli (da Google News), mai il testo
# =========================================================
import urllib.request, urllib.parse, xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime

# parole che indicano notizie fuori tema (es. la missione spaziale Hera)
ESCLUDI = {"hera": ("asteroide", "didymos", "dimorphos", "sonda", "esa ", "spazial", "dart")}
INVISIBILI = dict.fromkeys(map(ord, "\u200b\u200c\u200d\u200e\u200f\u2060\u2061\u2062\u2063\u2064\ufeff"), None)

ARGOMENTI_NOTIZIE = [
    # intitle: = la parola deve stare nel titolo dell'articolo (notizie più pertinenti)
    ("mercati", "Mercati", "intitle:\"Piazza Affari\" OR intitle:\"Ftse Mib\" OR intitle:\"Borsa di Milano\""),
    ("enel", "Enel", "intitle:Enel"),
    ("intesa", "Intesa Sanpaolo", "intitle:\"Intesa Sanpaolo\""),
    ("hera", "Hera", "\"Gruppo Hera\" OR \"Hera spa\" OR \"Hera Comm\" OR (Hera multiutility) -asteroide -Didymos -sonda -ESA"),
    ("crypto", "Crypto", "intitle:Bitcoin OR intitle:criptovalute"),
]


def notizie():
    uscita = {"aggiornato": adesso(), "argomenti": []}
    for chiave, nome, ricerca in ARGOMENTI_NOTIZIE:
        url = "https://news.google.com/rss/search?" + urllib.parse.urlencode(
            {"q": ricerca + " when:3d", "hl": "it", "gl": "IT", "ceid": "IT:it"})
        voci = []
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as r:
                radice = ET.fromstring(r.read())
            for item in radice.iter("item"):
                titolo = (item.findtext("title") or "").translate(INVISIBILI).strip()
                if any(parola in titolo.lower() for parola in ESCLUDI.get(chiave, ())):
                    continue
                fonte = (item.findtext("source") or "").strip()
                if fonte and titolo.endswith(" - " + fonte):
                    titolo = titolo[: -len(" - " + fonte)]
                try:
                    data = parsedate_to_datetime(item.findtext("pubDate")).isoformat()
                except Exception:
                    data = None
                voci.append({"titolo": titolo, "fonte": fonte, "link": item.findtext("link"), "data": data})
        except Exception as e:
            print(f"Notizie {nome}: {e}", file=sys.stderr)
        voci.sort(key=lambda v: v["data"] or "", reverse=True)
        uscita["argomenti"].append({"chiave": chiave, "nome": nome, "notizie": voci[:8]})
        time.sleep(0.5)
    return uscita


# =========================================================
# DIVIDENDI E APPUNTAMENTI (Yahoo)
# =========================================================
def data_iso(v):
    if v is None:
        return None
    if isinstance(v, (list, tuple)):
        v = v[0] if v else None
        if v is None:
            return None
    try:
        return v.isoformat()[:10]
    except AttributeError:
        return str(v)[:10]


def calendario(prezzi):
    uscita = {"aggiornato": adesso(), "titoli": {}}
    for simbolo, nome in TITOLI:
        if "-" in simbolo:          # le crypto non hanno dividendi
            continue
        voce = {"nome": nome, "dividendi": [], "rendimento_12m": None,
                "prossimo_stacco": None, "pagamento": None, "prossimi_conti": None}
        try:
            t = yf.Ticker(simbolo)
            div = t.dividends
            if div is not None and len(div):
                voce["dividendi"] = [{"data": d.date().isoformat(), "importo": round(float(v), 4)}
                                     for d, v in div.tail(6).items()][::-1]
                # dividendi staccati negli ultimi 365 giorni (contando da oggi)
                limite = datetime.datetime.now(div.index.tz) - datetime.timedelta(days=365)
                ultimi = div[div.index > limite]
                prezzo = (prezzi.get(simbolo) or {}).get("prezzo")
                if prezzo:
                    voce["rendimento_12m"] = round(float(ultimi.sum()) / prezzo * 100, 2)
            try:
                cal = t.calendar or {}
            except Exception:
                cal = {}
            if isinstance(cal, dict):
                voce["prossimo_stacco"] = data_iso(cal.get("Ex-Dividend Date"))
                voce["pagamento"] = data_iso(cal.get("Dividend Date"))
                voce["prossimi_conti"] = data_iso(cal.get("Earnings Date"))
        except Exception as e:
            print(f"Calendario {simbolo}: {e}", file=sys.stderr)
        uscita["titoli"][simbolo] = voce
        time.sleep(0.4)
    return uscita


# =========================================================
# AVVISI: titoli che si muovono molto e meteo forte previsto
# Ogni avviso nuovo diventa una "issue" su GitHub, che ti arriva per email.
# =========================================================
SOGLIA_TITOLI = 3.0                       # variazione in % (in su o in giù) per azioni ed ETF
SOGLIA_CRYPTO = 5.0                       # le crypto si muovono di più: soglia più alta
CITTA_METEO = ("Roma", 41.89, 12.51)
SOGLIE_METEO = {"pioggia_mm": 30, "raffiche_kmh": 70}


def avvisi(prezzi):
    elenco = []
    oggi = datetime.date.today()
    for simbolo, d in prezzi.items():
        v = d.get("var_pct")
        soglia = SOGLIA_CRYPTO if "-" in simbolo else SOGLIA_TITOLI
        if v is not None and abs(v) >= soglia:
            segno = "+" if v > 0 else "−"
            elenco.append({"tipo": "titolo", "chiave": f"{simbolo}-{oggi}",
                           "titolo": f"{d['nome']} {segno}{it(abs(v), 1)}% oggi",
                           "testo": f"{d['nome']} è a {prezzo_it(d['prezzo'])} ({segno}{it(abs(v))}% rispetto alla chiusura precedente)."})
    nome, lat, lon = CITTA_METEO
    try:
        url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
               "&daily=weather_code,precipitation_sum,wind_gusts_10m_max&timezone=Europe%2FRome&forecast_days=2")
        with urllib.request.urlopen(url, timeout=20) as r:
            m = json.load(r)["daily"]
        for i, giorno in enumerate(m["time"]):
            quando = "oggi" if i == 0 else "domani"
            motivi = []
            if m["weather_code"][i] >= 95:
                motivi.append("temporali")
            if (m["precipitation_sum"][i] or 0) >= SOGLIE_METEO["pioggia_mm"]:
                motivi.append(f"pioggia forte ({m['precipitation_sum'][i]:.0f} mm)")
            if (m["wind_gusts_10m_max"][i] or 0) >= SOGLIE_METEO["raffiche_kmh"]:
                motivi.append(f"raffiche fino a {m['wind_gusts_10m_max'][i]:.0f} km/h")
            if motivi:
                elenco.append({"tipo": "meteo", "chiave": f"meteo-{giorno}",
                               "titolo": f"Meteo {nome} {quando}: " + ", ".join(motivi),
                               "testo": f"Previsione per {nome} del {giorno}: " + ", ".join(motivi)
                                        + ". È una stima del modello meteo, non un'allerta ufficiale della Protezione Civile."})
    except Exception as e:
        print(f"Avvisi meteo: {e}", file=sys.stderr)
    return {"aggiornato": adesso(), "avvisi": elenco}


def apri_issue(avviso):
    """Crea una issue su GitHub per un avviso nuovo (una sola volta al giorno per avviso)."""
    token, repo = os.environ.get("GITHUB_TOKEN"), os.environ.get("GITHUB_REPOSITORY")
    if not token or not repo:
        return
    intestazioni = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json",
                    "User-Agent": "mercati-meteo"}
    chiave = f"<!-- avviso:{avviso['chiave']} -->"
    oggi = datetime.date.today().isoformat()
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/issues?state=all&per_page=100&since={oggi}T00:00:00Z",
        headers=intestazioni)
    with urllib.request.urlopen(req, timeout=20) as r:
        esistenti = json.load(r)
    if any(chiave in (i.get("body") or "") for i in esistenti):
        return
    corpo = (f"{avviso['testo']}\n\nApri il sito: https://{repo.split('/')[0]}.github.io/{repo.split('/')[1]}/\n\n"
             f"Puoi chiudere questa segnalazione quando l'hai letta.\n{chiave}")
    dati = json.dumps({"title": "Avviso: " + avviso["titolo"], "body": corpo}).encode()
    req = urllib.request.Request(f"https://api.github.com/repos/{repo}/issues", data=dati,
                                 headers=intestazioni, method="POST")
    urllib.request.urlopen(req, timeout=20).close()
    print("Aperta segnalazione:", avviso["titolo"])


def it(v, decimali=2):
    """Numero all'italiana: virgola per i decimali."""
    return f"{v:.{decimali}f}".replace(".", ",")


def prezzo_it(v):
    """Prezzo leggibile: 58.596 / 159,34 / 5,901 / 0,02772"""
    decimali = 0 if v >= 1000 else 2 if v >= 100 else 3 if v >= 1 else 5
    testo = f"{v:,.{decimali}f}"
    return testo.replace(",", "X").replace(".", ",").replace("X", ".")


def adesso():
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")


def salva(percorso, dati):
    os.makedirs(os.path.dirname(percorso) or ".", exist_ok=True)
    with open(percorso, "w") as f:
        json.dump(dati, f, ensure_ascii=False, separators=(",", ":"))


def main():
    uscita = sys.argv[1] if len(sys.argv) > 1 else "titoli.json"
    cartella = os.path.dirname(uscita) or "."
    dati = {"aggiornato": adesso(), "titoli": {}, "indici": {}}
    riusciti = 0
    for gruppo, elenco in (("titoli", TITOLI), ("indici", INDICI)):
        for simbolo, nome in elenco:
            try:
                dati[gruppo][simbolo] = leggi(simbolo, nome)
                riusciti += 1
            except Exception as e:
                print(f"Non riesco a leggere {simbolo}: {e}", file=sys.stderr)
            time.sleep(0.4)
    if riusciti == 0:
        sys.exit("Nessun dato scaricato: lascio invariato il file pubblicato.")
    salva(uscita, dati)
    print(f"Salvati {riusciti} simboli in {uscita}")

    # le parti seguenti sono facoltative: se una non riesce, le altre vanno avanti
    for nome_file, funzione in (("notizie.json", notizie),
                                ("calendario.json", lambda: calendario(dati["titoli"])),
                                ("avvisi.json", lambda: avvisi(dati["titoli"]))):
        try:
            contenuto = funzione()
            salva(os.path.join(cartella, nome_file), contenuto)
            print("Salvato", nome_file)
        except Exception as e:
            print(f"{nome_file} non aggiornato: {e}", file=sys.stderr)
    try:
        with open(os.path.join(cartella, "avvisi.json")) as f:
            for avviso in json.load(f)["avvisi"]:
                apri_issue(avviso)
    except Exception as e:
        print(f"Segnalazioni non create: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
