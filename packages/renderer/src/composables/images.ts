import {computed, ref, watchEffect} from 'vue';
import type {Ref} from 'vue';
import {utiliserÉtatThème} from '/@/état/thème';
import {storeToRefs} from 'pinia';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const imagesThème: {[key: string]: {[key: string]: Promise<typeof import('*.svg')>}} = {
  constr: {
    unDraw: import('/@/assets/undraw/undraw_under_construction_46pa.svg'),
    வவவ: import('/@/assets/வவவ/குயவர்.svg'),
  },
  docs: {
    unDraw: import('/@/assets/undraw/undraw_book_lover_mkck.svg'),
    வவவ: import('/@/assets/வவவ/சோதிடம்.svg'),
  },
  recherche: {
    unDraw: import('/@/assets/undraw/undraw_not_found_60pq.svg'),
    வவவ: import('/@/assets/வவவ/மீனவர்கள்.svg'),
  },
  message: {
    வவவ: import('/@/assets/வவவ/செய்தி_வள்ளுவன்.svg'),
  },
  profilFemme: {
    unDraw: import('/@/assets/undraw/undraw_female_avatar_w3jk.svg'),
    வவவ: import('/@/assets/வவவ/தஞ்சாவூர்_பொம்மை_பெண்.svg'),
  },
  profilHomme: {
    unDraw: import('/@/assets/undraw/undraw_male_avatar_323b.svg'),
    வவவ: import('/@/assets/வவவ/தஞ்சாவூர்_பொம்மை_ஆண்.svg'),
  },
  automatisation: {
    unDraw: import('/@/assets/undraw/undraw_real-time_sync_o57k.svg'),
    // வவவ: "/@/assets/வவவ/பொங்கல்_வண்டி.svg",
  },
  problème: {
    unDraw: import('/@/assets/undraw/undraw_towing_6yy4.svg'),
    வவவ: import('/@/assets/வவவ/ஜல்லிக்கட்டு.svg'),
  },
  favoris: {
    unDraw: import('/@/assets/undraw/undraw_Appreciation_re_p6rl.svg'),
    வவவ: import('/@/assets/வவவ/அஞ்சறைப்பெட்டி.svg'),
  },
  conditions: {
    unDraw: import('/@/assets/undraw/undraw_Terms_re_6ak4.svg'),
    வவவ: import('/@/assets/வவவ/கபடி_ஆட்டம்.svg'),
  },
  logoBD: {
    unDraw: import('/@/assets/undraw/undraw_Projections_re_1mrh.svg'),
  },
  dispositif: {
    unDraw: import('/@/assets/undraw/undraw_Mobile_re_q4nk.svg'),
  },
  vide: {
    unDraw: import('/@/assets/undraw/undraw_adventure_map_hnin.svg'),
    வவவ: import('/@/assets/வவவ/கிணறு.svg'),
  },
};

export const utiliserImagesDéco = function (thème?: string): {
  obtImageDéco: (clef: string) => Ref<string | undefined>;
} {
  const obtImageDéco = (clef: string): Ref<string | undefined> => {
    const étatThème = utiliserÉtatThème();
    const {thèmeImages} = storeToRefs(étatThème);
    const imageDéco = ref<string>();
    const thèmeFinal = computed(() => thème || thèmeImages.value);

    watchEffect(() => {
      if (clef === 'profil') {
        const options = ['profilFemme', 'profilHomme'];
        // Dans le doute, on garde ça équitable :)
        clef = options[Math.floor(Math.random() * options.length)];
      }
      if (imagesThème[clef]) {
        (imagesThème[clef][thèmeFinal.value] || Object.values(imagesThème[clef])[0]).then(
          svg => (imageDéco.value = svg?.default),
        );
      }
    });
    return imageDéco;
  };

  return {
    obtImageDéco,
  };
};
