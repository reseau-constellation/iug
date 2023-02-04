import type {bds} from '@constl/ipa';
import {தேதி_மாறி_அடையாளம், தேதி_நெடுவரிசை_அடையாளம்} from '@lassi-js/kili';

export const மொழிபெயர்ப்பு_அட்டவணை_சாபி = 'மொழிபெயர்ப்புகள்';

export const சாபி_நெடுவரிசை_அடையாளம் = 'சாபி';
export const மூல்_மொழி_நெடுவரிசை_அடையாளம் = 'மூல்_மொழி';
export const இலக்கு_மொழி_நெடுவரிசை_அடையாளம் = 'இலக்கு_மொழி';
export const மூல்_உரை_நெடுவரிசை_அடையாளம் = 'மூல்_உரை';
export const மொழிபெயர்ப்பு_நெடுவரிசை_அடையாளம் = 'மொழிபெயர்ப்பு';

/** À changer - temporaire ! */
export const மொழிபெயர்ப்பு_தரவுத்தள_அடையாளம் =
  '/orbitdb/zdpuAt9PVUHGEyrL43tWDmpBUrgoPPWZHX7AGXWk4ZhEZ1oik/841abe65-93f5-4539-b721-2f8085a18cc5';
export const குழு_அடையாளம் =
  '/orbitdb/zdpuAt9PVUHGEyrL43tWDmpBUrgoPPWZHX7AGXWk4ZhEZ1oik/841abe65-93f5-4539-b721-2f8085a18cc5';
/** À changer - temporaire ! */

export const சாபி_மாறி_அடையாளம் =
  '/orbitdb/zdpuAt9PVUHGEyrL43tWDmpBUrgoPPWZHX7AGXWk4ZhEZ1oik/841abe65-93f5-4539-b721-2f8085a18cc5';
export const மூல்_மொழி_மாறி_அடையாளம் =
  '/orbitdb/zdpuB1TEfuUWUQ2dPf8PHQFCg5n3zzx2xRhmimdF7tv6SSu9s/c15da84d-15bf-44da-9827-74d2857ff339';
export const இலக்கு_மொழி_மாறி_அடையாளம் =
  '/orbitdb/zdpuAtmGaeNicerk2ByPa4oQMtSPgdNovQp6ZC6c2fJqF64Sb/6462ccb9-25ca-44e5-b81a-ea6d5df09709';
export const மூல்_உரை_மாறி_அடையாளம் =
  '/orbitdb/zdpuAyBg5f4Lxabv7YHVrxpNbBQW6dzxwH6wfQVMKZjECnkry/f536d48e-e040-48bf-9efb-539321804f4f';
export const மொழிபெயர்ப்பு_மாறி_அடையாளம் =
  '/orbitdb/zdpuAnEhqhCW51yfohfHWzjLgDPyuY2ySVmTBW7upAidVbwnX/954f02c8-e2ea-433b-89e2-6e670fd8873b';

export const மொழியாக்கம்_சிறப்பு_சொல்_அடையாளம் =
  '/orbitdb/zdpuAoNDXakfzK2DxJAozuR2V9TYha5bvzjQHN5VnAm4jvL6S/736889ad-a29b-4e6f-94fa-a78f8e92978d';
export const கிளிமூக்கு_சிறப்பு_சொல்_அடையாளம் =
  '/orbitdb/zdpuAsViPqnpRhUwN6kL7cSyLFaxSEkK233cJAChJMtc2vwLT/fe6ab45c-dd39-4ca9-a695-f151d922704f';

export const கிளிமூக்கு_தரவுத்தளம்_வார்ப்புரு: bds.schémaSpécificationBd = {
  motsClefs: [மொழியாக்கம்_சிறப்பு_சொல்_அடையாளம், கிளிமூக்கு_சிறப்பு_சொல்_அடையாளம்],
  licence: 'ODbl-1_0',
  tableaux: [
    {
      clef: மொழிபெயர்ப்பு_அட்டவணை_சாபி,
      cols: [
        {
          idVariable: சாபி_மாறி_அடையாளம்,
          idColonne: சாபி_நெடுவரிசை_அடையாளம்,
        },
        {
          idVariable: மூல்_உரை_மாறி_அடையாளம்,
          idColonne: மூல்_மொழி_நெடுவரிசை_அடையாளம்,
        },
        {
          idVariable: இலக்கு_மொழி_மாறி_அடையாளம்,
          idColonne: இலக்கு_மொழி_நெடுவரிசை_அடையாளம்,
        },
        {
          idVariable: மூல்_உரை_மாறி_அடையாளம்,
          idColonne: மூல்_உரை_நெடுவரிசை_அடையாளம்,
        },
        {
          idVariable: மொழிபெயர்ப்பு_மாறி_அடையாளம்,
          idColonne: மொழிபெயர்ப்பு_நெடுவரிசை_அடையாளம்,
        },
        {
          idVariable: தேதி_மாறி_அடையாளம்,
          idColonne: தேதி_நெடுவரிசை_அடையாளம்,
        },
      ],
    },
  ],
};
