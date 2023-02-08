import {computed, inject, onMounted, onUnmounted, ref, watch, watchEffect} from 'vue';
import type {Ref} from 'vue';
import type {App} from 'vue';
import {
  கிளிமூக்கு,
  மரத்திலிருந்து_மொழிபெயர்ப்பு_அகராதி,
  மொழிபெயர்ப்பு_அகராதியிலிருந்து_மரம்,
} from './கிளிமூக்கு';
import type {முன்னேற்றம்_தகவல்கள்} from './கிளிமூக்கு';
import type {மரம்_மொழிபெயர்ப்பு_அகராதி_வகை} from './கிளிமூக்கு';
import type {schémaFonctionOublier} from '@constl/ipa/dist/src/utils';
import {useI18n} from 'vue-i18n';
import {utiliserLangues} from '../localisation/localisation';
import type {Nuchabäl} from 'nuchabal';

const useI18n_ = computed(() => {
  const செய்திகள் = inject<Ref<மரம்_மொழிபெயர்ப்பு_அகராதி_வகை>>('செய்திகள்');
  const {langue, languesAlternatives} = utiliserLangues();

  // Apparament il faut passer locale explicitement ici.
  const i18n = useI18n({
    messages: செய்திகள்?.value || {},
  });
  const {codesLanguesDisponibles: localesKilimukku} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
  watchEffect(() => {
    i18n.locale.value = langue.value;
  });

  // Pour une drôle de raison, assigner un objet ou une liste à i18n.fallbackLocale mène à une récursion infinie si on le fait dans watchEffect().
  const toutesLanguesAlternatives = computed(() => {
    return [
      ...languesAlternatives.value,
      ...localesKilimukku.value.filter(
        l => l !== langue.value && !languesAlternatives.value.includes(l),
      ),
    ];
  });
  watch([toutesLanguesAlternatives], () => {
    i18n.fallbackLocale.value = toutesLanguesAlternatives.value;
  });
  i18n.fallbackLocale.value = toutesLanguesAlternatives.value;

  return i18n;
});

const கிடைக்கும்_மொழிகளை_பயன்படுத்து = () => {
  const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');
  const nuchabäl = inject<{"nuch'ab'äl": Nuchabäl}>('locales')?.["nuch'ab'äl"];
  if (!கிளி) throw new Error('கிளிமூக்கு கிடைத்ததில்லை.');
  if (!nuchabäl) throw new Error("Nuch'ab'äl கிடைத்ததில்லை.");
  const கிடைக்கும்_மொழிகள் = ref<string[]>([]);

  let செ_மறந்துவிடு: schémaFonctionOublier | undefined;
  onMounted(async () => {
    செ_மறந்துவிடு = await கிளி.மொழிகளை_கேள்ளு({
      செ: இ => (கிடைக்கும்_மொழிகள்.value = இ),
    });
  });
  onUnmounted(async () => {
    if (செ_மறந்துவிடு) await செ_மறந்துவிடு();
  });

  // Codes langues disponibles
  const fsOublier: (schémaFonctionOublier | (() => void))[] = [];

  const kilimukku = inject<கிளிமூக்கு>('கிளிமூக்கு');

  const codesLanguesKilimukku = ref<string[]>([]);
  if (kilimukku) {
    kilimukku
      .மொழிகளை_கேள்ளு({
        செ: மொழிகள் => (codesLanguesKilimukku.value = மொழிகள்),
        பரிந்துரைகளும்: true,
      })
      .then(f => fsOublier.push(f));
  }

  const codesLanguesNuchabäl = ref<string[]>([]);

  const fOublierCodesLanguesNuchabäl = nuchabäl.tatzeqelbejKonojelChabäl({
    sm: (codes: string[]) => (codesLanguesNuchabäl.value = codes),
  });
  fsOublier.push(fOublierCodesLanguesNuchabäl);

  onUnmounted(async () => {
    await Promise.all(fsOublier.map(f => f()));
  });

  const codesLanguesDisponibles = computed(() => {
    return [...new Set([...codesLanguesNuchabäl.value, ...codesLanguesKilimukku.value])];
  });

  const languesEtCodes = computed<{lng?: string; code: string}[]>(() => {
    // On a pas besoin de lier les noms de langues de manière réactive parce que tatzeqelbejKonojelChabäl détectera
    // tout changement aux noms de langues, pas juste à leurs codes.
    return codesLanguesDisponibles.value
      .map(code => {
        return {
          code,
          lng: nuchabäl.rubiChabäl({runuk: code}),
        };
      })
      .filter(x => x.lng) as {lng: string; code: string}[];
  });

  const nomLangue = (code: string) => {
    return computed(() => {
      return languesEtCodes.value.find(x => x.code === code)?.lng;
    });
  };

  return {
    codesLanguesDisponibles,
    languesEtCodes,
    nomLangue,
    கிடைக்கும்_மொழிகள்,
  };
};

