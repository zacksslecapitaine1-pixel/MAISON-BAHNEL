import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import {
  CATS, SERVICES, SERVICE_BY_ID, servicesOf, minPrice, POPULAR, FORMATIONS, LIFTING,
  IMG, unsplash, money, wa, PHONE, SOCIAL, HOURS, DEPOSIT_NOTE,
} from "./data.js";
import { clean, phoneOk } from "./utils.js";

const Booking = lazy(() => import("./Booking.jsx"));

/* ───────────── Icônes ───────────── */
const WaIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
);
const IgIcon = () => (
  <svg className="stroke" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4.2" /><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" /></svg>
);
const TtIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
);

/* ───────────── Utilitaires ───────────── */
const imgFallback = (e) => { e.currentTarget.style.visibility = "hidden"; };

const Img = ({ id, alt, w = 800, sizes = "(max-width:700px) 100vw, 50vw", eager = false, className, ...rest }) => (
  <img
    src={unsplash(id, w)}
    srcSet={[400, 800, 1200, 1600].map((x) => `${unsplash(id, x)} ${x}w`).join(", ")}
    sizes={sizes}
    alt={alt}
    className={className}
    loading={eager ? "eager" : "lazy"}
    decoding="async"
    fetchpriority={eager ? "high" : undefined}
    onError={imgFallback}
    {...rest}
  />
);

const PAGES = [
  ["services", "Services"], ["academie", "Académie"], ["univers", "Mon Univers"], ["experience", "Expérience"], ["contact", "Contact"],
];
const PAGE_IDS = ["accueil", ...PAGES.map((p) => p[0])];
const LEGACY = { massages: "massages", rituels: "rituels", beaute: "onglerie" };
const TITLES = {
  accueil: "Maison Bahnel — Spa · Beauté · Bien-être | Lomé, Togo",
  services: "Services & tarifs — Maison Bahnel, spa à Lomé",
  academie: "L'Académie — Formations beauté et bien-être | Maison Bahnel",
  univers: "Mon Univers — L'histoire de Maison Bahnel",
  experience: "L'Expérience Maison Bahnel — Spa à Lomé",
  contact: "Contact & réservation — Maison Bahnel, Lomé",
};
const DESCS = {
  accueil: "Maison Bahnel, sanctuaire de beauté et de bien-être à Lomé : massages, rituels, lifting coréen, soins du visage, épilation et onglerie. Réservez en ligne.",
  services: "Tous les soins et tarifs de Maison Bahnel à Lomé : préludes hammam, rituels signatures, lifting coréen, massages, soins du visage, épilation, onglerie.",
  academie: "Formations professionnelles en massage, esthétique et prothésie ongulaire à Lomé avec l'Académie Maison Bahnel.",
  univers: "L'histoire de la fondatrice et la vision holistique de Maison Bahnel, spa et institut de beauté à Lomé.",
  experience: "Senteurs, ambiance, accueil : découvrez l'expérience sensorielle Maison Bahnel à Lomé.",
  contact: "Contactez Maison Bahnel à Lomé : WhatsApp, horaires, réseaux sociaux et prise de rendez-vous.",
};

