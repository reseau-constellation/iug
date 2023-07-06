<template>
  <span>
    <span v-if="texteProcessé.coupéAvant">{{ t('communs.troisPetitsPoints') }}</span>
    <span>{{ texteProcessé.texteAvant }}</span>
    <span class="highlight-yellow">{{ texteProcessé.texteSurligné }}</span>
    <span>{{ texteProcessé.texteAprès }}</span>
    <span v-if="texteProcessé.coupéAprès">{{ t('communs.troisPetitsPoints') }}</span>
  </span>
</template>

<script setup lang="ts">
import type {utils} from '@constl/ipa';
import {computed} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{info: utils.infoRésultatTexte; maxTaille?: number}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const TAILLE_MIN_TEXTE_AVANT = 4;

const texteProcessé = computed(
  (): {
    texteAvant: string;
    texteSurligné: string;
    texteAprès: string;
    coupéAvant: boolean;
    coupéAprès: boolean;
  } => {
    const {texte, début, fin} = props.info;
    const texteDIntérêt = texte.slice(début, fin);
    const préTexte = texte.slice(0, props.info.début);
    const postTexte = texte.slice(fin);
    if (props.maxTaille) {
      const différenceTaille = props.maxTaille - texte.length;
      if (différenceTaille >= 0) {
        return {
          texteAvant: préTexte,
          texteSurligné: texteDIntérêt,
          texteAprès: postTexte,
          coupéAvant: false,
          coupéAprès: false,
        };
      } else {
        const tailleTexteSurligné = Math.min(
          texteDIntérêt.length,
          props.maxTaille - Math.min(TAILLE_MIN_TEXTE_AVANT, préTexte.length),
        );

        const tailleMaxTexteAvant = Math.max(
          TAILLE_MIN_TEXTE_AVANT,
          props.maxTaille - tailleTexteSurligné,
        );
        const tailleMaxTexteAprès = Math.max(
          0,
          props.maxTaille - Math.min(tailleMaxTexteAvant, préTexte.length) - tailleTexteSurligné,
        );

        const coupéAprès =
          texteDIntérêt.length > tailleTexteSurligné || postTexte.length > tailleMaxTexteAprès;

        return {
          texteAvant: préTexte.slice(
            Math.max(0, préTexte.length - tailleMaxTexteAvant),
            préTexte.length,
          ),
          texteSurligné: texteDIntérêt.slice(0, tailleTexteSurligné),
          texteAprès: postTexte.slice(0, tailleMaxTexteAprès),
          coupéAvant: préTexte.length > tailleMaxTexteAvant,
          coupéAprès,
        };
      }
    } else {
      return {
        texteAvant: préTexte,
        texteSurligné: texteDIntérêt,
        texteAprès: postTexte,
        coupéAvant: false,
        coupéAprès: false,
      };
    }
  },
);
</script>

<style>
.highlight-yellow {
  border-radius: 1em 0 1em 0;
  background-image: linear-gradient(
    -100deg,
    rgba(255, 224, 0, 0.2),
    rgba(255, 224, 0, 0.7) 95%,
    rgba(255, 224, 0, 0.1)
  );
}
</style>
