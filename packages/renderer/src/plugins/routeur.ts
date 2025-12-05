import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {type RouteRecordRaw, createRouter, createWebHistory} from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('/@/vues/PageAccueil.vue'),
  },
  {
    path: '/compte',
    name: 'Compte',
    component: () => import('/@/vues/PageCompte.vue'),
  },
  {
    path: encodeURI('/données'),
    name: 'Données',
    component: () => import('/@/vues/données/MesDonnées.vue'),
  },
  {
    path: encodeURI('/données/bd/:id'),
    component: () => import('/@/vues/données/PageBd.vue'),
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: encodeURI('/données/nuée/:id'),
    component: () => import('/@/vues/données/PageNuée.vue'),
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: encodeURI('/données/projet/:id'),
    component: () => import('/@/vues/données/PageProjet.vue'),
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: () => import('/@/vues/PageRecherche.vue'),
  },
  {
    path: '/favoris',
    name: 'Favoris',
    component: () => import('/@/vues/PageFavoris.vue'),
  },
  {
    path: '/automatisations',
    name: 'Automatisations',
    component: () => import('/@/vues/PageAutomatisations.vue'),
  },
  {
    path: '/signalements',
    name: 'Signalements',
    component: () => import('/@/vues/PageSignalements.vue'),
  },
];

const routeur = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return {top: 0};
  },
});

routeur.afterEach(to => {
  const {lg} = to.query;
  if (lg && typeof lg === 'string') {
    const {மொழிகளை_தேர்ந்தெடுக்கொள்ளு} = மொழிகளைப்_பயன்படுத்து();
    மொழிகளை_தேர்ந்தெடுக்கொள்ளு(lg);
  }
});

export default routeur;
