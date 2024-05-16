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
        <template #activator="{props: propsActivateur}">
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
            <template #activator="{props: propsActivateur}">
              <JetonMotClef
                v-bind="propsActivateur"
                :id="idMotClef"
              />
            </template>
          </carte-mot-clef>
        </template>
        <template #itemListe="{id: idMotClef}">
          <carte-mot-clef :id="idMotClef">
            <template #activator="{props: propsActivateur}">
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
      <CarteEpingler :id="id">
        <template #activator="{props: propsActivateurCarte}">
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
      </CarteEpingler>

      <importer-ou-exporter
        :info-objet="{id, typeObjet: 'bd'}"
        :type="monAutorisation ? undefined : 'exportation'"
      >
        <template #activator="{props: propsActivateurCarte}">
          <v-tooltip
            :text="t('exporter.indice')"
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
      </importer-ou-exporter>

      <carte-code-bd :id="id">
        <template #activator="{props: propsActivateurCarte}">
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
        <template #activator="{props: propsActivateurCarte}">
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
        <template #activator="{props: propsActivateurCarte}">
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
        <template #activator="{props: propsActivateur}">
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
            <template #activator="{props: propsActivateur}">
              <item-statut
                v-bind="propsActivateur"
                type-objet="bd"
                :statut="statut"
              />
            </template>
          </carte-statut-bd>
        </v-card>
        <v-card
          v-if="false"
          flat
          width="200"
          class="mb-3"
        >
          <carte-qualite-bd>
            <template #activator="{props: propsActivateur}">
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
            <template #activator="{props: propsActivateur}">
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
            <template #activator="{props: propsActivateur}">
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
          <CarteRéplicationsObjet :id="id">
            <template #activator="{props: propsActivateur}">
              <ItemRéplicationsObjet
                v-bind="propsActivateur"
                :id="id"
              />
            </template>
          </CarteRéplicationsObjet>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <carte-automatisations
            :id-objet="id"
            :permission="monAutorisation"
            type-objet="bd"
          >
            <template #activator="{props: propsActivateur}">
              <item-automatisations
                v-bind="propsActivateur"
                :id-objet="id"
              />
            </template>
          </carte-automatisations>
        </v-card>
      </div>
      <p class="mt-6 text-h5">
        {{ t('bds.variables') }}
      </p>
      <v-divider class="mb-2" />
      <SérieJetons
        :n-max="5"
        :items="variables"
      >
        <template #jeton="{id: idVariable}">
          <carte-variable :id="idVariable">
            <template #activator="{props: propsActivateur}">
              <JetonVariable
                v-bind="propsActivateur"
                :id="idVariable"
              />
            </template>
          </carte-variable>
        </template>
        <template #itemListe="{id: idVariable}">
          <carte-variable :id="idVariable">
            <template #activator="{props: propsActivateur}">
              <ItemVariable
                v-bind="propsActivateur"
                :id="idVariable"
              />
            </template>
          </carte-variable>
        </template>
      </SérieJetons>
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
            si
            ze="small"
          >
            <TexteTronque
              :texte="ong.clef"
              :longueur-max="20"
            />
            <carte-tableau-bd
              :id-bd="id"
              :id-tableau="ong.id"
              :clef="ong.clef"
              :permission-modifier="!!monAutorisation"
            >
              <template #activator="{props: propsActivateur}">
                <v-icon
                  v-bind="propsActivateur"
                  class="ms-2"
                  icon="mdi-pencil"
                  variant="flat"
                  size="small"
                />
              </template>
            </carte-tableau-bd>
          </v-tab>

          <nouveau-tableau @sauvegarder="ajouterTableau">
            <template #activator="{props: propsActivateur}">
              <v-tab
                v-if="monAutorisation"
                v-bind="propsActivateur"
                :append-icon="!ajoutTableauEnCours ? 'mdi-plus' : undefined"
                :disabled="ajoutTableauEnCours"
                variant="tonal"
                class="mx-1"
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
              </v-tab>
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
              {{ ong.clef.slice(0, 10) }}

              <v-icon
                class="ms-2"
                icon="mdi-pencil"
                variant="flat"
                size="x-small"
              />
            </v-chip>
          </v-slide-group-item>
          <v-slide-group-item
            key="nouveau"
            value="nouveau"
          >
            <nouveau-tableau @sauvegarder="ajouterTableau">
              <template #activator="{props: propsActivateur}">
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
            <template #activator="{props: propsActivateur}">
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
          <importer-ou-exporter
            v-if="false"
            type="importation"
            :automatiser="true"
            :info-objet="{id, typeObjet: 'bd'}"
          >
            <v-btn
              v-if="monAutorisation"
              color="primary"
              class="mx-2"
              variant="outlined"
              icon="mdi-import"
            >
              {{ t('bds.importation') }}
            </v-btn>
          </importer-ou-exporter>
        </div>
      </v-list>
      <v-window v-model="tableauActif">
        <v-window-item
          v-for="tableau in tableaux"
          :key="tableau.clef"
          :value="tableau.clef"
        >
          <tableau-bd :id-tableau="tableau.id" />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-container>
