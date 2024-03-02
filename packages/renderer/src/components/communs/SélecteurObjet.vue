<template>
  <v-menu
    location="bottom"
    transition="slide-y-transition"
  >
    <template #activator="{props: propsActivateur}">
      <v-text-field
        v-model="requète"
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
          >
            <slot
              :id="idsObjetsSélectionnés[0]"
              name="carte-objet"
            >
              <slot
                :id="idsObjetsSélectionnés[0]"
                name="jeton-objet"
              >
                <v-icon
                  class="ms-2"
                  icon="mdi-close"
                  size="small"
                  variant="flat"
                  @click="() => désélectionner({id: idsObjetsSélectionnés[0]})"
                />
              </slot>
            </slot>
            
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
          v-show="!onTravaille && !résultatsPermisRecherche?.length"
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
          name="resultat"
          v-bind="{resultat: r}"
          :resultat="r"
          :click="() => sélectionner({id: r.id})"
        ></slot>
      </span>
      <v-divider />
      <slot 
        name="dialogue-nouveau"
        @nouveau="(id: string) => sélectionner({id})"
      >
        <v-list-item
          :title="texteNouveau"
          prepend-icon="mdi-plus"
        >
        </v-list-item>
      </slot>
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
        name="carte-objet"
      >
        <slot
          :id="objet"
          name="jeton-objet"
        >
          <v-icon
            class="ms-2"
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="() => désélectionner({id: objet})"
          />
        </slot>
      </slot>
    </span>
  </v-list>
</template>
<script setup lang="ts" generic="T extends types.résultatRecherche<types.infoRésultat>">
import type { types } from '@constl/ipa';
import {computed, watchEffect, ref} from 'vue';

const props = defineProps<{
  multiples: boolean; 
  interdites?: string[], 
  resultatsRecherche: T[] | undefined,
  onTravaille: boolean
  texteEtiquetteRecherche: string, 
  texteAucunRésultat: string, 
  texteNouveau: string,
}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsObjets: string[]): void;
  (é: 'requete-modifiee', requete: string): void;
}>();

// Sélection
const idsObjetsSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsObjetsSélectionnés.value);
});

// Contrôles recherche
const requète = ref('');

const résultatsPermisRecherche = computed(() => {
  return props.resultatsRecherche?.filter(r => !(props.interdites || []).includes(r.id));
});

const sélectionner = ({id}: {id: string}) => {
  if (props.multiples) {
    idsObjetsSélectionnés.value = [...idsObjetsSélectionnés.value, id];
  } else {
    idsObjetsSélectionnés.value = [id];
  }
  requète.value = '';
};
const désélectionner = ({id}: {id: string}) => {
  idsObjetsSélectionnés.value = idsObjetsSélectionnés.value.filter(mc => mc !== id);
};
</script>
