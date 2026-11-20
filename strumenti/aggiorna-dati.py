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
    os.makedirs(os.path.dirname(uscita) or ".", exist_ok=True)
    with open(uscita, "w") as f:
        json.dump(dati, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Salvati {riusciti} simboli in {uscita}")


if __name__ == "__main__":
    main()
