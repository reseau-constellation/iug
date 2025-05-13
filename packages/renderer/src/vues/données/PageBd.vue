<template>
  <v-container>
    <div>
      <v-breadcrumbs
        v-if="mdAndUp"
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
            <TexteTronque
              :texte="item.title"
              :longueur-max="35"
            />
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <v-btn
        v-else
        icon="mdi-arrow-left-top"
        variant="flat"
        @click="() => $router.push(encodeURI('/données/'))"
      />
    </div>

    <image-editable
      :src-image="image"
      :img-defaut="imgDéfaut"
      :editable="!!monAutorisation"
      :taille-avatar="mdAndUp ? 275 : 175"
      :max-taille-image="MAX_TAILLE_IMAGE"
      @image-changee="image => modifierImage(image)"
    />

    <div class="text-center">
      <DialogueNoms
        :etiquette-nom="t('objet.étiquetteNom')"
        :indice-nom="t('objet.indiceNom')"
        :indice-langue="t('objet.indiceLangue')"
        :texte-aucun-nom="t('objet.texteAucunNom')"
        :noms-initiaux="noms"
        :titre="t('objet.titreDialogueNoms')"
        :sous-titre="t('objet.sousTitreDialogueNoms')"
        :autorisation-modification="!!monAutorisation"
        @ajuster-noms="ajusterNoms"
      >
        <template #activateur="{props: propsActivateur}">
          <span
            v-bind="propsActivateur"
            class="text-h4"
          >
            {{ nomTraduit || t('bds.sansNom') }}
            <v-btn
              :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
              variant="flat"
              size="small"
            ></v-btn>
          </span>
        </template>
      </DialogueNoms>
      <lien-objet :id="id" />

      <v-spacer />
    </div>

    <div class="text-center">
      <SérieJetons
        :n-max="5"
        :items="motsClefs"
      >
        <template #jeton="{id: idMotClef}">
          <carte-mot-clef :id="idMotClef">
            <template #activateur="{props: propsActivateur}">
              <JetonMotClef
                v-bind="propsActivateur"
                :id="idMotClef"
              />
            </template>
          </carte-mot-clef>
        </template>
        <template #itemListe="{id: idMotClef}">
          <carte-mot-clef :id="idMotClef">
            <template #activateur="{props: propsActivateur}">
              <item-mot-clef
                v-bind="propsActivateur"
                :id="idMotClef"
              />
            </template>
          </carte-mot-clef>
        </template>
      </SérieJetons>
      <span
        v-if="motsClefs && !motsClefs.length"
        class="text-disabled"
      >
        {{ t('bds.aucunMotClef') }}
      </span>
      <EditeurMotsClefs
        v-if="monAutorisation && motsClefs"
        :originaux="motsClefs"
        @sauvegarder="ids => sauvegarderMotsClefs(ids)"
      />
    </div>

    <div class="text-center">
      <epingler-bd :id-bd="id">
        <template #activateur="{props: propsActivateurCarte}">
          <v-tooltip
            open-delay="200"
            location="bottom"
            :text="t('épingler.épingler')"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                icon
                variant="flat"
              >
                <IconeEpingle :id="id" />
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </epingler-bd>

      <carte-exportation-objet
        :id-objet="id"
        :noms-objet="noms"
        type-objet="bd"
      >
        <template #activateur="{props: propsActivateurCarte}">
          <v-tooltip
            :text="t('exportations.indice')"
            :open-delay="200"
            location="bottom"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                icon="mdi-download"
                variant="flat"
              />
            </template>
          </v-tooltip>
        </template>
      </carte-exportation-objet>

      <carte-code-bd :id="id">
        <template #activateur="{props: propsActivateurCarte}">
          <v-tooltip
            :text="t('code.indice')"
            :open-delay="200"
            location="bottom"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                icon="mdi-xml"
                variant="flat"
              />
            </template>
          </v-tooltip>
        </template>
      </carte-code-bd>

      <carte-copier
        v-if="false"
        :id="id"
      >
        <template #activateur="{props: propsActivateurCarte}">
          <v-tooltip
            open-delay="200"
            location="bottom"
            :text="t('copier.indice')"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                icon="mdi-content-copy"
                variant="flat"
              />
            </template>
          </v-tooltip>
        </template>
      </carte-copier>

      <carte-effacer
        v-if="!!monAutorisation"
        @effacer="effacerBd"
      >
        <template #activateur="{props: propsActivateurCarte}">
          <v-tooltip
            open-delay="200"
            location="bottom"
            :text="t('effacer.indice')"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                variant="flat"
                icon
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </carte-effacer>
    </div>

    <v-divider />
    <v-card-text>
      <DialogueNoms
        :etiquette-nom="t('objet.étiquetteDescription')"
        :indice-nom="t('objet.indiceDescription')"
        :indice-langue="t('objet.indiceLangue')"
        :texte-aucun-nom="t('objet.texteAucuneDescription')"
        :noms-initiaux="descriptions"
        :titre="t('objet.titreDialogueDescriptions')"
        :sous-titre="t('objet.sousTitreDialogueDescriptions')"
        :autorisation-modification="!!monAutorisation"
        longue
        @ajuster-noms="ajusterDescriptions"
      >
        <template #activateur="{props: propsActivateur}">
          <span :class="{'text-disabled': !descrTraduite}">{{
            descrTraduite || t('communs.baseCarteObjet.sansDescription')
          }}</span>
          <v-btn
            v-bind="propsActivateur"
            :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
            variant="flat"
            size="small"
          ></v-btn>
        </template>
      </DialogueNoms>

      <p class="mt-6 text-h5">
        {{ t('bds.info') }}
      </p>
      <v-divider class="mb-2" />
      <div class="d-flex flex-wrap">
        <v-card
          v-if="statut && (statut.statut !== 'active' || monAutorisation)"
          flat
          width="200"
          class="mb-3"
        >
          <carte-statut-bd :id-bd="id">
            <template #activateur="{props: propsActivateur}">
              <item-statut
                v-bind="propsActivateur"
                type-objet="bd"
                :statut="statut"
              />
            </template>
          </carte-statut-bd>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <carte-qualite-bd :id-bd="id">
            <template #activateur="{props: propsActivateur}">
              <item-qualite-bd
                v-bind="propsActivateur"
                :id="id"
              />
            </template>
          </carte-qualite-bd>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <gerer-auteurs
            :id="id"
            :auteurs="auteurs"
            :permission-moderateur="monAutorisation === 'MODÉRATEUR'"
          >
            <template #activateur="{props: propsActivateur}">
              <item-auteurs
                v-bind="propsActivateur"
                :auteurs="auteurs"
              />
            </template>
          </gerer-auteurs>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <dialogue-licence
            :licence="licence"
            :licence-contenu="licenceContenu"
            :permission-modifier="monAutorisation === 'MODÉRATEUR'"
            @changer-licence="changerLicence"
          >
            <template #activateur="{props: propsActivateur}">
              <item-licence
                v-bind="propsActivateur"
                :licence="licence"
                @changer-licence="changerLicence"
              />
            </template>
          </dialogue-licence>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <carte-replications-objet :id="id">
            <template #activator="{props: propsActivateur}">
              <item-replications-objet
                v-bind="propsActivateur"
                :id="id"
              />
            </template>
          </carte-replications-objet>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <carte-automatisations-bd
            :id-bd="id"
            :permission="monAutorisation"
            type-objet="bd"
          >
            <template #activateur="{props: propsActivateur}">
              <item-automatisations-objet
                v-bind="propsActivateur"
                :id-objet="id"
              />
            </template>
          </carte-automatisations-bd>
        </v-card>
      </div>
      <p class="mt-6 text-h5">
        {{ t('bds.variables') }}
      </p>
      <v-divider class="mb-2" />
      <serie-jetons
        :n-max="5"
        :items="variables"
      >
        <template #jeton="{id: idVariable}">
          <carte-variable :id="idVariable">
            <template #activateur="{props: propsActivateur}">
              <JetonVariable
                v-bind="propsActivateur"
                :id="idVariable"
                class="me-1 mb-1"
              />
            </template>
          </carte-variable>
        </template>
        <template #itemListe="{id: idVariable}">
          <carte-variable :id="idVariable">
            <template #activateur="{props: propsActivateur}">
              <ItemVariable
                v-bind="propsActivateur"
                :id="idVariable"
              />
            </template>
          </carte-variable>
        </template>
      </serie-jetons>
      <p
        v-if="!variables?.length"
        class="text-disabled"
      >
        {{ t('bds.aucuneVariable') }}
      </p>
      <v-list>
        <p class="mt-6 text-h5">
          {{ t('bds.tableaux') }}
        </p>
        <v-divider />
        <v-tabs
          v-if="mdAndUp"
          v-model="tableauActif"
          class="mt-2"
        >
          <v-tab
            v-for="ong in tableaux"
            :key="ong.clef"
            :value="ong.clef"
            color="primary"
            size="small"
            density="compact"
          >
            <entete-tableau
              :id="ong.id"
              :clef="ong.clef"
              @effacer="()=>effacerTableau(ong.id)"
            />
          </v-tab>

          <nouveau-tableau @sauvegarder="ajouterTableau">
            <template #activateur="{props: propsActivateur}">
              <v-chip
                v-if="monAutorisation"
                v-bind="propsActivateur"
                :append-icon="!ajoutTableauEnCours ? 'mdi-plus' : undefined"
                :disabled="ajoutTableauEnCours"
                variant="text"
                class="mx-1 my-auto"
                size="x-large"
                label
                @click.stop
              >
                {{ t('tableaux.nouveau') }}
                <v-progress-circular
                  v-if="ajoutTableauEnCours"
                  class="ms-2"
                  size="15"
                  width="1"
                  indeterminate
                />
              </v-chip>
            </template>
          </nouveau-tableau>
        </v-tabs>

        <v-slide-group
          v-else
          v-model="tableauActif"
          class="mt-4"
          show-arrows
          center-active
        >
          <v-slide-group-item
            v-for="ong in tableaux"
            v-slot="{isSelected, toggle}"
            :key="ong.clef"
            :value="ong.clef"
          >
            <v-chip
              class="mx-1"
              variant="tonal"
              label
              :active="false"
              :color="isSelected ? 'primary' : ''"
              @click="toggle"
            >
              <entete-tableau
                :id="ong.id"
                :clef="ong.clef"
              />
            </v-chip>
          </v-slide-group-item>
          <v-slide-group-item
            key="nouveau"
            value="nouveau"
          >
            <nouveau-tableau @sauvegarder="ajouterTableau">
              <template #activateur="{props: propsActivateur}">
                <v-chip
                  v-if="monAutorisation"
                  v-bind="propsActivateur"
                  :append-icon="!ajoutTableauEnCours ? 'mdi-plus' : undefined"
                  variant="tonal"
                  class="mx-1"
                  label
                  :disabled="ajoutTableauEnCours"
                >
                  {{ t('tableaux.nouveau') }}
                  <v-progress-circular
                    v-if="ajoutTableauEnCours"
                    class="ms-2"
                    size="15"
                    width="1"
                    indeterminate
                  />
                </v-chip>
              </template>
            </nouveau-tableau>
          </v-slide-group-item>
        </v-slide-group>

        <div
          v-if="tableaux && !tableaux.length"
          class="text-center"
        >
          <p class="text-h5 mt-5">
            {{ t('tableaux.aucun') }}
          </p>
          <v-img
            :src="imageVide"
            class="my-5"
            contain
            height="175px"
          />
          <nouveau-tableau @sauvegarder="ajouterTableau">
            <template #activateur="{props: propsActivateur}">
              <v-btn
                v-if="monAutorisation"
                v-bind="propsActivateur"
                color="primary"
                class="mx-2"
                variant="outlined"
              >
                <template #prepend>
                  <v-icon
                    icon="mdi-table"
                    start
                  />
                </template>
                {{ t('tableaux.nouveau') }}
              </v-btn>
            </template>
          </nouveau-tableau>
        </div>
      </v-list>
      <v-window v-model="tableauActif">
        <v-window-item
          v-for="tableau in tableaux"
          :key="tableau.clef"
          :value="tableau.clef"
        >
          <tableau-bd
            :id-tableau="tableau.id"
            :id-bd="id"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-container>
