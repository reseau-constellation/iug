<template>
  <v-menu
    v-model="dialogue"
    :close-on-content-click="false"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-text style="overflow-y:auto">
        <v-select label="'Calendrier'" />
        <div class="d-flex">
          <v-menu>
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                text="'Mois'"
                variant="text"
              />
            </template>
            <v-list>
              <v-list-item
                v-for="m in listeMois.length"
                :key="listeMois[m]"
                @click.stop="() => sélectionnerMois(m)"
              >
                {{ m }}
              </v-list-item>
            </v-list>
          </v-menu>
          <v-spacer />
          <v-btn
            icon="$prev"
            variant="text"
            @click="()=>reculerMois()"
          />
          <v-btn
            icon="$next"
            variant="text"
            @click="()=>avancerMois()"
          />
        </div>
        <div
          v-for="s in 5"
          :key="s"
        >
          <v-btn
            v-for="j in 7"
            :key="j"
            variant="flat"
            icon
          >
            {{ j + (s-1)*7 }}
          </v-btn>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!modifié"
          variant="flat"
          color="primary"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          variant="flat"
          append-icon="mdi-close"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { computed, watchEffect, ref } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{originale?: number}>();
const émettre = defineEmits<{
  (é: 'modifiee', args: {val?: number}): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Sélection
const val = ref<number>();
const modifié = computed(()=> val.value !== props.originale);
watchEffect(()=>val.value = computed(()=>props.originale).value);

// Contrôles
const listeMois = computed(()=>{
  return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
});
const mois = ref(0);
const reculerMois = () => mois.value--;
const avancerMois = () => mois.value++;
const sélectionnerMois = (val: number) => mois.value = val;

// Sauvegarder
const sauvegarder = () => {
  émettre('modifiee', {val: val.value});
  fermer();
};
const fermer = () => dialogue.value = false;
</script>