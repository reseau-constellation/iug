import {createRouter, createWebHashHistory, type RouteRecordRaw} from 'vue-router';
import PageAccueil from '/@/vues/PageAccueil.vue';
import PageCompte from '/@/vues/PageCompte.vue';
import MesDonnées from '/@/vues/données/MesDonnées.vue';
import PageBD from '/@/vues/données/PageBD.vue';
import PageTableau from '/@/vues/données/PageTableau.vue';
import PageRecherche from '/@/vues/PageRecherche.vue';
import PageFavoris from '/@/vues/PageFavoris.vue';
import PageAutomatisations from '/@/vues/PageAutomatisations.vue';
import PageSignalements from '/@/vues/PageSignalements.vue';
import PageTéléchargements from '/@/vues/PageTéléchargements.vue';
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
  },
  {
    path: encodeURI('/données/bd/:id/tableau/:idTableau'),
    component: PageTableau,
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

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
