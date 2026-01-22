import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfMake with default fonts
if (typeof window !== 'undefined') {
  (pdfMake as any).vfs = pdfFonts;
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

type Language = 'ar' | 'en' | 'both';

// Translations
const translations = {
  ar: {
    invoice: 'فاتورة',
    invoiceNumber: 'رقم الفاتورة',
    date: 'التاريخ',
    clientName: 'اسم العميل',
    description: 'الوصف',
    quantity: 'الكمية',
    price: 'السعر',
    total: 'المجموع',
    grandTotal: 'الإجمالي الكلي',
    notes: 'ملاحظات',
    companyInfo: 'معلومات الشركة',
    paymentSummary: 'ملخص الدفع',
    paymentMethod: 'طريقة الدفع',
    subtotal: 'المجموع الفرعي',
    shipping: 'الشحن',
    tax: 'الضريبة',
    discount: 'الخصم',
  },
  en: {
    invoice: 'INVOICE',
    invoiceNumber: 'Invoice Number',
    date: 'Date',
    clientName: 'Client Name',
    description: 'Description',
    quantity: 'Quantity',
    price: 'Price',
    total: 'Total',
    grandTotal: 'Grand Total',
    notes: 'Notes',
    companyInfo: 'Company Information',
    paymentSummary: 'Payment Summary',
    paymentMethod: 'Payment Method',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
  },
};

/**
 * Calculate the total for a single item
 */
const calculateItemTotal = (item: InvoiceItem): number => {
  return item.quantity * item.price;
};

/**
 * Calculate the grand total from all items
 */
const calculateGrandTotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
};

/**
 * Calculate final total including shipping, tax, and discount
 */
const calculateFinalTotal = (data: InvoiceData): number => {
  const subtotal = data.subtotal ?? calculateGrandTotal(data.items);
  const shipping = data.shippingCost ?? 0;
  const tax = data.taxAmount ?? 0;
  const discount = data.discount ?? 0;
  return subtotal + shipping + tax - discount;
};

/**
 * Format currency value
 */
const formatCurrency = (value: number, currency: string = '$'): string => {
  return `${currency} ${value.toFixed(2)}`;
};

/**
 * Generate invoice table for a specific language
 */
const generateInvoiceTable = (data: InvoiceData, language: 'ar' | 'en'): any => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const currency = data.currency || '$';

  // Table header
  const headerRow = [
    { text: t.description, style: 'tableHeader', alignment: isRTL ? 'right' : 'left' },
    { text: t.quantity, style: 'tableHeader', alignment: 'center' },
    { text: t.price, style: 'tableHeader', alignment: 'center' },
    { text: t.total, style: 'tableHeader', alignment: 'center' },
  ];

  if (isRTL) {
    headerRow.reverse();
  }

  // Table rows
  const tableRows = data.items.map((item) => {
    const row = [
      { text: item.description, alignment: isRTL ? 'right' : 'left', margin: [5, 5, 5, 5] },
      { text: item.quantity.toString(), alignment: 'center', margin: [5, 5, 5, 5] },
      { text: formatCurrency(item.price, currency), alignment: 'center', margin: [5, 5, 5, 5] },
      { 
        text: formatCurrency(calculateItemTotal(item), currency), 
        alignment: 'center', 
        bold: true,
        margin: [5, 5, 5, 5]
      },
    ];

    if (isRTL) {
      row.reverse();
    }

    return row;
  });

  return {
    table: {
      headerRows: 1,
      widths: isRTL ? ['auto', '*', 'auto', 'auto'] : ['*', 'auto', 'auto', 'auto'],
      body: [headerRow, ...tableRows],
    },
    layout: {
      fillColor: (rowIndex: number) => {
        return rowIndex === 0 ? '#2563eb' : rowIndex % 2 === 0 ? '#f8fafc' : null;
      },
      hLineWidth: () => 1,
      vLineWidth: () => 1,
      hLineColor: () => '#e2e8f0',
      vLineColor: () => '#e2e8f0',
      paddingLeft: () => 8,
      paddingRight: () => 8,
      paddingTop: () => 8,
      paddingBottom: () => 8,
    },
    margin: [0, 20, 0, 20],
  };
};

/**
 * Generate invoice header section
 */
