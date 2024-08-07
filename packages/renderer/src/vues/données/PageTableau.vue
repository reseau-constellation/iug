<template>
  <v-container>
    <v-card flat>
      <v-card-subtitle>
        <v-breadcrumbs
          :items="petitPousset"
          class="pa-0"
        >
          <template #divider>
            <v-icon>{{ isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
          </template>
          <template #title="{item}">
            <v-breadcrumbs-item
              :disabled="item.disabled"
              @click="item.href && $router.push(item.href)"
            >
              <texteTronqué
                :texte="item.title"
                :longueur-max="35"
              />
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>
      </v-card-subtitle>
      <image-editable
        :src-image="srcImgBd"
        :img-defaut="imgDéfaut"
        :editable="!!monAutorisation"
        :max-taille-image="MAX_TAILLE_IMAGE"
        :taille-avatar="mdAndUp ? 275 : 175"
        @image-changee="modifierImage"
      />
      <v-card-title>
        <texteTronqué
          :texte="nomTraduit"
          :longueur-max="40"
        />
        <DialogueNoms
          :etiquette-nom="t('objet.étiquetteNom')"
          :indice-langue="t('objet.indiceLangue')"
          :texte-aucun-nom="t('objet.texteAucunNom')"
          :noms-initiaux="nomsTableau"
          :titre="t('objet.titreDialogueNoms')"
          :sous-titre="t('objet.sousTitreDialogueNoms')"
          :autorisation-modification="!!monAutorisation"
          @ajuster-noms="ajusterNomsTableau"
        >
          <template #activator="{props: propsActivateur}">
            <span v-bind="propsActivateur">
              {{ nomTraduit || t('communs.baseCarteObjet.sansNom') }}
              <v-btn
                :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
                variant="flat"
                size="small"
              ></v-btn>
            </span>
          </template>
        </DialogueNoms>
        <lien-objet :id="idTableau" />

        <v-spacer />
        <importer-ou-exporter
          :info-objet="{id: idTableau, typeObjet: 'tableau'}"
          type="exportation"
        >
          <template #activator="{props: propsActivateurCarte}">
            <v-tooltip
              v-bind="propsActivateurCarte"
              :text="t('exporter.indice')"
              :open-delay="200"
              location="bottom"
            >
              <template #activator="{props: propsActivateurIndice}">
                <v-btn
                  v-bind="propsActivateurIndice"
                  icon="mdi-download"
                />
              </template>
            </v-tooltip>
          </template>
        </importer-ou-exporter>
        <importer-ou-exporter
          :info-objet="{id: idTableau, typeObjet: 'tableau'}"
          type="importation"
        >
          <template #activator="{props: propsActivateurCarte}">
            <v-tooltip
              v-bind="propsActivateurCarte"
              :text="t('importer.indice')"
              :open-delay="200"
              location="bottom"
            >
              <template #activator="{props: propsActivateurIndice}">
                <v-btn
                  v-bind="propsActivateurIndice"
                  icon="mdi-upload"
                />
              </template>
            </v-tooltip>
          </template>
        </importer-ou-exporter>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <visualisation-tableau :id-tableau="idTableau" />
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';
import {useDisplay, useRtl} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ajusterTexteTraductible} from '/@/utils';

import {utiliserConstellation} from '/@/components/utils';
import {MAX_TAILLE_IMAGE} from '/@/consts';

import ImageEditable from '/@/components/communs/ImageEditable.vue';
import ImporterOuExporter from '/@/components/importerExporter/ImporterOuExporter.vue';
import VisualisationTableau from '/@/components/tableaux/VisualisationTableau.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const props = defineProps<{idTableau: string; idBd: string}>();

const constl = utiliserConstellation();

const {obtImageDéco} = utiliserImagesDéco();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const petitPousset = computed<{title: string; href?: string; disabled?: boolean}[]>(() => [
  {title: t('navig.mesDonnées') as string, href: encodeURI('/données')},
  {title: nomTraduitBd.value || props.idBd, href: encodeURI(`/données/bd/${props.idBd}`)},
  {title: nomTraduit.value || props.idTableau, disabled: true},
]);

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {
  idObjet: props.idTableau,
});

// Nom du tableau
const nomsTableau = suivre(constl.tableaux.suivreNomsTableau, {
  idTableau: props.idTableau,
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsTableau);

const ajusterNomsTableau = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: nomsTableau.value,
    nouvelles: nms,
  });
  for (const langue of àEffacer) {
    await constl.tableaux.effacerNomTableau({idTableau: props.idTableau, langue});
  }
  await constl.tableaux.sauvegarderNomsTableau({
    idTableau: props.idTableau,
    noms: àAjouter,
  });
};

// Nom de la BD
const nomsBd = suivre(constl.bds.suivreNomsBd, {idBd: props.idBd});
const nomTraduitBd = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsBd);

// Image
const imageBd = suivre(constl.bds.suivreImage, {idBd: props.idBd});
const srcImgBd = computed(() => {
  if (imageBd.value) {
    return URL.createObjectURL(new Blob([imageBd.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const imgDéfaut = obtImageDéco('logoBD');

const modifierImage = async (image?: {contenu: ArrayBuffer; fichier: string}) => {
  if (image) {
    await constl.profil.sauvegarderImage({
      image: {contenu: new Uint8Array(image.contenu), nomFichier: image.fichier},
    });
  } else {
    await constl.profil.effacerImage();
  }
};
</script>
