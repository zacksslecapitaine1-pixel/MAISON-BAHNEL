// Nettoyage des saisies avant de les placer dans un message WhatsApp
export const clean = (s, max) =>
  String(s || "").replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

export const phoneOk = (p) => {
  const t = String(p).trim();
  const digits = t.replace(/\D/g, "");
  return /^[+\d][\d\s().-]*$/.test(t) && digits.length >= 8 && digits.length <= 15;
};