</template>
<script setup lang="ts">
import type {tableaux as typesTableaux} from '@constl/ipa';

import {useDisplay, useRtl} from 'vuetify';

import {computed, ref, onMounted, watchEffect} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {MAX_TAILLE_IMAGE} from '/@/consts';

import {constellation, suivre} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

import ImageEditable from '/@/components/communs/ImageEditable.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import CarteEpingler from '/@/components/épingles/CarteÉpingler.vue';
import IconeEpingle from '/@/components/épingles/IcôneÉpingle.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import CarteCopier from '/@/components/communs/CarteCopier.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import ImporterOuExporter from '/@/components/importerExporter/ImporterOuExporter.vue';
import ItemAutomatisations from '/@/components/automatisations/ItemAutomatisationsObjet.vue';
import CarteAutomatisations from '/@/components/automatisations/CarteAutomatisationsObjet.vue';
import CarteStatutBd from '/@/components/bds/CarteStatutBd.vue';
import GererAuteurs from '/@/components/communs/GererAuteurs.vue';
import ItemAuteurs from '/@/components/communs/ItemAuteurs.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import ItemQualiteBd from '/@/components/bds/ItemQualitéBd.vue';
import CarteQualiteBd from '/@/components/bds/CarteQualitéBd.vue';
import CarteCodeBd from '/@/components/bds/CarteCodeBd.vue';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import ItemLicence from '/@/components/licences/ItemLicence.vue';
import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import CarteRéplicationsObjet from '/@/components/épingles/CarteRéplicationsObjet.vue';
import ItemRéplicationsObjet from '/@/components/épingles/ItemRéplicationsObjet.vue';
import NouveauTableau from '/@/components/tableaux/NouveauTableau.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import TableauBd from '/@/components/tableaux/TableauBd.vue';
import CarteTableauBd from '/@/components/tableaux/CarteTableauBd.vue';
import ItemStatut from '/@/components/communs/ItemStatut.vue';

import {ajusterTexteTraductible, sourceImage} from '/@/utils';
import type {valid} from '@constl/ipa';

const props = defineProps<{id: string}>();

const constl = constellation();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();
const historiqueDocuments = utiliserHistoriqueDocuments();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});

// Visualisation
const imageVide = obtImageDéco('vide');

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.id});

// Nom de la Bd
const noms = suivre(constl.bds.suivreNomsBd, {idBd: props.id});
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
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {idBd: props.id});
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
const image = sourceImage(suivre(constl.bds.suivreImage, {idBd: props.id}));

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
const statut = suivre(constl.bds.suivreStatutBd, {idBd: props.id});

// Variables
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: props.id});

// Mots-clefs
const motsClefs = suivre(constl.bds.suivreMotsClefsBd, {idBd: props.id});
const sauvegarderMotsClefs = async (àJour: string[]) => {
  console.log({àJour});
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
const tableaux = suivre(constl.bds.suivreTableauxBd, {idBd: props.id});
const tableauxOrdonnés = computed(() => {
  if (!tableaux.value) return;
  return [...tableaux.value].sort((a, b) => (a.id > b.id ? -1 : 1));
});
const tableauActif = ref<string>();
watchEffect(() => {
  if (!tableauActif.value && tableauxOrdonnés.value?.length) {
    tableauActif.value = tableauxOrdonnés.value[0].clef;
  }
  if (
    tableauActif.value &&
    !tableauxOrdonnés.value?.map(t => t.clef).includes(tableauActif.value)
  ) {
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
      noms,
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

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: props.id});

// Licence
const licence = suivre(constl.bds.suivreLicenceBd, {idBd: props.id});
const licenceContenu = suivre(constl.bds.suivreLicenceContenuBd, {idBd: props.id});
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
