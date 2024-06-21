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
            v-if="!multiples && idsSélectionnés.length"
            class="mx-3"
          >
            <slot
              :id="idsSélectionnés[0]"
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
      <v-fade-transition group>
        <v-list-item
          v-show="!résultatsPermisRecherche?.length"
          :key="'aucun'"
          class="text-h6 text-center text-disabled"
        >
          {{ props.texteAucunRésultat }}
        </v-list-item>
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
      </v-fade-transition>
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
    <v-scroll-x-transition group>
      <span
        v-for="objet in idsSélectionnés"
        :key="objet"
      >
        <slot
          :id="objet"
          name="jeton-objet"
          :deselectionner="désélectionner"
        />
      </span>
    </v-scroll-x-transition>
  </v-list>
</template>
<script setup lang="ts" generic="T extends types.résultatRecherche<types.infoRésultat>">
import type {types} from '@constl/ipa';
import {computed, watchEffect, ref} from 'vue';

const props = defineProps<{
  multiples?: boolean;
  originaux?: string[];
  interdits?: string[];
  resultatsRecherche: T[] | undefined;
  onTravaille: boolean;
  texteEtiquetteRecherche: string;
  texteAucunRésultat: string;
}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsObjets: string[]): void;
  (é: 'requete-modifiee', requête: string): void;
}>();

// Sélection
const idsSélectionnés = ref<string[]>(props.originaux || []);
watchEffect(() => {
  émettre('selectionnee', idsSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
watchEffect(() => {
  émettre('requete-modifiee', requête.value);
});

const résultatsPermisRecherche = computed(() => {
  return props.resultatsRecherche
    ?.filter(r => !idsSélectionnés.value.includes(r.id))
    .filter(r => !props.interdits || !props.interdits.includes(r.id));
});

const sélectionner = ({id}: {id: string}) => {
  if (props.multiples) {
    idsSélectionnés.value = [...idsSélectionnés.value, id];
  } else {
    idsSélectionnés.value = [id];
  }
  requête.value = '';
};
const désélectionner = ({id}: {id: string}) => {
  idsSélectionnés.value = idsSélectionnés.value.filter(mc => mc !== id);
};
</script>
