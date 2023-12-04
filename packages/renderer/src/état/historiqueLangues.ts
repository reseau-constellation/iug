import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const dédoublonnerListe = (liste: string[]) => {
  const déjàVu = new Set();
  return liste.filter(x => {
      return déjàVu.has(x) ? false : déjàVu.add(x);
  });
};

export const utiliserHistoriqueLangues = defineStore('historiqueLangues', () => {
  
  const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();
  const sélectionsInterface = computed(()=>{
    return [மொழி.value, ...மாற்றுமொழிகள்.value];
  });
  const autresSélections = ref<string[]>([]);
  const historique = computed(()=>{
    return dédoublonnerListe([...autresSélections.value, ...sélectionsInterface.value]);
  });

  const sélectionner = (lng: string) => {
    autresSélections.value = dédoublonnerListe([lng, ...autresSélections.value]);
  };
  return {
    sélectionner,
    historique,
    sélectionsInterface,
    autresSélections,
  };
});
