export const obtIcôneContact = ({type}: {type: string}): string => {
  switch (type) {
    case 'whatsapp':
      return 'mdi-whatsapp';
    case 'téléphone':
      return 'mdi-phone';
    case 'télégramme':
      return 'mdi-send';
    case 'courriel':
      return 'mdi-email-outline';
    default:
      return 'mdi-account-outline';
  }
};
