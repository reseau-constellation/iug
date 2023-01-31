import {computed, inject, onMounted, onUnmounted, ref} from 'vue';
import type {Ref} from 'vue';
import type {App} from 'vue';
import {
  கிளிமூக்கு,
  மரத்திலிருந்து_மொழிபெயர்ப்பு_அகராதி,
  மொழிபெயர்ப்பு_அகராதியிலிருந்து_மரம்,
} from './கிளிமூக்கு';
import type {முன்னேற்றம்_தகவல்கள்} from './கிளிமூக்கு';
import type {மரம்_மொழிபெயர்ப்பு_அகராதி_வகை} from './கிளிமூக்கு';
import type {schémaFonctionOublier} from '@constl/ipa/dist/utils';
import {useI18n} from 'vue-i18n';

const utililiserLanguesDisponibles = (): {languesDisponibles: Ref<string[]>} => {
  const kilimukku = inject<கிளிமூக்கு>('கிளிமூக்கு');
  if (!kilimukku) throw new Error('Kilimukku non installé');
  const languesDisponibles = ref<string[]>([]);

  let fOublier: schémaFonctionOublier | undefined;
  onMounted(async () => {
    console.log('onMounted');
    fOublier = await kilimukku.மொழிகளை_கேள்ளு({
      செ: இ => (languesDisponibles.value = இ),
    });
  });
  onUnmounted(async () => {
    console.log('onUnmounted');
    if (fOublier) await fOublier();
  });

  return {languesDisponibles};
};

const utiliserProgrèsLangue = ({
  மொழி,
  வகை = 'வார்த்தை',
}: {
  மொழி: string;
  வகை: 'வார்த்தை' | 'சாபி';
}): {progrèsLangue: Ref<முன்னேற்றம்_தகவல்கள் | undefined>} => {
  const kilimukku = inject<கிளிமூக்கு>('கிளிமூக்கு');
  if (!kilimukku) throw new Error('Kilimukku non installé');
  const progrèsLangue = ref<முன்னேற்றம்_தகவல்கள்>();
  let fOublier: schémaFonctionOublier | undefined;
  onMounted(async () => {
    fOublier = await kilimukku.முன்னேற்றத்தை_கேள்ளு({
      மொழி,
      வகை,
      செ: இ => (progrèsLangue.value = இ),
    });
  });
  onUnmounted(async () => {
    if (fOublier) await fOublier();
  });
  return {progrèsLangue};
};

const useI18n_ = computed(() => {
  const செய்திகள் = inject<Ref<மரம்_மொழிபெயர்ப்பு_அகராதி_வகை>>('செய்திகள்');
  const {locale} = useI18n();

  // Apparament il faut passer locale explicitement ici.
  return useI18n({
    locale: locale.value,
    messages: செய்திகள்?.value || {},
  });
});

export const கிளிமூக்கை_உபயோகி = () => {
  return {
    utililiserLanguesDisponibles,
    utiliserProgrèsLangue,
    useI18n: () => {
      return {...useI18n_.value, $t: useI18n_.value.t};
    },
  };
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
