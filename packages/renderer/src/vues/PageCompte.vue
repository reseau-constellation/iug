<template>
  <v-container class="text-center">
    <TitrePage :titre="t('pages.compte.titre')" />
    <ImageEditable
      :src-image="srcImgProfil"
      :img-defaut="imgDéfaut"
      :taille-avatar="mdAndUp ? 275 : 175"
      :editable="true"
      :max-taille-image="MAX_TAILLE_IMAGE"
      @image-changee="image => sauvegarderImage(image)"
    />
    <h1 class="mb-2">
      <span :class="{'text-disabled': !nomTraduit}">{{ nomTraduit || t('communs.anonyme') }}</span>
      <DialogueNoms
        :etiquette-nom="t('listeNomsProfil.étiquetteNom')"
        :indice-nom="t('listeNomsProfil.indiceNom')"
        :indice-langue="t('listeNomsProfil.indiceLangue')"
        :texte-aucun-nom="t('listeNomsProfil.texteAucunNom')"
        :noms-initiaux="noms"
        :titre="t('pages.compte.titreDialogueNoms')"
        :sous-titre="t('pages.compte.sousTitreDialogueNoms')"
        autorisation-modification
        @ajuster-noms="nms => ajusterNoms(nms)"
      >
        <template #activator="{props}">
          <v-btn
            v-bind="props"
            icon="mdi-pencil"
            variant="flat"
          ></v-btn>
        </template>
      </DialogueNoms>
      <lien-objet
        v-if="idCompte"
        :id="idCompte"
      />
    </h1>
    <modifier-info-contact-membre
      v-for="{type, contact} in contacts || []"
      :key="contact + '|' + type"
      :type="type"
      :valeur-avant="contact"
    >
      <template #activator="{props}">
        <jeton-contact-membre
          v-bind="props"
          :type="type"
          :contact="contact"
        />
      </template>
    </modifier-info-contact-membre>

    <nouvelle-info-contact-membre :deja-presents="Object.keys(contacts || {})">
      <template #activator="{props: propsActivateur}">
        <v-chip
          v-bind="propsActivateur"
          class="mx-2"
          variant="outlined"
          label
          append-icon="mdi-plus"
        >
          {{ t('pages.compte.nouveauContact') }}
        </v-chip>
      </template>
    </nouvelle-info-contact-membre>
    <v-tabs
      v-if="smAndUp"
      v-model="onglet"
      class="mt-2"
      color="primary"
    >
      <v-tab
        v-for="ong in onglets"
        :key="ong.clef"
        :value="ong.clef"
      >
        {{ t(`pages.compte.${ong.clefTraduc}`) }}
        <v-icon
          end
          :icon="ong.icône"
        >
        </v-icon>
      </v-tab>
    </v-tabs>
    <v-slide-group
      v-else
      v-model="onglet"
      class="mt-4"
      show-arrows
      center-active
    >
      <v-slide-group-item
        v-for="ong in onglets"
        v-slot="{isSelected, toggle}"
        :key="ong.clef"
        :value="ong.clef"
      >
        <v-chip
          class="mx-2"
          variant="outlined"
          label
          :color="isSelected ? 'primary' : ''"
          :append-icon="ong.icône"
          @click="toggle"
        >
          {{ t(`pages.compte.${ong.clefTraduc}`) }}
        </v-chip>
      </v-slide-group-item>
    </v-slide-group>
    <v-window v-model="onglet">
      <v-window-item value="compte">
        <OngletCompte />
      </v-window-item>
      <v-window-item value="thème">
        <OngletThème />
      </v-window-item>
      <v-window-item value="connexions">
        <OngletConnexions />
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserImagesDéco} from '/@/composables/images';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import TitrePage from '/@/components/communs/TitrePage.vue';
import OngletCompte from '/@/components/compte/OngletCompte.vue';
import OngletConnexions from '/@/components/compte/OngletConnexions.vue';
import OngletThème from '/@/components/compte/OngletThème.vue';
import NouvelleInfoContactMembre from '/@/components/membres/NouvelleInfoContact.vue';
import {utiliserConstellation} from '/@/components/utils';
import {MAX_TAILLE_IMAGE} from '/@/consts';

import JetonContactMembre from '/@/components/membres/JetonContactMembre.vue';
import ModifierInfoContactMembre from '/@/components/membres/ModifierInfoContactMembre.vue';
import {ajusterTexteTraductible} from '/@/utils';

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {smAndUp, mdAndUp} = useDisplay();

// Mon ID compte
const idCompte = suivre(constl.suivreIdCompte);

// Image profil
const imageProfil = suivre(constl.profil.suivreImage);
const srcImgProfil = computed(() => {
  if (imageProfil.value) {
    return URL.createObjectURL(new Blob([imageProfil.value], {type: 'image'}));
  } else {
    return undefined;
  }
});

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');

const sauvegarderImage = async (image?: {contenu: ArrayBuffer; fichier: string}) => {
  if (image) {
    await constl.profil.sauvegarderImage({
      image: {contenu: new Uint8Array(image.contenu), nomFichier: image.fichier},
    });
  } else {
    await constl.profil.effacerImage();
  }
};

// Nom profil
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms);
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const [langue, nom] of Object.entries(àAjouter)) {
    await constl.profil.sauvegarderNom({langue, nom});
  }
  for (const langue of àEffacer) {
    await constl.profil.effacerNom({langue});
  }
};

// Contacts
const contacts = suivre(constl.profil.suivreContacts);

// Onglets
const onglet = ref('compte');
const onglets: {clef: string; clefTraduc: string; icône?: string}[] = [
  {clef: 'compte', clefTraduc: 'ongletCompte', icône: 'mdi-account'},
  {clef: 'thème', clefTraduc: 'ongletThème', icône: 'mdi-tune-variant'},
  {clef: 'connexions', clefTraduc: 'ongletConnexions', icône: 'mdi-lan-connect'},
];
</script>
