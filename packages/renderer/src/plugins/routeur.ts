import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Accueil',
    component: () => import('../vues/PageAccueil.vue'),
  },
  {
    path: '/compte',
    name: 'Compte',
    component: () => import('../vues/PageCompte.vue'),
  },
  {
    path: '/données',
    name: 'Données',
    component: () => import('/@/vues/données/MesDonnées.vue'),
  },
  {
    path: '/données/bd/:id',
    component: () => import('../vues/données/PageBD.vue'),
  },
  {
    path: '/données/bd/:id/tableau/:idTableau',
    component: () => import('../vues/données/PageTableau.vue'),
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: () => import('../vues/PageRecherche.vue'),
  },
  {
    path: '/favoris',
    name: 'Favoris',
    component: () => import('../vues/PageFavoris.vue'),
  },
  {
    path: '/automatisations',
    name: 'Automatisations',
    component: () => import('../vues/PageAutomatisations.vue'),
  },
  {
    path: '/signalements',
    name: 'Signalements',
    component: () => import('../vues/PageSignalements.vue'),
  },
  {
    path: encodeURI('/téléchargements'),
    name: 'Téléchargements',
    component: () => import('../vues/PageTéléchargements.vue'),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
