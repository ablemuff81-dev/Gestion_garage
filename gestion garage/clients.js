import { crudPage } from '../components/crud.js';
import { fdate } from '../utils/format.js';
export default (v, ctx) => crudPage(v, ctx, { mod: 'clients', col: 'clients', icon: 'clients', title: 'Clients', add: 'Nouveau client',
  cols: [{ label: 'Nom', get: r => `${r.firstName} ${r.lastName}`, k: 'lastName' }, { label: 'Téléphone', k: 'phone' }, { label: 'Email', k: 'email' }, { label: 'Créé le', get: r => fdate(r.createdAt), k: 'createdAt' }],
  fields: [{ k: 'firstName', label: 'Prénom', req: 1 }, { k: 'lastName', label: 'Nom', req: 1 }, { k: 'phone', label: 'Téléphone', req: 1, type: 'tel' }, { k: 'email', label: 'Email', type: 'email' }, { k: 'address', label: 'Adresse', wide: 1 }, { k: 'notes', label: 'Notes', type: 'textarea', wide: 1 }] });
