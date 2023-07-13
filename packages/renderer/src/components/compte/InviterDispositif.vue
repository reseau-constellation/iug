<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card>
      <v-card-item>
        <v-card-title>
          {{ titreCarte }}
        </v-card-title>
        <v-card-subtitle>
          {{ sousTitreCarte }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window>
          <v-window-item :value="0">
            <v-list>
              <v-list-item
                :title="t('dispositifs.inviter.manuellement')"
                @click="suivreCheminementManuel"
              ></v-list-item>
              <v-list-item
                :title="t('dispositifs.inviter.codeR2')"
                @click="suivreCheminementCodeR2"
              ></v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item :value="1">
            <v-btn
              :text="
                invitationTexte
                  ? t('dispositifs.inviter.générerInvitation')
                  : t('dispositifs.inviter.reGénérerInvitation')
              "
              :loading="générationEnCours"
              @click="() => générerInvitation()"
            />
            {{ invitation?.codeSecret }}
          </v-window-item>
          <v-window-item :value="2">
            <v-btn
              :text="
                invitationTexte
                  ? t('dispositifs.inviter.générerInvitation')
                  : t('dispositifs.inviter.reGénérerInvitation')
              "
              :loading="générationEnCours"
              @click="() => générerInvitation()"
            />
            <qrcode-vue
              :value="invitationTexte"
              :size="300"
              level="H"
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
import type {client} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import QrcodeVue from 'qrcode.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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
</script>
