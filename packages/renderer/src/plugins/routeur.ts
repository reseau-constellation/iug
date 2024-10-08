import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';
import MesDonnées from '/@/vues/données/MesDonnées.vue';
import PageBD from '/@/vues/données/PageBD.vue';
import PageNuée from '/@/vues/données/PageNuée.vue';
import PageProjet from '/@/vues/données/PageProjet.vue';
import PageAccueil from '/@/vues/PageAccueil.vue';
import PageAutomatisations from '/@/vues/PageAutomatisations.vue';
import PageCompte from '/@/vues/PageCompte.vue';
import PageFavoris from '/@/vues/PageFavoris.vue';
import PageRecherche from '/@/vues/PageRecherche.vue';
import PageSignalements from '/@/vues/PageSignalements.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: PageAccueil,
  },
  {
    path: '/compte',
    name: 'Compte',
    component: PageCompte,
  },
  {
    path: encodeURI('/données'),
    name: 'Données',
    component: MesDonnées,
  },
  {
    path: encodeURI('/données/bd/:id'),
    component: PageBD,
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: encodeURI('/données/nuée/:id'),
    component: PageNuée,
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: encodeURI('/données/projet/:id'),
    component: PageProjet,
    props: route => {
      const {id} = route.params;
      if (typeof id === 'string') return {id: decodeURIComponent(id)};
    },
  },
  {
    path: '/recherche',
    name: 'Recherche',
    component: PageRecherche,
  },
  {
    path: '/favoris',
    name: 'Favoris',
    component: PageFavoris,
  },
  {
    path: '/automatisations',
    name: 'Automatisations',
    component: PageAutomatisations,
  },
  {
    path: '/signalements',
    name: 'Signalements',
    component: PageSignalements,
  },
];

const routeur = createRouter({
  history: createWebHashHistory(),
  routes,
});

routeur.afterEach(to => {
  const {lg} = to.query;
  if (lg && typeof lg === 'string') {
    const {மொழிகளை_தேர்ந்தெடுக்கொள்ளு} = மொழிகளைப்_பயன்படுத்து();
    மொழிகளை_தேர்ந்தெடுக்கொள்ளு(lg);
  }
});

export default routeur;
