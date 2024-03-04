<template>
  <v-menu
    location="bottom"
    transition="slide-y-transition"
  >
    <template #activator="{props: propsActivateur}">
      <v-text-field
        v-model="requête"
        v-bind="propsActivateur"
        class="pt-2"
        :label="props.texteEtiquetteRecherche"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      >
        <template #prepend-inner>
          <span
            v-if="!multiples && idsObjetsSélectionnés.length"
            class="mx-3"
          >
            <slot
              :id="idsObjetsSélectionnés[0]"
              name="jeton-objet"
              :deselectionner="désélectionner"
            ></slot>
          </span>
        </template>
      </v-text-field>
    </template>
    <v-list>
      <v-progress-linear
        v-show="onTravaille"
        class="mb-3"
        height="1"
        color="primary"
        indeterminate
        absolute
      />
      <v-expand-transition>
        <v-list-item
          v-show="!résultatsPermisRecherche?.length"
          class="text-h6 text-center text-disabled"
        >
          {{ props.texteAucunRésultat }}
        </v-list-item>
      </v-expand-transition>
      <span
        v-for="r in résultatsPermisRecherche"
        :key="r.id"
      >
        <slot
          name="résultat"
          :résultat="r"
          :click="() => sélectionner({id: r.id})"
        ></slot>
      </span>
      <v-divider />
      <slot 
        name="nouveau"
        :nouveau="(id: string) => sélectionner({id})"
      />
    </v-list>
  </v-menu>
  <v-list
    v-if="multiples"
    class="mt-4"
  >
    <span
      v-for="objet in idsObjetsSélectionnés"
      :key="objet"
    >
      <slot
        :id="objet"
        name="jeton-objet"
        :deselectionner="désélectionner"
      />
    </span>
  </v-list>
</template>
<script setup lang="ts" generic="T extends types.résultatRecherche<types.infoRésultat>">
import type { types } from '@constl/ipa';
import {computed, watchEffect, ref} from 'vue';

const props = defineProps<{
  multiples?: boolean; 
  interdites?: string[], 
  resultatsRecherche: T[] | undefined,
  onTravaille: boolean
  texteEtiquetteRecherche: string, 
  texteAucunRésultat: string, 
}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsObjets: string[]): void;
  (é: 'requête-modifiee', requête: string): void;
}>();

// Sélection
const idsObjetsSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsObjetsSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
watchEffect(()=>{
  émettre('requête-modifiee', requête.value);
});

const résultatsPermisRecherche = computed(() => {
  return props.resultatsRecherche?.filter(r => !(props.interdites || []).includes(r.id));
});

const sélectionner = ({id}: {id: string}) => {
  if (props.multiples) {
    idsObjetsSélectionnés.value = [...idsObjetsSélectionnés.value, id];
  } else {
    idsObjetsSélectionnés.value = [id];
  }
  requête.value = '';
};
const désélectionner = ({id}: {id: string}) => {
  idsObjetsSélectionnés.value = idsObjetsSélectionnés.value.filter(mc => mc !== id);
};
</script>
