import { initAuth, getUser, onAuth } from './services/auth.service.js';
import { renderShell } from './components/layout.js';
import { renderAuth } from './pages/auth.js';
import { startRouter } from './core/router.js';
import { applyTheme } from './utils/theme.js';

applyTheme();
let last;
onAuth(u => {
  const id = u?.uid + '|' + u?.role;
  if (!u) { last = null; return renderAuth(); }
  if (id === last) return; last = id;           // évite de redessiner si rien n'a changé
  renderShell(u); startRouter(u);
});
initAuth().catch(e => { document.getElementById('app').innerHTML = `<div class="empty"><h3>Erreur d'initialisation</h3><p>${e.message}</p></div>`; });
