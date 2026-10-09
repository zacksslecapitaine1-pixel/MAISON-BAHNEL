import { useState, useEffect, useRef, useMemo } from "react";
import { CATS, SERVICE_BY_ID, servicesOf, TIMES, wa, money, PHONE, DEPOSIT_NOTE } from "./data.js";
import { clean, phoneOk } from "./utils.js";

const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const DOW = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
const MON = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
const STEPS = ["Soins", "Date", "Vos infos", "Confirmer"];

const roundTo500 = (n) => Math.round(n / 500) * 500;

export default function Booking({ open, preset, onClose }) {
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState("massages");
  const [sel, setSel] = useState([]);
  const [abo, setAbo] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const sheetRef = useRef(null);
  const bodyRef = useRef(null);
  const lastFocus = useRef(null);

  const days = useMemo(() => {
    const out = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 30; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d);
    }
    return out;
  }, [open]);

  // Initialisation à l'ouverture
  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    const ids = (preset || []).filter((id) => SERVICE_BY_ID[id]);
    setSel(ids);
    setCat(ids.length ? SERVICE_BY_ID[ids[0]].cat : "massages");
    setAbo(false);
    setStep(ids.length ? 2 : 1);
    setDate(""); setTime(""); setName(""); setPhone(""); setNote("");
    setTouched(false); setDone(false); setCopied(false);
    document.body.classList.add("lock");
    const t = setTimeout(() => sheetRef.current && sheetRef.current.focus(), 60);
    return () => {
      clearTimeout(t);
      document.body.classList.remove("lock");
      if (lastFocus.current && lastFocus.current.focus) try { lastFocus.current.focus(); } catch (e) {}
    };
  }, [open, preset]);

  // Échap + piège de focus
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = sheetRef.current.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex="0"]');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === sheetRef.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [step, done]);

  const items = sel.map((id) => SERVICE_BY_ID[id]).filter(Boolean);
  const useAbo = abo && items.some((i) => i.abo);
  const unit = (i) => (useAbo && i.abo ? i.abo : i.price);
  const total = items.reduce((a, i) => a + unit(i), 0);
  const hasFrom = items.some((i) => i.from);
  const canAbo = items.some((i) => i.abo);
  const dMin = roundTo500(total * 0.3), dMax = roundTo500(total * 0.5);

  const toggle = (id) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const now = new Date();
  const todayKey = keyOf(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const slotOff = (t) => {
    if (date !== todayKey) return false;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m < nowMin + 60;
  };
  const dateLabel = date
    ? new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(date + "T12:00:00"))
    : "";

  const nameClean = clean(name, 60), phoneClean = clean(phone, 25), noteClean = clean(note, 300);
  const lines = items.map((i) => `• ${i.name}${i.dur ? " (" + i.dur + ")" : ""} — ${i.from ? "à partir de " : ""}${money(unit(i))}${useAbo && i.abo ? " (tarif abonnement 10 séances)" : ""}`);
  const message = [
    "Bonjour Maison Bahnel,", "",
    "Je souhaite réserver :", ...lines, "",
    `Date : ${dateLabel}`, `Heure : ${time}`, "",
    `Nom : ${nameClean}`, `Téléphone : ${phoneClean}`,
    `Total estimé : ${hasFrom ? "à partir de " : ""}${money(total)}`,
    noteClean ? `Note : ${noteClean}` : null, "",
    "Je réglerai l'acompte pour confirmer mon rendez-vous. Merci !",
  ].filter((l) => l !== null).join("\n");

  const nameBad = touched && !nameClean;
  const phoneBad = touched && !phoneOk(phoneClean);
  const next = () => {
    if (step === 1 && sel.length) setStep(2);
    else if (step === 2 && date && time) setStep(3);
    else if (step === 3) {
      setTouched(true);
      if (nameClean && phoneOk(phoneClean)) setStep(4);
    }
  };
  const canNext = (step === 1 && sel.length > 0) || (step === 2 && date && time) || step === 3;

  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); } catch (e) { setCopied(false); }
  };

  const listed = servicesOf(cat);

  return (
    <div className={`modal ${open ? "op" : ""}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-hidden={!open}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="bk-title" tabIndex={-1} ref={sheetRef}>
        <div className="sh-head">
          <h2 id="bk-title">{done ? "Dernière étape !" : "Prendre rendez-vous"}</h2>
          <button className="sh-x" onClick={onClose} aria-label="Fermer la réservation">✕</button>
        </div>
        {!done && (
          <>
            <div className="prog" aria-hidden="true"><i style={{ width: `${(step / 4) * 100}%` }} /></div>
            <div className="sh-steps" aria-label={`Étape ${step} sur 4`}>
              {STEPS.map((s, i) => <span key={s} className={step === i + 1 ? "ac" : step > i + 1 ? "dn" : ""}>{step > i + 1 ? "✓ " : ""}{s}</span>)}
            </div>
          </>
        )}

        <div className="sh-body" ref={bodyRef}>
          {done ? (
            <div className="done">
              <div className="mark" aria-hidden="true">✦</div>
              <h3>Merci {nameClean.split(" ")[0]} !</h3>
              <p className="lead">WhatsApp s'est ouvert avec votre demande prête à envoyer. <strong>Appuyez sur « Envoyer »</strong> puis réglez l'acompte : votre créneau est confirmé dès sa réception.</p>
              <p className="lead">Rien ne s'est ouvert ? Copiez le message, puis écrivez-nous au <strong>{PHONE}</strong>.</p>
              <a className="btn btn--gold" href={wa(message)} target="_blank" rel="noopener noreferrer">Rouvrir WhatsApp</a>
              <button className="btn btn--line" onClick={copy}>{copied ? "✓ Message copié" : "Copier le message"}</button>
              <button className="btn btn--dark" onClick={onClose}>Fermer</button>
            </div>
          ) : step === 1 ? (
            <>
              <h3>Que souhaitez-vous ?</h3>
              <p className="lead">Choisissez un ou plusieurs soins. Vous pouvez les combiner dans la même visite.</p>
              <div className="cchips" role="group" aria-label="Catégories">
                {CATS.map((c) => {
                  const n = sel.filter((id) => SERVICE_BY_ID[id].cat === c.id).length;
                  return <button key={c.id} className="cchip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.tab}{n > 0 && <em>{n}</em>}</button>;
                })}
              </div>
              <div className="opts">
                {listed.map((s) => (
                  <button key={s.id} className="opt" aria-pressed={sel.includes(s.id)} onClick={() => toggle(s.id)}>
                    <span className="ck" aria-hidden="true">✓</span>
                    <span className="nm">{s.name}<small>{[s.dur, s.abo ? "abonnement " + money(s.abo) : ""].filter(Boolean).join(" · ")}</small></span>
                    <span className="pr">{s.from ? <small>dès</small> : null}{money(s.price)}</span>
                  </button>
                ))}
              </div>
            </>
          ) : step === 2 ? (
            <>
              <h3>Quand venir ?</h3>
              <p className="lead">Choisissez le jour puis l'heure qui vous arrange. Ouvert du lundi au samedi, 9h à 20h (dimanche sur demande).</p>
              <div className="days" role="group" aria-label="Jour">
                {days.map((d) => {
                  const k = keyOf(d);
                  return (
                    <button key={k} className="day" aria-pressed={date === k} onClick={() => { setDate(k); setTime(""); }}>
                      <small>{DOW[d.getDay()]}</small><b>{d.getDate()}</b><span>{MON[d.getMonth()]}</span>
                    </button>
                  );
                })}
              </div>
              {date ? (
                <div className="slots">
                  {[["Matin", (t) => t < "12:00"], ["Après-midi", (t) => t >= "12:00" && t < "17:00"], ["Fin de journée", (t) => t >= "17:00"]].map(([label, f]) => (
                    <div key={label}>
                      <h4>{label}</h4>
                      <div className="slotg">
                        {TIMES.filter(f).map((t) => <button key={t} className="slot" disabled={slotOff(t)} aria-pressed={time === t} onClick={() => setTime(t)}>{t}</button>)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className="lead">⬆ Sélectionnez d'abord un jour.</p>}
            </>
          ) : step === 3 ? (
            <>
              <h3>Vos coordonnées</h3>
              <p className="lead">Pour vous confirmer le rendez-vous sur WhatsApp.</p>
              <div className={`fld ${nameBad ? "bad" : ""}`}>
                <label htmlFor="bk-n">Prénom et nom *</label>
                <input id="bk-n" type="text" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Ex. Amina Koffi" aria-invalid={nameBad} />
                {nameBad && <p className="err">Indiquez votre nom.</p>}
              </div>
              <div className={`fld ${phoneBad ? "bad" : ""}`}>
                <label htmlFor="bk-p">Téléphone / WhatsApp *</label>
                <input id="bk-p" type="tel" inputMode="tel" value={phone} maxLength={25} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="+228 90 00 00 00" aria-invalid={phoneBad} />
                {phoneBad && <p className="err">Entrez un numéro valide (8 à 15 chiffres).</p>}
              </div>
              <div className="fld">
                <label htmlFor="bk-no">Un souhait particulier ? (facultatif)</label>
                <textarea id="bk-no" value={note} maxLength={300} onChange={(e) => setNote(e.target.value)} placeholder="Allergies, grossesse, occasion spéciale…" />
              </div>
            </>
          ) : (
            <>
              <h3>Tout est bon ?</h3>
              <p className="lead">Vérifiez votre demande avant l'envoi.</p>
              <div className="recap">
                {items.map((i) => <div key={i.id}><span>{i.name}</span><span>{i.from ? "dès " : ""}{money(unit(i))}</span></div>)}
                <div><span>Date</span><span>{dateLabel}</span></div>
                <div><span>Heure</span><span>{time}</span></div>
                <div><span>Nom</span><span>{nameClean}</span></div>
                <div><span>Téléphone</span><span>{phoneClean}</span></div>
                <div className="tot"><span>Total{hasFrom ? " estimé" : ""}</span><span>{hasFrom ? "dès " : ""}{money(total)}</span></div>
              </div>
              <div className="note"><span className="ic" aria-hidden="true">✦</span><span>{DEPOSIT_NOTE} {useAbo ? "Le montant exact vous sera précisé sur WhatsApp." : <>Soit environ <b>{money(dMin)}</b> à <b>{money(dMax)}</b> pour votre sélection.</>}</span></div>
            </>
          )}
        </div>

        {!done && (
          <div className="sh-foot">
            {step <= 3 && items.length > 0 && (
              <>
                {step === 1 && canAbo && (
                  <label className="aboT"><input type="checkbox" checked={abo} onChange={(e) => setAbo(e.target.checked)} /><span>Tarif abonnement 10 séances<small>Appliqué aux soins qui le proposent</small></span></label>
                )}
                <div className="sh-sum"><span>{items.length} soin{items.length > 1 ? "s" : ""} · estimation</span><b>{hasFrom ? "dès " : ""}{money(total)}</b></div>
              </>
            )}
            <div className="sh-nav">
              {step > 1 && <button className="btn btn--back" onClick={() => setStep(step - 1)}>← Retour</button>}
              {step < 4 ? (
                <button className="btn btn--gold" disabled={!canNext} onClick={next}>{step === 3 ? "Vérifier" : "Continuer"} →</button>
              ) : (
                <a className="btn btn--gold" href={wa(message)} target="_blank" rel="noopener noreferrer" onClick={() => setTimeout(() => setDone(true), 400)}>Envoyer sur WhatsApp</a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
