<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
        <v-card-subtitle>
          {{ t(sousTitreCarte) }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-if="enLigne"
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <v-list>
              <v-list-item
                :title="t('dispositifs.inviter.manuellement')"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                prepend-icon="mdi-pencil"
                @click="() => suivreCheminementManuel()"
              ></v-list-item>
              <v-list-item
                :title="t('dispositifs.inviter.codeR2')"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                prepend-icon="mdi-qrcode"
                @click="() => suivreCheminementCodeR2()"
              ></v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item
            :value="1"
            class="text-center"
          >
            <v-otp-input
              :model-value="codeSecret || ''"
              :length="codeSecret?.length || 6"
              type="text"
              disabled
            />
          </v-window-item>
          <v-window-item
            :value="2"
            class="text-center"
          >
            <div
              class="mx-auto mb-2"
              style="display: flex; align-items: center; justify-content: center"
            >
              <code-r2
                :valeur="invitationTexte"
                :props-code="{
                  size: 200,
                }"
              />
              <div
                :class="{
                  fond: !invitationTexte,
                }"
                style="position: fixed; height: 200px; width: 200px"
              />
            </div>
          </v-window-item>
        </v-window>
        <div
          v-else
          class="text-center text-disabled text-h6"
        >
          {{ t('dispositifs.inviter.horsLigne') }}
        </div>
      </v-card-text>
      <v-card-actions>
        <btn-retour
          :visible="retourActif.visible"
          :actif="retourActif.actif"
          @retour="retour"
        />
        <v-spacer></v-spacer>
        <btn-suivant
          :visible="suivantActif.visible"
          :actif="suivantActif.actif"
          @suivant="suivant"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {useOnline} from '@vueuse/core';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay, useRtl} from 'vuetify';

import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import CodeR2 from '/@/components/communs/CodeR2.vue';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();
const enLigne = useOnline();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['cheminement', 'manuelle', 'codeR2'] as const;
const cheminement = ref<'manuelle' | 'codeR2'>();

const suivreCheminementManuel = () => {
  if (!invitation.value) générerInvitation();
  cheminement.value = 'manuelle';
  étape.value = listeÉtapes.indexOf('manuelle');
};
const suivreCheminementCodeR2 = () => {
  if (!invitation.value) générerInvitation();
  cheminement.value = 'codeR2';
  étape.value = listeÉtapes.indexOf('codeR2');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'dispositifs.inviter.titreCheminement';
    case 'manuelle':
      return 'dispositifs.inviter.titreManuelle';
    case 'codeR2':
      return 'dispositifs.inviter.titreCodeR2';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'dispositifs.inviter.sousTitreCheminement';
    case 'manuelle':
      return 'dispositifs.inviter.sousTitreManuelle';
    case 'codeR2':
      return 'dispositifs.inviter.sousTitreCodeR2';
    default:
      return '';
  }
});

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'manuelle':
    case 'codeR2':
      étape.value = listeÉtapes.indexOf('cheminement');
      break;
    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
    case 'manuelle':
    case 'codeR2':
      return {actif: false, visible: false};
    default:
      return {actif: enLigne.value, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return {actif: false, visible: false};
    default:
      return {actif: enLigne.value, visible: true};
  }
});

// Génération invitation
const mesAdresses = suivre(constl.réseau.suivreMesAdresses);
const générationEnCours = ref(false);
const invitation = ref<{
  idCompte: string;
  codeSecret: string;
  adresses?: string[];
}>();
const générerInvitation = async () => {
  générationEnCours.value = true;
  invitation.value = await constl.générerInvitationRejoindreCompte();
  invitation.value.adresses = mesAdresses.value;
  générationEnCours.value = false;
};
const invitationTexte = computed(() => {
  if (invitation.value) return JSON.stringify(invitation.value);
  else return undefined;
});
const codeSecret = computed(() => {
  if (invitation.value) return invitation.value.codeSecret.split(':')[1];
  else return undefined;
});

// Annulation
const révoquerInvitation = async () => {
  await constl.révoquerInvitationRejoindreCompte({});
  invitation.value = undefined;
};

// Pour la sécurité, automatiquement révoquer l'invitation si l'on ferme le dialogue
watchEffect(async () => {
  if (!dialogue.value) {
    await révoquerInvitation();
    étape.value = 0;
  }
});
</script>

<style scoped>
.fond {
  background-color: rgba(255, 255, 255, 0.95);
}
</style>