const generateHeader = (data: InvoiceData, language: 'ar' | 'en'): any[] => {
  const t = translations[language];
  const isRTL = language === 'ar';

  return [
    {
      text: t.invoice,
      style: 'header',
      alignment: isRTL ? 'right' : 'left',
      margin: [0, 0, 0, 10],
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 3,
          lineColor: '#2563eb',
        },
      ],
      margin: [0, 0, 0, 20],
    },
    {
      columns: [
        {
          width: '50%',
          stack: [
            {
              text: [
                { text: `${t.invoiceNumber}: `, bold: true, color: '#475569' },
                { text: data.invoiceNumber, color: '#0f172a' },
              ],
              alignment: isRTL ? 'right' : 'left',
              margin: [0, 0, 0, 8],
            },
            {
              text: [
                { text: `${t.date}: `, bold: true, color: '#475569' },
                { text: data.date, color: '#0f172a' },
              ],
              alignment: isRTL ? 'right' : 'left',
              margin: [0, 0, 0, 8],
            },
          ],
        },
        {
          width: '50%',
          stack: [
            {
              text: [
                { text: `${t.clientName}: `, bold: true, color: '#475569' },
                { text: data.clientName, color: '#0f172a' },
              ],
              alignment: isRTL ? 'left' : 'right',
              margin: [0, 0, 0, 8],
            },
          ],
        },
      ],
      margin: [0, 0, 0, 20],
    },
  ];
};

/**
 * Generate payment summary section
 */
const generatePaymentSummary = (data: InvoiceData, language: 'ar' | 'en'): any[] => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const currency = data.currency || '$';
  
  const subtotal = data.subtotal ?? calculateGrandTotal(data.items);
  const shipping = data.shippingCost ?? 0;
  const tax = data.taxAmount ?? 0;
  const discount = data.discount ?? 0;
  const finalTotal = calculateFinalTotal(data);

  const summaryRows: any[] = [];

  // Subtotal row
  summaryRows.push([
    { 
      text: t.subtotal, 
      alignment: isRTL ? 'right' : 'left',
      color: '#64748b',
      border: [false, false, false, false],
    },
    { 
      text: formatCurrency(subtotal, currency), 
      alignment: 'right',
      color: '#1e293b',
      border: [false, false, false, false],
    },
  ]);

  // Shipping row (if exists)
  if (shipping > 0) {
    summaryRows.push([
      { 
        text: t.shipping, 
        alignment: isRTL ? 'right' : 'left',
        color: '#64748b',
        border: [false, false, false, false],
      },
      { 
        text: formatCurrency(shipping, currency), 
        alignment: 'right',
        color: '#1e293b',
        border: [false, false, false, false],
      },
    ]);
  }

  // Tax row (if exists)
  if (tax > 0) {
    summaryRows.push([
      { 
        text: t.tax, 
        alignment: isRTL ? 'right' : 'left',
        color: '#64748b',
        border: [false, false, false, false],
      },
      { 
        text: formatCurrency(tax, currency), 
        alignment: 'right',
        color: '#1e293b',
        border: [false, false, false, false],
      },
    ]);
  }

  // Discount row (if exists)
  if (discount > 0) {
    summaryRows.push([
      { 
        text: t.discount, 
        alignment: isRTL ? 'right' : 'left',
        color: '#ef4444',
        border: [false, false, false, false],
      },
      { 
        text: `- ${formatCurrency(discount, currency)}`, 
        alignment: 'right',
        color: '#ef4444',
        border: [false, false, false, false],
      },
    ]);
  }

  // Grand Total row
  summaryRows.push([
    { 
      text: t.grandTotal, 
      bold: true,
      fontSize: 14,
      alignment: isRTL ? 'right' : 'left',
      color: '#0f172a',
      border: [false, true, false, false],
      borderColor: ['', '#2563eb', '', ''],
      borderWidth: [0, 2, 0, 0],
      margin: [0, 8, 0, 0],
    },
    { 
      text: formatCurrency(finalTotal, currency), 
      bold: true,
      fontSize: 16,
      alignment: 'right',
      color: '#2563eb',
      border: [false, true, false, false],
      borderColor: ['', '#2563eb', '', ''],
      borderWidth: [0, 2, 0, 0],
      margin: [0, 8, 0, 0],
    },
  ]);

  return [
    {
      columns: [
        { width: '*', text: '' },
        {
          width: 280,
          stack: [
            {
              text: t.paymentSummary,
              fontSize: 12,
              bold: true,
              color: '#475569',
              margin: [0, 0, 0, 10],
            },
            {
              table: {
                widths: ['*', 'auto'],
                body: summaryRows,
              },
              layout: 'noBorders',
            },
          ],
        },
      ],
      margin: [0, 20, 0, 20],
    },
  ];
};