</template>
<script setup lang="ts">
import type {tableaux as typesTableaux} from '@constl/ipa';

import {useDisplay, useRtl} from 'vuetify';

import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, ref, toRaw, watchEffect} from 'vue';

import {MAX_TAILLE_IMAGE} from '/@/consts';

import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

import CarteAutomatisationsBd from '/@/components/automatisations/CarteAutomatisationsBd.vue';
import CarteExportationObjet from '/@/components/automatisations/CarteExportationObjet.vue';
import ItemAutomatisationsObjet from '/@/components/automatisations/ItemAutomatisationsObjet.vue';
import CarteCodeBd from '/@/components/bds/CarteCodeBd.vue';
import CarteQualiteBd from '/@/components/bds/CarteQualitéBd.vue';
import CarteStatutBd from '/@/components/bds/CarteStatutBd.vue';
import ItemQualiteBd from '/@/components/bds/ItemQualitéBd.vue';
import CarteCopier from '/@/components/communs/CarteCopier.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import GererAuteurs from '/@/components/communs/GererAuteurs.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import ItemAuteurs from '/@/components/communs/ItemAuteurs.vue';
import ItemStatut from '/@/components/communs/ItemStatut.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import SerieJetons from '/@/components/communs/SérieJetons.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import ItemLicence from '/@/components/licences/ItemLicence.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import EnteteTableau from '/@/components/tableaux/EntêteTableau.vue';
import NouveauTableau from '/@/components/tableaux/NouveauTableau.vue';
import TableauBd from '/@/components/tableaux/TableauBd.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import IconeEpingle from '/@/components/épingles/IcôneÉpingle.vue';
import ItemReplicationsObjet from '/@/components/épingles/ItemRéplicationsObjet.vue';
import EpinglerBd from '/@/components/épingles/ÉpinglerBd.vue';

