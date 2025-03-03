/**
 * TODO: Rewrite this config to ESM
 * But currently electron-builder doesn't support ESM configs
 * @see https://github.com/develar/read-config-file/issues/10
 */

/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
export default async function () {
  const {getVersion} = await import('./version/getVersion.mjs');
  return {
    productName: 'Constellation', // Pour macOS et Windows
    directories: {
      output: 'dist',
      buildResources: 'buildResources',
    },
    files: ['packages/**/dist/**'],
    extraMetadata: {
      version: getVersion(),
      name: 'Constellation', // Pour linux deb
    },

    mac: {
      extendInfo: {
        NSCameraUsageDescription:
          "Constellation a besoin d'accéder la caméra pour lire les codes R2",
        // NSMicrophoneUsageDescription: "Accès microphone",
        //"com.apple.security.device.audio-input": true,
        'com.apple.security.device.camera': true,
      },
      target: [
        {
          target: 'dmg',
          arch: ['x64', 'arm64'],
        },
      ],
    },

    // Specify linux target just for disabling snap compilation
    linux: {
      target: 'deb',
    },
  };
}
