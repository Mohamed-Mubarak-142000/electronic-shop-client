import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with default fonts
if (typeof window !== 'undefined') {
  const vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs || pdfFonts;
  (pdfMake as any).vfs = vfs;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  items: InvoiceItem[];
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  notes?: string;
  currency?: string;
  paymentMethod?: string;
  subtotal?: number;
  shippingCost?: number;
  taxAmount?: number;
  discount?: number;
}

/**
 * Simple PDF generation that works reliably with default fonts
 * Use this as a fallback if custom fonts fail
 */
export const generateSimpleInvoicePDF = (
  data: InvoiceData,
  action: 'download' | 'print' | 'open' = 'download'
): void => {
  console.log('=== Generating Simple PDF (No Custom Fonts) ===');

  const currency = data.currency || '$';
  const subtotal = data.subtotal || data.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const shipping = data.shippingCost || 0;
  const tax = data.taxAmount || 0;
  const discount = data.discount || 0;
  const total = subtotal + shipping + tax - discount;

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        text: 'INVOICE',
        fontSize: 28,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      
      // Invoice Info
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: `Invoice #: ${data.invoiceNumber}`, fontSize: 10, margin: [0, 0, 0, 5] },
              { text: `Date: ${data.date}`, fontSize: 10 },
            ],
          },
          {
            width: '50%',
            stack: data.companyName ? [
              { text: data.companyName, fontSize: 12, bold: true, alignment: 'right' },
              data.companyAddress ? { text: data.companyAddress, fontSize: 9, alignment: 'right' } : {},
              data.companyPhone ? { text: data.companyPhone, fontSize: 9, alignment: 'right' } : {},
              data.companyEmail ? { text: data.companyEmail, fontSize: 9, alignment: 'right' } : {},
            ] : [],
          },
        ],
        margin: [0, 0, 0, 20],
      },

      // Customer Info
      {
        text: 'Bill To:',
        fontSize: 12,
        bold: true,
        margin: [0, 0, 0, 5],
      },
      {
        stack: [
          { text: data.clientName, fontSize: 10, margin: [0, 0, 0, 3] },
          data.clientEmail ? { text: data.clientEmail, fontSize: 9, margin: [0, 0, 0, 3] } : {},
          data.clientPhone ? { text: data.clientPhone, fontSize: 9, margin: [0, 0, 0, 3] } : {},
          data.clientAddress ? { text: data.clientAddress, fontSize: 9, margin: [0, 0, 0, 3] } : {},
        ],
        margin: [0, 0, 0, 20],
      },

      // Items Table
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            [
              { text: 'Description', style: 'tableHeader' },
              { text: 'Quantity', style: 'tableHeader' },
              { text: 'Price', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' },
            ],
            ...data.items.map(item => [
              { text: item.description, margin: [5, 5, 5, 5] },
              { text: item.quantity.toString(), alignment: 'center', margin: [5, 5, 5, 5] },
              { text: `${currency}${item.price.toFixed(2)}`, alignment: 'center', margin: [5, 5, 5, 5] },
              { text: `${currency}${(item.quantity * item.price).toFixed(2)}`, alignment: 'center', margin: [5, 5, 5, 5], bold: true },
            ]),
          ],
        },
        layout: {
          fillColor: (rowIndex: number) => rowIndex === 0 ? '#2563eb' : (rowIndex % 2 === 0 ? '#f8fafc' : null),
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#e2e8f0',
          vLineColor: () => '#e2e8f0',
        },
        margin: [0, 0, 0, 20],
      },

      // Payment Summary
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 250,
            stack: [
              {
                table: {
                  widths: ['*', 'auto'],
                  body: [
                    [{ text: 'Subtotal:', border: [false, false, false, false] }, { text: `${currency}${subtotal.toFixed(2)}`, alignment: 'right', border: [false, false, false, false] }],
                    shipping > 0 ? [{ text: 'Shipping:', border: [false, false, false, false] }, { text: `${currency}${shipping.toFixed(2)}`, alignment: 'right', border: [false, false, false, false] }] : [],
                    tax > 0 ? [{ text: 'Tax:', border: [false, false, false, false] }, { text: `${currency}${tax.toFixed(2)}`, alignment: 'right', border: [false, false, false, false] }] : [],
                    discount > 0 ? [{ text: 'Discount:', border: [false, false, false, false], color: '#ef4444' }, { text: `-${currency}${discount.toFixed(2)}`, alignment: 'right', border: [false, false, false, false], color: '#ef4444' }] : [],
                    [
                      { text: 'TOTAL:', bold: true, fontSize: 12, border: [false, true, false, false], margin: [0, 5, 0, 0] },
                      { text: `${currency}${total.toFixed(2)}`, bold: true, fontSize: 14, alignment: 'right', color: '#2563eb', border: [false, true, false, false], margin: [0, 5, 0, 0] }
                    ],
                  ].filter(row => row.length > 0),
                },
                layout: 'noBorders',
              },
            ],
          },
        ],
      },

      // Payment Method & Notes
      data.paymentMethod || data.notes ? {
        stack: [
          data.paymentMethod ? { text: `Payment Method: ${data.paymentMethod}`, fontSize: 10, margin: [0, 20, 0, 5] } : {},
          data.notes ? { text: `Notes: ${data.notes}`, fontSize: 9, color: '#64748b', margin: [0, 5, 0, 0] } : {},
        ],
      } : {},
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 11,
        color: 'white',
        fillColor: '#2563eb',
        alignment: 'center',
      },
    },
    defaultStyle: {
      fontSize: 10,
    },
  };

  try {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    const fileName = `invoice-${data.invoiceNumber}.pdf`;

    switch (action) {
      case 'download':
        console.log(`Downloading PDF: ${fileName}`);
        pdfDocGenerator.download(fileName);
        break;
      case 'print':
        console.log('Opening print dialog...');
        pdfDocGenerator.print();
        break;
      case 'open':
        console.log('Opening PDF in new tab...');
        pdfDocGenerator.open();
        break;
    }

    console.log('✓ Simple PDF generated successfully');
  } catch (error) {
    console.error('Error generating simple PDF:', error);
    throw error;
  }
};
