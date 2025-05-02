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
            {{ nomTraduit || t('nuées.sansNom') }}
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
        {{ t('nuées.aucunMotClef') }}
      </span>
      <EditeurMotsClefs
        v-if="monAutorisation && motsClefs"
        :originaux="motsClefs"
        @sauvegarder="ids => sauvegarderMotsClefs(ids)"
      />
    </div>

    <div class="text-center">
      <epingler-nuee :id-nuee="id">
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
      </epingler-nuee>

      <carte-exportation-objet
        :id-objet="id"
        :noms-objet="noms"
        type-objet="nuée"
      >
        <template #activator="{props: propsActivateurCarte}">
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

      <!--<generer-appli :id-nuee="id">
        <template #activator="{props: propsActivateurCarte}">
          <v-tooltip
            :text="t('code.générerAppli.indice')"
            :open-delay="200"
            location="bottom"
          >
            <template #activator="{props: propsActivateurIndice}">
              <v-btn
                v-bind="{...propsActivateurCarte, ...propsActivateurIndice}"
                variant="flat"
                icon
              >
                <v-icon
                  icon="mdi-creation-outline"
                  color="primary"
                ></v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </generer-appli>-->

      <carte-code-nuee :id="id">
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
      </carte-code-nuee>

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
        @effacer="() => effacerNuée()"
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
        {{ t('nuées.info') }}
      </p>
      <v-divider class="mb-2" />
      <div class="d-flex flex-wrap">
        <v-card
          v-if="statut && (statut.statut !== 'active' || monAutorisation)"
          flat
          width="200"
          class="mb-3"
        >
          <carte-statut-nuee :id-nuee="id">
            <template #activator="{props: propsActivateur}">
              <item-statut
                v-bind="propsActivateur"
                type-objet="nuée"
                :statut="statut"
              />
            </template>
          </carte-statut-nuee>
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
          <CarteReplicationsObjet :id="id">
            <template #activator="{props: propsActivateur}">
              <ItemReplicationsObjet
                v-bind="propsActivateur"
                :id="id"
              />
            </template>
          </CarteReplicationsObjet>
        </v-card>
        <v-card
          flat
          width="200"
          class="mb-3"
        >
          <carte-automatisations-objet
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
          </carte-automatisations-objet>
        </v-card>
      </div>
      <p class="mt-6 text-h5">
        {{ t('nuées.variables') }}
      </p>
      <v-divider class="mb-2" />
      <SerieJetons
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
      </SerieJetons>
      <p
        v-if="!variables?.length"
        class="text-disabled"
      >
        {{ t('nuées.aucuneVariable') }}
      </p>
      <v-list>
        <p class="mt-6 text-h5">
          {{ t('nuées.tableaux') }}
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
          >
            <entete-tableau
              :id="ong.id"
              :clef="ong.clef"
            />
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
        </div>
      </v-list>
      <v-window v-model="tableauActif">
        <v-window-item
          v-for="tableau in tableaux"
          :key="tableau.clef"
          :value="tableau.clef"
        >
          <tableau-nuee
            :id-tableau="tableau.id"
            :clef-tableau="tableau.clef"
            :id-nuee="id"
          />
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import type {tableaux as typesTableaux, valid} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, ref, watchEffect} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {ajusterTexteTraductible, sourceImage} from '/@/utils';

import CarteAutomatisationsObjet from '/@/components/automatisations/CarteAutomatisationsObjet.vue';
import CarteCopier from '/@/components/communs/CarteCopier.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import GererAuteurs from '/@/components/communs/GererAuteurs.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import ItemAuteurs from '/@/components/communs/ItemAuteurs.vue';
import ItemStatut from '/@/components/communs/ItemStatut.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import CarteStatutNuee from '/@/components/nuées/CarteStatutNuée.vue';

import LienObjet from '/@/components/communs/LienObjet.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import CarteCodeNuee from '/@/components/nuées/CarteCodeNuée.vue';
// import GenererAppli from '/@/components/nuées/GénérerAppli.vue';
import ItemAutomatisations from '/@/components/automatisations/ItemAutomatisationsObjet.vue';
import SerieJetons from '/@/components/communs/SérieJetons.vue';
import EnteteTableau from '/@/components/tableaux/EntêteTableau.vue';

import CarteExportationObjet from '/@/components/automatisations/CarteExportationObjet.vue';
import CarteReplicationsObjet from '/@/components/épingles/CarteRéplicationsObjet.vue';

