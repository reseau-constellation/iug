<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ titreCarte }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
        <v-card-subtitle>
          {{ sousTitreCarte }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
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
              :model-value="invitation?.codeSecret"
              :length="8"
              type="text"
              disabled
            />
            <v-btn
              v-if="!invitationTexte"
              class="mt-2"
              :text="t('dispositifs.inviter.générerInvitation')"
              :loading="générationEnCours"
              variant="outlined"
              append-icon="mdi-reload"
              @click="() => générerInvitation()"
            />
            <v-btn
              v-else
              class="mt-2"
              :text="t('dispositifs.inviter.annulerInvitation')"
              variant="outlined"
              append-icon="mdi-cancel"
              @click="() => révoquerInvitation()"
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
              <qrcode-vue
                :value="invitationTexte"
                :size="200"
                level="H"
              />
              <div
                :class="{
                  fond: !invitationTexte,
                }"
                style="position: fixed; height: 200px; width: 200px"
              />
            </div>
            <v-btn
              v-if="!invitationTexte"
              class="mt-2"
              :text="t('dispositifs.inviter.générerInvitation')"
              :loading="générationEnCours"
              variant="outlined"
              append-icon="mdi-reload"
              @click="() => générerInvitation()"
            />
            <v-btn
              v-else
              class="mt-2"
              :text="t('dispositifs.inviter.annulerInvitation')"
              variant="outlined"
              append-icon="mdi-cancel"
              @click="() => révoquerInvitation()"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-show="retourActif.visible"
          variant="text"
          :disabled="!retourActif.actif"
          @click="retour"
        >
          {{ t('communs.retour') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-show="suivantActif.visible"
          color="primary"
          variant="flat"
          :disabled="!suivantActif.actif"
          @click="suivant"
        >
          {{ t('communs.suivant') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import QrcodeVue from 'qrcode.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay, useRtl} from 'vuetify/lib/framework.mjs';
import {watchEffect} from 'vue';

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['cheminement', 'manuelle', 'codeR2'] as const;
const cheminement = ref<'manuelle' | 'codeR2'>();

const suivreCheminementManuel = () => {
  cheminement.value = 'manuelle';
  étape.value = listeÉtapes.indexOf('manuelle');
};
const suivreCheminementCodeR2 = () => {
  cheminement.value = 'codeR2';
  étape.value = listeÉtapes.indexOf('codeR2');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('dispositifs.inviter.titreCheminement');
    case 'manuelle':
      return t('dispositifs.inviter.titreManuelle');
    case 'codeR2':
      return t('dispositifs.inviter.titreCodeR2');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('dispositifs.inviter.sousTitreCheminement');
    case 'manuelle':
      return t('dispositifs.inviter.sousTitreManuelle');
    case 'codeR2':
      return t('dispositifs.inviter.sousTitreCodeR2');
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
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

// Génération invitation
const générationEnCours = ref(false);
const invitation = ref<{
  idCompte: string;
  codeSecret: string;
}>();
const générerInvitation = async () => {
  générationEnCours.value = true;
  invitation.value = await constl?.générerInvitationRejoindreCompte();
  générationEnCours.value = false;
};
const invitationTexte = computed(() => {
  if (invitation.value) return JSON.stringify(invitation.value);
  else return undefined;
});

// Annulation
const révoquerInvitation = async () => {
  invitation.value = undefined;
  // await constl.révoquerInvitation()
};
// Pour la sécurité, automatiquement révoquer l'invitation si l'on ferme le dialogue
watchEffect(async () => {
  if (!dialogue.value) {
    await révoquerInvitation();
  }
});
</script>

<style scoped>
.fond {
  background-color: rgba(255, 255, 255, 0.95);
}
</style>
