# PDF Invoice Generator

Professional PDF invoice generator with full support for Arabic (RTL) and English (LTR) languages using pdfMake library.

## Features

✅ **Bilingual Support**: Generate invoices in Arabic, English, or both languages
✅ **RTL/LTR Support**: Proper text direction handling for each language
✅ **Auto Calculations**: Automatically calculates item totals and grand total
✅ **Professional Design**: Clean, print-ready layout with proper margins
✅ **Customizable**: Company info, notes, currency symbols
✅ **Multiple Actions**: Download, print, or open in new window
✅ **TypeScript**: Full type safety and IntelliSense support

## Installation

Install the required dependencies:

```bash
npm install pdfmake
```

Or with yarn:

```bash
yarn add pdfmake
```

## Basic Usage

```typescript
import { generateInvoicePDF } from '@/lib/invoiceGenerator';

const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2026-01-13",
  clientName: "Mohamed Mubarak / محمد مبارك",
  items: [
    { description: "Web Design / تصميم موقع", quantity: 1, price: 3000 },
    { description: "Hosting / استضافة", quantity: 12, price: 50 }
  ]
};

// Download English invoice
generateInvoicePDF(invoiceData, 'en', 'download');

// Download Arabic invoice
generateInvoicePDF(invoiceData, 'ar', 'download');

// Download both languages (2 pages)
generateInvoicePDF(invoiceData, 'both', 'download');
```

## Invoice Data Structure

```typescript
interface InvoiceData {
  // Required fields
  invoiceNumber: string;      // e.g., "INV-001"
  date: string;                // e.g., "2026-01-13"
  clientName: string;          // Client's name
  items: InvoiceItem[];        // Array of invoice items
  
  // Optional fields
  companyName?: string;        // Your company name
  companyAddress?: string;     // Your company address
  companyPhone?: string;       // Your company phone
  companyEmail?: string;       // Your company email
  notes?: string;              // Additional notes
  currency?: string;           // Currency symbol (default: "$")
}

interface InvoiceItem {
  description: string;         // Item description
  quantity: number;            // Item quantity
  price: number;               // Item unit price
}
```

## Full Example

```typescript
const invoiceData = {
  invoiceNumber: "INV-001",
  date: "2026-01-13",
  clientName: "Mohamed Mubarak / محمد مبارك",
  companyName: "Electro Shop",
  companyAddress: "123 Tech Street, Cairo, Egypt",
  companyPhone: "+20 123 456 7890",
  companyEmail: "info@electroshop.com",
  currency: "EGP",
  items: [
    { description: "Laptop Dell XPS 15 / لابتوب ديل XPS 15", quantity: 2, price: 45000 },
    { description: "Wireless Mouse / ماوس لاسلكي", quantity: 5, price: 250 },
    { description: "USB-C Hub / موزع USB-C", quantity: 3, price: 800 },
  ],
  notes: "Payment due within 30 days. Thank you! / الدفع مستحق خلال 30 يوماً. شكراً!"
};

generateInvoicePDF(invoiceData, 'both', 'download');
```

## React Component Example

```tsx
import { generateInvoicePDF } from '@/lib/invoiceGenerator';

function InvoiceButton({ orderData }: { orderData: any }) {
  const handleDownload = () => {
    generateInvoicePDF(orderData, 'en', 'download');
  };

  return (
    <button 
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Download Invoice
    </button>
  );
}
```

## API Reference

### generateInvoicePDF(data, language, action)

Generates a PDF invoice with the specified language and action.

**Parameters:**

- `data` (InvoiceData): The invoice data object
- `language` ('ar' | 'en' | 'both'): The language for the invoice
  - `'en'`: English only
  - `'ar'`: Arabic only
  - `'both'`: Both languages (2 pages)
- `action` ('download' | 'print' | 'open'): What to do with the PDF
  - `'download'`: Download the PDF file
  - `'print'`: Open print dialog
  - `'open'`: Open PDF in new window/tab

**Returns:** void

## Language Support

### English (LTR)
- Left-to-right text direction
- Helvetica/Roboto font
- Standard alignment (left for descriptions, center for numbers)

### Arabic (RTL)
- Right-to-left text direction
- Arabic-compatible font
- Reversed column order in tables
- Right-aligned text for descriptions

### Both Languages
- Generates two pages: first in English, second in Arabic
- Each page is fully formatted for its respective language
- Useful for international clients

## Customization

### Changing Colors

Edit the `styles` section in the `docDefinition`:

```typescript
styles: {
  header: {
    fontSize: 28,
    bold: true,
    color: '#2D3748',  // Change header color
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    color: 'white',
    fillColor: '#4A5568',  // Change table header background
  },
}
```

### Changing Fonts

For better Arabic support, you can add custom fonts:

```typescript
pdfMake.fonts = {
  Amiri: {
    normal: 'Amiri-Regular.ttf',
    bold: 'Amiri-Bold.ttf',
  }
};

// In docDefinition:
defaultStyle: {
  font: 'Amiri',
}
```

### Changing Page Size

```typescript
pageSize: 'A4',  // Options: 'A4', 'LETTER', 'LEGAL', etc.
pageMargins: [40, 60, 40, 60],  // [left, top, right, bottom]
```

## Calculations

The library automatically calculates:

1. **Item Total**: `quantity × price`
2. **Grand Total**: Sum of all item totals

All calculations are performed automatically - you just provide the items!

## Styling Features

- Professional header with company branding
- Clean table design with alternating row colors
- Proper spacing and margins for printing
- Clear separation between sections
- Grand total highlighting

## Browser Compatibility

Works in all modern browsers:
- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## Notes

1. **Arabic Font**: For better Arabic rendering, consider adding the Amiri font to pdfMake's VFS
2. **Large Invoices**: The library handles invoices with many items automatically
3. **Currency**: You can specify any currency symbol (e.g., "$", "€", "EGP", "SAR")
4. **Date Format**: Use ISO format (YYYY-MM-DD) or any format you prefer

## Troubleshooting

### Issue: Arabic text not displaying correctly

**Solution**: Make sure you're using a font that supports Arabic characters. The default Roboto font has basic Arabic support.

### Issue: PDF not downloading

**Solution**: Check browser console for errors. Ensure pdfMake is properly installed.

### Issue: Table alignment issues

**Solution**: The library automatically handles RTL/LTR alignment. If you see issues, verify your `language` parameter is correct.

## License

This code is provided as-is for use in your projects.

## Support

For issues or questions, please check the pdfMake documentation:
- https://pdfmake.github.io/docs/

## Examples

See [invoiceExamples.tsx](./invoiceExamples.tsx) for more usage examples including:
- React component integration
- Multiple invoice scenarios
- Complex invoices with many items
- Button components for downloading invoices
