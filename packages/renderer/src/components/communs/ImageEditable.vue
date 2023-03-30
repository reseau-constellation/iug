<template>
  <v-row class="text-center">
    <input
      ref="HTMLChoixFichier"
      type="file"
      style="display: none"
      accept="image/*"
      @change="imageChangee"
    />
    <v-snackbar
      v-model="imageTropGrande"
      timeout="5000"
      color="error"
      outlined
    >
      {{ t('imageÉditable.imageTropGrande', {tailleMaxKO: maxTailleImage / 1000}) }}
    </v-snackbar>
    <v-col cols="12">
      <v-hover :disabled="!editable">
        <template #default="{isHovering, props: propsHover}">
          <v-avatar
            v-bind="propsHover"
            class="mb-3"
            :size="tailleAvatar"
            :elevation="isHovering ? 12 : 2"
          >
            <v-img
              :src="srcImage || imgDefaut"
              contain
            >
              <v-row
                :class="{
                  'ma-0': true,
                  'on-hover': isHovering,
                  'align-self-center': true,
                  'fill-height': true,
                  'flex-column': true,
                  fond: true,
                }"
                style="background-color: black"
              >
                <div
                  class="align-self-center"
                  style="height: 100%"
                >
                  <v-row class="flex-column fill-height ma-0">
                    <div class="my-auto">
                      <v-btn
                        :class="{'show-btns': isHovering, 'mx-2': true}"
                        color="rgba(255, 255, 255, 0)"
                        class="align-self-center"
                        icon
                        large
                        @click="() => ouvrirFenêtreChoisirImage()"
                      >
                        <v-icon
                          :class="{'show-btns': isHovering}"
                          color="rgba(255, 255, 255, 0)"
                          large
                        >
                          mdi-camera-outline
                        </v-icon>
                      </v-btn>
                      <v-btn
                        v-if="srcImage"
                        :class="{'show-btns': isHovering, 'mx-2': true}"
                        color="rgba(255, 255, 255, 0)"
                        class="align-self-center"
                        icon
                        large
                        @click="() => effacerImage()"
                      >
                        <v-icon
                          :class="{'show-btns': isHovering}"
                          color="rgba(255, 255, 255, 0)"
                          large
                        >
                          mdi-close
                        </v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                </div>
              </v-row>
            </v-img>
          </v-avatar>
        </template>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue';
import convert from 'image-file-resize';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  srcImage?: string;
  imgDefaut?: string;
  maxTailleImage: number;
  tailleAvatar: number;
  editable: boolean;
}>();
const émettre = defineEmits<{
  (é: 'imageChangee', image?: ArrayBuffer): void;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Actions fichier
const HTMLChoixFichier = ref<HTMLInputElement>();
const ouvrirFenêtreChoisirImage = () => {
  HTMLChoixFichier.value?.click();
};

const fichier = ref<File>();
const fichierRecoupé = ref<File>();
const image = ref<ArrayBuffer>();

const imageTropGrande = computed(() => {
  if (fichierRecoupé.value) {
    return fichierRecoupé.value.size > props.maxTailleImage;
  } else {
    return false;
  }
});

const effacerImage = () => {
  émettre('imageChangee', undefined);
};

const imageChangee = async (): Promise<void> => {
  if (!HTMLChoixFichier.value?.files?.length) return;
  fichier.value = HTMLChoixFichier.value.files[0];
};

const calculerTailleImage = (
  fichier_: File,
): Promise<{
  hauteur: number;
  largeur: number;
}> => {
  return new Promise(résoudre => {
    // https://stackoverflow.com/questions/7460272/getting-image-dimensions-using-javascript-file-api
    const dataURL = URL.createObjectURL(fichier_);
    const img = new Image();
    img.onload = () => {
      résoudre({
        hauteur: img.height,
        largeur: img.width,
      });
    };
    img.src = dataURL;
  });
};
watchEffect(async () => {
  if (fichier.value) {
    if (fichier.value.size > props.maxTailleImage) {
      const {hauteur, largeur} = await calculerTailleImage(fichier.value);
      const ratio = (hauteur * largeur * 16) / (8 * 1024) / props.maxTailleImage;
      try {
        fichierRecoupé.value = convert({
          file: fichier.value,
          height: ratio * hauteur,
          width: ratio * largeur,
        });
      } catch {
        fichierRecoupé.value = fichier.value;
        return;
      }
    } else {
      fichierRecoupé.value = fichier.value;
    }
  }
});
watchEffect(async () => {
  image.value = await fichierRecoupé.value?.arrayBuffer();
});
watchEffect(async () => {
  if (image.value) {
    if (!imageTropGrande.value) {
      émettre('imageChangee', image.value);
    }
  }
});
</script>

<style scoped>
.fond {
  transition: opacity 0.4s ease-in-out;
}

.fond:not(.on-hover) {
  opacity: 0;
}

.fond.on-hover {
  opacity: 0.5;
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
</style>
