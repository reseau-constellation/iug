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
              @click="item.lien && $router.push(item.lien)"
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
        :taille-avatar="mdAndUp ? 275 : 175"
        :max-taille-image="MAX_TAILLE_IMAGE"
        @image-changee="image => modifierImage(image)"
      />

      <v-card-title class="d-flex">
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
        <lien-objet :id="id" />

        <v-spacer />
        <CarteEpingler :id="id">
          <template #activator="{props: propsActivateurCarte}">
            <v-tooltip
              open-delay="200"
              location="bottom"
              :text="t('communs.épingler')"
            >
              <template #activator="{props: propsActivateurIndice}">
                <v-btn
                  v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                  icon
                  variant="flat"
                >
                  <IcôneEpingle :id="id"></IcôneEpingle>
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

        <carte-copier :id="id">
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
      </v-card-title>

      <v-divider />
      <v-card-text>
        <v-card
          flat
          class="mx-3 mb-3"
        >
          <DialogueNoms
            :etiquette-nom="t('objet.étiquetteDescription')"
            :indice-nom="t('objet.indiceDescription')"
            :indice-langue="t('objet.indiceLangue')"
            :texte-aucun-nom="t('objet.texteAucuneDescription')"
            :noms-initiaux="descriptions"
            :titre="t('objet.titreDialogueDescriptions')"
            :sous-titre="t('objet.sousTitreDialogueDescriptions')"
            :autorisation-modification="!!monAutorisation"
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

          <p class="mb-0 text-overline">
            {{ t('pages.bds.info') }}
          </p>
          <div class="d-flex flex-wrap">
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
        </v-card>
        <v-card
          flat
          class="mx-3 mb-3"
        >
          <div class="d-flex flex-wrap">
            <v-card
              flat
              min-width="200"
              max-width="350"
              class="mb-3 me-3"
            >
              <v-card-item>
                <v-card-title>
                  <p class="text-overline">
                    {{ t('bd.carteBd.variables') }}
                  </p>
                </v-card-title>
              </v-card-item>

              <v-card-text>
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
              </v-card-text>
            </v-card>
            <v-card
              flat
              min-width="200"
              max-width="350"
              class="mb-3 me-3"
            >
              <v-card-item>
                <v-card-title>
                  <p class="mb-0 text-overline">
                    {{ t('bds.carteBd.motsClefs') }}
                  </p>
                </v-card-title>
              </v-card-item>
              <v-card-text>
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
                <p
                  v-if="motsClefs && !motsClefs.length"
                  class="text-disabled"
                >
                  {{ t('bds.aucunMotClef') }}
                </p>
                <GérerMotsClefsObjet
                  v-if="monAutorisation && motsClefs"
                  :originaux="motsClefs"
                  @sauvegarder="sauvegarderMotsClefs"
                />
              </v-card-text>
            </v-card>
            <v-card
              flat
              min-width="200"
              max-width="350"
              class="mb-3 me-3"
            >
              <v-card-item>
                <v-card-title>
                  <p class="mb-0 text-overline">
                    {{ t('bd.carteBd.géographie') }}
                  </p>
                </v-card-title>
              </v-card-item>
              <v-card-text>
                <p
                  v-if="géog && !géog.length"
                  class="text--disabled"
                >
                  {{ t('bds.aucuneGéog') }}
                </p>
                <v-chip
                  v-for="m in géog"
                  :key="m"
                  outlined
                  small
                  label
                  class="mx-1 my-1"
                >
                  {{ m }}
                </v-chip>
              </v-card-text>
            </v-card>
          </div>
        </v-card>
        <v-list>
          <p class="mb-0 text-overline">
            {{ t('bds.tableaux') }}
            <nouveau-tableau
              :id-bd="id"
              importation-permise
            >
              <template #activator="{props: propsActivateur}">
                <v-btn
                  v-if="monAutorisation"
                  v-bind="propsActivateur"
                  icon="mdi-plus"
                  size="small"
                  variant="flat"
                />
              </template>
            </nouveau-tableau>
          </p>
          <v-divider />
          <v-skeleton-loader
            v-if="tableaux === null"
            type="paragraph"
          />
          <div
            v-else-if="tableaux && !tableaux.length"
            class="text-center"
          >
            <p class="text-h5 mt-5">
              {{ t('bds.tableaux') }}
            </p>
            <v-img
              :src="imageVide"
              class="my-5"
              contain
              height="175px"
            />
            <nouveau-tableau
              :id-bd="id"
              importation-permise
            >
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
                  {{ t('bds.ajouterTableau') }}
                </v-btn>
              </template>
            </nouveau-tableau>
            <importer-ou-exporter
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

          <transition-group
            v-else
            name="fade"
            mode="out-in"
            class="d-flex flex-wrap justify-center"
          >
            <item-tableau
              v-for="tableau in tableauxOrdonnés"
              :id="tableau.id"
              :key="tableau.id"
              :id-bd="id"
              @click="
                $router.push(
                  `/bd/visualiser/${encodeURIComponent(id)}/tableau/${encodeURIComponent(
                    tableau.id,
                  )}`,
                )
              "
            />
          </transition-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script setup lang="ts">
