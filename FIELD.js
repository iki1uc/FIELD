// ============================================================
// FIELD.js — F81-UNIT Modul für MXU · OS Runtime
// ============================================================

export const FIELD = (function() {
    const meta = {
        id: "F81-UNIT",
        label: "FIELD · F81",
        version: "1.0",
        stage: 3  // 3 Etagen: ID → ECO → Effect
    };

    const nowISO = () => (new Date()).toISOString();

    // Kontext: global oder aus MXU übergeben
    function getContext() {
        if (typeof window !== 'undefined' && window.FIELD_DATA) {
            return window.FIELD_DATA;
        }
        // Fallback: MXU-Kontext
        if (typeof window !== 'undefined' && window.MXU_CONTEXT) {
            return window.MXU_CONTEXT;
        }
        return { owner: "unknown", site: "local" };
    }

    function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
    }

    // ============================================================
    // STAGE 1: ID-Prüfung
    // ============================================================
    function id() {
        const ctx = getContext();
        return {
            meta,
            owner: ctx.owner || "unknown",
            site: ctx.site || "local",
            verified: true,
            note: "ID pattern OK (simulated check)",
            timestamp: nowISO(),
            // 3-9-27-81 Mapping
            mapping: {
                level: 3,
                sublevel: 9,
                unit: 81,
                label: "F81"
            }
        };
    }

    // ============================================================
    // STAGE 2: ECO-Feld
    // ============================================================
    function eco() {
        const ctx = getContext();
        const metrics = ctx.metrics || {
            energyConsumption_kWh: 42.0,
            waterUse_m3: 120,
            emissions_tCO2e: 3.4,
            biodiversityIndex: 0.72
        };

        // Scoring-Formel (optimiert für 3-9-27-81)
        const eNorm = clamp(1 - (metrics.energyConsumption_kWh / 200), 0, 1);
        const emisNorm = clamp(1 - (metrics.emissions_tCO2e / 10), 0, 1);
        const bio = clamp(metrics.biodiversityIndex || 0, 0, 1);

        const score = Number((eNorm * 0.4 + emisNorm * 0.4 + bio * 0.2).toFixed(3));

        // 3er-System: arg, xarg, arg3te
        const arg = score;
        const xarg = Number(Math.abs(metrics.energyConsumption_kWh - 50) / 200).toFixed(3);
        const arg3te = Number((arg * (1 - xarg)).toFixed(3));

        return {
            meta,
            metrics,
            normalized: {
                energy: Number(eNorm.toFixed(3)),
                emissions: Number(emisNorm.toFixed(3)),
                biodiversity: Number(bio.toFixed(3))
            },
            ecoScore: score,
            status: score >= 0.75 ? "good" : (score >= 0.5 ? "moderate" : "attention"),
            // 3er-System
            math: { arg, xarg, arg3te },
            timestamp: nowISO()
        };
    }

    // ============================================================
    // STAGE 3: Wirkung / Effect
    // ============================================================
    function effect() {
        const e = eco();
        const s = e.ecoScore;

        let severity = "low";
        if (s < 0.5) severity = "high";
        else if (s < 0.75) severity = "medium";

        const recommendations = [];
        if (severity === "high") {
            recommendations.push("🔴 Emissionen reduzieren: technische Filter/Prozessänderung prüfen.");
            recommendations.push("🔴 Energieaudit durchführen; erneuerbare Quellen prüfen.");
            recommendations.push("🔴 Wasser-Nutzung optimieren.");
        } else if (severity === "medium") {
            recommendations.push("🟡 Optimierungspotential identifizieren; Monitoring erhöhen.");
            recommendations.push("🟡 Regelmäßige Überprüfung einplanen.");
        } else {
            recommendations.push("🟢 Regelmäßig überwachen; Dokumentation aufrechterhalten.");
            recommendations.push("🟢 Status quo halten.");
        }

        // Ja/Nein/Später-Entscheidung basierend auf Score
        let decision = "SPÄTER";
        if (s >= 0.8) decision = "JA";
        else if (s < 0.4) decision = "NEIN";

        return {
            meta,
            eco: e,
            severity,
            recommendations,
            decision, // JA / NEIN / SPÄTER
            math: e.math,
            timestamp: nowISO()
        };
    }

    // ============================================================
    // STAGE 4: RESET (für MXU-Integration)
    // ============================================================
    function reset() {
        if (typeof window !== 'undefined') {
            window.FIELD_DATA = {
                owner: "MXU·System",
                site: "field.local",
                metrics: {
                    energyConsumption_kWh: 42.0,
                    waterUse_m3: 120,
                    emissions_tCO2e: 3.4,
                    biodiversityIndex: 0.72
                }
            };
        }
        return { status: "reset", timestamp: nowISO() };
    }

    // ============================================================
    // EXPORT
    // ============================================================
    return {
        id,
        eco,
        effect,
        reset,
        meta,
        // Für MXU-Boot-Sequenz
        boot: {
            stages: [
                { name: "ID", fn: id },
                { name: "ECO", fn: eco },
                { name: "EFFECT", fn: effect }
            ],
            totalStages: 3
        }
    };

})();

// ============================================================
// DEFAULT EXPORT für Module-Import
// ============================================================
export default FIELD;
// FIELD.js – ohne export, als globale Variable
const FIELD = { ... };  // deine Funktionen
window.FIELD = FIELD;
// FIELD.js – Minimale Implementierung für MXU-OS
const FIELD = {
  // Stage 1: ID – Identität
  id() {
    return {
      status: 'ok',
      meta: { label: 'F81-UNIT' },
      owner: 'MXU·System',
      version: '1.0',
      timestamp: new Date().toISOString()
    };
  },

  // Stage 2: ECO – Ökologische Metriken
  eco() {
    return {
      status: 'ok',
      meta: { label: 'ECO-Metrics' },
      metrics: {
        energyConsumption_kWh: 42.0,
        waterUse_m3: 120,
        emissions_tCO2e: 3.4,
        biodiversityIndex: 0.72
      }
    };
  },

  // Stage 3: EFFECT – Entscheidung / Wirkung
  effect() {
    return {
      status: 'ok',
      meta: { label: 'EFFECT-Decision' },
      decision: 'CONTINUE',
      recommendation: 'Stabiler Betrieb – alle Metriken im grünen Bereich',
      nextAction: 'FIELD-Zyklus fortsetzen'
    };
  },

  // Reset-Funktion
  reset() {
    return { status: 'ok', message: 'FIELD zurückgesetzt' };
  }
};

export default FIELD;
import FIELD from '/home/iki1uc/FIELD.js';