const மொழி_முன்னேற்றத்தை_பயன்படுத்து = ({
  மொழி,
  வகை = 'வார்த்தை',
}: {
  மொழி: string;
  வகை: 'வார்த்தை' | 'சாபி';
}): {மொழி_முன்னேற்றம்: Ref<முன்னேற்றம்_தகவல்கள் | undefined>} => {
  const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');
  if (!கிளி) throw new Error('கிளிமூக்கு கிடைத்ததில்லை.');

  const மொழி_முன்னேற்றம் = ref<முன்னேற்றம்_தகவல்கள்>();

  let செ_மறந்துவிடு: schémaFonctionOublier | undefined;
  onMounted(async () => {
    செ_மறந்துவிடு = await கிளி.முன்னேற்றத்தை_கேள்ளு({
      மொழி,
      வகை,
      செ: இ => (மொழி_முன்னேற்றம்.value = இ),
    });
  });
  onUnmounted(async () => {
    if (செ_மறந்துவிடு) await செ_மறந்துவிடு();
  });
  return {மொழி_முன்னேற்றம்};
};

const சாபிகளை_பயன்படுத்து = () => {
  const கிளி = inject<கிளிமூக்கு>('கிளிமூக்கு');
  if (!கிளி) throw new Error('கிளிமூக்கு கிடைத்ததில்லை.');

  const சாபிகள் = ref<string[]>();

  let செ_மறந்துவிடு: schémaFonctionOublier | undefined;
  onMounted(async () => {
    செ_மறந்துவிடு = await கிளி.சாபிகளை_கேள்ளு({
      செ: இ => (சாபிகள்.value = இ),
    });
  });
  onUnmounted(async () => {
    if (செ_மறந்துவிடு) await செ_மறந்துவிடு();
  });

  return { சாபிகள் };
};

export const கிளிமூக்கு_உருவாக்கு = ({
  மூல்_மொழி,
  மூல்_மொழிபெயர்ப்புகள்,
}: {
  மூல்_மொழி: string;
  மூல்_மொழிபெயர்ப்புகள்: மரம்_மொழிபெயர்ப்பு_அகராதி_வகை;
}) => {
  return {
    install: (செயலி: App) => {
      const விண்மீன் = செயலி.config.globalProperties.$constl;

      if (!விண்மீன்) throw Error('விண்மீன் கிடைக்கதில்லை.');
      const கிளி = new கிளிமூக்கு({
        விண்மீன்,
        மூல்_மொழிபெயர்ப்புகள்: மரத்திலிருந்து_மொழிபெயர்ப்பு_அகராதி(மூல்_மொழிபெயர்ப்புகள்),
        மூல்_மொழி,
      });

      const செய்திகள் = ref<மரம்_மொழிபெயர்ப்பு_அகராதி_வகை>({});
      கிளி.மொழிபெயர்ப்புகளை_கேள்ளு({
        செ: மொழிபெயர்ப்புகள் => {
          செய்திகள்.value = மொழிபெயர்ப்பு_அகராதியிலிருந்து_மரம்(மொழிபெயர்ப்புகள்);
        },
      });

      செயலி.config.globalProperties.$கிளிமூக்கு = கிளி;
      செயலி.provide('செய்திகள்', செய்திகள்);
      செயலி.provide('கிளிமூக்கு', கிளி);
    },
  };
};

export const கிளிமூக்கை_உபயோகி = () => {
  return {
    கிடைக்கும்_மொழிகளை_பயன்படுத்து,
    மொழி_முன்னேற்றத்தை_பயன்படுத்து,
    சாபிகளை_பயன்படுத்து,
    useI18n: () => {
      return {...useI18n_.value, $t: useI18n_.value.t};
    },
  };
};
