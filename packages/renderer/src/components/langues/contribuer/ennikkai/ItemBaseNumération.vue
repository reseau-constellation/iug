<template>
  <v-row>
    <v-col
      :cols="5"
      class="py-0"
    >
      <v-text-field
        v-model="symbole"
        variant="outlined"
        density="compact"
        :label="t('ennikkai.nouvelle.étiquetteSymboleBase')"
        :hint="t('ennikkai.nouvelle.indiceSymboleBase')"
        @blur="()=>modifier()"
      >
      </v-text-field>
    </v-col>
    <v-col
      :cols="5"
      class="py-0"
    >
      <v-text-field
        v-model="val"
        variant="outlined"
        density="compact"
        :label="t('ennikkai.nouvelle.étiquetteValeurBase')"
        :hint="t('ennikkai.nouvelle.indiceValeurBase')"
        @blur="()=>modifier()"
      >
      </v-text-field>
    </v-col>
    <v-col
      :cols="2"
      class="py-0"
    >
      <v-btn
        variant="flat"
        size="small"
        icon="mdi-close"
        @click="() => effacer()"
      ></v-btn>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { computed, watchEffect } from 'vue';
import { ref } from 'vue';

const émettre = defineEmits<{
    (é: 'effacer', args: {symbole: string}): void;
    (é: 'modifier', args: {val: number, symbole: string}): void;
}>();
const props = defineProps<{val: number, symbole: string}>();


const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const val = ref<string>(props.val.toString());
const symbole = ref<string>(props.symbole);

watchEffect(()=>{
    val.value = computed(()=>props.val.toString()).value;
});

const modifier = ()=>{
    if (val.value && symbole.value) {
        émettre('modifier', {
            val: parseInt(val.value),
            symbole: symbole.value,
        });
    }
};

const effacer = () => {
    émettre('effacer', {symbole: symbole.value});
};
</script>
