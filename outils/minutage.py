"""Minutage mot à mot d'une voix montée, en local avec Whisper (rien ne quitte l'ordinateur).

Lancé par `npm run minutage -- <film>` (outils/minutage.mjs). Écrit le fichier
minutage.json du film : la durée, chaque mot avec son début et sa fin, et les
silences de plus de 0,4 s (chacun deviendra un plan avec son action muette).

Fonctionne avec l'un ou l'autre de ces paquets :
  - openai-whisper  (pip install -U openai-whisper)   plus lourd à installer ;
  - faster-whisper  (pip install -U faster-whisper)   plus léger, plus rapide sur processeur.
"""
import argparse
import json
import math
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

ECHANTILLONS = 16000  # Whisper travaille en 16 kHz mono
TRANCHE = 160  # 10 ms


def transcrire(audio_path, modele, langue, indice):
    """Renvoie (mots, audio 16 kHz) avec openai-whisper, sinon faster-whisper."""
    try:
        import whisper  # openai-whisper

        model = whisper.load_model(modele)
        res = model.transcribe(
            audio_path,
            language=langue,
            word_timestamps=True,
            initial_prompt=indice or None,
            condition_on_previous_text=False,
            fp16=False,
        )
        mots = [
            {"mot": w["word"].strip(), "debut": float(w["start"]), "fin": float(w["end"]), "p": float(w.get("probability", 1))}
            for seg in res["segments"]
            for w in seg.get("words", [])
            if w["word"].strip()
        ]
        return mots, whisper.load_audio(audio_path), "openai-whisper"
    except ImportError:
        pass
    try:
        from faster_whisper import WhisperModel
        from faster_whisper.audio import decode_audio
    except ImportError:
        print("✖ Whisper n'est pas installé. Demandez à Claude Code : « Installe faster-whisper pour le minutage ».", file=sys.stderr)
        sys.exit(2)
    model = WhisperModel(modele, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(
        audio_path, language=langue, word_timestamps=True, initial_prompt=indice or None, condition_on_previous_text=False
    )
    mots = [
        {"mot": w.word.strip(), "debut": float(w.start), "fin": float(w.end), "p": float(w.probability)}
        for s in segments
        for w in (s.words or [])
        if w.word.strip()
    ]
    return mots, decode_audio(audio_path, sampling_rate=ECHANTILLONS), "faster-whisper"


def fusionner_elisions(mots):
    """Recolle les élisions que Whisper sépare (« s 'affiche » → « s'affiche », « aujourd 'hui »)."""
    resultat = []
    for m in mots:
        if resultat and (m["mot"][:1] in "'’" or resultat[-1]["mot"][-1:] in "'’"):
            precedent = resultat[-1]
            precedent["mot"] += m["mot"]
            precedent["fin"] = m["fin"]
            precedent["p"] = min(precedent["p"], m["p"])
        else:
            resultat.append(dict(m))
    return resultat


def energie_db(audio):
    """Niveau (dBFS) de chaque tranche de 10 ms."""
    niveaux = []
    for i in range(0, len(audio) - TRANCHE, TRANCHE):
        bloc = audio[i : i + TRANCHE]
        rms = math.sqrt(float((bloc * bloc).mean()) + 1e-12)
        niveaux.append(20 * math.log10(rms + 1e-9))
    return niveaux


def recaler(mots, niveaux, seuil=-40.0, fenetre=0.3):
    """Recale le premier mot de chaque phrase sur le vrai début du son (Whisper dérive de quelques centièmes)."""
    recales = 0
    for i, m in enumerate(mots):
        debut_de_phrase = i == 0 or m["debut"] - mots[i - 1]["fin"] > 0.25
        if not debut_de_phrase:
            continue
        a = max(0, int((m["debut"] - fenetre) * 100))
        b = min(len(niveaux), int((m["debut"] + fenetre) * 100))
        if i > 0:
            a = max(a, int(mots[i - 1]["fin"] * 100) + 1)
        for k in range(a, b):
            if niveaux[k] > seuil:
                nouveau = k / 100
                if nouveau < m["fin"] - 0.05 and abs(nouveau - m["debut"]) > 0.02:
                    m["debut"] = nouveau
                    recales += 1
                break
    return recales


def main():
    p = argparse.ArgumentParser(description="Minutage mot à mot (Whisper local)")
    p.add_argument("audio")
    p.add_argument("--sortie", required=True)
    p.add_argument("--modele", default="small")
    p.add_argument("--langue", default="fr")
    p.add_argument("--indice", default="", help="texte du script, pour aider l'orthographe")
    args = p.parse_args()

    print(f"Transcription de {Path(args.audio).name} (modèle {args.modele}, langue {args.langue})… cela peut prendre une à deux minutes.")
    mots, audio, moteur = transcrire(args.audio, args.modele, args.langue, args.indice)
    mots = fusionner_elisions(mots)
    if not mots:
        print("✖ Aucun mot reconnu : la voix est-elle audible ?", file=sys.stderr)
        sys.exit(3)
    niveaux = energie_db(audio)
    recales = recaler(mots, niveaux)
    duree = len(audio) / ECHANTILLONS

    silences = []
    if mots[0]["debut"] > 0.4:
        silences.append({"debut": 0.0, "fin": mots[0]["debut"]})
    for a, b in zip(mots, mots[1:]):
        if b["debut"] - a["fin"] > 0.4:
            silences.append({"debut": a["fin"], "fin": b["debut"]})
    if duree - mots[-1]["fin"] > 0.4:
        silences.append({"debut": mots[-1]["fin"], "fin": duree})

    r3 = lambda x: round(x, 3)
    sortie = {
        "duree": r3(duree),
        "source": Path(args.audio).name,
        "moteur": f"{moteur} ({args.modele})",
        "mots": [{"mot": m["mot"], "debut": r3(m["debut"]), "fin": r3(m["fin"])} for m in mots],
        "silences": [{"debut": r3(s["debut"]), "fin": r3(s["fin"])} for s in silences],
    }
    Path(args.sortie).write_text(json.dumps(sortie, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"\n✔ {len(mots)} mots minutés, durée {duree:.2f} s ({recales} débuts de phrase recalés sur le son réel)")
    print("\nSilences de plus de 0,4 s — chacun devient un plan avec son action muette :")
    for s in silences:
        print(f"  {s['debut']:6.2f} → {s['fin']:6.2f} s  ({s['fin'] - s['debut']:.2f} s)")
    doutes = [m for m in mots if m["p"] < 0.5]
    if doutes:
        print("\nMots à vérifier (reconnaissance incertaine) :")
        for m in doutes:
            print(f"  « {m['mot']} » à {m['debut']:.2f} s")
    print(f"\nÉcrit : {args.sortie}")


if __name__ == "__main__":
    main()
