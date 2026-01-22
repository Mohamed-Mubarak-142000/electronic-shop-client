// Custom fonts configuration for pdfMake with Amiri Arabic font support

export const loadCustomFonts = async () => {
  const fonts: any = {};

  try {
    // Load Amiri fonts
    const amiriRegular = await fetch('/fonts/Amiri-1.000/Amiri-Regular.ttf').then(res => res.arrayBuffer());
    const amiriBold = await fetch('/fonts/Amiri-1.000/Amiri-Bold.ttf').then(res => res.arrayBuffer());
    const amiriItalic = await fetch('/fonts/Amiri-1.000/Amiri-Italic.ttf').then(res => res.arrayBuffer());
    const amiriBoldItalic = await fetch('/fonts/Amiri-1.000/Amiri-BoldItalic.ttf').then(res => res.arrayBuffer());

    // Convert to base64
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    fonts['Amiri-Regular.ttf'] = arrayBufferToBase64(amiriRegular);
    fonts['Amiri-Bold.ttf'] = arrayBufferToBase64(amiriBold);
    fonts['Amiri-Italic.ttf'] = arrayBufferToBase64(amiriItalic);
    fonts['Amiri-BoldItalic.ttf'] = arrayBufferToBase64(amiriBoldItalic);

    return fonts;
  } catch (error) {
    console.error('Failed to load Amiri fonts:', error);
    return null;
  }
};

export const fontDefinitions = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
  Amiri: {
    normal: 'Amiri-Regular.ttf',
    bold: 'Amiri-Bold.ttf',
    italics: 'Amiri-Italic.ttf',
    bolditalics: 'Amiri-BoldItalic.ttf',
  },
};