import NouveauTableau from '/@/components/tableaux/NouveauTableau.vue';
import TableauNuee from '/@/components/tableaux/TableauNuée.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import IconeEpingle from '/@/components/épingles/IcôneÉpingle.vue';
import ItemReplicationsObjet from '/@/components/épingles/ItemRéplicationsObjet.vue';
import EpinglerNuee from '/@/components/épingles/ÉpinglerNuée.vue';

import {useDisplay, useRtl} from 'vuetify';
import {MAX_TAILLE_IMAGE} from '/@/consts';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const historiqueDocuments = utiliserHistoriqueDocuments();
const {obtImageDéco} = utiliserImagesDéco();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});

// Navigation
const petitPousset = computed<{title: string; href?: string; disabled?: boolean}[]>(() => [
  {title: t('navigation.données') as string, href: encodeURI('/données/')},
  {title: nomTraduit.value || t('nuées.sansNom'), disabled: true},
]);

// Nom de la nuée
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.nuées.effacerNomNuée({idNuée: props.id, langue});
  }
  await constl.nuées.sauvegarderNomsNuée({
    idNuée: props.id,
    noms: àAjouter,
  });
};

// Description de la nuée
const descriptions = suivre(constl.nuées.suivreDescriptionsNuée, {
  idNuée: computed(() => props.id),
});
const descrTraduite = அகராதியிலிருந்து_மொழிபெயர்ப்பு(descriptions);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.nuées.effacerDescriptionNuée({idNuée: props.id, langue});
  }
  await constl.nuées.sauvegarderDescriptionsNuée({
    idNuée: props.id,
    descriptions: àAjouter,
  });
};

// Image
const image = sourceImage(suivre(constl.nuées.suivreImage, {idNuée: computed(() => props.id)}));

const imgDéfaut = obtImageDéco('logoBD');

const modifierImage = async (image?: {contenu: ArrayBuffer; fichier: string}) => {
  if (image) {
    await constl.nuées.sauvegarderImage({
      idNuée: props.id,
      image: {contenu: new Uint8Array(image.contenu), nomFichier: image.fichier},
    });
  } else {
    await constl.nuées.effacerImage({idNuée: props.id});
  }
};

// Visualisation
const imageVide = obtImageDéco('vide');

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.id)});

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursNuée, {idNuée: computed(() => props.id)});

// Variables
const variables = suivre(constl.nuées.suivreVariablesNuée, {idNuée: computed(() => props.id)});

// Mots-clefs
const motsClefs = suivre(constl.nuées.suivreMotsClefsNuée, {idNuée: computed(() => props.id)});
const sauvegarderMotsClefs = async (àJour: string[]) => {
  const nouveaux = àJour.filter(m => !motsClefs.value?.includes(m));
  const àEnlever = motsClefs.value?.filter(m => !àJour.includes(m)) || [];
  await constl.nuées.ajouterMotsClefsNuée({
    idNuée: props.id,
    idsMotsClefs: nouveaux,
  });
  await Promise.all(
    àEnlever.map(m => constl.nuées.effacerMotClefNuée({idNuée: props.id, idMotClef: m})),
  );
};

// Statut
const statut = suivre(constl.nuées.suivreStatutNuée, {idNuée: computed(() => props.id)});

/*
const estApprouvable = computed(()=>{})
const activerApprouvable = async () => {

}
*/

// Tableaux
const tableaux = suivre(constl.nuées.suivreTableauxNuée, {idNuée: computed(() => props.id)});
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
    await constl.nuées.sauvegarderNomsTableauNuée({
      idTableau,
      noms,
    });
    await Promise.all(
      cols.map(async col => {
        await constl.nuées.ajouterColonneTableauNuée({
          idTableau,
          idColonne: col.info.id,
          idVariable: col.info.variable,
        });
        if (col.info.index) {
          await constl.nuées.changerColIndexTableauNuée({
            idTableau,
            idColonne: col.info.id,
            val: true,
          });
        }
        await Promise.all(
          col.règles.map(
            async r =>
              await constl.nuées.ajouterRègleTableauNuée({
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

// const autorisation = suivre(constl.nuées.suivrePhilosophieAutorisation, {idNuée: props.id});

// Actions
const effacerNuée = async () => {
  await constl.nuées.effacerNuée({idNuée: props.id});
};
</script>
