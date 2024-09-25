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
      <carte-epingler :id="id">
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
      </carte-epingler>

      <carte-exportation-objet
        :id-objet="id"
        type-objet="bd"
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

      <generer-appli :id-nuee="id">
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
      </generer-appli>

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
  </v-container>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted} from 'vue';

import {utiliserConstellation} from '/@/components/utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {ajusterTexteTraductible, sourceImage} from '/@/utils';

import CarteCopier from '/@/components/communs/CarteCopier.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import CarteCodeNuee from '/@/components/nuées/CarteCodeNuée.vue';
import GenererAppli from '/@/components/nuées/GénérerAppli.vue';

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

const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: props.id});
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

// Image
const image = sourceImage(suivre(constl.nuées.suivreImage, {idNuée: props.id}));

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

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.id});

// Mots-clefs
const motsClefs = suivre(constl.nuées.suivreMotsClefsNuée, {idNuée: props.id});
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

/*
const estApprouvable = computed(()=>{})
const activerApprouvable = async () => {

}
*/

// Tableaux
// const tableaux = suivre(constl.nuées.suivreTableauxNuée, {idNuée: props.id});

// const autorisation = suivre(constl.nuées.suivrePhilosophieAutorisation, {idNuée: props.id});

// Actions
const effacerNuée = async () => {
  await constl.nuées.effacerNuée({idNuée: props.id});
};
</script>