/**
 * Generate payment method and notes footer
 */
const generateFooter = (data: InvoiceData, language: 'ar' | 'en'): any[] => {
  const t = translations[language];
  const isRTL = language === 'ar';
  const footer: any[] = [];

  // Payment Method
  if (data.paymentMethod) {
    footer.push({
      columns: [
        {
          width: '50%',
          stack: [
            {
              text: [
                { text: `${t.paymentMethod}: `, bold: true, color: '#475569', fontSize: 11 },
                { text: data.paymentMethod, color: '#1e293b', fontSize: 11 },
              ],
              alignment: isRTL ? 'right' : 'left',
            },
          ],
        },
        { width: '50%', text: '' },
      ],
      margin: [0, 0, 0, 15],
    });
  }

  // Notes
  if (data.notes) {
    footer.push({
      text: [
        { text: `${t.notes}: `, bold: true, color: '#475569' },
        { text: data.notes, color: '#64748b' },
      ],
      alignment: isRTL ? 'right' : 'left',
      margin: [0, 10, 0, 0],
      fontSize: 10,
    });
  }

  return footer;
};

/**
 * Generate company information section
 */
const generateCompanyInfo = (data: InvoiceData, language: 'ar' | 'en'): any[] => {
  if (!data.companyName && !data.companyAddress && !data.companyPhone && !data.companyEmail) {
    return [];
  }

  const isRTL = language === 'ar';
  const info: any[] = [];

  if (data.companyName) {
    info.push({
      text: data.companyName,
      fontSize: 20,
      bold: true,
      color: '#0f172a',
      alignment: isRTL ? 'right' : 'left',
      margin: [0, 0, 0, 5],
    });
  }

  const details: string[] = [];
  if (data.companyAddress) details.push(data.companyAddress);
  if (data.companyPhone) details.push(`Tel: ${data.companyPhone}`);
  if (data.companyEmail) details.push(`Email: ${data.companyEmail}`);

  if (details.length > 0) {
    info.push({
      text: details.join(' | '),
      fontSize: 10,
      color: '#64748b',
      alignment: isRTL ? 'right' : 'left',
      margin: [0, 0, 0, 25],
    });
  }

  return info;
};

/**
 * Generate PDF invoice with support for Arabic, English, or both languages
 */
export const generateInvoicePDF = async (
  data: InvoiceData,
  language: Language = 'en',
  action: 'download' | 'print' | 'open' = 'download'
): Promise<void> => {
  let content: any[] = [];

  if (language === 'both') {
    // Generate both English and Arabic versions on separate pages
    content = [
      ...generateCompanyInfo(data, 'en'),
      ...generateHeader(data, 'en'),
      generateInvoiceTable(data, 'en'),
      ...generatePaymentSummary(data, 'en'),
      ...generateFooter(data, 'en'),
      { text: '', pageBreak: 'after' },
      ...generateCompanyInfo(data, 'ar'),
      ...generateHeader(data, 'ar'),
      generateInvoiceTable(data, 'ar'),
      ...generatePaymentSummary(data, 'ar'),
      ...generateFooter(data, 'ar'),
    ];
  } else {
    // Generate single language version
    content = [
      ...generateCompanyInfo(data, language),
      ...generateHeader(data, language),
      generateInvoiceTable(data, language),
      ...generatePaymentSummary(data, language),
      ...generateFooter(data, language),
    ];
  }

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [50, 60, 50, 60],
    content,
    styles: {
      header: {
        fontSize: 32,
        bold: true,
        color: '#0f172a',
      },
      tableHeader: {
        bold: true,
        fontSize: 12,
        color: 'white',
        fillColor: '#2563eb',
      },
    },
    defaultStyle: {
      fontSize: 11,
      lineHeight: 1.4,
      color: '#1e293b',
    },
  };

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  switch (action) {
    case 'download':
      pdfDocGenerator.download(`invoice-${data.invoiceNumber}.pdf`);
      break;
    case 'print':
      pdfDocGenerator.print();
      break;
    case 'open':
      pdfDocGenerator.open();
      break;
  }
};

export default generateInvoicePDF;