import type {valid} from '@constl/ipa';
import {ajusterTexteTraductible, sourceImage} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();
const historiqueDocuments = utiliserHistoriqueDocuments();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});

// Visualisation
const imageVide = obtImageDéco('vide');

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.id)});

// Nom de la Bd
const noms = suivre(constl.bds.suivreNomsBd, {idBd: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.bds.effacerNomBd({idBd: props.id, langue});
  }
  await constl.bds.sauvegarderNomsBd({
    idBd: props.id,
    noms: àAjouter,
  });
};

// Description de la Bd
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {
  idBd: computed(() => props.id),
});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.bds.effacerDescriptionBd({idBd: props.id, langue});
  }
  await constl.bds.sauvegarderDescriptionsBd({
    idBd: props.id,
    descriptions: àAjouter,
  });
};

// Image
const image = sourceImage(suivre(constl.bds.suivreImage, {idBd: computed(() => props.id)}));

const imgDéfaut = obtImageDéco('logoBD');

const modifierImage = async (image?: {contenu: ArrayBuffer; fichier: string}) => {
  if (image) {
    await constl.bds.sauvegarderImage({
      idBd: props.id,
      image: {contenu: new Uint8Array(image.contenu), nomFichier: image.fichier},
    });
  } else {
    await constl.bds.effacerImage({idBd: props.id});
  }
};

