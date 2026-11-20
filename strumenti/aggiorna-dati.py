"""Scarica i prezzi di borsa da Yahoo Finance e li salva in un file JSON.

Lo esegue GitHub Actions (vedi .github/workflows/dati.yml): il sito poi legge
il file dal ramo "dati" del repository. Uso:  python3 strumenti/aggiorna-dati.py USCITA.json

Per aggiungere un titolo: aggiungi una riga qui sotto (simbolo Yahoo, nome)
e la stessa voce in I_MIEI_TITOLI dentro app.js.
"""
import json, sys, time, urllib.request, urllib.parse, datetime

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
HOSTS = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"]
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"


def scarica(simbolo, intervallo, periodo):
    errore = None
    for host in HOSTS:
        url = f"https://{host}/v8/finance/chart/{urllib.parse.quote(simbolo)}?interval={intervallo}&range={periodo}"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.load(r)["chart"]["result"][0]
        except Exception as e:  # prova l'altro server
            errore = e
            time.sleep(1)
    raise errore


def chiusure(risultato):
    valori = risultato.get("indicators", {}).get("quote", [{}])[0].get("close") or []
    return [round(v, 6) for v in valori if v is not None]


def leggi(simbolo, nome):
    oggi = scarica(simbolo, "5m", "1d")
    meta = oggi["meta"]
    prezzo = meta.get("regularMarketPrice")
    prec = meta.get("previousClose") or meta.get("chartPreviousClose")
    storico = chiusure(scarica(simbolo, "1d", "3mo"))
    return {
        "simbolo": simbolo, "nome": nome, "valuta": meta.get("currency"),
        "prezzo": prezzo, "chiusura_prec": prec,
        "var": (prezzo - prec) if prezzo is not None and prec else None,
        "var_pct": ((prezzo / prec - 1) * 100) if prezzo is not None and prec else None,
        "ora": meta.get("regularMarketTime"),
        "oggi": chiusure(oggi), "storico": storico,
    }


def main():
    uscita = sys.argv[1] if len(sys.argv) > 1 else "titoli.json"
    dati = {"aggiornato": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
            "titoli": {}, "indici": {}}
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
    import os
    os.makedirs(os.path.dirname(uscita) or ".", exist_ok=True)
    with open(uscita, "w") as f:
        json.dump(dati, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Salvati {riusciti} simboli in {uscita}")


if __name__ == "__main__":
    main()
