import { listAll } from '../services/db.service.js';
import { money, today, fdate } from '../utils/format.js';
import { esc } from '../utils/ui.js';
export default async (view, ctx) => {
  const D = await listAll(), T = today(), open = D.repairs.filter(r => !/termin|livr|annul/.test(r.status));
  const unpaid = D.invoices.filter(i => i.status !== 'payée' && i.status !== 'annulée').reduce((s, i) => s + (i.total - (i.paid || 0)), 0);
  const low = D.parts.filter(p => p.qty <= p.threshold), ca = D.invoices.reduce((s, i) => s + (i.paid || 0), 0);
  const K = [['Chiffre d\'affaires encaissé', money(ca)], ['Véhicules au garage', new Set(open.map(r => r.vehicleId)).size], ['Réparations en cours', open.length], ['RDV du jour', D.appointments.filter(a => a.date === T).length],
    ['Devis en attente', D.quotes.filter(q => /brouillon|envoy/.test(q.status)).length], ['Impayés', money(unpaid)], ['Stock faible', low.length]];
  const m = {}; D.invoices.forEach(i => { const k = (i.date || '').slice(0, 7); m[k] = (m[k] || 0) + (i.paid || 0); });
  const ks = Object.keys(m).sort().slice(-6), mx = Math.max(1, ...ks.map(k => m[k]));
  view.innerHTML = `<div class="head"><div><h1>Bonjour, ${esc(ctx.user.name || '')}</h1><p class="muted">Voici l'état de votre atelier aujourd'hui.</p></div></div>
  <div class="kpis">${K.map(([l, v]) => `<div class="card kpi"><span class="muted">${l}</span><strong>${v}</strong></div>`).join('')}</div>
  <div class="two"><div class="card"><h3>Chiffre d'affaires par mois</h3><div class="bars">${ks.map(k => `<div><i style="height:${m[k] / mx * 100}%"></i><small>${k.slice(5)}/${k.slice(2, 4)}</small></div>`).join('') || '<p class="muted">Pas encore de données</p>'}</div></div>
  <div class="card"><h3>Dernières réparations</h3>${D.repairs.slice(-5).reverse().map(r => `<div class="li"><span>${esc(r.reported)}</span><span class="tag">${esc(r.status)} · ${fdate(r.date)}</span></div>`).join('') || '<p class="muted">Aucune activité</p>'}</div></div>`;
};
