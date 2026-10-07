import { crudPage } from '../components/crud.js';
export default (v, ctx) => crudPage(v, ctx, { mod: 'vehicles', col: 'vehicles', icon: 'vehicles', title: 'Véhicules', add: 'Nouveau véhicule', lookups: { c: 'clients' },
  cols: [{ label: 'Plaque', k: 'plate' }, { label: 'Véhicule', get: r => `${r.brand} ${r.model} ${r.year || ''}`, k: 'brand' }, { label: 'Carburant', k: 'fuel' }, { label: 'Km', get: r => (r.km || 0).toLocaleString('fr-FR'), k: 'km' },
    { label: 'Propriétaire', get: (r, x) => { const o = x.c.find(c => c.id === r.clientId); return o ? `${o.firstName} ${o.lastName}` : '—'; }, k: 'clientId' }],
  fields: [{ k: 'clientId', label: 'Propriétaire', type: 'select', req: 1, options: x => x.c.map(c => [c.id, `${c.firstName} ${c.lastName}`]) }, { k: 'plate', label: 'Immatriculation', req: 1 }, { k: 'brand', label: 'Marque', req: 1 }, { k: 'model', label: 'Modèle', req: 1 },
    { k: 'year', label: 'Année', type: 'number' }, { k: 'fuel', label: 'Carburant', type: 'select', options: ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'] }, { k: 'km', label: 'Kilométrage', type: 'number' }] });
