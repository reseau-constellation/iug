<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :min-width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ t('communs.métadonnées.titreCarte') }}
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-list>
          <v-list-item v-if="modifiable">
            <v-row>
              <v-col :cols="4">
                <v-text-field
                  v-model="clef"
                  :label="t('communs.métadonnées.indiceClef')"
                  variant="outlined"
                  hide-details
                  density="compact"
                ></v-text-field>
              </v-col>
              <v-col :cols="8">
                <v-text-field
                  v-model="val"
                  :label="t('communs.métadonnées.indiceVal')"
                  variant="outlined"
                  hide-details
                  density="compact"
                  append-icon="mdi-content-save-outline"
                  @click:append="sauvegarder"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-2" />
          </v-list-item>
          <item-metadonnees
            v-for="méta in Object.entries(metadonnees)"
            :id="méta[0]"
            :key="méta[0]"
            :clef="méta[0]"
            :val="méta[1]"
            :modifiable="modifiable"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import ItemMetadonnees from './ItemMétadonnées.vue';
import type {types} from '@constl/ipa';

defineProps<{
  modifiable: boolean
  metadonnees: {[clef: string]: types.élémentsBd};
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const mdAndUp = useDisplay();

// Navigation générale
const dialogue = ref(false);

// Ajout
const clef = ref('');
const val = ref('');
const sauvegarder = () => {
  clef.value = '';
  val.value = '';
};
</script>
