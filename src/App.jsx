import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const WA_NUM = "22898361919";
const wa = (msg) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`;
const isMobile = () => window.innerWidth < 768 || ("ontouchstart" in window);

// Filet de sécurité : si une image externe ne charge pas, on affiche un dégradé doré élégant
// à la place d'une icône d'image cassée — l'utilisateur ne voit jamais d'image cassée.
const imgFallback = (e) => {
  const t = e.currentTarget;
  t.onerror = null;
  t.style.display = "none";
  const parent = t.parentElement;
  if (parent) {
    parent.style.background = "linear-gradient(135deg, var(--cr3) 0%, var(--gou) 50%, var(--cr2) 100%)";
    parent.style.minHeight = (t.getAttribute("height") ? t.getAttribute("height")+"px" : "200px");
  }
};

const MASSAGES = [
  {id:"relaxant",cat:"Classique",name:"Massage Relaxant",desc:"Un moment suspendu, doux et enveloppant — une parenthèse loin du bruit du monde. Le corps ralentit, l'esprit s'apaise et chaque geste invite à retrouver l'équilibre intérieur.",benefits:["Relâche les tensions physiques et nerveuses","Apaise le stress et la fatigue mentale","Favorise un sommeil profond et réparateur","Améliore la circulation et la détente musculaire"],p60:"15 000 F",p90:"20 000 F",img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&q=80&auto=format&fit=crop"},
  {id:"signature",cat:"Signature",name:"Massage Signature Bahnel",desc:"Le rituel emblématique de Maison Bahnel. Un voyage sensoriel mêlant douceur, profondeur et élégance pour reconnecter le corps, les émotions et l'esprit dans une atmosphère raffinée.",benefits:["Détente musculaire profonde","Réduction du stress physique et émotionnel","Rééquilibrage des énergies du corps","Expérience de bien-être complète et immersive"],p60:"20 000 F",p90:"25 000 F",img:"https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=700&q=80&auto=format&fit=crop"},
  {id:"lomilomi",cat:"Hawaïen",name:"Massage Lomi-Lomi",desc:"Inspiré des traditions hawaïennes, une véritable invitation au voyage. Des mouvements longs, fluides et enveloppants comme un bercement apaisant qui invite au lâcher-prise total.",benefits:["Relâche tensions physiques et émotionnelles","Favorise une profonde détente corps et esprit","Améliore la circulation sanguine","Réduit le stress et la fatigue mentale"],p60:"20 000 F",p90:"25 000 F",img:"https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=700&q=80&auto=format&fit=crop"},
  {id:"pierres",cat:"Thermique",name:"Massage aux Pierres Chaudes",desc:"La chaleur des pierres diffuse une sensation immédiate de réconfort. Le corps se relâche dans une atmosphère douce, chaleureuse et profondément relaxante.",benefits:["Détend profondément muscles et tensions","Favorise la circulation sanguine","Apaise le stress et la fatigue nerveuse","Procure une chaleur réconfortante profonde"],p60:"25 000 F",p90:"35 000 F",img:"https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=700&q=80&auto=format&fit=crop"},
  {id:"4mains",cat:"Luxueux",name:"Massage 4 Mains",desc:"Une expérience luxueuse et hypnotique — les mouvements synchronisés de deux thérapeutes créent une sensation unique de lâcher-prise absolu et d'abandon profond.",benefits:["Détente profonde et rapide du système nerveux","Sensation d'abandon total du corps","Réduction intense du stress et des tensions","Expérience sensorielle immersive et unique"],p60:"30 000 F",p90:"40 000 F",img:"https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=700&q=80&auto=format&fit=crop"},
  {id:"duo",cat:"Partage",name:"Massage en Duo",desc:"Une expérience intime et apaisante à vivre à deux dans une atmosphère douce et harmonieuse. Idéal pour célébrer un moment spécial ou s'offrir une pause de sérénité.",benefits:["Partage d'un moment de détente privilégié","Réduction du stress à deux","Renforcement de la connexion émotionnelle","Expérience relaxante et mémorable"],p60:"30 000 F",p90:"40 000 F",img:"https://images.unsplash.com/photo-1607008829749-c0f284a49fc4?w=700&q=80&auto=format&fit=crop"},
  {id:"energetique",cat:"Énergétique",name:"Massage Énergétique",desc:"Un soin profondément apaisant qui invite au recentrage, à l'écoute de soi et à la reconnexion intérieure dans une atmosphère calme et enveloppante.",benefits:["Harmonisation énergétique du corps","Apaise les tensions émotionnelles","Encourage le recentrage et l'équilibre intérieur","Aide à relâcher les blocages liés au stress"],p60:"30 000 F",p90:"40 000 F",img:"https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=700&q=80&auto=format&fit=crop"},
  {id:"prenatal",cat:"Prénatal",name:"Massage Femme Enceinte",desc:"Un soin délicat et rassurant pour accompagner la future maman dans un cocon de douceur, de calme et de bien-être tout au long de sa grossesse.",benefits:["Soulage les tensions du dos et des jambes","Apaise les inconforts de la grossesse","Favorise la relaxation et le sommeil","Offre un moment de connexion douce au corps"],p60:"20 000 F",p90:"25 000 F",img:"https://images.unsplash.com/photo-1588776814546-1ffad65b8f90?w=700&q=80&auto=format&fit=crop"},
  {id:"drainage",cat:"Rééquilibrant",name:"Drainage Lymphatique",desc:"Un soin doux, fluide et rééquilibrant qui procure une profonde sensation de purification. Le corps paraît plus léger, plus reposé et reconnecté à son énergie naturelle.",benefits:["Stimule la circulation lymphatique","Réduit sensations de jambes lourdes","Favorise l'élimination des toxines","Aide à affiner la silhouette"],p60:"20 000 F",p90:"25 000 F",img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&q=80&auto=format&fit=crop"},
  {id:"maderotherapie",cat:"Sculpting",name:"Madérothérapie",desc:"Un soin à la fois tonique et rééquilibrant qui redonne au corps énergie et vitalité. Les mouvements sculptants créent une expérience revitalisante profonde.",benefits:["Stimule la circulation sanguine et lymphatique","Aide à réduire l'aspect de la cellulite","Tonifie et raffermit la peau","Procure légèreté et dynamisme"],p60:"15 000 F",p90:"20 000 F",img:"https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=700&q=80&auto=format&fit=crop"}
];

const RITUELS = [
  {id:"detox",num:"01",cat:"Rituel Détox",name:"Détox Éclat & Unification",includes:["Gommage corps complet","Enveloppement nourrissant","Couverture sauna","Hydratation intensive"],desc:"Une expérience purifiante qui révèle l'éclat naturel de votre peau et renouvelle votre énergie intérieure.",img:"https://images.unsplash.com/photo-1614159102271-2e93da5ee297?w=900&q=80&auto=format&fit=crop"},
  {id:"asie",num:"02",cat:"Rituel Asiatique",name:"Lumière d'Asie",includes:["Massage Signature Bahnel","Soin visage personnalisé","Cérémonie du thé","Ambiance sensorielle immersive"],desc:"Inspiré des traditions orientales, un moment hors du temps où l'âme et le corps se retrouvent en parfaite harmonie.",img:"https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80&auto=format&fit=crop"},
  {id:"gold",num:"03",cat:"Rituel Luxe",name:"Gold Glow",includes:["Drainage lymphatique","Vapeur douce","Exfoliation premium","Relaxation profonde"],desc:"L'alliance parfaite du luxe et du bien-être pour une peau rayonnante et un esprit libéré de toute tension.",img:"https://images.unsplash.com/photo-1498842812179-c81beecf902c?w=900&q=80&auto=format&fit=crop"}
];

const BEAUTE = [
  {id:"onglerie",icon:"◈",name:"Onglerie d'Exception",img:"https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop",services:["Manucure Spa & Russe","Pédicure Spa, Jelly & Russe","Vernis simple & Gel semi-permanent","Pose américaine & Capsules","Acrylique, Polygel & Gel de construction","Nail Art personnalisé"]},
  {id:"visage",icon:"✦",name:"Soins Visage",img:"https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80&auto=format&fit=crop",services:["Glow Skin — Éclat naturel","Hydra Facial — Hydratation profonde","Glass Skin — Peau de verre","Soins anti-âge","Nettoyage profond & purification"]},
  {id:"coiffure",icon:"◇",name:"Coiffure & Hair",img:"https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop",services:["Tresses, Perruques & Tissages","Dreadlocks","Coupes femmes & Pixie Cut","Coupes hommes & Barbe","Soins capillaires"]},
  {id:"epilation",icon:"✧",name:"Épilation",img:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",services:["Épilation au laser","Épilation à la cire douce","Épilation visage","Épilation corps complète","Épilation sourcils & lèvres"]}
];

const FORMATIONS = [
  {num:"01",name:"Formation Massage Thérapeutique",sub:"Techniques, anatomie et éthique professionnelle"},
  {num:"02",name:"Formation Esthétique",sub:"Soins du visage, maquillage et techniques de beauté"},
  {num:"03",name:"Formation Prothésie Ongulaire",sub:"Nail art, poses techniques et soins des ongles"},
  {num:"04",name:"Coaching Business Beauté",sub:"Entrepreneuriat dans le secteur beauté et bien-être"}
];

const TEMOIGNAGES = [
  {text:"Une expérience absolument exceptionnelle. Le Massage Signature Bahnel est magique. L'ambiance, les mains habiles, l'accueil sincère — je suis ressortie transformée et légère.",author:"Amina K.",soin:"Massage Signature Bahnel"},
  {text:"Maison Bahnel, c'est un vrai luxe à Lomé. L'endroit dégage une sérénité particulière. Les soins visage sont d'une qualité incomparable. Je recommande sans hésitation.",author:"Clarisse M.",soin:"Soin Visage Glow Skin"},
  {text:"J'ai offert le massage duo à ma mère pour son anniversaire. On est toutes les deux ressorties détendues, heureuses et rayonnantes. Un moment inoubliable dans un cadre élégant.",author:"Sandra T.",soin:"Massage en Duo"},
  {text:"Les rituels sont une révélation. Le Rituel Lumière d'Asie est une expérience hors du commun — une parenthèse enchantée. Je reviendrai certainement très bientôt.",author:"Nafissatou D.",soin:"Rituel Lumière d'Asie"}
];

const BOOKING_CATS = [
  {id:"massage",ic:"◈",n:"Bahnel Massage",s:"10 massages d'exception"},
  {id:"rituel",ic:"✦",n:"Les Rituels",s:"Expériences sensorielles"},
  {id:"beaute",ic:"◇",n:"Bahnel Beauty",s:"Onglerie, visage, hair"},
  {id:"acad",ic:"✧",n:"L'Académie",s:"Formations professionnelles"}
];

const TIMES = ["09:00","09:30","10:00","10:30","11:00","11:30","12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00"];

const CSS = `
:root{--cr:#FDFBF7;--cr2:#F4ECE0;--cr3:#E9E0D2;--es:#2B2015;--dk:#36281A;--mc:#41311F;--br:#6B4A2A;--go:#C6A55A;--god:#A8893C;--gop:#E8D4A0;--gou:#F8F0DF;--tx:#2B2015;--txm:#5A4530;--txs:#8A7560;--ff:'Cormorant Garamond',Georgia,serif;--fs:'Jost','Helvetica Neue',sans-serif;--ez:cubic-bezier(0.16,1,0.3,1);--sp:cubic-bezier(0.34,1.56,0.64,1);--r-lg:28px;--r-md:20px;--r-sm:14px;--r-pill:999px;--sh-soft:0 8px 32px rgba(107,74,42,.10);--sh-card:0 4px 24px rgba(107,74,42,.08);--sh-hover:0 18px 48px rgba(107,74,42,.18)}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:var(--fs);font-size:17px;background:var(--cr);color:var(--tx);line-height:1.7;overflow-x:hidden}
img{display:block;max-width:100%;object-fit:cover}
a{text-decoration:none;color:inherit}
button{border:none;background:none;cursor:pointer;font-family:inherit}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:var(--es)}::-webkit-scrollbar-thumb{background:var(--go)}
h1,h2,h3,h4{font-family:var(--ff);font-weight:400;line-height:1.15}
h1{font-size:clamp(3rem,7.5vw,7.5rem)}h2{font-size:clamp(2rem,4.5vw,4rem)}h3{font-size:clamp(1.4rem,2.5vw,2rem)}
p{font-size:1.02rem;font-weight:300;color:var(--txm);line-height:1.85}
.C{max-width:1320px;margin:0 auto;padding:0 2.5rem}
.Cs{max-width:860px;margin:0 auto;padding:0 2.5rem}
.ey{display:inline-flex;align-items:center;gap:.7rem;font-family:var(--fs);font-size:.62rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:var(--go)}
.ey::before{content:'';width:28px;height:1px;background:linear-gradient(90deg,var(--go),transparent);flex-shrink:0}
.rule{width:48px;height:1px;background:linear-gradient(90deg,transparent,var(--go),transparent);margin:1.4rem auto}
.btn{display:inline-flex;align-items:center;gap:.7rem;font-family:var(--fs);font-size:.68rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;padding:1rem 2.4rem;cursor:pointer;position:relative;overflow:hidden;transition:color .45s var(--ez),transform .35s var(--sp),box-shadow .35s var(--ez);border-radius:var(--r-pill)}
.bto{border:1px solid var(--go);color:var(--go);background:transparent}
.bto::after{content:'';position:absolute;inset:0;background:var(--go);transform:translateX(-101%);transition:transform .45s var(--ez);z-index:0;border-radius:var(--r-pill)}
.bto:hover{color:var(--es);transform:translateY(-2px);box-shadow:var(--sh-soft)}.bto:hover::after{transform:translateX(0)}.bto span{position:relative;z-index:1}
.btg{background:var(--go);color:var(--es);border:1px solid var(--go);font-weight:500;transition:background .3s,transform .35s var(--sp),box-shadow .35s var(--ez)}
.btg:hover{background:var(--god);transform:translateY(-2px);box-shadow:var(--sh-hover)}
.btsm{font-family:var(--fs);font-size:.66rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;padding:.7rem 1.4rem;border:1px solid var(--go);color:var(--go);background:transparent;transition:background .35s,color .35s,transform .35s var(--sp);white-space:nowrap;cursor:pointer;border-radius:var(--r-pill)}
.btsm:hover{background:var(--go);color:var(--es);transform:translateY(-2px)}
.rev{opacity:0;transform:translateY(28px);filter:blur(2px);transition:opacity .8s var(--ez),transform .8s var(--ez),filter .8s var(--ez)}
.rev.v{opacity:1;transform:none;filter:none}
.rev.d1{transition-delay:.1s}.rev.d2{transition-delay:.2s}.rev.d3{transition-delay:.3s}.rev.d4{transition-delay:.4s}
.pgt{opacity:0;transform:translateY(12px);transition:opacity .45s var(--ez),transform .45s var(--ez)}
.pgt.v{opacity:1;transform:none}
.ld{position:fixed;inset:0;z-index:9999;background:var(--es);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2rem;transition:opacity .8s var(--ez),visibility .8s}
.ld.out{opacity:0;visibility:hidden;pointer-events:none}
.ld-br{font-family:var(--ff);font-size:2.8rem;font-weight:300;color:var(--cr);letter-spacing:.08em}
.ld-br em{color:var(--go);font-style:italic}
.ld-sub{font-size:.6rem;letter-spacing:.45em;text-transform:uppercase;color:var(--go)}
.ld-bar{width:180px;height:1px;background:rgba(255,255,255,.08);overflow:hidden}
.ld-prg{height:100%;width:0;background:var(--go);animation:ldP 1.8s var(--ez) .3s forwards}
@keyframes ldP{to{width:100%}}
@media(hover:hover) and (pointer:fine){
.cur{position:fixed;width:8px;height:8px;background:var(--go);border-radius:50%;pointer-events:none;z-index:8999;transform:translate(-50%,-50%);transition:width .3s,height .3s,opacity .3s;opacity:0}
.cur.vis{opacity:1}
.cur-r{position:fixed;width:34px;height:34px;border:1px solid rgba(198,165,90,.4);border-radius:50%;pointer-events:none;z-index:8998;transform:translate(-50%,-50%);transition:width .35s,height .35s,opacity .3s;opacity:0}
.cur-r.vis{opacity:1}}
.nav{position:fixed;top:0;left:0;right:0;z-index:500;padding:1.5rem 0;transition:padding .5s var(--ez),background .5s var(--ez),box-shadow .5s}
.nav.sc{background:rgba(250,247,242,.96);backdrop-filter:blur(24px) saturate(1.5);padding:.9rem 0;box-shadow:0 1px 0 rgba(30,21,16,.08)}
.nav-i{max-width:1440px;margin:0 auto;padding:0 3rem;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:1.5rem}
.nav-l{display:flex;justify-content:flex-end;gap:2.2rem;list-style:none}
.nav-r{display:flex;justify-content:flex-start;align-items:center;gap:2rem;list-style:none}
.nav-l a,.nav-r button:not(.nav-res){font-family:var(--fs);font-size:.64rem;font-weight:400;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,247,242,.82);position:relative;cursor:pointer;transition:color .3s;background:none;border:none;padding:0}
.nav-l a::after,.nav-r button:not(.nav-res)::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:var(--go);transition:width .35s var(--ez)}
.nav-l a:hover,.nav-r button:not(.nav-res):hover{color:var(--go)}
.nav-l a:hover::after,.nav-r button:not(.nav-res):hover::after{width:100%}
.nav.sc .nav-l a,.nav.sc .nav-r button:not(.nav-res){color:var(--txm)}
.nav.sc .nav-l a:hover,.nav.sc .nav-r button:not(.nav-res):hover{color:var(--go)}
.nav-logo{display:flex;flex-direction:column;align-items:center;gap:.4rem;cursor:pointer;border:none;background:none}
.nav-logo-img{width:58px;height:58px;border-radius:50%;object-fit:cover;transition:width .5s var(--ez),height .5s var(--ez),transform .4s var(--sp);box-shadow:0 4px 18px rgba(43,32,21,.18);background:var(--cr2)}
.nav.sc .nav-logo-img{width:46px;height:46px}
.nav-logo:hover .nav-logo-img{transform:scale(1.06) rotate(-3deg)}
.nav-logo-t{font-size:.5rem;letter-spacing:.32em;text-transform:uppercase;color:var(--go);transition:color .4s}
.nav-res{font-family:var(--fs);font-size:.66rem;font-weight:500;letter-spacing:.16em;text-transform:uppercase;padding:.7rem 1.6rem;background:var(--go);color:var(--es) !important;transition:background .3s,transform .25s var(--sp),box-shadow .3s;white-space:nowrap;border-radius:var(--r-pill)}
.nav-res:hover{background:var(--god);transform:translateY(-1px)}
.nav-res::after{display:none !important}
.nav-bg{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:4px;background:none;border:none}
.nav-bg span{display:block;width:24px;height:1px;background:var(--cr);transition:all .4s var(--ez);transform-origin:center}
.nav.sc .nav-bg span{background:var(--tx)}
.nav-bg.op span:nth-child(1){transform:translateY(6px) rotate(45deg)}
.nav-bg.op span:nth-child(2){opacity:0;transform:scaleX(0)}
.nav-bg.op span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
.mov{display:none;position:fixed;inset:0;z-index:499;background:rgba(22,16,8,.97);backdrop-filter:blur(20px);flex-direction:column;align-items:center;justify-content:center;gap:.5rem}
.mov.op{display:flex}
.mov button{font-family:var(--ff);font-size:2rem;font-weight:300;font-style:italic;color:var(--cr2);padding:.5rem 0;cursor:pointer;background:none;border:none;opacity:0;transform:translateY(14px);transition:color .3s,opacity .45s var(--ez),transform .45s var(--ez)}
.mov.op button{opacity:1;transform:none}
.mov.op button:nth-child(1){transition-delay:.05s}.mov.op button:nth-child(2){transition-delay:.10s}.mov.op button:nth-child(3){transition-delay:.15s}.mov.op button:nth-child(4){transition-delay:.20s}.mov.op button:nth-child(5){transition-delay:.25s}.mov.op button:nth-child(6){transition-delay:.30s}.mov.op button:nth-child(7){transition-delay:.35s}.mov.op button:nth-child(8){transition-delay:.40s}
.mov button:hover{color:var(--go)}
.mov-cl{position:absolute;top:1.8rem;right:2.5rem;font-family:var(--fs);font-size:.65rem;letter-spacing:.25em;text-transform:uppercase;color:var(--go);cursor:pointer;background:none;border:none}
.waf{position:fixed;bottom:2rem;right:2rem;z-index:490;display:flex;flex-direction:column;align-items:flex-end;gap:.6rem}
.waf-tip{background:var(--dk);color:var(--cr);padding:.5rem 1rem;font-size:.7rem;white-space:nowrap;opacity:0;transform:translateX(8px);transition:all .35s var(--ez);pointer-events:none}
.waf:hover .waf-tip{opacity:1;transform:translateX(0)}
.waf-btn{width:56px;height:56px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(37,211,102,.3);transition:transform .4s var(--sp),background .3s;animation:waPulse 3s ease-in-out infinite}
.waf-btn:hover{background:#1eba58;transform:scale(1.1);animation:none}
@keyframes waPulse{0%,100%{box-shadow:0 4px 24px rgba(37,211,102,.3)}50%{box-shadow:0 4px 36px rgba(37,211,102,.55),0 0 0 8px rgba(37,211,102,.08)}}
.waf-btn svg{width:25px;height:25px;fill:white}
.lat{position:fixed;top:50%;right:0;z-index:480;transform:translateY(-50%)}
.lat a{display:block;writing-mode:vertical-rl;padding:1.2rem .8rem;background:var(--go);border-radius:var(--r-pill) 0 0 var(--r-pill);font-family:var(--fs);font-size:.58rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--es);transition:background .3s,transform .35s var(--sp);text-decoration:none;box-shadow:var(--sh-soft)}
.lat a:hover{background:var(--god);transform:translateX(-4px)}
.mbk{position:fixed;inset:0;z-index:800;background:rgba(22,16,8,.88);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity .4s var(--ez)}
.mbk.op{opacity:1;pointer-events:all}
.mbk-box{background:var(--dk);border:1px solid rgba(255,255,255,.07);border-radius:var(--r-lg);width:100%;max-width:720px;max-height:90vh;overflow-y:auto;transform:translateY(20px);transition:transform .4s var(--ez);scrollbar-width:thin;scrollbar-color:var(--go) transparent}
.mbk.op .mbk-box{transform:none}
.mbk-head{padding:2rem 2.5rem 1.5rem;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}
.mbk-title{font-family:var(--ff);font-size:1.7rem;color:var(--cr)}
.mbk-cl{font-size:1.2rem;color:rgba(255,255,255,.4);cursor:pointer;transition:color .3s;padding:.3rem .5rem;background:none;border:none;line-height:1}
.mbk-cl:hover{color:var(--go)}
.mbk-steps{display:flex;padding:0 2.5rem;border-bottom:1px solid rgba(255,255,255,.06)}
.mbk-stp{flex:1;padding:.9rem .3rem;text-align:center;font-size:.55rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(255,255,255,.2);border-bottom:2px solid transparent;transition:all .35s;user-select:none}
.mbk-stp.ac{color:var(--go);border-bottom-color:var(--go)}.mbk-stp.dn{color:rgba(255,255,255,.36)}
.mbk-body{padding:2rem 2.5rem}
.cat-g{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.cat-c{padding:1.6rem;border:1px solid rgba(255,255,255,.07);border-radius:var(--r-md);cursor:pointer;transition:all .3s var(--sp);text-align:left;background:transparent}
.cat-c:hover{border-color:rgba(198,165,90,.4);background:rgba(198,165,90,.05);transform:translateY(-2px)}
.cat-c.sl{border-color:var(--go);background:rgba(198,165,90,.08)}
.cat-c-ic{font-size:1.4rem;color:var(--go);margin-bottom:.9rem}
.cat-c-n{font-family:var(--ff);font-size:1.15rem;color:var(--cr);margin-bottom:.3rem}
.cat-c-s{font-size:.73rem;color:rgba(255,255,255,.36)}
.svc-l{display:flex;flex-direction:column;gap:.5rem;max-height:300px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--go) transparent}
.svc-i{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.3rem;border:1px solid rgba(255,255,255,.07);border-radius:var(--r-sm);cursor:pointer;transition:all .3s;background:transparent;text-align:left;width:100%}
.svc-i:hover{border-color:rgba(198,165,90,.4);background:rgba(198,165,90,.04)}
.svc-i.sl{border-color:var(--go);background:rgba(198,165,90,.08)}
.svc-n{font-family:var(--ff);font-size:.98rem;color:var(--cr)}
.svc-p{font-size:.72rem;color:var(--go);white-space:nowrap;margin-left:.8rem}
.dur-row{display:flex;gap:.8rem;margin-top:1rem}
.dur-btn{flex:1;padding:.65rem;border:1px solid rgba(255,255,255,.12);border-radius:var(--r-pill);font-family:var(--fs);font-size:.72rem;letter-spacing:.12em;cursor:pointer;transition:all .35s var(--sp)}
.dur-btn.sl{border-color:var(--go);color:var(--go);background:rgba(198,165,90,.08)}
.dur-btn:not(.sl){color:rgba(255,255,255,.4);background:transparent}
.dt-g{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.fld label{display:block;font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.32);margin-bottom:.5rem}
.fld input,.fld select,.fld textarea{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(255,255,255,.12);color:var(--cr);font-family:var(--fs);font-size:.88rem;font-weight:300;padding:.6rem 0;outline:none;transition:border-color .3s;-webkit-appearance:none}
.fld input:focus,.fld select:focus,.fld textarea:focus{border-bottom-color:var(--go)}
.fld select option{background:var(--es);color:var(--cr)}
.fld textarea{height:75px;resize:none}
.fld-row{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem}
.sum{background:rgba(255,255,255,.03);padding:1.3rem 1.8rem;border:1px solid rgba(255,255,255,.07);border-radius:var(--r-md)}
.sum-r{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;padding:.55rem 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:.83rem}
.sum-r:last-child{border-bottom:none}
.sum-r span:first-child{color:rgba(255,255,255,.36);font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;flex-shrink:0}
.sum-r span:last-child{color:var(--cr);text-align:right}
.mbk-nav{display:flex;gap:.8rem;margin-top:1.8rem;padding-top:1.3rem;border-top:1px solid rgba(255,255,255,.07)}
.mbk-bk{padding:.8rem 1.6rem;border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.45);font-family:var(--fs);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:all .3s;background:none;flex-shrink:0}
.mbk-bk:hover{border-color:rgba(255,255,255,.3);color:rgba(255,255,255,.75)}
.mbk-nx{flex:1;padding:.85rem;background:var(--go);color:var(--es);border:1px solid var(--go);font-family:var(--fs);font-size:.62rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;transition:background .3s}
.mbk-nx:hover:not(:disabled){background:var(--god)}
.mbk-nx:disabled{opacity:.38;cursor:not-allowed}
#hero{position:relative;min-height:100dvh;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden}
.h-bg{position:absolute;inset:0;background-color:var(--mc);background-image:url('https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=85&auto=format&fit=crop');background-size:cover;background-position:center 30%;will-change:transform}
.h-ov{position:absolute;inset:0;z-index:1;background:linear-gradient(155deg,rgba(22,16,8,.72) 0%,rgba(22,16,8,.38) 50%,rgba(22,16,8,.65) 100%)}
.h-3d{position:absolute;inset:0;z-index:2;pointer-events:none}
.h-ct{position:relative;z-index:3;text-align:center;padding:0 2rem;max-width:1060px}
.h-pre{font-family:var(--fs);font-size:.62rem;font-weight:300;letter-spacing:.45em;text-transform:uppercase;color:var(--go);margin-bottom:2rem;opacity:0;animation:hIn 1s var(--ez) .3s forwards}
.h-t1{font-family:var(--ff);font-size:clamp(3.5rem,9vw,8rem);font-weight:300;color:var(--cr);letter-spacing:.04em;margin-bottom:.4rem;line-height:.95;opacity:0;animation:hIn 1.1s var(--ez) .5s forwards}
.h-t1 em{font-style:italic;color:var(--gop)}
.h-div{display:flex;align-items:center;justify-content:center;gap:1.2rem;margin:1.8rem 0 2.4rem;opacity:0;animation:hIn 1s var(--ez) .7s forwards}
.h-div::before,.h-div::after{content:'';flex:1;max-width:70px;height:1px;background:linear-gradient(90deg,transparent,var(--go))}
.h-div::after{background:linear-gradient(270deg,transparent,var(--go))}
.h-div span{font-family:var(--fs);font-size:.56rem;letter-spacing:.36em;text-transform:uppercase;color:rgba(250,247,242,.5)}
.h-tag{font-family:var(--ff);font-size:clamp(1.1rem,2.5vw,1.9rem);font-weight:300;font-style:italic;color:rgba(250,247,242,.82);line-height:1.5;max-width:660px;margin:0 auto 3.5rem;opacity:0;animation:hIn 1s var(--ez) .9s forwards}
.h-btns{display:flex;align-items:center;justify-content:center;gap:1.2rem;flex-wrap:wrap;opacity:0;animation:hIn 1s var(--ez) 1.1s forwards}
.h-sc{position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);z-index:3;display:flex;flex-direction:column;align-items:center;gap:.5rem;color:rgba(250,247,242,.32);font-size:.55rem;letter-spacing:.28em;text-transform:uppercase;cursor:pointer;opacity:0;animation:hIn 1s var(--ez) 1.5s forwards;border:none;background:none;padding:.5rem}
.h-sc-l{width:1px;height:44px;background:linear-gradient(to bottom,rgba(198,165,90,.7),transparent);animation:sP 2.2s ease infinite}
@keyframes hIn{from{opacity:0;transform:translateY(24px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
@keyframes sP{0%,100%{opacity:.5;transform:scaleY(1)}50%{opacity:1;transform:scaleY(1.15)}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes goldShimmer{0%{background-position:200% center}100%{background-position:-200% center}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:none}}
@keyframes rotateSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.i-bdg{animation:floatY 4s ease-in-out infinite}
.rule{background:linear-gradient(90deg,transparent,var(--go),transparent);background-size:200% auto;animation:goldShimmer 3s linear infinite}
.prm{background:var(--es);position:relative}
.prm::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--go),transparent)}
.prm-g{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem}
.prm-i{background:var(--es);border-radius:var(--r-md);padding:3.2rem 2.2rem;border:1px solid rgba(198,165,90,.12);cursor:pointer;transition:border-color .4s,background .4s,transform .45s var(--sp),box-shadow .4s}
.prm-i:hover{box-shadow:var(--sh-hover);transform:translateY(-6px)}
.prm-i:hover{background:var(--mc);border-color:rgba(198,165,90,.3)}
.prm-n{font-family:var(--ff);font-size:3rem;font-weight:300;color:rgba(198,165,90,.13);line-height:1;margin-bottom:1.6rem;transition:color .4s}
.prm-i:hover .prm-n{color:rgba(198,165,90,.38)}
.prm-nm{font-family:var(--ff);font-size:1.3rem;color:var(--cr);margin-bottom:.6rem}
.prm-d{font-size:.78rem;color:rgba(250,247,242,.38);line-height:1.75}
.prm-lk{display:inline-block;margin-top:1.6rem;font-size:.6rem;letter-spacing:.22em;text-transform:uppercase;color:var(--go);border-bottom:1px solid transparent;transition:border-color .3s}
.prm-i:hover .prm-lk{border-color:var(--go)}
.intro{padding:9rem 0;background:var(--cr)}
.intro-in{display:grid;grid-template-columns:1fr 1fr;gap:6.5rem;align-items:center}
.intro-h2{font-size:clamp(2.2rem,3.8vw,3.4rem);color:var(--tx);margin:1.2rem 0 2rem;line-height:1.2}
.intro-h2 em{font-style:italic;color:var(--br)}
.intro-pil{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;margin-top:3rem}
.pil{background:var(--cr);padding:2.2rem 1.4rem;text-align:center;border:1px solid var(--cr3);border-radius:var(--r-md);transition:all .4s var(--sp)}
.pil:hover{transform:translateY(-4px);box-shadow:var(--sh-card)}
.pil:hover{border-color:var(--go);background:var(--gou)}
.pil-n{font-family:var(--ff);font-size:2.2rem;color:var(--go);font-weight:300;margin-bottom:.5rem}
.pil h3{font-size:.85rem;letter-spacing:.1em;margin-bottom:.35rem;color:var(--tx);font-family:var(--fs);font-weight:500}
.pil p{font-size:.75rem;color:var(--txs);margin:0}
.intro-vis{position:relative}
.i-img{width:100%;height:600px;border-radius:48px 12px 48px 12px}
.i-img2{position:absolute;width:42%;height:185px;bottom:-2.5rem;left:-2rem;border:5px solid var(--cr);border-radius:12px 36px 12px 36px;box-shadow:var(--sh-hover)}
.i-bdg{position:absolute;top:2.5rem;right:-1.5rem;background:var(--go);border-radius:var(--r-md);padding:1.4rem 1.2rem;text-align:center;box-shadow:0 8px 40px rgba(198,165,90,.28)}
.i-bdg-n{display:block;font-family:var(--ff);font-size:2.8rem;font-weight:300;color:var(--es);line-height:1}
.i-bdg-l{font-size:.57rem;letter-spacing:.2em;text-transform:uppercase;color:rgba(22,16,8,.65);display:block;margin-top:.3rem}
.qi{padding:6rem 0;background:var(--gou);text-align:center;border-top:1px solid rgba(198,165,90,.22);border-bottom:1px solid rgba(198,165,90,.22)}
.shd{text-align:center;margin-bottom:5.5rem}
.shd h2{color:var(--tx);margin:1rem 0 .5rem}
.shd h2 em{font-style:italic;color:var(--br)}
.shd p{max-width:600px;margin:0 auto;font-size:.94rem}
.ph{position:relative;height:55vh;min-height:380px;display:flex;align-items:flex-end;padding-bottom:4rem;overflow:hidden}
.ph-bg{position:absolute;inset:0;background-color:var(--mc);background-size:cover;background-position:center;filter:brightness(.44)}
.ph-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(22,16,8,.92) 0%,rgba(22,16,8,.18) 100%)}
.ph-ct{position:relative;z-index:2;padding:0 2.5rem;width:100%;max-width:1320px;margin:0 auto}
.ph-ct .ey{margin-bottom:1rem}
.ph-ct h1{font-size:clamp(2.2rem,5.5vw,4.8rem);color:var(--cr);font-weight:300}
.ph-ct h1 em{font-style:italic;color:var(--gop)}
.ph-ct p{color:rgba(250,247,242,.58);margin-top:.9rem;max-width:500px;font-size:.93rem}
.ms-sec{padding:7rem 0;background:var(--cr)}
.ms-g{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2rem}
.mc{background:var(--cr);border:1px solid var(--cr3);border-radius:var(--r-md);overflow:hidden;box-shadow:var(--sh-card);transition:border-color .4s,box-shadow .4s,transform .45s var(--sp)}
.mc:hover{border-color:var(--go);box-shadow:var(--sh-hover);transform:translateY(-6px);z-index:2}
.mc-iw{overflow:hidden;height:200px}
.mc-img{width:100%;height:100%;transition:transform .7s var(--ez)}
.mc:hover .mc-img{transform:scale(1.05)}
.mc-b{padding:1.8rem 1.8rem 0}
.mc-cat{font-size:.57rem;letter-spacing:.3em;text-transform:uppercase;color:var(--go);margin-bottom:.6rem}
.mc-n{font-size:1.2rem;color:var(--tx);margin-bottom:.7rem}
.mc-d{font-size:.83rem;line-height:1.75;font-style:italic;color:var(--txs);margin-bottom:1.1rem}
.mc-bl{list-style:none;margin-bottom:1.4rem}
.mc-bl li{font-size:.77rem;color:var(--txm);padding:.26rem 0 .26rem .95rem;position:relative}
.mc-bl li::before{content:'—';position:absolute;left:0;color:var(--go);font-size:.63rem;top:.3rem}
.mc-ft{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 1.8rem;border-top:1px solid var(--cr3);background:var(--cr)}
.mc-ps{display:flex;flex-direction:column;gap:.1rem}
.mc-p{font-family:var(--ff);font-size:.98rem;color:var(--tx)}
.mc-p span{font-family:var(--fs);font-size:.66rem;color:var(--txs);font-weight:300}
.abo{margin-top:2.5rem;border-radius:var(--r-md);padding:2.2rem 3rem;background:var(--dk);display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;box-shadow:var(--sh-soft)}
.abo-t h4{font-family:var(--ff);font-size:1.35rem;color:var(--cr);margin-bottom:.4rem}
.abo-t p{font-size:.78rem;color:rgba(255,255,255,.38);margin:0}
.abo-b{font-family:var(--ff);font-size:3.2rem;font-weight:300;color:var(--go);white-space:nowrap;flex-shrink:0}
.rt-sec{padding:7rem 0;background:var(--es);position:relative}
.rt-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(198,165,90,.05),transparent);pointer-events:none}
.rt-sec .shd h2{color:var(--cr)}.rt-sec .shd h2 em{color:var(--gop)}.rt-sec .shd p{color:rgba(250,247,242,.48)}
.rt-g{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
.rc{position:relative;min-height:580px;display:flex;align-items:flex-end;overflow:hidden;border-radius:var(--r-lg);box-shadow:var(--sh-soft)}
.rc-bg{position:absolute;inset:0;width:100%;height:100%;transition:transform .8s var(--ez),filter .6s;filter:brightness(.44) saturate(.8)}
.rc:hover .rc-bg{transform:scale(1.05);filter:brightness(.3) saturate(.6)}
.rc-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(22,16,8,.95) 0%,rgba(22,16,8,.15) 60%,transparent 100%)}
.rc-ct{position:relative;z-index:2;padding:2.5rem;width:100%}
.rc-nm{font-family:var(--ff);font-size:4.2rem;font-weight:300;color:rgba(198,165,90,.13);line-height:1;margin-bottom:.9rem}
.rc-ca{font-size:.57rem;letter-spacing:.32em;text-transform:uppercase;color:var(--go);margin-bottom:.6rem}
.rc-na{font-family:var(--ff);font-size:1.65rem;color:var(--cr);margin-bottom:1.1rem}
.rc-l{list-style:none;margin-bottom:1.4rem}
.rc-l li{font-size:.79rem;color:rgba(250,247,242,.62);padding:.2rem 0;display:flex;align-items:center;gap:.6rem}
.rc-l li::before{content:'·';color:var(--go);font-size:1.1rem;line-height:1}
.rc-dc{font-size:.82rem;font-style:italic;color:rgba(250,247,242,.4);max-height:0;overflow:hidden;transition:max-height .5s var(--ez),margin .3s}
.rc:hover .rc-dc{max-height:80px;margin-bottom:1.2rem}
.bt-sec{padding:7rem 0;background:var(--cr)}
.bt-cs{display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;margin-top:4.5rem}
.bc{padding:3rem;border:1px solid var(--cr3);border-radius:var(--r-md);overflow:hidden;position:relative;transition:all .4s var(--sp);background:var(--cr);box-shadow:var(--sh-card)}
.bc::before{content:'';position:absolute;top:0;left:0;width:2px;height:0;background:var(--go);transition:height .5s var(--ez)}
.bc:hover::before{height:100%}
.bc:hover{border-color:rgba(198,165,90,.38);transform:translateY(-2px);box-shadow:0 8px 40px rgba(198,165,90,.12)}
.bc-iw{height:175px;overflow:hidden;margin:-3rem -3rem 2rem}
.bc-img{width:100%;height:100%;transition:transform .7s var(--ez);filter:brightness(.82)}
.bc:hover .bc-img{transform:scale(1.04)}
.bc-ic{font-size:1.5rem;color:var(--go);margin-bottom:1.3rem}
.bc h3{font-size:1.4rem;color:var(--tx);margin-bottom:1.3rem}
.bc-l{list-style:none}
.bc-l li{font-size:.83rem;color:var(--txm);padding:.48rem 0;border-bottom:1px solid var(--cr3);display:flex;align-items:center;gap:.8rem}
.bc-l li:last-child{border-bottom:none}
.bc-l li::before{content:'';width:18px;height:1px;background:var(--go);flex-shrink:0}
.ac-sec{padding:7rem 0;background:var(--cr2)}
.ac-in{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center}
.ac-h2{color:var(--tx);margin:1.2rem 0 1.4rem}.ac-h2 em{color:var(--go)}
.frm-l{list-style:none;margin:2.2rem 0}
.frm-l li{display:flex;gap:1.1rem;align-items:flex-start;padding:1.1rem 0;border-bottom:1px solid var(--cr3)}
.frm-l li:last-child{border-bottom:none}
.frm-nm{font-family:var(--ff);font-size:1.7rem;color:var(--go);font-weight:300;min-width:34px;line-height:1;margin-top:.2rem}
.frm-i h4{font-size:.9rem;color:var(--tx);margin-bottom:.2rem}
.frm-i p{font-size:.76rem;color:var(--txs);margin:0}
.ac-vis{position:relative;height:500px;border-radius:var(--r-lg);overflow:hidden}
.ac-img{width:100%;height:100%;object-fit:cover}
.ac-tag{position:absolute;bottom:2rem;left:2rem;background:var(--go);border-radius:var(--r-sm);padding:1.1rem 1.5rem}
.ac-tag h4{font-size:1.05rem;color:var(--es)}.ac-tag p{font-size:.68rem;color:rgba(22,16,8,.65);margin:.2rem 0 0}
.un-sec{padding:7rem 0;background:var(--cr2)}
.un-in{display:grid;grid-template-columns:1fr 1fr;gap:7rem;align-items:start}
.un-vis{position:relative;height:680px}
.un-img{position:absolute;right:0;top:0;width:82%;height:100%;border-radius:var(--r-lg);object-fit:cover}
.un-qb{position:absolute;left:0;bottom:4.5rem;background:var(--es);border-radius:var(--r-md);padding:2rem;max-width:290px;box-shadow:0 20px 60px rgba(22,16,8,.28)}
.un-qt{font-family:var(--ff);font-size:1rem;font-style:italic;color:var(--cr);line-height:1.65;margin-bottom:1.1rem}
.un-qa{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--go)}
.un-h2{color:var(--tx);margin:1.2rem 0 2.2rem}.un-h2 em{font-style:italic;color:var(--br)}
.story{padding:1.6rem 0;border-bottom:1px solid var(--cr3)}
.story:last-of-type{border-bottom:none}
.story-l{font-size:.58rem;letter-spacing:.28em;text-transform:uppercase;color:var(--go);margin-bottom:.7rem}
.story-t{font-size:.91rem;line-height:1.9;color:var(--txm)}
.vs-sec{padding:7rem 0;background:var(--cr);border-top:1px solid var(--cr3)}
.vs-g{display:grid;grid-template-columns:repeat(3,1fr);gap:3rem;margin-top:4rem}
.vs-i{text-align:center;padding:2.5rem 1.5rem}
.vs-n{font-family:var(--ff);font-size:4.5rem;font-weight:300;color:var(--go);opacity:.2;line-height:1;margin-bottom:.9rem}
.vs-i h3{font-size:1.2rem;color:var(--tx);margin-bottom:.9rem}.vs-i p{font-size:.83rem;color:var(--txs)}
.ex-sec{padding:7rem 0;background:var(--dk);position:relative}
.ex-sec::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 80% 50%,rgba(198,165,90,.04),transparent);pointer-events:none}
.ex-in{display:grid;grid-template-columns:1fr 2fr;gap:5.5rem;align-items:center}
.ex-l h2{font-size:clamp(2rem,3.5vw,3rem);color:var(--cr);margin:1.2rem 0 1.4rem}
.ex-l h2 em{color:var(--gop)}.ex-l p{color:rgba(250,247,242,.48);font-style:italic;font-size:.91rem}
.ex-g{display:grid;grid-template-columns:1fr 1fr;gap:1.3rem}
.ex-i{padding:2rem 1.8rem;border:1px solid rgba(255,255,255,.06);border-radius:var(--r-md);transition:all .4s}
.ex-i:hover{border-color:rgba(198,165,90,.32);background:rgba(198,165,90,.04)}
.ex-ic{font-size:1.4rem;color:var(--go);margin-bottom:.9rem}
.ex-i h4{font-size:.98rem;color:var(--cr);margin-bottom:.4rem}.ex-i p{font-size:.77rem;color:rgba(250,247,242,.43);margin:0}
.snsr{margin-top:6rem;display:grid;grid-template-columns:repeat(3,1fr);gap:1.8rem}
.sn{position:relative;height:380px;overflow:hidden;border-radius:var(--r-lg);box-shadow:var(--sh-soft)}
.sn-bg{position:absolute;inset:0;width:100%;height:100%;transition:transform .7s var(--ez),filter .5s;filter:brightness(.43)}
.sn:hover .sn-bg{transform:scale(1.05);filter:brightness(.28)}
.sn-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(22,16,8,.9) 0%,transparent 60%)}
.sn-ct{position:absolute;bottom:2.2rem;left:2.2rem;right:2.2rem;z-index:2}
.sn-l{font-size:.57rem;letter-spacing:.3em;text-transform:uppercase;color:var(--go);margin-bottom:.45rem}
.sn-ct h3{font-family:var(--ff);font-size:1.45rem;color:var(--cr)}
.sn-d{font-size:.79rem;color:rgba(250,247,242,.48);margin-top:.45rem;max-height:0;overflow:hidden;transition:max-height .5s var(--ez)}
.sn:hover .sn-d{max-height:60px}
.tm-sec{padding:7rem 0;background:var(--cr)}
.tm-g{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-top:4rem}
.tm{padding:2.2rem 1.8rem;background:var(--cr2);border:1px solid var(--cr3);border-radius:var(--r-md);transition:all .4s var(--sp);box-shadow:var(--sh-card)}
.tm:hover{border-color:var(--go);box-shadow:0 8px 40px rgba(198,165,90,.12);transform:translateY(-4px)}
.tm-q{font-family:var(--ff);font-size:3.2rem;color:var(--go);font-weight:300;line-height:.6;margin-bottom:1.3rem}
.tm-t{font-size:.85rem;font-style:italic;color:var(--txm);line-height:1.85;margin-bottom:1.3rem}
.tm-s{color:var(--go);font-size:.72rem;letter-spacing:.2em;margin-bottom:.65rem}
.tm-a{font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--tx)}.tm-sv{font-size:.68rem;color:var(--txs);margin-top:.2rem}
.ct-sec{padding:7rem 0;background:var(--es)}
.ct-in{display:grid;grid-template-columns:1fr 1fr;gap:5.5rem}
.ct-h2{color:var(--cr);margin:1.2rem 0 1rem}.ct-h2 em{color:var(--gop)}
.ct-fb{background:rgba(255,255,255,.03);padding:2.8rem;border:1px solid rgba(255,255,255,.07);border-radius:var(--r-lg)}
.ct-fb h3{font-family:var(--ff);font-size:1.6rem;color:var(--cr);margin-bottom:2.2rem}
.fsub-row{display:flex;gap:.8rem;margin-top:1.8rem;flex-wrap:wrap}
.fsub{flex:1;min-width:120px;padding:.85rem;background:var(--go);color:var(--es);font-family:var(--fs);font-size:.62rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;border:1px solid var(--go);transition:background .3s}
.fsub:hover:not(:disabled){background:var(--god)}.fsub:disabled{opacity:.38;cursor:not-allowed}
.fwa{flex:1;min-width:120px;padding:.85rem;background:transparent;color:rgba(250,247,242,.6);font-family:var(--fs);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;gap:.5rem;transition:all .35s}
.fwa:hover{background:#25D366;border-color:#25D366;color:white}
.ct-inf{display:flex;flex-direction:column}
.ct-ii{display:flex;gap:1.4rem;align-items:flex-start;padding:1.3rem 0;border-bottom:1px solid rgba(255,255,255,.07)}
.ct-ii:last-child{border-bottom:none}
.ct-ic{font-size:1rem;color:var(--go);min-width:18px;margin-top:.1rem}
.ct-ib h4{font-size:.8rem;color:var(--cr);font-family:var(--fs);font-weight:400;margin-bottom:.2rem}
.ct-ib p{font-size:.76rem;color:rgba(250,247,242,.43);margin:0}
.soc-r{display:flex;gap:.7rem;margin-top:2.2rem}
.soc-b{width:42px;height:42px;border:1px solid rgba(255,255,255,.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fs);font-size:.6rem;color:rgba(250,247,242,.38);transition:all .35s var(--sp);cursor:pointer;background:none;text-decoration:none}
.soc-b:hover{border-color:var(--go);color:var(--go);transform:translateY(-3px);box-shadow:0 6px 20px rgba(198,165,90,.2)}
.ft{background:var(--dk);padding:5rem 0 2.5rem;border-top:1px solid rgba(255,255,255,.05)}
.ft-in{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3.5rem;margin-bottom:3.5rem}
.ft-br-n{font-family:var(--ff);font-size:1.55rem;color:var(--cr);margin-bottom:.3rem;font-weight:400}
.ft-br-t{font-size:.53rem;letter-spacing:.35em;text-transform:uppercase;color:var(--go);display:block;margin-bottom:1.3rem}
.ft-br p{font-size:.79rem;color:rgba(250,247,242,.3);line-height:1.85}
.ft-col h4{font-family:var(--fs);font-size:.58rem;letter-spacing:.25em;text-transform:uppercase;color:rgba(250,247,242,.38);margin-bottom:1.3rem;font-weight:400}
.ft-lk{list-style:none;display:flex;flex-direction:column;gap:.65rem}
.ft-lk li button,.ft-lk li a{font-size:.8rem;color:rgba(250,247,242,.26);transition:color .3s;cursor:pointer;background:none;border:none;font-family:var(--fs);text-align:left;text-decoration:none}
.ft-lk li button:hover,.ft-lk li a:hover{color:var(--go)}
.ft-bt{padding-top:1.8rem;border-top:1px solid rgba(255,255,255,.05);display:flex;align-items:center;justify-content:space-between}
.ft-bt p{font-size:.68rem;color:rgba(250,247,242,.17)}
.ft-btl{list-style:none;display:flex;gap:2rem}
.ft-btl a{font-size:.66rem;color:rgba(250,247,242,.17);transition:color .3s;text-decoration:none}
.ft-btl a:hover{color:var(--go)}
.err-msg{color:#ff6b6b;font-size:.78rem;margin-top:.8rem;font-family:var(--fs)}
@media(max-width:1100px){.ft-in{grid-template-columns:1fr 1fr;gap:2.5rem}.ms-g{grid-template-columns:1fr 1fr}.tm-g{grid-template-columns:1fr 1fr}}
@media(max-width:900px){
.nav-l,.nav-r{display:none}.nav-bg{display:flex}.lat{display:none}
.prm-g{grid-template-columns:1fr 1fr}
.intro-in{grid-template-columns:1fr;gap:3.5rem}.i-img2,.i-bdg{display:none}.i-img{height:380px}
.rt-g{grid-template-columns:1fr}.bt-cs{grid-template-columns:1fr}
.ex-in{grid-template-columns:1fr;gap:3rem}.snsr{grid-template-columns:1fr}
.un-in{grid-template-columns:1fr;gap:3.5rem}.un-vis{height:380px}.un-img{width:100%}.un-qb{display:none}
.ac-in{grid-template-columns:1fr;gap:3.5rem}.ac-vis{height:340px;order:-1}
.ct-in{grid-template-columns:1fr;gap:4rem}.vs-g{grid-template-columns:1fr}
.ft-in{grid-template-columns:1fr 1fr;gap:2rem}.intro-pil{grid-template-columns:1fr}
.ex-g{grid-template-columns:1fr}.abo{flex-direction:column;text-align:center}.nav-i{padding:0 1.5rem}}
@media(max-width:640px){
.C,.Cs{padding:0 1.4rem}
.ms-g,.tm-g,.bt-cs,.prm-g{grid-template-columns:1fr}
.h-btns{flex-direction:column;align-items:center}
.ft-in{grid-template-columns:1fr}.ft-bt{flex-direction:column;gap:1rem}.ft-btl{display:none}
.fld-row,.dt-g,.cat-g{grid-template-columns:1fr}
.mbk-body{padding:1.5rem}.mbk-head{padding:1.5rem}.mbk-steps{padding:0 .5rem}.mbk-stp{font-size:.48rem;padding:.8rem .2rem}
.ph{height:48vh;min-height:320px}.rc{min-height:440px}}
`;

const WaSVG = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{width:25,height:25,fill:"white"}}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

function HeroParticles() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mobile = window.innerWidth < 768;
    const N1 = mobile ? 250 : 800, N2 = mobile ? 100 : 300;
    let renderer, frame;
    try {
      const w = el.clientWidth||window.innerWidth, h = el.clientHeight||window.innerHeight;
      const scene = new THREE.Scene();
      const cam = new THREE.PerspectiveCamera(60,w/h,0.1,100); cam.position.z=4;
      renderer = new THREE.WebGLRenderer({antialias:!mobile,alpha:true});
      renderer.setSize(w,h); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setClearColor(0,0);
      el.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style,{position:"absolute",inset:"0",width:"100%",height:"100%"});
      const mkPts=(n,sp,col,sz,op)=>{
        const pos=new Float32Array(n*3);
        for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*sp[0];pos[i*3+1]=(Math.random()-.5)*sp[1];pos[i*3+2]=(Math.random()-.5)*sp[2];}
        const g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.BufferAttribute(pos,3));
        const m=new THREE.PointsMaterial({color:col,size:sz,transparent:true,opacity:op,sizeAttenuation:true});
        return {pts:new THREE.Points(g,m),g,m};
      };
      const {pts:p1,g:g1,m:m1}=mkPts(N1,[14,9,7],0xC6A55A,.022,.55);
      const {pts:p2,g:g2,m:m2}=mkPts(N2,[12,8,5],0xE8D4A0,.011,.28);
      scene.add(p1,p2);
      let t=0;
      const anim=()=>{frame=requestAnimationFrame(anim);t+=.001;p1.rotation.y=t*.12;p1.rotation.x=t*.04;p2.rotation.y=-t*.08;p2.rotation.z=t*.03;const s=1+Math.sin(t*.5)*.03;p1.scale.set(s,s,s);renderer.render(scene,cam);};
      anim();
      const onR=()=>{if(!el||!renderer)return;const nw=el.clientWidth,nh=el.clientHeight;if(!nw||!nh)return;cam.aspect=nw/nh;cam.updateProjectionMatrix();renderer.setSize(nw,nh);};
      window.addEventListener("resize",onR,{passive:true});
      return ()=>{cancelAnimationFrame(frame);window.removeEventListener("resize",onR);try{if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);renderer.dispose();[g1,m1,g2,m2].forEach(x=>{try{x.dispose();}catch(e){}});}catch(e){}};
    } catch(e){return ()=>{try{cancelAnimationFrame(frame);}catch(e){}};}
  },[]);
  return <div ref={ref} className="h-3d" aria-hidden="true"/>;
}

function useReveal(dep) {
  useEffect(()=>{
    const t=setTimeout(()=>{
      const els=document.querySelectorAll(".rev:not(.v)");
      if(!els.length)return;
      const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("v");});},{threshold:0.08,rootMargin:"0px 0px -30px 0px"});
      els.forEach(el=>obs.observe(el));
      return ()=>obs.disconnect();
    },80);
    return ()=>clearTimeout(t);
  },[dep]);
}

function BookingModal({open,onClose}){
  const [step,setStep]=useState(1),[cat,setCat]=useState(null),[svc,setSvc]=useState(""),[dur,setDur]=useState("60 mn");
  const [date,setDate]=useState(""),[time,setTime]=useState(""),[name,setName]=useState(""),[phone,setPhone]=useState("");
  const [email,setEmail]=useState(""),[note,setNote]=useState(""),[done,setDone]=useState(false),[err,setErr]=useState("");
  const today=new Date().toISOString().split("T")[0];
  const svcs=cat==="massage"?MASSAGES.map(m=>({n:m.name,p:`${m.p60} / ${m.p90}`})):cat==="rituel"?RITUELS.map(r=>({n:r.name,p:"Sur demande"})):cat==="beaute"?BEAUTE.map(b=>({n:b.name,p:"Sur demande"})):FORMATIONS.map(f=>({n:f.name,p:"Sur demande"}));
  const confirm=()=>{
    if(!name.trim()||!phone.trim()){setErr("Veuillez renseigner votre nom et téléphone.");return;}
    setErr("");
    const msg=`Bonjour Maison Bahnel,\n\nJe souhaite réserver un soin.\n\nNom : ${name.trim()}\nTéléphone : ${phone.trim()}${email?"\nEmail : "+email:""}\n\nSoin : ${svc}\nDurée : ${dur}${date?"\nDate : "+date:""}${time?"\nHeure : "+time:""}${note?"\n\nNote : "+note:""}\n\nMerci !`;
    setDone(true); setTimeout(()=>{try{window.open(wa(msg),"_blank","noopener,noreferrer");}catch(e){};},500);
  };
  const reset=()=>{setStep(1);setCat(null);setSvc("");setDur("60 mn");setDate("");setTime("");setName("");setPhone("");setEmail("");setNote("");setDone(false);setErr("");};
  const handleClose=()=>{onClose();setTimeout(reset,500);};
  useEffect(()=>{const onKey=e=>{if(e.key==="Escape"&&open)handleClose();};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[open]);
  const SLBL=["Univers","Prestation","Planning","Coordonnées","Confirmation"];
  return(
    <div className={`mbk ${open?"op":""}`} role="dialog" aria-modal="true" aria-label="Réserver un soin" onClick={e=>{if(e.target===e.currentTarget)handleClose();}}>
      <div className="mbk-box">
        <div className="mbk-head">
          <h3 className="mbk-title">{done?"Réservation envoyée !":"Réserver un soin"}</h3>
          <button className="mbk-cl" onClick={handleClose} aria-label="Fermer">✕</button>
        </div>
        {!done&&<div className="mbk-steps">{SLBL.map((s,i)=><div key={i} className={`mbk-stp ${step===i+1?"ac":step>i+1?"dn":""}`}>{s}</div>)}</div>}
        <div className="mbk-body">
          {done?(
            <div style={{textAlign:"center",padding:"2rem 0"}}>
              <div style={{fontFamily:"var(--ff)",fontSize:"3.5rem",color:"var(--go)",marginBottom:"1rem",lineHeight:1}}>✦</div>
              <h3 style={{fontFamily:"var(--ff)",fontSize:"1.65rem",color:"var(--cr)",marginBottom:".9rem"}}>Merci, {name} !</h3>
              <p style={{color:"rgba(250,247,242,.52)",marginBottom:"2rem",fontSize:".88rem"}}>Votre demande a été envoyée via WhatsApp. Nous vous contacterons au <strong style={{color:"var(--go)"}}>+228 98 36 19 19</strong>.</p>
              <div style={{display:"flex",gap:"1rem",justifyContent:"center",flexWrap:"wrap"}}>
                <a href={wa(`Bonjour, je souhaite réserver : ${svc} à Maison Bahnel.`)} target="_blank" rel="noopener noreferrer" className="btn btg">Ouvrir WhatsApp</a>
                <button className="mbk-bk" onClick={handleClose}>Fermer</button>
              </div>
            </div>
          ):step===1?(
            <>
              <p style={{color:"rgba(250,247,242,.42)",fontSize:".84rem",marginBottom:"1.5rem"}}>Choisissez votre univers de soins.</p>
              <div className="cat-g">{BOOKING_CATS.map(c=><button key={c.id} className={`cat-c ${cat===c.id?"sl":""}`} onClick={()=>setCat(c.id)}><div className="cat-c-ic">{c.ic}</div><div className="cat-c-n">{c.n}</div><div className="cat-c-s">{c.s}</div></button>)}</div>
              <div className="mbk-nav"><button className="mbk-nx" disabled={!cat} onClick={()=>setStep(2)}>Continuer →</button></div>
            </>
          ):step===2?(
            <>
              <p style={{color:"rgba(250,247,242,.42)",fontSize:".84rem",marginBottom:"1.1rem"}}>Sélectionnez votre prestation.</p>
              <div className="svc-l">{svcs.map((s,i)=><button key={i} className={`svc-i ${svc===s.n?"sl":""}`} onClick={()=>setSvc(s.n)}><span className="svc-n">{s.n}</span><span className="svc-p">{s.p}</span></button>)}</div>
              {cat==="massage"&&<div className="dur-row">{["60 mn","90 mn"].map(d=><button key={d} className={`dur-btn ${dur===d?"sl":""}`} onClick={()=>setDur(d)}>{d}</button>)}</div>}
              <div className="mbk-nav"><button className="mbk-bk" onClick={()=>setStep(1)}>← Retour</button><button className="mbk-nx" disabled={!svc} onClick={()=>setStep(3)}>Continuer →</button></div>
            </>
          ):step===3?(
            <>
              <p style={{color:"rgba(250,247,242,.42)",fontSize:".84rem",marginBottom:"1.5rem"}}>Quand souhaitez-vous venir ?</p>
              <div className="dt-g">
                <div className="fld"><label htmlFor="bk-d">Date souhaitée</label><input id="bk-d" type="date" value={date} min={today} onChange={e=>setDate(e.target.value)}/></div>
                <div className="fld"><label htmlFor="bk-t">Heure</label><select id="bk-t" value={time} onChange={e=>setTime(e.target.value)}><option value="">Choisir...</option>{TIMES.map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="mbk-nav"><button className="mbk-bk" onClick={()=>setStep(2)}>← Retour</button><button className="mbk-nx" disabled={!date||!time} onClick={()=>setStep(4)}>Continuer →</button></div>
            </>
          ):step===4?(
            <>
              <p style={{color:"rgba(250,247,242,.42)",fontSize:".84rem",marginBottom:"1.5rem"}}>Vos coordonnées pour finaliser.</p>
              <div className="fld-row" style={{marginBottom:"1.2rem"}}>
                <div className="fld"><label htmlFor="bk-n">Prénom & Nom *</label><input id="bk-n" type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom" autoComplete="name"/></div>
                <div className="fld"><label htmlFor="bk-p">Téléphone *</label><input id="bk-p" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+228 ..." autoComplete="tel"/></div>
              </div>
              <div className="fld" style={{marginBottom:"1.2rem"}}><label htmlFor="bk-e">E-mail</label><input id="bk-e" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" autoComplete="email"/></div>
              <div className="fld"><label htmlFor="bk-no">Message (facultatif)</label><textarea id="bk-no" value={note} onChange={e=>setNote(e.target.value)} placeholder="Informations complémentaires..."/></div>
              {err&&<p className="err-msg">{err}</p>}
              <div className="mbk-nav"><button className="mbk-bk" onClick={()=>setStep(3)}>← Retour</button><button className="mbk-nx" disabled={!name.trim()||!phone.trim()} onClick={()=>setStep(5)}>Vérifier →</button></div>
            </>
          ):(
            <>
              <p style={{color:"rgba(250,247,242,.42)",fontSize:".84rem",marginBottom:"1.3rem"}}>Vérifiez votre réservation.</p>
              <div className="sum">{[["Prestation",svc],["Durée",dur],["Date",date],["Heure",time],["Nom",name],["Téléphone",phone],email&&["Email",email],note&&["Note",note]].filter(Boolean).map(([k,v],i)=><div key={i} className="sum-r"><span>{k}</span><span>{v}</span></div>)}</div>
              <div style={{marginTop:"1.2rem",padding:"1rem 1.4rem",background:"rgba(198,165,90,.07)",border:"1px solid rgba(198,165,90,.18)"}}>
                <p style={{fontSize:".77rem",color:"rgba(250,247,242,.52)",lineHeight:"1.7"}}>Vous serez redirigé(e) vers WhatsApp pour confirmer au <strong style={{color:"var(--go)"}}>+228 98 36 19 19</strong>.</p>
              </div>
              <div className="mbk-nav"><button className="mbk-bk" onClick={()=>setStep(4)}>← Modifier</button><button className="mbk-nx" onClick={confirm}>Confirmer sur WhatsApp →</button></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PH({img,eye,t1,t1em,sub}){
  return(
    <div className="ph">
      <div className="ph-bg" style={{backgroundImage:`url('${img}')`}} aria-hidden="true"/>
      <div className="ph-ov" aria-hidden="true"/>
      <div className="ph-ct">{eye&&<p className="ey">{eye}</p>}<h1>{t1}{t1em&&<> <em>{t1em}</em></>}</h1>{sub&&<p>{sub}</p>}</div>
    </div>
  );
}

function HomePage({nav,book}){
  useReveal("home");
  return(
    <main>
      <section id="hero">
        <div className="h-bg" id="heroBg" aria-hidden="true"/>
        <div className="h-ov" aria-hidden="true"/>
        <HeroParticles/>
        <div className="h-ct">
          <p className="h-pre">Lomé, Togo · Sanctuaire de Bien-être</p>
          <h1 className="h-t1">Maison&nbsp;<em>Bahnel</em></h1>
          <div className="h-div" aria-hidden="true"><span>Spa</span><span>·</span><span>Beauté</span><span>·</span><span>Bien-être</span></div>
          <p className="h-tag">Un sanctuaire de beauté, de bien-être<br/>et de transformation.</p>
          <div className="h-btns">
            <button onClick={book} className="btn btg">Réserver maintenant</button>
            <button onClick={()=>nav("massages")} className="btn bto"><span>Découvrir nos soins</span></button>
          </div>
        </div>
        <button className="h-sc" onClick={()=>document.querySelector(".prm")?.scrollIntoView({behavior:"smooth"})} aria-label="Défiler vers le bas">
          <div className="h-sc-l" aria-hidden="true"/><span>Découvrir</span>
        </button>
      </section>

      <section className="prm">
        <div className="prm-g">
          {[{n:"01",nm:"Bahnel Massage",d:"Massages thérapeutiques et rituels sensoriels pour une détente profonde du corps et de l'esprit.",p:"massages"},
            {n:"02",nm:"Bahnel Beauty",d:"Onglerie d'exception, soins du visage et coiffure pour sublimer votre beauté naturelle.",p:"beaute"},
            {n:"03",nm:"Les Rituels",d:"Expériences sensorielles immersives mêlant gommage, enveloppement, massage et soin visage.",p:"rituels"},
            {n:"04",nm:"L'Académie",d:"Formations professionnelles en massage, esthétique et bien-être pour l'excellence du soin.",p:"academie"}
          ].map((x,i)=>(
            <div key={i} className="prm-i rev" onClick={()=>nav(x.p)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&nav(x.p)}>
              <div className="prm-n" aria-hidden="true">{x.n}</div>
              <p className="prm-nm" style={{fontFamily:"var(--ff)",fontSize:"1.3rem",color:"var(--cr)",marginBottom:".6rem"}}>{x.nm}</p>
              <p className="prm-d">{x.d}</p>
              <span className="prm-lk" aria-hidden="true">Explorer →</span>
            </div>
          ))}
        </div>
      </section>

      <section className="intro">
        <div className="C">
          <div className="intro-in">
            <div>
              <p className="ey rev">Notre maison</p>
              <h2 className="intro-h2 rev d1">L'art du soin,<br/>du toucher et de la <em>féminité</em></h2>
              <p className="rev d1" style={{fontSize:"1rem",marginBottom:"1.3rem"}}>Maison Bahnel est née d'une conviction profonde : dans un monde où tout va trop vite, le soin doit redevenir un moment de reconnexion, de douceur et de présence à soi.</p>
              <p className="rev d2" style={{fontSize:"1rem"}}>Ici, chaque geste est pensé, chaque détail est choisi, et chaque soin est conçu comme une expérience globale où le corps et l'esprit se retrouvent.</p>
              <button onClick={()=>nav("univers")} className="btn bto rev d2" style={{marginTop:"2rem"}}><span>Notre histoire</span></button>
              <div className="intro-pil" style={{marginTop:"3rem"}}>
                {[["I","Authenticité","Soins pensés avec sincérité"],["II","Excellence","Exigence dans chaque détail"],["III","Bien-être","Approche holistique du corps"]].map(([n,t,s],i)=>(
                  <div key={i} className={`pil rev d${i+1}`}><div className="pil-n" aria-hidden="true">{n}</div><h3 className="pil" style={{fontSize:".85rem",letterSpacing:".1em",fontFamily:"var(--fs)",fontWeight:500,color:"var(--tx)",marginBottom:".35rem"}}>{t}</h3><p>{s}</p></div>
                ))}
              </div>
            </div>
            <div className="intro-vis rev d2">
              <img src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80&auto=format&fit=crop" alt="Ambiance Maison Bahnel" className="i-img" loading="lazy" width="800" height="600" onError={imgFallback}/>
              <img src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80&auto=format&fit=crop" alt="Soin Maison Bahnel" className="i-img2" loading="lazy" width="400" height="185" onError={imgFallback}/>
              <div className="i-bdg"><span className="i-bdg-n">100%</span><span className="i-bdg-l">Holistique</span></div>
            </div>
          </div>
        </div>
      </section>

      <blockquote className="qi rev">
        <div className="Cs">
          <p style={{fontFamily:"var(--ff)",fontSize:"clamp(1.4rem,2.8vw,2.5rem)",fontStyle:"italic",fontWeight:300,color:"var(--br)",lineHeight:1.55,maxWidth:"800px",margin:"0 auto"}}>« Le bien-être ne vient pas uniquement de ce que l'on voit dans le miroir, mais aussi de ce que l'on ressent profondément à l'intérieur. »</p>
          <cite style={{display:"block",fontFamily:"var(--fs)",fontStyle:"normal",fontSize:".62rem",letterSpacing:".28em",textTransform:"uppercase",color:"var(--god)",marginTop:"2rem"}}>— La Fondatrice, Maison Bahnel</cite>
        </div>
      </blockquote>

      <section style={{padding:"7rem 0",background:"var(--cr)"}}>
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center"}}>Nos soins phares</p><h2>Massages <em>d'exception</em></h2><div className="rule"/><p>Une sélection de nos soins les plus appréciés.</p></div>
          <div className="ms-g">
            {MASSAGES.slice(0,3).map((m,i)=>(
              <article key={m.id} className={`mc rev d${i}`}>
                <div className="mc-iw"><img src={m.img} alt={m.name} className="mc-img" loading="lazy" width="700" height="467" onError={imgFallback}/></div>
                <div className="mc-b"><p className="mc-cat">{m.cat}</p><h3 className="mc-n">{m.name}</h3><p className="mc-d">{m.desc}</p></div>
                <div className="mc-ft">
                  <div className="mc-ps"><span className="mc-p">{m.p60} <span>/ 60 mn</span></span><span className="mc-p">{m.p90} <span>/ 90 mn</span></span></div>
                  <button className="btsm" onClick={book}>Réserver</button>
                </div>
              </article>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"3rem"}}><button onClick={()=>nav("massages")} className="btn bto"><span>Voir tous les massages</span></button></div>
        </div>
      </section>

      <section className="tm-sec">
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center"}}>Témoignages</p><h2>Elles nous font <em>confiance</em></h2></div>
          <div className="tm-g">
            {TEMOIGNAGES.map((t,i)=>(
              <article key={i} className={`tm rev d${i}`}>
                <div className="tm-q" aria-hidden="true">"</div>
                <p className="tm-t">{t.text}</p>
                <p className="tm-s" aria-label="5 étoiles">★★★★★</p>
                <p className="tm-a">{t.author}</p><p className="tm-sv">{t.soin}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function MassagesPage({book}){
  useReveal("massages");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&q=80&auto=format&fit=crop" eye="Bahnel Massage" t1="L'art du" t1em="toucher" sub="10 massages d'exception conçus comme des expériences sensorielles uniques."/>
      <section className="ms-sec">
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center"}}>Nos massages</p><h2>10 soins <em>d'exception</em></h2><div className="rule"/><p>Chaque massage alliant technique, intention et présence pour une détente profonde.</p></div>
          <div className="ms-g">
            {MASSAGES.map((m,i)=>(
              <article key={m.id} className={`mc rev d${i%3}`}>
                <div className="mc-iw"><img src={m.img} alt={m.name} className="mc-img" loading="lazy" width="700" height="467" onError={imgFallback}/></div>
                <div className="mc-b"><p className="mc-cat">{m.cat}</p><h3 className="mc-n">{m.name}</h3><p className="mc-d">{m.desc}</p><ul className="mc-bl">{m.benefits.map((b,j)=><li key={j}>{b}</li>)}</ul></div>
                <div className="mc-ft">
                  <div className="mc-ps"><span className="mc-p">{m.p60} <span>/ 60 mn</span></span><span className="mc-p">{m.p90} <span>/ 90 mn</span></span></div>
                  <button className="btsm" onClick={book}>Réserver</button>
                </div>
              </article>
            ))}
          </div>
          <div className="abo rev">
            <div className="abo-t"><h4>Abonnement Bien-être — 10 Séances</h4><p>Engagez-vous dans un programme complet et bénéficiez d'une réduction exclusive.</p></div>
            <div className="abo-b" aria-label="Réduction 20%">−20%</div>
            <a href={wa("Bonjour, je souhaite des informations sur l'abonnement 10 séances Maison Bahnel.")} target="_blank" rel="noopener noreferrer" className="btn bto"><span>En savoir plus</span></a>
          </div>
        </div>
      </section>
    </main>
  );
}

function RituelsPage({book}){
  useReveal("rituels");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1920&q=80&auto=format&fit=crop" eye="Expériences Sensorielles" t1="Nos" t1em="Rituels" sub="Bien plus que des soins — des voyages immersifs où chaque sens est éveillé."/>
      <section className="rt-sec">
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center",color:"var(--go)"}}>Rituels signature</p><h2>Des expériences <em>inoubliables</em></h2><div className="rule"/></div>
          <div className="rt-g">
            {RITUELS.map((r,i)=>(
              <article key={r.id} className={`rc rev d${i}`}>
                <img src={r.img} alt={r.name} className="rc-bg" loading="lazy" width="900" height="600" onError={imgFallback}/>
                <div className="rc-ov" aria-hidden="true"/>
                <div className="rc-ct">
                  <div className="rc-nm" aria-hidden="true">{r.num}</div>
                  <p className="rc-ca">{r.cat}</p>
                  <h3 className="rc-na">{r.name}</h3>
                  <ul className="rc-l">{r.includes.map((x,j)=><li key={j}>{x}</li>)}</ul>
                  <p className="rc-dc">{r.desc}</p>
                  <button className="btsm" onClick={book} style={{marginTop:"1.4rem",borderColor:"rgba(198,165,90,.5)",color:"var(--gop)"}}>Réserver ce rituel</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function BeautePage({book}){
  useReveal("beaute");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80&auto=format&fit=crop" eye="Bahnel Beauty" t1="La" t1em="beauté sublimée" sub="Une approche raffinée où chaque soin célèbre votre féminité naturelle."/>
      <section className="bt-sec">
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center"}}>Nos services</p><h2>Beauté <em>d'exception</em></h2><div className="rule"/><p>Des soins premium pensés pour sublimer votre beauté naturelle.</p></div>
          <div className="bt-cs">
            {BEAUTE.map((b,i)=>(
              <article key={b.id} className={`bc rev d${i%2}`}>
                <div className="bc-iw"><img src={b.img} alt={b.name} className="bc-img" loading="lazy" width="600" height="400" onError={imgFallback}/></div>
                <div className="bc-ic" aria-hidden="true">{b.icon}</div>
                <h3>{b.name}</h3>
                <ul className="bc-l">{b.services.map((s,j)=><li key={j}>{s}</li>)}</ul>
                <button onClick={book} className="btn bto" style={{marginTop:"2rem"}}><span>Prendre rendez-vous</span></button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function AcademiePage(){
  useReveal("academie");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1581088669936-e20c38ff0c36?w=1920&q=80&auto=format&fit=crop" eye="Formation & Excellence" t1="L'Académie" t1em="Maison Bahnel" sub="Transmettre un savoir-faire d'exception et une philosophie du soin."/>
      <section className="ac-sec">
        <div className="C">
          <div className="ac-in">
            <div>
              <p className="ey rev">Formations professionnelles</p>
              <h2 className="ac-h2 rev d1">Former les <em>experts</em><br/>de demain</h2>
              <p className="rev d1">Transmettre un savoir-faire d'exception, une philosophie du soin et une exigence de qualité à travers des formations professionnelles rigoureuses.</p>
              <p className="rev d2" style={{marginTop:"1rem"}}>Parce que l'excellence du bien-être commence par la formation de ceux qui en font leur vocation.</p>
              <ul className="frm-l rev d2">{FORMATIONS.map((f,i)=><li key={i}><span className="frm-nm">{f.num}</span><div className="frm-i"><h4>{f.name}</h4><p>{f.sub}</p></div></li>)}</ul>
              <a href={wa("Bonjour, je souhaite des informations sur les formations de l'Académie Maison Bahnel.")} target="_blank" rel="noopener noreferrer" className="btn bto rev d3"><span>Rejoindre l'Académie</span></a>
            </div>
            <div className="ac-vis rev d2">
              <img src="https://images.unsplash.com/photo-1581088669936-e20c38ff0c36?w=700&q=80&auto=format&fit=crop" alt="Académie Maison Bahnel" className="ac-img" loading="lazy" width="700" height="500" onError={imgFallback}/>
              <div className="ac-tag"><h4>Prochaine Session</h4><p>Informations sur WhatsApp</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function UniversPage(){
  useReveal("univers");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1920&q=80&auto=format&fit=crop" eye="Mon Univers" t1="Un parcours" t1em="de vie" sub="L'histoire d'une femme, d'un retour à soi, et d'une maison née de cette renaissance."/>
      <section className="un-sec">
        <div className="C">
          <div className="un-in">
            <div className="un-vis rev">
              <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=700&q=80&auto=format&fit=crop" alt="La fondatrice de Maison Bahnel" className="un-img" loading="lazy" width="700" height="680" onError={imgFallback}/>
              <figure className="un-qb">
                <blockquote className="un-qt">« Ce qui n'était au départ qu'une manière de prendre soin de proches est devenu une évidence absolue. »</blockquote>
                <figcaption className="un-qa">La Fondatrice, Maison Bahnel</figcaption>
              </figure>
            </div>
            <div>
              <p className="ey rev">Mon histoire</p>
              <h2 className="un-h2 rev d1">Une maison née<br/>d'un <em>parcours de vie</em></h2>
              {[{l:"Les Origines",t:"Je suis née à Lomé, une enfance douce et privilégiée où l'élégance, le goût du beau et le sens du travail ont très tôt façonné ma vision du monde. Après une maîtrise en sciences de gestion à l'Université d'Abidjan, ma carrière m'a menée de CI Telecom au commerce international, entre Paris et Taipei."},
                {l:"L'Éveil Asiatique",t:"La Chine et l'Asie ont été pour moi bien plus qu'un voyage : un véritable éveil. J'y ai découvert une philosophie de vie où le calme, l'équilibre et l'énergie occupent une place essentielle. Cette culture du bien-être a profondément transformé ma vision du soin."},
                {l:"La Renaissance",t:"Après des épreuves personnelles qui m'ont profondément transformée, j'ai choisi de revenir à Lomé avec une seule intention : me reconstruire. C'est dans cette période de renaissance qu'est née ma passion pour le soin, portée par mon amour de l'art, des espaces et de l'esthétique."},
                {l:"Ma Vision du Soin",t:"Chez Maison Bahnel, le soin ne se limite pas à l'apparence. Ma vision est profondément holistique : prendre soin du corps, des émotions, de l'énergie et du bien-être intérieur. Un vrai soin permet de ralentir, respirer, relâcher les tensions et retrouver l'équilibre intérieur."},
                {l:"Maison Bahnel",t:"Aujourd'hui, Maison Bahnel est l'expression de ce parcours. Un lieu pensé comme un refuge élégant et apaisant, où la beauté rencontre le soin, où chaque détail est imaginé pour faire du bien au corps, à l'esprit et aux émotions. Plus qu'un institut, une maison née d'une passion sincère."}
              ].map((s,i)=><div key={i} className={`story rev d${Math.min(i,3)}`}><p className="story-l">{s.l}</p><p className="story-t">{s.t}</p></div>)}
            </div>
          </div>
        </div>
      </section>
      <section className="vs-sec">
        <div className="C">
          <div className="shd rev"><p className="ey" style={{justifyContent:"center"}}>Le Futur</p><h2>Une vision <em>en expansion</em></h2><div className="rule"/><p>Maison Bahnel est née d'une passion pour le soin. Ce n'est que le début d'une vision beaucoup plus grande.</p></div>
          <div className="vs-g">
            {[{n:"01",t:"Un Lieu d'Exception",p:"Développer un espace encore plus immersif, pensé comme une véritable maison du bien-être : élégante, apaisante et profondément sensorielle."},
              {n:"02",t:"L'Académie Bahnel",p:"Transmettre un savoir-faire et une philosophie du soin. Former une nouvelle génération de professionnels engagés dans l'excellence."},
              {n:"03",t:"Une Marque Globale",p:"Développer l'univers Maison Bahnel au-delà des soins : produits, rituels signature, contenus, collaborations et événements bien-être."}
            ].map((v,i)=><div key={i} className={`vs-i rev d${i}`}><div className="vs-n" aria-hidden="true">{v.n}</div><h3>{v.t}</h3><p>{v.p}</p></div>)}
          </div>
        </div>
      </section>
    </main>
  );
}

function ExperiencePage(){
  useReveal("experience");
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80&auto=format&fit=crop" eye="Notre Atmosphère" t1="L'Expérience" t1em="Maison Bahnel" sub="Votre force n'est pas seulement la technique. C'est l'atmosphère."/>
      <section className="ex-sec">
        <div className="C">
          <div className="ex-in">
            <div>
              <p className="ey rev" style={{color:"var(--go)"}}>Votre sanctuaire</p>
              <h2 className="rev d1" style={{fontSize:"clamp(2rem,3.5vw,3rem)",color:"var(--cr)",margin:"1.2rem 0 1.4rem"}}>Tous les sens<br/><em style={{color:"var(--gop)"}}>éveillés</em></h2>
              <div className="rule" style={{margin:"1.4rem 0"}} aria-hidden="true"/>
              <p className="rev d2" style={{color:"rgba(250,247,242,.48)",fontStyle:"italic"}}>Un espace où chaque sens est éveillé pour une reconnexion totale à vous-même.</p>
            </div>
            <div className="ex-g">
              {[{i:"◈",t:"Senteurs d'Exception",p:"Des huiles essentielles soigneusement sélectionnées pour une atmosphère olfactive apaisante et unique."},
                {i:"✦",t:"Ambiance Sensorielle",p:"Musique douce, lumières tamisées et atmosphère pensée dans les moindres détails pour votre confort."},
                {i:"◇",t:"Accueil Chaleureux",p:"Boissons chaudes, serviettes moelleuses et un accueil sincère pour vous mettre immédiatement à l'aise."},
                {i:"✧",t:"Présence & Écoute",p:"Chaque soin est adapté à vos besoins du moment. Votre bien-être est notre seule et unique priorité."}
              ].map((e,i)=><div key={i} className={`ex-i rev d${i}`}><div className="ex-ic" aria-hidden="true">{e.i}</div><h4 style={{fontSize:".98rem",color:"var(--cr)",marginBottom:".4rem",fontFamily:"var(--ff)"}}>{e.t}</h4><p>{e.p}</p></div>)}
            </div>
          </div>
          <div className="snsr">
            {[{img:"https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=700&q=80&auto=format&fit=crop",l:"Le silence",t:"Le Cocon",d:"Un espace de silence et de sérénité qui vous enveloppe dès que vous franchissez la porte."},
              {img:"https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&q=80&auto=format&fit=crop",l:"Le toucher",t:"Le Soin",d:"Des mains expertes et attentionnées qui connaissent le langage du corps et de l'émotion."},
              {img:"https://images.unsplash.com/photo-1614159102271-2e93da5ee297?w=700&q=80&auto=format&fit=crop",l:"Les senteurs",t:"L'Éveil",d:"Des fragrances soigneusement choisies pour éveiller vos sens et approfondir la détente."}
            ].map((s,i)=>(
              <article key={i} className="sn">
                <img src={s.img} alt={s.t} className="sn-bg" loading="lazy" width="700" height="400" onError={imgFallback}/>
                <div className="sn-ov" aria-hidden="true"/>
                <div className="sn-ct"><p className="sn-l">{s.l}</p><h3>{s.t}</h3><p className="sn-d">{s.d}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactPage({book}){
  const [fn,setFn]=useState(""),[fp,setFp]=useState(""),[fe,setFe]=useState(""),[fs,setFs]=useState(""),[fm,setFm]=useState(""),[sent,setSent]=useState(false),[err,setErr]=useState("");
  useReveal("contact");
  const allSvcs=[...MASSAGES.map(m=>m.name),...RITUELS.map(r=>r.name),...BEAUTE.map(b=>b.name),...FORMATIONS.map(f=>f.name)];
  const submit=()=>{
    if(!fn.trim()){setErr("Veuillez renseigner votre nom.");return;}
    if(!fp.trim()){setErr("Veuillez renseigner votre téléphone.");return;}
    setErr("");
    const msg=`Bonjour Maison Bahnel,\n\nNom : ${fn.trim()}\nTéléphone : ${fp.trim()}${fe?"\nEmail : "+fe:""}${fs?"\nSoin : "+fs:""}${fm?"\n\nMessage : "+fm:""}\n\nMerci !`;
    setSent(true); setTimeout(()=>{try{window.open(wa(msg),"_blank","noopener,noreferrer");}catch(e){};},500);
  };
  return(
    <main>
      <PH img="https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&q=80&auto=format&fit=crop" eye="Contact & Réservation" t1="Prenons" t1em="soin de vous" sub="Réservez votre moment de bien-être ou contactez-nous pour toute question."/>
      <section className="ct-sec">
        <div className="C">
          <div className="ct-in">
            <div>
              <p className="ey rev" style={{color:"var(--go)"}}>Nous trouver</p>
              <h2 className="ct-h2 rev d1">Un moment<br/><em>rien que pour vous</em></h2>
              <p className="rev d1" style={{color:"rgba(250,247,242,.48)",marginBottom:"2.5rem",fontSize:".9rem"}}>Nous sommes là pour vous accueillir avec soin et douceur.</p>
              <div className="ct-inf rev d2">
                {[{i:"◈",t:"WhatsApp & Téléphone",p:"+228 98 36 19 19"},{i:"◇",t:"Localisation",p:"Lomé, Togo"},{i:"✦",t:"Horaires",p:"Lun – Sam : 9h00 – 20h00 · Dim : Sur rendez-vous"}].map((c,i)=>(
                  <div key={i} className="ct-ii"><span className="ct-ic" aria-hidden="true">{c.i}</span><div className="ct-ib"><h4>{c.t}</h4><p>{c.p}</p></div></div>
                ))}
              </div>
              <div className="soc-r rev d3">
                <button className="soc-b" aria-label="Instagram">IG</button>
                <button className="soc-b" aria-label="TikTok">TK</button>
                <a href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer" className="soc-b" aria-label="WhatsApp">WA</a>
              </div>
              <div style={{marginTop:"2.5rem"}} className="rev d3">
                <button onClick={book} className="btn btg" style={{display:"inline-flex",gap:".7rem"}}>Réserver un soin →</button>
              </div>
            </div>
            <div className="ct-fb rev d2">
              {sent?(
                <div style={{textAlign:"center",padding:"2rem 0"}}>
                  <div style={{fontFamily:"var(--ff)",fontSize:"3.5rem",color:"var(--go)",marginBottom:"1rem",lineHeight:1}}>✦</div>
                  <h3 style={{fontFamily:"var(--ff)",fontSize:"1.6rem",color:"var(--cr)",marginBottom:"1rem"}}>Message envoyé !</h3>
                  <p style={{color:"rgba(250,247,242,.5)",marginBottom:"2rem",fontSize:".88rem"}}>Merci. Nous vous répondrons très prochainement via WhatsApp.</p>
                  <button onClick={()=>setSent(false)} className="btn bto"><span>Nouveau message</span></button>
                </div>
              ):(
                <>
                  <h3>Nous écrire</h3>
                  <div className="fld-row" style={{marginBottom:"1.2rem"}}>
                    <div className="fld"><label htmlFor="ct-n">Nom *</label><input id="ct-n" type="text" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Votre nom" autoComplete="name"/></div>
                    <div className="fld"><label htmlFor="ct-p">Téléphone *</label><input id="ct-p" type="tel" value={fp} onChange={e=>setFp(e.target.value)} placeholder="+228 ..." autoComplete="tel"/></div>
                  </div>
                  <div className="fld" style={{marginBottom:"1.2rem"}}><label htmlFor="ct-e">Email</label><input id="ct-e" type="email" value={fe} onChange={e=>setFe(e.target.value)} placeholder="votre@email.com" autoComplete="email"/></div>
                  <div className="fld" style={{marginBottom:"1.2rem"}}>
                    <label htmlFor="ct-s">Soin souhaité</label>
                    <select id="ct-s" value={fs} onChange={e=>setFs(e.target.value)}>
                      <option value="">Sélectionner...</option>
                      {allSvcs.map((o,i)=><option key={i} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="fld"><label htmlFor="ct-m">Message</label><textarea id="ct-m" value={fm} onChange={e=>setFm(e.target.value)} placeholder="Informations complémentaires..."/></div>
                  {err&&<p className="err-msg">{err}</p>}
                  <div className="fsub-row">
                    <button className="fsub" onClick={submit} disabled={!fn.trim()||!fp.trim()}>Envoyer le message</button>
                    <button className="fwa" onClick={()=>{try{window.open(wa(`Bonjour, je souhaite un rendez-vous à Maison Bahnel${fs?" pour : "+fs:""}.`),"_blank","noopener,noreferrer");}catch(e){};}}><WaSVG/> WhatsApp direct</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Navbar({nav,book}){
  const [sc,setSc]=useState(false),[op,setOp]=useState(false);
  useEffect(()=>{
    const onS=()=>setSc(window.scrollY>70);
    window.addEventListener("scroll",onS,{passive:true});
    return()=>window.removeEventListener("scroll",onS);
  },[]);
  const go=(p)=>{setOp(false);document.body.style.overflow="";nav(p);};
  const toggle=()=>{const n=!op;setOp(n);document.body.style.overflow=n?"hidden":"";};
  useEffect(()=>{
    const onK=e=>{if(e.key==="Escape"&&op){setOp(false);document.body.style.overflow="";}};
    window.addEventListener("keydown",onK);
    return()=>window.removeEventListener("keydown",onK);
  },[op]);
  const LEFT=[["massages","Massages"],["rituels","Rituels"],["beaute","Beauté"]];
  const RIGHT=[["academie","Académie"],["univers","Mon Univers"],["experience","Expérience"]];
  const ALL=[["home","Accueil"],["massages","Massages"],["rituels","Rituels"],["beaute","Beauté"],["academie","Académie"],["univers","Mon Univers"],["experience","Expérience"],["contact","Contact"]];
  return(
    <>
      <header>
        <nav className={`nav ${sc?"sc":""}`} role="navigation" aria-label="Navigation principale">
          <div className="nav-i">
            <ul className="nav-l">
              {LEFT.map(([p,l])=><li key={p}><a role="button" tabIndex={0} onClick={()=>go(p)} onKeyDown={e=>e.key==="Enter"&&go(p)}>{l}</a></li>)}
            </ul>
            <button className="nav-logo" onClick={()=>go("home")} aria-label="Maison Bahnel — Accueil">
              <img src={`${import.meta.env.BASE_URL}img/logo-mb.png`} alt="Maison Bahnel" className="nav-logo-img" width="58" height="58" onError={imgFallback}/>
              <span className="nav-logo-t">Spa · Beauté · Bien-être</span>
            </button>
            <ul className="nav-r">
              {RIGHT.map(([p,l])=><li key={p}><button onClick={()=>go(p)}>{l}</button></li>)}
              <li><button className="nav-res" onClick={book}>Réserver</button></li>
            </ul>
            <button className={`nav-bg ${op?"op":""}`} onClick={toggle} aria-label={op?"Fermer le menu":"Ouvrir le menu"} aria-expanded={op}>
              <span/><span/><span/>
            </button>
          </div>
        </nav>
      </header>
      <div className={`mov ${op?"op":""}`} role="dialog" aria-modal="true" aria-label="Menu navigation">
        <button className="mov-cl" onClick={toggle}>Fermer ✕</button>
        {ALL.map(([p,l])=><button key={p} onClick={()=>go(p)}>{l}</button>)}
      </div>
    </>
  );
}

function Footer({nav}){
  return(
    <footer className="ft" role="contentinfo">
      <div className="C">
        <div className="ft-in">
          <div className="ft-br">
            <p className="ft-br-n" style={{fontFamily:"var(--ff)",fontSize:"1.55rem",color:"var(--cr)",marginBottom:".3rem",fontWeight:400}}>Maison Bahnel</p>
            <span className="ft-br-t">Spa · Beauté · Bien-être · Lomé, Togo</span>
            <p>Un sanctuaire de beauté, de bien-être et de transformation au cœur de Lomé. Une maison née d'une passion profonde pour le soin, le raffinement et l'art de prendre soin des autres avec élégance et authenticité.</p>
          </div>
          <div className="ft-col">
            <h4>Nos Soins</h4>
            <ul className="ft-lk">
              {[["massages","Bahnel Massage"],["rituels","Nos Rituels"],["beaute","Bahnel Beauty"],["academie","L'Académie"]].map(([p,l])=><li key={p}><button onClick={()=>nav(p)}>{l}</button></li>)}
            </ul>
          </div>
          <div className="ft-col">
            <h4>L'Univers</h4>
            <ul className="ft-lk">
              {[["univers","Mon Univers"],["experience","L'Expérience"],["contact","Contact"]].map(([p,l])=><li key={p}><button onClick={()=>nav(p)}>{l}</button></li>)}
            </ul>
          </div>
          <div className="ft-col">
            <h4>Contact</h4>
            <ul className="ft-lk">
              <li><a href={wa("Bonjour Maison Bahnel !")} target="_blank" rel="noopener noreferrer">+228 98 36 19 19</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#tiktok">TikTok</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bt">
          <p>© 2024 Maison Bahnel. Tous droits réservés. Lomé, Togo.</p>
          <ul className="ft-btl">
            <li><a href="#confidentialite">Confidentialité</a></li>
            <li><a href="#mentions">Mentions légales</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function App(){
  const [page,setPage]=useState("home"),[vis,setVis]=useState(true);
  const [loading,setLoading]=useState(true),[bookOpen,setBookOpen]=useState(false);
  const curRef=useRef(null),ringRef=useRef(null),rafRef=useRef(null);
  const mouse=useRef({x:0,y:0}),ring=useRef({x:0,y:0});

  // Inject CSS
  useEffect(()=>{
    if(document.getElementById("mb-css"))return;
    const el=document.createElement("style"); el.id="mb-css"; el.textContent=CSS;
    document.head.appendChild(el);
    return()=>{const s=document.getElementById("mb-css");if(s)s.remove();};
  },[]);

  // Loader
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),2000);return()=>clearTimeout(t);},[]);

  // Cursor (desktop only)
  useEffect(()=>{
    const isTouch="ontouchstart" in window||navigator.maxTouchPoints>0;
    if(isTouch)return;
    const onM=e=>{
      mouse.current={x:e.clientX,y:e.clientY};
      if(curRef.current){curRef.current.style.left=e.clientX+"px";curRef.current.style.top=e.clientY+"px";curRef.current.classList.add("vis");}
    };
    const animate=()=>{
      const dx=mouse.current.x-ring.current.x, dy=mouse.current.y-ring.current.y;
      ring.current.x+=dx*0.13; ring.current.y+=dy*0.13;
      if(ringRef.current){ringRef.current.style.left=ring.current.x+"px";ringRef.current.style.top=ring.current.y+"px";ringRef.current.classList.add("vis");}
      rafRef.current=requestAnimationFrame(animate);
    };
    rafRef.current=requestAnimationFrame(animate);
    window.addEventListener("mousemove",onM,{passive:true});
    return()=>{window.removeEventListener("mousemove",onM);cancelAnimationFrame(rafRef.current);};
  },[]);

  // Hero parallax
  useEffect(()=>{
    const onS=()=>{const bg=document.getElementById("heroBg");if(!bg)return;if(window.scrollY<window.innerHeight*1.2)bg.style.transform=`translateY(${window.scrollY*0.36}px) scale(1.1)`;};
    window.addEventListener("scroll",onS,{passive:true});
    return()=>window.removeEventListener("scroll",onS);
  },[page]);

  const navigate=useCallback((target)=>{
    if(target===page){window.scrollTo({top:0,behavior:"smooth"});return;}
    setVis(false);
    window.scrollTo({top:0,behavior:"instant"});
    setTimeout(()=>{setPage(target);setVis(true);},300);
  },[page]);

  const openBook=useCallback(()=>setBookOpen(true),[]);
  const closeBook=useCallback(()=>setBookOpen(false),[]);

  const PAGES={
    home:       <HomePage nav={navigate} book={openBook}/>,
    massages:   <MassagesPage book={openBook}/>,
    rituels:    <RituelsPage book={openBook}/>,
    beaute:     <BeautePage book={openBook}/>,
    academie:   <AcademiePage/>,
    univers:    <UniversPage/>,
    experience: <ExperiencePage/>,
    contact:    <ContactPage book={openBook}/>
  };

  return(
    <>
      {/* Loader */}
      <div className={`ld ${!loading?"out":""}`} role="status" aria-label="Chargement">
        <div className="ld-br">Maison <em>Bahnel</em></div>
        <div className="ld-sub">Spa · Beauté · Bien-être</div>
        <div className="ld-bar" aria-hidden="true"><div className="ld-prg"/></div>
      </div>

      {/* Custom cursor */}
      <div className="cur" ref={curRef} aria-hidden="true"/>
      <div className="cur-r" ref={ringRef} aria-hidden="true"/>

      {/* Booking */}
      <BookingModal open={bookOpen} onClose={closeBook}/>

      {/* Nav */}
      <Navbar nav={navigate} book={openBook}/>

      {/* WhatsApp float */}
      <div className="waf">
        <div className="waf-tip" aria-hidden="true">Réserver sur WhatsApp</div>
        <a href={wa("Bonjour, je souhaite prendre rendez-vous à Maison Bahnel.")} target="_blank" rel="noopener noreferrer" className="waf-btn" aria-label="WhatsApp Maison Bahnel">
          <WaSVG/>
        </a>
      </div>

      {/* Lateral */}
      <div className="lat">
        <a href="#reserver" onClick={e=>{e.preventDefault();openBook();}}>Réserver un soin</a>
      </div>

      {/* Pages */}
      <div className={`pgt ${vis?"v":""}`}>
        {PAGES[page]??PAGES.home}
      </div>

      {/* Footer */}
      <Footer nav={navigate}/>
    </>
  );
}
