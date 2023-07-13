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
          class="mx-2 text-disabled"
          variant="outlined"
          label
          append-icon="mdi-plus"
        >
          {{ t('pages.compte.nouveauContact') }}
        </v-chip>
      </template>
    </nouvelle-info-contact-membre>
    <v-tabs v-model="onglet">
      <v-tab value="compte">{{ t('pages.compte.ongletCompte') }}</v-tab>
      <v-tab value="thème">{{ t('pages.compte.ongletThème') }}</v-tab>
      <v-tab value="connexions">{{ t('pages.compte.ongletConnexions') }}</v-tab>
    </v-tabs>
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
import {computed, inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserImagesDéco} from '/@/composables/images';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import type {client} from '@constl/ipa';

import {MAX_TAILLE_IMAGE} from '/@/consts';
import {enregistrerÉcoute} from '/@/components/utils';
import TitrePage from '/@/components/communs/TitrePage.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import OngletConnexions from '/@/components/compte/OngletConnexions.vue';
import OngletThème from '/@/components/compte/OngletThème.vue';
import OngletCompte from '/@/components/compte/OngletCompte.vue';
import LienObjet from '/@/components/communs/LienObjet.vue';
import NouvelleInfoContactMembre from '/@/components/membres/NouvelleInfoContact.vue';

import JetonContactMembre from '/@/components/membres/JetonContactMembre.vue';
import ModifierInfoContactMembre from '/@/components/membres/ModifierInfoContactMembre.vue';
import {ajusterTexteTraductible} from '/@/utils';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

// Mon ID compte
const idCompte = ref<string>();
enregistrerÉcoute(
  constl?.suivreIdBdCompte({
    f: id => (idCompte.value = id),
  }),
);

// Image profil
const imageProfil = ref<Uint8Array | null>();
const srcImgProfil = computed(() => {
  if (imageProfil.value) {
    return URL.createObjectURL(new Blob([imageProfil.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
enregistrerÉcoute(
  constl?.profil?.suivreImage({
    f: image => (imageProfil.value = image),
  }),
);

const {obtImageDéco} = utiliserImagesDéco();
const imgDéfaut = obtImageDéco('profil');

const sauvegarderImage = async (image?: ArrayBuffer) => {
  if (image) {
    await constl?.profil?.sauvegarderImage({image});
  } else {
    await constl?.profil?.effacerImage();
  }
};

// Nom profil
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);
enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  }),
);

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const [langue, nom] of Object.entries(àAjouter)) {
    await constl?.profil?.sauvegarderNom({langue, nom});
  }
  for (const langue of àEffacer) {
    await constl?.profil?.effacerNom({langue});
  }
};

// Contacts
const contacts = ref<{type: string; contact: string}[]>();
enregistrerÉcoute(
  constl?.profil?.suivreContacts({
    f: x => (contacts.value = x),
  }),
);

// Onglets
const onglet = ref('thème');
</script>
