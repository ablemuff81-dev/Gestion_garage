// Page CRUD générique : tableau + recherche + tri + modale + validation + confirmation. Réutilisée par Clients, Véhicules, Pièces…
import { list, create, update, remove } from '../services/db.service.js';
import { icon, esc, modal, confirmBox, toast } from '../utils/ui.js';
export async function crudPage(view, ctx, c) {
  const W = ctx.can(c.mod, 'write'), D = ctx.can(c.mod, 'delete');
  view.innerHTML = '<div class="loader">Chargement…</div>';
  let rows, extra = {}, q = '', sort = null, dir = 1;
  const load = async () => { rows = await list(c.col); for (const k in (c.lookups || {})) extra[k] = await list(c.lookups[k]); };
  try { await load(); } catch (e) { return view.innerHTML = `<div class="empty"><h3>Erreur</h3><p>${esc(e.message)}</p></div>`; }
  const val = (r, col) => col.get ? col.get(r, extra) : r[col.k];
  const draw = () => {
    let a = rows.filter(r => !q || c.cols.some(k => String(val(r, k) ?? '').toLowerCase().includes(q)));
    if (sort) a = [...a].sort((x, y) => (val(x, sort) > val(y, sort) ? 1 : -1) * dir);
    view.innerHTML = `<div class="head"><div><h1>${c.title}</h1><p class="muted">${a.length} élément(s)</p></div>${W ? `<button class="btn" id="add">${icon('plus', 16)} ${c.add}</button>` : ''}</div>
    <div class="card">${a.length ? `<div class="tw"><table><thead><tr>${c.cols.map((k, i) => `<th data-s="${i}">${k.label}${sort === k ? (dir > 0 ? ' ↑' : ' ↓') : ''}</th>`).join('')}<th></th></tr></thead><tbody>${a.map(r => `<tr>${c.cols.map(k => `<td data-label="${k.label}">${k.html ? k.html(r, extra) : esc(val(r, k))}</td>`).join('')}<td class="act">${r.demo ? '<span class="tag">DÉMO</span>' : ''}${W ? `<button class="ib" data-e="${r.id}" title="Modifier">${icon('edit', 16)}</button>` : ''}${D ? `<button class="ib" data-d="${r.id}" title="Supprimer">${icon('trash', 16)}</button>` : ''}${(c.rowActions ? c.rowActions(r, W) : '')}</td></tr>`).join('')}</tbody></table></div>`
      : `<div class="empty">${icon(c.icon, 40)}<h3>Aucun résultat</h3><p>${q ? 'Essayez une autre recherche.' : 'Commencez par en ajouter un.'}</p></div>`}</div>`;
    view.querySelectorAll('th[data-s]').forEach(th => th.onclick = () => { const k = c.cols[+th.dataset.s]; dir = sort === k ? -dir : 1; sort = k; draw(); });
    view.querySelector('#add')?.addEventListener('click', () => form());
    view.querySelectorAll('[data-e]').forEach(b => b.onclick = () => form(rows.find(r => r.id === b.dataset.e)));
    view.querySelectorAll('[data-d]').forEach(b => b.onclick = async () => { if (await confirmBox('Supprimer définitivement cet élément ?')) { await remove(c.col, b.dataset.d); toast('Supprimé'); await load(); draw(); } });
    c.afterDraw?.(view, { rows, reload: async () => { await load(); draw(); }, extra });
  };
  const form = r => {
    const o = (f) => (typeof f.options === 'function' ? f.options(extra) : f.options || []).map(x => { const [v, l] = Array.isArray(x) ? x : [x, x]; return `<option value="${esc(v)}" ${r?.[f.k] == v ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
    const m = modal(`<h3>${r ? 'Modifier' : c.add}</h3><form novalidate><div class="grid">${c.fields.map(f => `<label class="${f.wide ? 'wide' : ''}">${f.label}${f.req ? ' *' : ''}${f.type === 'select' ? `<select name="${f.k}"><option value="">—</option>${o(f)}</select>` : f.type === 'textarea' ? `<textarea name="${f.k}" rows="3">${esc(r?.[f.k] || '')}</textarea>` : `<input name="${f.k}" type="${f.type || 'text'}" value="${esc(r?.[f.k] ?? '')}" ${f.step ? 'step="any"' : ''}>`}<small class="err"></small></label>`).join('')}</div><div class="row end"><button type="button" class="btn ghost" data-close>Annuler</button><button class="btn" type="submit">Enregistrer</button></div></form>`);
    m.querySelector('form').onsubmit = async e => {
      e.preventDefault(); const d = {}; let ok = true;
      c.fields.forEach(f => { const el = e.target.elements[f.k]; let v = el.value.trim(); if (f.type === 'number') v = v === '' ? '' : Number(v);
        const bad = (f.req && v === '') || (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) || (f.type === 'number' && v !== '' && (isNaN(v) || v < 0));
        el.nextElementSibling.textContent = bad ? (f.req && v === '' ? 'Champ obligatoire' : 'Valeur invalide') : ''; if (bad) ok = false; d[f.k] = v; });
      if (!ok) return; const btn = e.submitter; btn.disabled = true; btn.textContent = '…';
      try { r ? await update(c.col, r.id, d) : await create(c.col, d); m.remove(); toast(r ? 'Modifié' : 'Ajouté'); await load(); draw(); }
      catch (err) { toast(err.message, 'err'); btn.disabled = false; btn.textContent = 'Enregistrer'; }
    };
  };
  document.getElementById('gsearch').oninput = e => { q = e.target.value.toLowerCase(); draw(); };
  draw();
}
