// FIELD.js
// Einfaches, robustes Modul für FIELD · F81-UNIT
// Export: FIELD.id(), FIELD.eco(), FIELD.effect()

export const FIELD = (function(){
  const meta = { id: "F81-UNIT", label: "FIELD · F81", version: "1.0" };

  const nowISO = () => (new Date()).toISOString();

  // Hilfsfunktion: benutze globales Feld‑Kontext falls vorhanden (window.FIELD_DATA)
  function getContext(){
    if(typeof window !== 'undefined' && window.FIELD_DATA) return window.FIELD_DATA;
    return { owner: "unknown", site: "local" };
  }

  // STAGE 1: ID Prüfung / Ausgabe (simuliert, deterministic)
  function id(){
    const ctx = getContext();
    return {
      meta,
      owner: ctx.owner || "unknown",
      site: ctx.site || "local",
      verified: true,
      note: "ID pattern OK (simulated check)",
      timestamp: nowISO()
    };
  }

  // STAGE 2: ECO‑Feld Prüfung — liefert Umweltkennzahlen + Score (0..1)
  function eco(){
    const ctx = getContext();
    // Beispiel‑Werte (kannst du durch real data ersetzen via window.FIELD_DATA.metrics)
    const metrics = ctx.metrics || {
      energyConsumption_kWh: 42.0,
      waterUse_m3: 120,
      emissions_tCO2e: 3.4,
      biodiversityIndex: 0.72
    };

    // einfache Scoring‑Formel (tunable)
    // lower emissions & energy -> better; biodiversity increases score
    const eNorm = clamp(1 - (metrics.energyConsumption_kWh / 200), 0, 1);
    const emisNorm = clamp(1 - (metrics.emissions_tCO2e / 10), 0, 1);
    const bio = clamp(metrics.biodiversityIndex || 0, 0, 1);

    const score = Number(( (eNorm * 0.4) + (emisNorm * 0.4) + (bio * 0.2) ).toFixed(3));

    return {
      meta,
      metrics,
      normalized: { energy: Number(eNorm.toFixed(3)), emissions: Number(emisNorm.toFixed(3)), biodiversity: Number(bio.toFixed(3)) },
      ecoScore: score,
      status: score >= 0.75 ? "good" : (score >= 0.5 ? "moderate" : "attention"),
      timestamp: nowISO()
    };
  }

  // STAGE 3: Wirkung / Impact — kombiniert ECO + einfache Measures → Empfehlungen
  function effect(){
    const e = eco();
    const s = e.ecoScore;
    let severity = "low";
    if(s < 0.5) severity = "high";
    else if(s < 0.75) severity = "medium";

    const recommendations = [];
    if(severity === "high"){
      recommendations.push("Emissionen reduzieren: technische Filter/Prozessänderung prüfen.");
      recommendations.push("Energieaudit durchführen; erneuerbare Quellen prüfen.");
    } else if(severity === "medium"){
      recommendations.push("Optimierungspotential identifizieren; Monitoring erhöhen.");
    } else {
      recommendations.push("Regelmäßig überwachen; Dokumentation aufrechterhalten.");
    }

    // Beispiel: einfache arg/xarg/arg3te Kalkulation (wie du es benutzt)
    const arg = Number(s.toFixed(3));
    const xarg = Number((Math.abs(e.metrics.energyConsumption_kWh - 50) / 200).toFixed(3)); // distance to nominal
    const arg3te = Number((arg * (1 - xarg)).toFixed(3));

    return {
      meta,
      eco: e,
      severity,
      recommendations,
      math: { arg, xarg, arg3te },
      timestamp: nowISO()
    };
  }

  // Utility
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }

  // Expose API
  return { id, eco, effect };
})();