function parseHash() {
  let h = "";
  try { h = decodeURIComponent((window.location.hash || "").replace(/^#\/?/, "")); } catch (e) { h = ""; }
  const [a = "", b = ""] = h.split("/");
  if (PAGE_IDS.includes(a)) return { page: a, sub: b };
  if (LEGACY[a]) return { page: "services", sub: LEGACY[a] };
  return { page: "accueil", sub: "" };
}
function useRoute() {
  const [r, setR] = useState(parseHash);
  useEffect(() => {
    const f = () => setR(parseHash());
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  return r;
}

/* ───────────── Particules dorées (canvas 2D léger) ───────────── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const N = window.innerWidth < 700 ? 20 : 42;
    let w = 0, h = 0, P = [], raf = 0, visible = true, tab = true;
    const size = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const init = () => {
      P = Array.from({ length: N }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + 0.7, s: Math.random() * 0.25 + 0.08, a: Math.random() * 0.5 + 0.3, d: Math.random() * 6.28 }));
    };
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#EBD08F";
      for (const p of P) {
        p.y -= p.s; p.d += 0.004; p.x += Math.sin(p.d) * 0.25;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const run = visible && tab;
      if (run && !raf) raf = requestAnimationFrame(loop);
      if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    };
    size(); init();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); });
    io.observe(c);
    const onVis = () => { tab = !document.hidden; sync(); };
    let rt;
    const onResize = () => { clearTimeout(rt); rt = setTimeout(() => { size(); init(); }, 200); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", onResize, { passive: true });
    sync();
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(rt); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}

/* ───────────── Briques ───────────── */
function PageHead({ img, eye, children, sub }) {
  return (
    <header className="ph">
      <Img id={img} alt="" w={1200} sizes="100vw" eager />
      <div className="wrap">
        <p className="eyebrow">{eye}</p>
        <h1>{children}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </header>
  );
}

function Price({ s }) {
  return (
    <div className="price">
      {s.from && <small>à partir de</small>}
      {s.regular && <span className="was">{money(s.regular)}</span>}
      <b>{money(s.price)}</b>
      {s.abo && <span className="abo">Abonnement 10 séances : {money(s.abo)} / séance</span>}
    </div>
  );
}

function SvcCard({ s, book }) {
  return (
    <article className="card rev">
      {s.img && <div className="card-img"><Img id={s.img} alt={s.name} w={800} sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 380px" /></div>}
      <div className="card-body">
        {s.dur && <span className="tag">{s.dur}</span>}
        <h3>{s.name}</h3>
        {s.sub && <p className="card-sub">{s.sub}</p>}
        <p>{s.desc}</p>
        {s.result && <p className="result"><strong>Résultat :</strong> {s.result}</p>}
        {s.includes && (<><p style={{ marginTop: ".9rem", fontWeight: 600, color: "var(--tx)" }}>La cure comprend :</p><ul className="checks">{s.includes.map((x) => <li key={x}>{x}</li>)}</ul></>)}
      </div>
      <div className="card-foot">
        <Price s={s} />
        <button className="btn btn--gold btn--sm" onClick={() => book([s.id])}>Réserver</button>
      </div>
    </article>
  );
}

function Social({ dark }) {
  return (
    <div className="social">
      <a className="sbtn" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"><IgIcon /> Instagram</a>
      <a className="sbtn" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer"><TtIcon /> TikTok</a>
    </div>
  );
}

/* ───────────── Accueil ───────────── */
function Home({ book }) {
  return (
    <>
      <section className="hero">
        <Img id={IMG.hero} alt="" w={1200} sizes="100vw" eager className="hero-bg" />
        <Particles />
        <div className="hero-ct">
          <p className="eyebrow">Lomé, Togo · Sanctuaire de bien-être</p>
          <h1>Maison <em>Bahnel</em></h1>
          <p className="hero-sub"><span>Spa</span><span>·</span><span>Beauté</span><span>·</span><span>Bien-être</span></p>
          <p className="hero-tag">Un sanctuaire de beauté, de bien-être et de transformation.</p>
          <div className="hero-btns">
            <button className="btn btn--gold" onClick={() => book([])}>Réserver maintenant</button>
            <a className="btn btn--line" href="#/services">Découvrir nos soins</a>
          </div>
          <div className="hero-facts"><span className="chip">Lun – Sam · 9h – 20h</span><span className="chip">Réservation sur WhatsApp</span></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="shd rev"><p className="eyebrow">Nos univers</p><h2>Une carte de soins <em>pensée pour vous</em></h2><p>Du hammam traditionnel au lifting coréen, trouvez le soin qui vous ressemble.</p></div>
          <div className="cats">
            {CATS.map((c) => (
              <a key={c.id} className="cat rev" href={`#/services/${c.id}`}>
                <span className="cat-ic" aria-hidden="true">{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.intro.split(". ")[0].replace(/\.$/, "")}.</p>
                <span className="cat-from">À partir de {money(minPrice(c.id))}</span>
                <span className="cat-go">Découvrir →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--alt lazy-sec">
        <div className="wrap split">
          <div className="rev">
            <p className="eyebrow">Notre maison</p>
            <h2>L'art du soin, du toucher et de la <em>féminité</em></h2>
            <p style={{ fontSize: "1.15rem" }}>Maison Bahnel est née d'une conviction profonde : dans un monde où tout va trop vite, le soin doit redevenir un moment de reconnexion, de douceur et de présence à soi.</p>
            <p style={{ fontSize: "1.15rem" }}>Ici, chaque geste est pensé, chaque détail est choisi, et chaque soin est conçu comme une expérience globale où le corps et l'esprit se retrouvent.</p>
            <div className="pillars">
              {[["Authenticité", "Soins pensés avec sincérité"], ["Excellence", "Exigence dans chaque détail"], ["Bien-être", "Approche holistique du corps"]].map(([t, s]) => <div key={t} className="pillar"><b>{t}</b><span>{s}</span></div>)}
            </div>
            <a className="btn btn--line" href="#/univers" style={{ marginTop: "2rem" }}>Notre histoire</a>
          </div>
          <div className="split-img rev">
            <Img id={IMG.ambiance} alt="Ambiance apaisante de Maison Bahnel" w={800} />
            <div className="badge"><b>100%</b><span>Holistique</span></div>
          </div>
        </div>
      </section>

      <section className="sec lazy-sec">
        <div className="wrap">
          <div className="shd rev"><p className="eyebrow">Nos incontournables</p><h2>Les soins <em>les plus demandés</em></h2></div>
          <div className="cards">{POPULAR.map((id) => <SvcCard key={id} s={SERVICE_BY_ID[id]} book={book} />)}</div>
          <p className="center" style={{ marginTop: "2.4rem" }}><a className="btn btn--line" href="#/services">Voir tous les services et tarifs</a></p>
        </div>
      </section>

      <section className="sec dark lazy-sec">
        <div className="wrap">
          <div className="shd rev"><p className="eyebrow">Réserver est simple</p><h2>Trois étapes, <em>un rendez-vous</em></h2></div>
          <div className="steps">
            <div className="step rev"><h3>Choisissez</h3><p>Sélectionnez un ou plusieurs soins, le jour et l'heure qui vous conviennent.</p></div>
            <div className="step rev"><h3>Envoyez</h3><p>Votre demande part sur WhatsApp, déjà rédigée : il n'y a plus qu'à appuyer sur « Envoyer ».</p></div>
            <div className="step rev"><h3>Confirmez</h3><p>Un acompte de 30 % à 50 % confirme votre créneau. Nous vous accueillons ensuite à Lomé.</p></div>
          </div>
          <p className="center" style={{ marginTop: "2.4rem" }}><button className="btn btn--gold" onClick={() => book([])}>Prendre rendez-vous</button></p>
        </div>
      </section>

      <section className="sec lazy-sec">
        <div className="wrap band rev">
          <p className="eyebrow">Suivez-nous</p>
          <h2>Inspirations, coulisses et <em>nouveautés</em></h2>
          <p style={{ maxWidth: 560, margin: "0 auto 1.8rem", fontSize: "1.15rem" }}>Retrouvez Maison Bahnel sur Instagram et TikTok : soins en images, offres et actualités du salon.</p>
          <div style={{ display: "flex", justifyContent: "center" }}><Social /></div>
        </div>
      </section>
    </>
  );
}

/* ───────────── Services ───────────── */
function Lifting({ book }) {
  const prem = SERVICE_BY_ID["lifting-premium"], cure = SERVICE_BY_ID["lifting-cure"];
  return (
    <>
      <div className="lift-lead rev">{LIFTING.lead.map((p, i) => <p key={i}>{p}</p>)}</div>
      <div className="note rev" style={{ marginTop: "1.4rem" }}><span className="ic" aria-hidden="true">✦</span><span>{LIFTING.tip}</span></div>
      <h3 style={{ marginTop: "2.4rem" }}>Les bienfaits</h3>
      <div className="lift-grid">{LIFTING.benefits.map(([t, d]) => <div key={t} className="lift-b rev"><b>{t}</b><span>{d}</span></div>)}</div>
      <h3 style={{ margin: "2.4rem 0 1.2rem" }}>Nos tarifs</h3>
      <div className="cards"><SvcCard s={prem} book={book} /><SvcCard s={cure} book={book} /></div>
      <details className="contra" open>
        <summary>Contre-indications — à lire avant de réserver</summary>
        <p>{LIFTING.contra}</p>
      </details>
    </>
  );
}

function PriceList({ cat, book }) {
  return (
    <ul className="plist rev">
      {servicesOf(cat).map((s) => (
        <li key={s.id} className="row">
          <span className="row-name">{s.name}{s.detail && <small>{s.detail}</small>}</span>
          <span className="row-price">{s.from && <small>à partir de</small>}{money(s.price)}</span>
          <button className="row-add" onClick={() => book([s.id])} aria-label={`Réserver : ${s.name}`}>+</button>
        </li>
      ))}
    </ul>
  );
}

function Services({ sub, book }) {
  const cat = CATS.find((c) => c.id === sub) || CATS[0];
  const first = useRef(true);
  useEffect(() => {
    const bar = document.getElementById("tabs");
    const el = bar && bar.querySelector('[aria-current="true"]');
    if (el) bar.scrollTo({ left: el.offsetLeft - bar.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
    if (first.current) { first.current = false; if (!sub) return; }
    const top = document.getElementById("svc-top");
    if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  }, [cat.id]);

  return (
    <>
      <PageHead img={IMG.massage} eye="Services & tarifs" sub="Une carte complète de soins, avec ses tarifs en toute transparence.">Nos <em>soins</em></PageHead>
      <div className="tabs-bar">
        <div className="wrap">
          <nav aria-label="Catégories de services"><div className="tabs" id="tabs">
            {CATS.map((c) => <a key={c.id} className="tab" href={`#/services/${c.id}`} aria-current={c.id === cat.id ? "true" : undefined}>{c.tab}</a>)}
          </div></nav>
        </div>
      </div>
      <section className="sec" id="svc-top" style={{ paddingTop: "2.6rem" }}>
        <div className="wrap">
          <div className="note" style={{ marginBottom: "2.2rem" }}><span className="ic" aria-hidden="true">✦</span><span><b>Acompte :</b> {DEPOSIT_NOTE}</span></div>
          <div className="cat-head rev"><p className="eyebrow">{cat.tab}</p><h2>{cat.title}</h2><p>{cat.intro}</p></div>
          {cat.id === "lifting" ? <Lifting book={book} />
            : (cat.id === "epilation" || cat.id === "onglerie") ? <PriceList cat={cat.id} book={book} />
            : <div className="cards">{servicesOf(cat.id).map((s) => <SvcCard key={s.id} s={s} book={book} />)}</div>}
          {cat.id === "massages" || cat.id === "soins" ? <p className="rev" style={{ marginTop: "1.6rem", color: "var(--txm)" }}>L'abonnement de 10 séances vous fait bénéficier du tarif réduit à chaque séance.</p> : null}
          <p className="center" style={{ marginTop: "2.6rem" }}><button className="btn btn--gold" onClick={() => book([])}>Prendre rendez-vous</button></p>
        </div>
      </section>
    </>
  );
}

/* ───────────── Académie ───────────── */
function Academie() {
  return (
    <>
      <PageHead img={IMG.acad} eye="Formation & excellence" sub="Transmettre un savoir-faire d'exception et une philosophie du soin.">L'Académie <em>Maison Bahnel</em></PageHead>
      <section className="sec">
        <div className="wrap split">
          <div>
            <p className="eyebrow rev">Formations professionnelles</p>
            <h2 className="rev">Former les <em>experts</em> de demain</h2>
            <p className="rev" style={{ fontSize: "1.15rem" }}>Transmettre un savoir-faire d'exception, une philosophie du soin et une exigence de qualité à travers des formations professionnelles rigoureuses.</p>
            <p className="rev" style={{ fontSize: "1.15rem" }}>Parce que l'excellence du bien-être commence par la formation de ceux qui en font leur vocation.</p>
            <ul className="flist rev" style={{ margin: "1.6rem 0" }}>{FORMATIONS.map((f) => <li key={f.num}><span className="n">{f.num}</span><div><b>{f.name}</b><span>{f.sub}</span></div></li>)}</ul>
            <a className="btn btn--gold rev" href={wa("Bonjour, je souhaite des informations sur les formations de l'Académie Maison Bahnel.")} target="_blank" rel="noopener noreferrer"><WaIcon /> Rejoindre l'Académie</a>
          </div>
          <div className="split-img rev"><Img id={IMG.acad} alt="Formation à l'Académie Maison Bahnel" w={800} /></div>
        </div>
      </section>
    </>
  );
}

/* ───────────── Mon Univers ───────────── */
const STORY = [
  ["Les Origines", "Je suis née à Lomé, une enfance douce et privilégiée où l'élégance, le goût du beau et le sens du travail ont très tôt façonné ma vision du monde. Après une maîtrise en sciences de gestion à l'Université d'Abidjan, ma carrière m'a menée de CI Telecom au commerce international, entre Paris et Taipei."],
  ["L'Éveil Asiatique", "La Chine et l'Asie ont été pour moi bien plus qu'un voyage : un véritable éveil. J'y ai découvert une philosophie de vie où le calme, l'équilibre et l'énergie occupent une place essentielle. Cette culture du bien-être a profondément transformé ma vision du soin."],
  ["La Renaissance", "Après des épreuves personnelles qui m'ont profondément transformée, j'ai choisi de revenir à Lomé avec une seule intention : me reconstruire. C'est dans cette période de renaissance qu'est née ma passion pour le soin, portée par mon amour de l'art, des espaces et de l'esthétique."],
  ["Ma Vision du Soin", "Chez Maison Bahnel, le soin ne se limite pas à l'apparence. Ma vision est profondément holistique : prendre soin du corps, des émotions, de l'énergie et du bien-être intérieur. Un vrai soin permet de ralentir, respirer, relâcher les tensions et retrouver l'équilibre intérieur."],
  ["Maison Bahnel", "Aujourd'hui, Maison Bahnel est l'expression de ce parcours. Un lieu pensé comme un refuge élégant et apaisant, où la beauté rencontre le soin, où chaque détail est imaginé pour faire du bien au corps, à l'esprit et aux émotions. Plus qu'un institut, une maison née d'une passion sincère."],
];
function Univers() {
  return (
    <>
      <PageHead img={IMG.founder} eye="Mon univers" sub="L'histoire d'une femme, d'un retour à soi, et d'une maison née de cette renaissance.">Un parcours <em>de vie</em></PageHead>
      <section className="sec sec--alt">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="split-img rev">
            <Img id={IMG.founder} alt="La fondatrice de Maison Bahnel" w={800} />
            <figure className="quote"><p>« Ce qui n'était au départ qu'une manière de prendre soin de proches est devenu une évidence absolue. »</p><cite>La Fondatrice, Maison Bahnel</cite></figure>
          </div>
          <div>
            <p className="eyebrow rev">Mon histoire</p>
            <h2 className="rev">Une maison née d'un <em>parcours de vie</em></h2>
            {STORY.map(([t, p]) => <div key={t} className="story rev"><h3>{t}</h3><p>{p}</p></div>)}
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="shd rev"><p className="eyebrow">Le futur</p><h2>Une vision <em>en expansion</em></h2><p>Maison Bahnel est née d'une passion pour le soin. Ce n'est que le début d'une vision beaucoup plus grande.</p></div>
          <div className="grid3">
            {[["Un lieu d'exception", "Développer un espace encore plus immersif, pensé comme une véritable maison du bien-être : élégante, apaisante et profondément sensorielle."], ["L'Académie Bahnel", "Transmettre un savoir-faire et une philosophie du soin. Former une nouvelle génération de professionnels engagés dans l'excellence."], ["Une marque globale", "Développer l'univers Maison Bahnel au-delà des soins : produits, rituels signature, contenus, collaborations et événements bien-être."]].map(([t, p], i) => (
              <div key={t} className="tile tile--light rev"><div className="ic" aria-hidden="true">{["◈", "✦", "◇"][i]}</div><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────── Expérience ───────────── */
function Experience() {
  return (
    <>
      <PageHead img={IMG.hero} eye="Notre atmosphère" sub="Votre bien-être ne tient pas seulement à la technique : c'est aussi l'atmosphère.">L'Expérience <em>Maison Bahnel</em></PageHead>
      <section className="sec dark">
        <div className="wrap">
          <div className="shd"><p className="eyebrow">Votre sanctuaire</p><h2>Tous les sens <em>éveillés</em></h2><p>Un espace où chaque sens est éveillé pour une reconnexion totale à vous-même.</p></div>
          <div className="grid3">
            {[["◈", "Senteurs d'exception", "Des huiles essentielles soigneusement sélectionnées pour une atmosphère olfactive apaisante et unique."], ["✦", "Ambiance sensorielle", "Musique douce, lumières tamisées et atmosphère pensée dans les moindres détails pour votre confort."], ["◇", "Accueil chaleureux", "Boissons chaudes, serviettes moelleuses et un accueil sincère pour vous mettre immédiatement à l'aise."], ["✧", "Présence & écoute", "Chaque soin est adapté à vos besoins du moment. Votre bien-être est notre seule et unique priorité."]].map(([i, t, p]) => (
              <div key={t} className="tile rev"><div className="ic" aria-hidden="true">{i}</div><h3>{t}</h3><p>{p}</p></div>
            ))}
          </div>
          <div className="sensory">
            {[[IMG.ambiance, "Le silence", "Le Cocon", "Un espace de silence et de sérénité qui vous enveloppe dès que vous franchissez la porte."], [IMG.spa, "Le toucher", "Le Soin", "Des mains expertes et attentionnées qui connaissent le langage du corps et de l'émotion."], [IMG.detox, "Les senteurs", "L'Éveil", "Des fragrances soigneusement choisies pour éveiller vos sens et approfondir la détente."]].map(([img, l, t, d]) => (
              <article key={t} className="sn rev"><Img id={img} alt="" w={700} /><div><small>{l}</small><h3>{t}</h3><p>{d}</p></div></article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────── Contact ───────────── */
function Contact({ book }) {
  const [fn, setFn] = useState(""), [fp, setFp] = useState(""), [fs, setFs] = useState(""), [fm, setFm] = useState(""), [touched, setTouched] = useState(false);
  const n = clean(fn, 60), p = clean(fp, 25), m = clean(fm, 500);
  const valid = !!n && phoneOk(p);
  const svc = fs && SERVICE_BY_ID[fs] ? SERVICE_BY_ID[fs].name : "";
  const msg = `Bonjour Maison Bahnel,\n\nNom : ${n}\nTéléphone : ${p}${svc ? "\nSoin : " + svc : ""}${m ? "\n\nMessage : " + m : ""}\n\nMerci !`;
  return (
    <>
      <PageHead img={IMG.hero} eye="Contact & réservation" sub="Réservez votre moment de bien-être ou posez-nous vos questions.">Prenons <em>soin de vous</em></PageHead>
      <section className="sec dark">
        <div className="wrap contact">
          <div>
            <p className="eyebrow rev">Nous trouver</p>
            <h2 className="rev" style={{ margin: ".9rem 0 1rem" }}>Un moment <em>rien que pour vous</em></h2>
            <p className="rev" style={{ marginBottom: "1.6rem", fontSize: "1.15rem" }}>Nous sommes là pour vous accueillir avec soin et douceur.</p>
            <ul className="cinfo rev">
              <li><span className="ic" aria-hidden="true">◈</span><div><b>WhatsApp & téléphone</b><a href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer">{PHONE}</a></div></li>
              <li><span className="ic" aria-hidden="true">◇</span><div><b>Localisation</b><span>Lomé, Togo</span></div></li>
              <li><span className="ic" aria-hidden="true">✦</span><div><b>Horaires</b><span>{HOURS}</span></div></li>
              <li><span className="ic" aria-hidden="true">✧</span><div><b>Réseaux sociaux</b><span style={{ display: "block", marginTop: ".6rem" }}><Social /></span></div></li>
            </ul>
            <p style={{ marginTop: "1.8rem" }}><button className="btn btn--gold" onClick={() => book([])}>Prendre rendez-vous</button></p>
          </div>
          <div className="formbox rev">
            <h3>Nous écrire</h3>
            <div className={`fld ${touched && !n ? "bad" : ""}`}><label htmlFor="ct-n">Nom *</label><input id="ct-n" value={fn} maxLength={60} onChange={(e) => setFn(e.target.value)} autoComplete="name" placeholder="Votre nom" />{touched && !n && <p className="err">Indiquez votre nom.</p>}</div>
            <div className={`fld ${touched && !phoneOk(p) ? "bad" : ""}`}><label htmlFor="ct-p">Téléphone / WhatsApp *</label><input id="ct-p" type="tel" inputMode="tel" value={fp} maxLength={25} onChange={(e) => setFp(e.target.value)} autoComplete="tel" placeholder="+228 90 00 00 00" />{touched && !phoneOk(p) && <p className="err">Entrez un numéro valide.</p>}</div>
            <div className="fld"><label htmlFor="ct-s">Soin souhaité</label>
              <select id="ct-s" value={fs} onChange={(e) => setFs(e.target.value)}>
                <option value="">Je ne sais pas encore</option>
                {CATS.map((c) => <optgroup key={c.id} label={c.tab}>{servicesOf(c.id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup>)}
              </select></div>
            <div className="fld"><label htmlFor="ct-m">Message</label><textarea id="ct-m" value={fm} maxLength={500} onChange={(e) => setFm(e.target.value)} placeholder="Votre question ou votre demande…" /></div>
            <a className="btn btn--gold" style={{ width: "100%" }} href={valid ? wa(msg) : "#/contact"} target={valid ? "_blank" : undefined} rel="noopener noreferrer"
              onClick={(e) => { if (!valid) { e.preventDefault(); setTouched(true); } }}><WaIcon /> Envoyer sur WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────────── Navigation & pied de page ───────────── */
function Navbar({ page, book }) {
  const [sc, setSc] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSc(window.scrollY > 40);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOpen(false); }, [page]);
  useEffect(() => {
    document.body.classList.toggle("lock", open);
    const k = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("keydown", k); document.body.classList.remove("lock"); };
  }, [open]);
  const homeClick = () => { setOpen(false); if (page === "accueil") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const cur = (id) => (page === id ? "page" : undefined);
  return (
    <>
      <header className={`nav ${sc ? "sc" : ""} ${open ? "open" : ""}`}>
        <div className="nav-in">
          <a className="brand" href="#/" onClick={homeClick} aria-label="Maison Bahnel — Accueil">
            <img src="/img/logo-nav.png" alt="" width="52" height="52" />
            <span><b>Maison Bahnel</b><small>Spa · Beauté · Bien-être</small></span>
          </a>
          <nav className="nav-links" aria-label="Navigation principale">
            {PAGES.map(([id, l]) => <a key={id} href={`#/${id}`} aria-current={cur(id)}>{l}</a>)}
            <button className="btn btn--gold btn--sm nav-cta" onClick={() => book([])}>Réserver</button>
          </nav>
          <button className={`burger ${open ? "op" : ""}`} onClick={() => setOpen(!open)} aria-label={open ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={open} aria-controls="drawer"><span /><span /><span /></button>
        </div>
      </header>
      <div className={`drawer ${open ? "op" : ""}`} id="drawer" aria-hidden={!open}>
        <a className="dl" href="#/" onClick={homeClick} aria-current={cur("accueil")} tabIndex={open ? 0 : -1}>Accueil</a>
        {PAGES.map(([id, l]) => <a key={id} className="dl" href={`#/${id}`} aria-current={cur(id)} tabIndex={open ? 0 : -1}>{l}</a>)}
        <button className="btn btn--gold" onClick={() => { setOpen(false); book([]); }} tabIndex={open ? 0 : -1}>Prendre rendez-vous</button>
        <div className="drawer-info"><p>{HOURS}</p><div className="social" style={{ marginTop: "1rem" }}>
          <a className="sico" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" tabIndex={open ? 0 : -1}><IgIcon /></a>
          <a className="sico" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" tabIndex={open ? 0 : -1}><TtIcon /></a>
          <a className="sico" href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" tabIndex={open ? 0 : -1}><WaIcon /></a>
        </div></div>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-grid">
          <div>
            <b className="t">Maison Bahnel</b>
            <p style={{ color: "var(--gl)", letterSpacing: ".18em", textTransform: "uppercase", fontSize: ".85rem", margin: ".3rem 0 1rem" }}>Spa · Beauté · Bien-être · Lomé</p>
            <p>Un sanctuaire de beauté, de bien-être et de transformation au cœur de Lomé, né d'une passion profonde pour le soin et l'art de prendre soin des autres avec élégance et authenticité.</p>
            <div className="social">
              <a className="sico" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram Maison Bahnel"><IgIcon /></a>
              <a className="sico" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok Maison Bahnel"><TtIcon /></a>
              <a className="sico" href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Maison Bahnel"><WaIcon /></a>
            </div>
          </div>
          <div><h4>Nos soins</h4><ul>{CATS.map((c) => <li key={c.id}><a href={`#/services/${c.id}`}>{c.tab}</a></li>)}</ul></div>
          <div><h4>La maison</h4><ul>{[["academie", "L'Académie"], ["univers", "Mon Univers"], ["experience", "L'Expérience"], ["contact", "Contact"]].map(([id, l]) => <li key={id}><a href={`#/${id}`}>{l}</a></li>)}</ul></div>
          <div><h4>Contact</h4><ul>
            <li><a href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer">{PHONE}</a></li>
            <li><a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a></li>
            <li><span style={{ color: "rgba(253,251,247,.85)" }}>{HOURS}</span></li>
          </ul></div>
        </div>
        <p className="ft-bt">© {new Date().getFullYear()} Maison Bahnel. Tous droits réservés. Lomé, Togo.</p>
      </div>
    </footer>
  );
}

/* ───────────── Application ───────────── */
export default function App() {
  const route = useRoute();
  const [bk, setBk] = useState({ open: false, preset: [], mounted: false });
  const mainRef = useRef(null);
  const book = useCallback((preset = []) => setBk({ open: true, preset, mounted: true }), []);
  const closeBook = useCallback(() => setBk((b) => ({ ...b, open: false })), []);

  // Titre, description, retour en haut à chaque changement de page
  useEffect(() => {
    document.title = TITLES[route.page];
    const m = document.querySelector('meta[name="description"]');
    if (m) m.setAttribute("content", DESCS[route.page]);
    if (route.page !== "services") window.scrollTo(0, 0);
    else if (!route.sub) window.scrollTo(0, 0);
    if (mainRef.current) mainRef.current.focus({ preventScroll: true });
  }, [route.page]);

  // Apparition douce au défilement (un seul observateur)
  useEffect(() => {
    const els = document.querySelectorAll(".rev:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [route.page, route.sub]);

  const p = route.page;
  return (
    <>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current && mainRef.current.focus(); }}>Aller au contenu</a>
      <Navbar page={p} book={book} />
      <main id="main" tabIndex={-1} ref={mainRef} style={{ outline: "none" }}>
        {p === "accueil" && <Home book={book} />}
        {p === "services" && <Services sub={route.sub} book={book} />}
        {p === "academie" && <Academie />}
        {p === "univers" && <Univers />}
        {p === "experience" && <Experience />}
        {p === "contact" && <Contact book={book} />}
      </main>
      <Footer />
      <a className="waf" href={wa("Bonjour, je souhaite prendre rendez-vous à Maison Bahnel.")} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp"><WaIcon /></a>
      <div className="mbar">
        <button className="btn btn--gold" onClick={() => book([])}>Réserver un soin</button>
        <a className="btn wa" href={wa("Bonjour, je souhaite prendre rendez-vous à Maison Bahnel.")} target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp"><WaIcon /></a>
      </div>
      {bk.mounted && <Suspense fallback={null}><Booking open={bk.open} preset={bk.preset} onClose={closeBook} /></Suspense>}
    </>
  );
}
