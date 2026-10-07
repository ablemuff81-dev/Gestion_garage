import { ROUTES } from '../core/routes.js';
import { can, ROLES } from '../core/permissions.js';
import { logout, isDemo } from '../services/auth.service.js';
import { resetDemo } from '../services/db.service.js';
import { icon, esc, toast, confirmBox } from '../utils/ui.js';
import { toggleTheme, getTheme } from '../utils/theme.js';
export function renderShell(u) {
  const nav = ROUTES.filter(r => can(u.role, r.key)).map(r => `<a href="#/${r.key}" data-nav="${r.key}">${icon(r.icon, 18)}<span>${r.label}</span></a>`).join('');
  document.getElementById('app').innerHTML = `<div id="scrim"></div>
  <aside id="side"><div class="brand">Garage<b>Pro</b></div><nav>${nav}</nav><div class="who"><strong>${esc(u.garageName || '')}</strong><small>${esc(u.name || u.email)} · ${ROLES[u.role] || u.role}</small></div></aside>
  <main><header><button class="ib" id="burger" aria-label="Menu">${icon('menu')}</button>
    <label class="search">${icon('search', 16)}<input id="gsearch" placeholder="Rechercher dans la page…" aria-label="Recherche"></label>
    ${isDemo ? '<span class="tag warn" title="Firebase non configuré : données locales fictives">MODE DÉMO</span>' : ''}
    <button class="ib" id="theme" aria-label="Thème">${icon(getTheme() === 'dark' ? 'sun' : 'moon')}</button>
    <button class="ib" id="notif" aria-label="Notifications">${icon('bell')}</button>
    <button class="ib" id="out" aria-label="Déconnexion">${icon('logout')}</button></header>
  <section id="view"></section></main>`;
  const $ = s => document.querySelector(s);
  $('#burger').onclick = () => { $('#side').classList.toggle('open'); $('#scrim').classList.toggle('on'); };
  $('#scrim').onclick = () => { $('#side').classList.remove('open'); $('#scrim').classList.remove('on'); };
  $('#theme').onclick = () => { $('#theme').innerHTML = icon(toggleTheme() === 'dark' ? 'sun' : 'moon'); };
  $('#notif').onclick = () => toast('Alertes de stock : voir « Pièces & stock »');
  $('#out').onclick = async () => { if (await confirmBox('Se déconnecter ?')) logout(); };
  if (isDemo) $('.who').insertAdjacentHTML('beforeend', '<button class="btn ghost sm" id="rst">Réinitialiser la démo</button>'), $('#rst').onclick = async () => { if (await confirmBox('Effacer les modifications de démo ?')) { resetDemo(); location.reload(); } };
}
