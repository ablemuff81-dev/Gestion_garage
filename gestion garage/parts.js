import { crudPage } from '../components/crud.js';
import { create, update } from '../services/db.service.js';
import { icon, toast } from '../utils/ui.js';
import { money, today } from '../utils/format.js';
// Entrée/sortie de stock : met à jour qty ET journalise dans stockMovements. Point d'ancrage futur pour Parts Spot / ordres de réparation.
export default (v, ctx) => crudPage(v, ctx, { mod: 'parts', col: 'parts', icon: 'box', title: 'Pièces & stock', add: 'Nouvelle pièce',
  cols: [{ label: 'Réf.', k: 'ref' }, { label: 'Nom', k: 'name' }, { label: 'Catégorie', k: 'category' }, { label: 'Achat', get: r => money(r.buyPrice), k: 'buyPrice' }, { label: 'Vente', get: r => money(r.sellPrice), k: 'sellPrice' },
    { label: 'Stock', k: 'qty', html: r => `<span class="${r.qty <= r.threshold ? 'low' : ''}">${r.qty}</span>${r.qty <= r.threshold ? ' <span class="tag warn">Stock faible</span>' : ''}` }],
  rowActions: (r, W) => W ? `<button class="ib" data-m="+1:${r.id}" title="Entrée">＋</button><button class="ib" data-m="-1:${r.id}" title="Sortie">－</button>` : '',
  afterDraw: (view, { rows, reload }) => view.querySelectorAll('[data-m]').forEach(b => b.onclick = async () => {
    const [d, id] = b.dataset.m.split(':'), p = rows.find(x => x.id === id), n = +d; if (p.qty + n < 0) return toast('Stock insuffisant', 'err');
    await update('parts', id, { qty: p.qty + n }); await create('stockMovements', { partId: id, type: n > 0 ? 'entrée' : 'sortie', qty: 1, date: today() }); toast('Stock mis à jour'); reload(); }),
  fields: [{ k: 'ref', label: 'Référence', req: 1 }, { k: 'name', label: 'Nom', req: 1 }, { k: 'category', label: 'Catégorie' }, { k: 'brand', label: 'Marque' }, { k: 'buyPrice', label: "Prix d'achat", type: 'number', step: 1 }, { k: 'sellPrice', label: 'Prix de vente', type: 'number', step: 1 },
    { k: 'qty', label: 'Quantité', type: 'number', req: 1 }, { k: 'threshold', label: "Seuil d'alerte", type: 'number', req: 1 }] });
