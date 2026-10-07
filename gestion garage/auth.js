import { login, register, resetPassword, authError, isDemo } from '../services/auth.service.js';
import { ROLES } from '../core/permissions.js';
import { esc } from '../utils/ui.js';
let mode = 'login';
export function renderAuth() {
  const T = { login: 'Connexion', register: 'Créer mon garage', forgot: 'Mot de passe oublié' };
  const f = (n, l, t = 'text', x = '') => `<label>${l}<input name="${n}" type="${t}" required ${x}></label>`;
  document.getElementById('app').innerHTML = `<div class="auth"><div class="card"><div class="brand">Garage<b>Pro</b></div><h1>${T[mode]}</h1>
  ${isDemo ? '<p class="note">Mode démonstration : Firebase n\'est pas encore configuré. Toute adresse/mot de passe fonctionne ; les données sont fictives et locales.</p>' : ''}
  <form id="af">${mode === 'register' ? f('name', 'Votre nom') + f('garageName', 'Nom du garage') : ''}${f('email', 'Email', 'email')}${mode !== 'forgot' ? f('pw', 'Mot de passe', 'password', 'minlength="6"') : ''}
  ${isDemo && mode === 'login' ? `<label>Rôle (démo)<select name="role">${Object.entries(ROLES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>` : ''}
  <p class="err" id="ae"></p><button class="btn full">${T[mode]}</button></form>
  <p class="links">${mode !== 'login' ? '<a href="#" data-m="login">Connexion</a>' : '<a href="#" data-m="register">Créer un compte</a> · <a href="#" data-m="forgot">Mot de passe oublié</a>'}</p></div></div>`;
  document.querySelectorAll('[data-m]').forEach(a => a.onclick = e => { e.preventDefault(); mode = a.dataset.m; renderAuth(); });
  document.getElementById('af').onsubmit = async e => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)), b = e.submitter, err = document.getElementById('ae'); b.disabled = true; err.textContent = '';
    try { if (mode === 'login') await login(d.email, d.pw, d.role); else if (mode === 'register') await register(d); else { await resetPassword(d.email); err.style.color = 'var(--ok)'; err.textContent = 'Si ce compte existe, un email a été envoyé.'; } }
    catch (x) { err.style.color = ''; err.textContent = authError(x); } b.disabled = false;
  };
}