// Statut
const statut = suivre(constl.bds.suivreStatutBd, {idBd: computed(() => props.id)});

// Variables
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: computed(() => props.id)});

// Mots-clefs
const motsClefs = suivre(constl.bds.suivreMotsClefsBd, {idBd: computed(() => props.id)});
const sauvegarderMotsClefs = async (àJour: string[]) => {
  const nouveaux = àJour.filter(m => !motsClefs.value?.includes(m));
  const àEnlever = motsClefs.value?.filter(m => !àJour.includes(m)) || [];
  await constl.bds.ajouterMotsClefsBd({
    idBd: props.id,
    idsMotsClefs: nouveaux,
  });
  await Promise.all(àEnlever.map(m => constl.bds.effacerMotClefBd({idBd: props.id, idMotClef: m})));
};

// Géographie
/* À faire
cosnt géog = suivre(
  constl.bds.suivreGéographieBd, 
  {
    idBd: props.id
  },
);
*/

// Tableaux
const tableaux = suivre(constl.bds.suivreTableauxBd, {idBd: computed(() => props.id)});
const tableauActif = ref<string>();
watchEffect(() => {
  if (!tableauActif.value && tableaux.value?.length) {
    tableauActif.value = tableaux.value[0].clef;
  }
  if (tableauActif.value && !tableaux.value?.map(t => t.clef).includes(tableauActif.value)) {
    tableauActif.value = undefined;
  }
});

