import {defineStore} from 'pinia';
import {computed, ref} from 'vue';

export const utiliserÉtatConditions = defineStore('conditions', () => {
  const acceptées = ref(false);
  const langues = ref<string[]>();
  const empreinte = ref<string>();

  const accepter = () => {
    acceptées.value = true;
  };
  const refuser = () => {
    acceptées.value = false;
  };
  const acceptationÀJour = computed(() => {
    if (!acceptées.value) return undefined;
    return true; // À faire
  });
  return {
    acceptées,
    langues,
    empreinte,
    accepter,
    refuser,
    acceptationÀJour,
  };
});
