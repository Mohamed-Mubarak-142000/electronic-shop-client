// Custom fonts configuration for pdfMake with Amiri Arabic font support

export const loadCustomFonts = async () => {
  const fonts: any = {};

  try {
    console.log('Starting to load Amiri fonts...');
    
    // Load Amiri fonts with better error handling
    const loadFont = async (path: string, name: string) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${name}: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        console.log(`Loaded ${name}: ${buffer.byteLength} bytes`);
        return buffer;
      } catch (error) {
        console.error(`Error loading ${name}:`, error);
        throw error;
      }
    };

    const [amiriRegular, amiriBold, amiriItalic, amiriBoldItalic] = await Promise.all([
      loadFont('/fonts/Amiri-1.000/Amiri-Regular.ttf', 'Amiri-Regular'),
      loadFont('/fonts/Amiri-1.000/Amiri-Bold.ttf', 'Amiri-Bold'),
      loadFont('/fonts/Amiri-1.000/Amiri-Italic.ttf', 'Amiri-Italic'),
      loadFont('/fonts/Amiri-1.000/Amiri-BoldItalic.ttf', 'Amiri-BoldItalic'),
    ]);

    // Convert to base64 with chunking for large files
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000; // 32KB chunks
      const chunks: string[] = [];
      
      for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
        chunks.push(String.fromCharCode.apply(null, Array.from(chunk)));
      }
      
      return btoa(chunks.join(''));
    };

    fonts['Amiri-Regular.ttf'] = arrayBufferToBase64(amiriRegular);
    fonts['Amiri-Bold.ttf'] = arrayBufferToBase64(amiriBold);
    fonts['Amiri-Italic.ttf'] = arrayBufferToBase64(amiriItalic);
    fonts['Amiri-BoldItalic.ttf'] = arrayBufferToBase64(amiriBoldItalic);

    console.log('All Amiri fonts loaded and converted successfully');
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
