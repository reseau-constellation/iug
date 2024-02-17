<template>
  <v-list-item @click="() => lire()">
    <v-list-item-title>
      <v-avatar
        v-if="!info.lu"
        class="mx-2"
        color="error"
        size="10"
      />
      {{ titre }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ sousTitre }}
    </v-list-item-subtitle>
    <v-dialog
      v-if="texteAction"
      v-model="dialogue"
    >
      <template #activator="{props: propsActivateur}">
        <v-btn
          v-bind="propsActivateur"
          class="mt-2"
          variant="flat"
          size="small"
          :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        >
          {{ texteAction }}
        </v-btn>
      </template>
      <v-card
        :max-width="mdAndUp ? 700 : 300"
        class="mx-auto"
      >
        <v-card-item>
          <v-card-title class="d-flex">{{ titre }} </v-card-title>
          <v-card-subtitle>
            {{ sousTitre }}
          </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <slot name="contenu" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            append-icon="mdi-close"
            @click="() => (dialogue = false)"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template #append>
      <v-icon
        icon="mdi-close"
        @click.stop="() => fermer()"
      />
    </template>
  </v-list-item>
</template>
  <script setup lang="ts">
  import type {InfoAvecId, Info} from '/@/état/infos';
  
  import {ref} from 'vue';
  import {useDisplay, useRtl} from 'vuetify';
  
  import {utiliserÉtatInfos} from '/@/état/infos';
  
  const props = defineProps<{
    info: InfoAvecId<Info>;
    titre: string;
    sousTitre: string;
    texteAction: string;
  }>();
  
  const {isRtl} = useRtl();
  const {mdAndUp} = useDisplay();
  const étatInfos = utiliserÉtatInfos();
  
  const dialogue = ref(false);
  
  const lire = () => {
    étatInfos.lireInfo(props.info.id);
  };
  
  const fermer = () => {
    étatInfos.effacerInfo(props.info.id);
  };
  </script>
  