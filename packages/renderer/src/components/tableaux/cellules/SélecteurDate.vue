<template>
  <v-dialog
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
        <v-select
          v-model="calendrierChoisi"
          label="'Calendrier'"
          :items="calendriers"
        />
        <div class="d-flex">
          <v-menu v-model="menuMois">
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                :text="nomMois"
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
        <div v-if="symbolesSousCycle">
          <v-btn
            v-for="s in symbolesSousCycle"
            :key="s"
            disabled
            icon
            variant="plain"
          >
            {{ s }}
          </v-btn>
        </div>
        <div
          v-for="s in nRangées"
          :key="s"
        >
          <v-btn
            v-for="j in nSousCycle"
            :key="j"
            :disabled="dateRangéeColonne(s, j).m !== 'présent' "
            :variant="rangéeColonneAujourdhui(s, j) ? 'outlined' : (rangéeColonneSélectionnée(s, j) ? 'tonal' : 'plain')"
            icon
            :color="rangéeColonneSélectionnée(s, j) ?'primary': undefined"
            @click="() => jour = dateRangéeColonne(s, j).j"
          >
            {{ dateRangéeColonne(s, j).j }}
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
  </v-dialog>
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
const menuMois = ref(false);

// Sélection
const val = ref<number>();
const modifié = computed(()=> val.value !== props.originale);
watchEffect(()=>val.value = computed(()=>props.originale).value);

// Contrôles
const utiliserDates = () => {
  return { calendrier: ref('Grégorien')};
};
const { calendrier } = utiliserDates();
const calendriers = computed(()=>['Grégorien', 'தமிழ்', 'Mayab\'']);
const calendrierChoisi = ref(calendrier.value);

const maintenant = new Date();
const année = ref(maintenant.getFullYear());

const listeMois = computed(()=>{
  return ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
});
const mois = ref(maintenant.getMonth());
const nomMois = computed(()=>listeMois.value[mois.value]);
const reculerMois = () => mois.value--;
const avancerMois = () => mois.value++;
const sélectionnerMois = (val: number) => {mois.value = val; menuMois.value = false;};

const jour = ref(maintenant.getDate());
const joursParMois = (m: number, a: number) =>  m === 1 ? (a % 4 !== 0 ? 28 : (a % 400 === 0 ? 29 : (a % 100 === 0 ? 28 : 29))) : ([0, 2, 4, 6, 7, 9, 11].includes(m) ? 31 : 30);
const nJoursMois = computed(()=>{
  return joursParMois(mois.value, année.value);
});
const nJoursDansMoisPrécédent = computed(()=>{
  return joursParMois(mois.value + 1 % 12, année.value + mois.value === 11 ? 1 : 0);
});

const nSousCycle = ref(7);
const symbolesSousCycle = computed(()=>['D', 'L', 'Ma', 'Me', 'J', 'V', 'S']);
const premièreDateMois = computed(()=>new Date(année.value, mois.value));
const nJoursDuMoisPrécédent = computed(() => premièreDateMois.value.getDay());

const nJoursDuMoisSuivant = computed(() =>nSousCycle.value - (nJoursDuMoisPrécédent.value + nJoursMois.value) % nSousCycle.value);

const nJoursTotal = computed(()=>nJoursDuMoisPrécédent.value + nJoursMois.value + nJoursDuMoisSuivant.value);
const nRangées = computed(()=>nJoursTotal.value / nSousCycle.value);

const dateRangéeColonne = (rangé: number, colonne: number): {m: 'précédent' | 'présent' | 'suivant', j: number}=>{
  const valConsécutive = (rangé - 1) * nSousCycle.value + colonne;
  const joursDepuisDébutDuMois = valConsécutive - nJoursDuMoisPrécédent.value;
  if (joursDepuisDébutDuMois < 1) return {m: 'précédent', j: nJoursDansMoisPrécédent.value + joursDepuisDébutDuMois};
  else if (joursDepuisDébutDuMois <= nJoursMois.value) return {m: 'présent', j: joursDepuisDébutDuMois};
  else return {'m' : 'suivant', j: joursDepuisDébutDuMois - nJoursMois.value };
};

const rangéeColonneAujourdhui = (rangé: number, colonne: number) => {
  const {m, j} = dateRangéeColonne(rangé, colonne);
  return m === 'présent' && mois.value === maintenant.getMonth() && j === maintenant.getDate();
};
const rangéeColonneSélectionnée = (rangé: number, colonne: number) => {
  const {m, j} = dateRangéeColonne(rangé, colonne);
  return m === 'présent' && j === jour.value;
};


// Sauvegarder
const sauvegarder = () => {
  émettre('modifiee', {val: val.value});
  fermer();
};
const fermer = () => dialogue.value = false;
</script>