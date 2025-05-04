<template>
  <v-expand-transition>
    <qrcode-stream
      :track="paintBoundingBox"
      @detect="x => lorsqueDétecté(x)"
      @error="e => lorsquErreur(e)"
    />
  </v-expand-transition>

  <v-expand-transition>
    <v-alert
      v-if="erreur"
      :text="t(`communs.lecteurCodeR2.erreurs.${erreur}`)"
      type="error"
      variant="tonal"
      closable
    />
  </v-expand-transition>
</template>
<script setup lang="ts" generic="T extends object">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import Ajv, {type JSONSchemaType} from 'ajv';
import {toByteArray} from 'base64-js';
import {gunzipSync} from 'fflate';
import {onMounted, ref} from 'vue';
import {QrcodeStream} from 'vue-qrcode-reader';
import {isElectronRenderer} from 'wherearewe';
import {demanderAccèsMédia} from '/@/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const ajv = new Ajv();

const props = defineProps<{
  schema?: JSONSchemaType<T>;
}>();

const émettre = defineEmits<{
  (é: 'detecte', args: {valTexte: string; valJSON?: T}): void;
}>();

// Pour Électron sur MacOS
onMounted(async () => {
  if (isElectronRenderer) {
    await demanderAccèsMédia('camera');
  }
});

// Détection
type TypeCodeDétecté = {
  rawValue: string;
  boundingBox: {x: number; y: number; width: number; height: number};
};

function paintBoundingBox(detectedCodes: TypeCodeDétecté[], ctx: CanvasRenderingContext2D | null) {
  if (ctx) {
    for (const detectedCode of detectedCodes) {
      const {
        boundingBox: {x, y, width, height},
      } = detectedCode;

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#007bff';
      ctx.strokeRect(x, y, width, height);
    }
  }
}

const lorsqueDétecté = (info: TypeCodeDétecté[]) => {
  erreur.value = undefined;

  let texteCode = info[0].rawValue; // On utilise le premier code détecté

  // Décomprimer
  texteCode = new TextDecoder().decode(gunzipSync(toByteArray(texteCode)));

  if (props.schema) {
    const validateur = ajv.compile(props.schema);
    try {
      const jsonCode = JSON.parse(texteCode);
      try {
        if (validateur(jsonCode)) {
          émettre('detecte', {valTexte: texteCode, valJSON: jsonCode});
        } else {
          erreur.value = 'valeurCodeInvalide';
        }
      } catch {
        erreur.value = 'valeurCodeInvalide';
      }
    } catch {
      erreur.value = 'valeurCodeInvalide';
    }
  } else {
    émettre('detecte', {valTexte: texteCode});
  }
};

// Erreurs
const erreur = ref<string>();
function lorsquErreur(err: {value: string; name: string; message: string}) {
  switch (err.name) {
    case 'NotAllowedError':
      erreur.value = 'permission';
      break;
    case 'NotFoundError':
      erreur.value = 'pasDeCaméra';
      break;
    case 'NotSupportedError':
    case 'InsecureContextError':
      erreur.value = 'contexteInsécure';
      break;
    case 'NotReadableError':
      erreur.value = 'caméraUtilisée';
      break;
    case 'OverconstrainedError':
      erreur.value = 'erreurCaméra';
      break;
    case 'StreamApiNotSupportedError':
      erreur.value = 'navigNonSupporté';
      break;

    default:
      erreur.value = 'autreErreur';
      break;
  }
}
</script>