const ajoutTableauEnCours = ref(false);
const ajouterTableau = async ({
  noms,
  cols,
}: {
  noms: {
    [langue: string]: string;
  };
  cols: {
    info: typesTableaux.InfoCol;
    règles: valid.règleVariable[];
  }[];
}) => {
  ajoutTableauEnCours.value = true;
  try {
    const idTableau = await constl.bds.ajouterTableauBd({idBd: props.id});
    await constl.tableaux.sauvegarderNomsTableau({
      idTableau,
      noms: toRaw(noms),
    });

    await Promise.all(
      cols.map(async col => {
        await constl.tableaux.ajouterColonneTableau({
          idTableau,
          idColonne: col.info.id,
          idVariable: col.info.variable,
        });
        if (col.info.index) {
          await constl.tableaux.changerColIndex({
            idTableau,
            idColonne: col.info.id,
            val: true,
          });
        }
        await Promise.all(
          col.règles.map(
            async r =>
              await constl.tableaux.ajouterRègleTableau({
                idTableau,
                idColonne: col.info.id,
                règle: r,
              }),
          ),
        );
      }),
    );
  } finally {
    ajoutTableauEnCours.value = false;
  }
};

const effacerTableau = async (idTableau: string) => {
  await constl.bds.effacerTableauBd({ idBd: props.id, idTableau });
};

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: computed(() => props.id)});

// Licence
const licence = suivre(constl.bds.suivreLicenceBd, {idBd: computed(() => props.id)});
const licenceContenu = suivre(constl.bds.suivreLicenceContenuBd, {idBd: computed(() => props.id)});
const changerLicence = async ({
  licence: nouvelleLicence,
  licenceContenu: nouvelleLicenceContenu,
}: {
  licence: string;
  licenceContenu?: string | undefined;
}) => {
  await constl.bds.changerLicenceBd({idBd: props.id, licence: nouvelleLicence});
  if (nouvelleLicenceContenu) {
    await constl.bds.changerLicenceContenuBd({
      idBd: props.id,
      licenceContenu: nouvelleLicenceContenu,
    });
  }
};

// Navigation
const petitPousset = computed<{title: string; href?: string; disabled?: boolean}[]>(() => [
  {title: t('navigation.données') as string, href: encodeURI('/données/')},
  {title: nomTraduit.value || t('bds.sansNom'), disabled: true},
]);

// Actions
const effacerBd = async () => {
  await constl.bds.effacerBd({idBd: props.id});
};
</script>