import {useDisplay, useRtl} from 'vuetify';

import {computed, ref, onMounted} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {MAX_TAILLE_IMAGE} from '/@/consts';

import {constellation, suivre} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

import ImageEditable from '/@/components/communs/ImageEditable.vue';
import texteTronqué from '/@/components/communs/TexteTronqué.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import CarteEpingler from '/@/components/épingles/CarteÉpingler.vue';
import IcôneEpingle from '/@/components/épingles/IcôneÉpingle.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import CarteCopier from '/@/components/communs/CarteCopier.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import ImporterOuExporter from '/@/components/importerExporter/ImporterOuExporter.vue';
import ItemAutomatisations from '/@/components/automatisations/ItemAutomatisationsObjet.vue';
import CarteAutomatisations from '/@/components/automatisations/CarteAutomatisationsObjet.vue';
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
import GérerMotsClefsObjet from '/@/components/motsClefs/GérerMotsClefsObjet.vue';
import CarteRéplicationsObjet from '/@/components/épingles/CarteRéplicationsObjet.vue';
import ItemRéplicationsObjet from '/@/components/épingles/ItemRéplicationsObjet.vue';
import NouveauTableau from '/@/components/tableaux/NouveauTableau.vue';
import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemTableau from '/@/components/tableaux/ItemTableau.vue';

import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
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
const noms = suivre(constl.bds.suivreNomsBd, {idBd: props.id}, {});
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
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {idBd: props.id}, {});
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
const imageBd = suivre(constl.bds.suivreImage, {idBd: props.id});
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

// Variables
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: props.id});

// Mots-clefs
const motsClefs = suivre(constl.bds.suivreMotsClefsBd, {idBd: props.id});
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
const géog = ref();
/* À faire
enregistrerÉcoute(
  constl.bds.suivreGéographieBd({
    idBd: props.id,
    f: x => (géog.value = x)
  }),
);
*/

// Tableaux
const tableaux = suivre(constl.bds.suivreTableauxBd, {idBd: props.id});
const tableauxOrdonnés = computed(() => {
  if (!tableaux.value) return;
  return [...tableaux.value].sort((a, b) => (a.id > b.id ? -1 : 1));
});

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: props.id});

// Licence
const licence = suivre(constl.bds.suivreLicenceBd, {idBd: props.id});
const changerLicence = async (nouvelleLicence: string) => {
  await constl.bds.changerLicenceBd({idBd: props.id, licence: nouvelleLicence});
};

// Navigation
const petitPousset = computed<{title: string; lien?: string; disabled?: boolean}[]>(() => [
  {title: t('navig.mesDonnées') as string, lien: encodeURI('/données/')},
  {title: nomTraduit.value || props.id, disabled: true},
]);

// Actions
const effacerBd = async () => {
  await constl.bds.effacerBd({idBd: props.id});
};
</script>
