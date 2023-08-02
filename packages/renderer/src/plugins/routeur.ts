import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';
import PageAccueil from '/@/vues/PageAccueil.vue';
import PageCompte from '/@/vues/PageCompte.vue';
import MesDonnées from '/@/vues/données/MesDonnées.vue';
import PageBD from '/@/vues/données/PageBD.vue';
import PageNuée from '/@/vues/données/PageNuée.vue';
import PageTableau from '/@/vues/données/PageTableau.vue';
import PageRecherche from '/@/vues/PageRecherche.vue';
import PageFavoris from '/@/vues/PageFavoris.vue';
import PageAutomatisations from '/@/vues/PageAutomatisations.vue';
import PageSignalements from '/@/vues/PageSignalements.vue';
import PageTéléchargements from '/@/vues/PageTéléchargements.vue';
import {utiliserLangues} from './localisation/localisation.js';

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
    path: encodeURI('/données/bd/:id/tableau/:idTableau'),
    component: PageTableau,
  },
  {
    path: encodeURI('/données/nuées/:id'),
    component: PageNuée,
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
  {
    path: encodeURI('/téléchargements'),
    name: 'Téléchargements',
    component: PageTéléchargements,
  },
];

const routeur = createRouter({
  history: createWebHashHistory(),
  routes,
});

routeur.afterEach(to => {
  const {lg} = to.query;
  if (lg && typeof lg === 'string') {
    const {choisirLangues} = utiliserLangues();
    choisirLangues(lg);
  }
});

export default routeur;
