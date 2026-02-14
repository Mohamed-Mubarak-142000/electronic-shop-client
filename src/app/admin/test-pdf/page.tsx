'use client';

import { useState } from 'react';
import { generateSimpleInvoicePDF } from '@/lib/invoiceGeneratorSimple';
import { generateInvoicePDF } from '@/lib/invoiceGenerator';

export default function TestPDFPage() {
  const [status, setStatus] = useState<string>('Ready to test');

  const testSimplePDF = () => {
    console.log('Testing simple PDF generation...');
    setStatus('Generating simple PDF...');
    
    try {
      const testData = {
        invoiceNumber: 'TEST-001',
        date: new Date().toLocaleDateString(),
        clientName: 'Test Customer',
        clientEmail: 'test@example.com',
        clientPhone: '+1 234 567 8900',
        clientAddress: '123 Test Street, Test City, 12345',
        companyName: 'Test Company',
        companyAddress: '456 Company Ave',
        companyPhone: '+1 555 123 4567',
        companyEmail: 'info@testcompany.com',
        currency: '$',
        items: [
          { description: 'Test Product 1', quantity: 2, price: 50 },
          { description: 'Test Product 2', quantity: 1, price: 100 },
        ],
        paymentMethod: 'Credit Card',
        subtotal: 200,
        shippingCost: 10,
        taxAmount: 15,
        discount: 5,
        notes: 'Test invoice for debugging'
      };

      generateSimpleInvoicePDF(testData, 'download');
      setStatus('✓ Simple PDF generated! Check your downloads.');
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(`✗ Error: ${error.message}`);
    }
  };

  const testArabicPDF = async () => {
    console.log('Testing Arabic PDF generation...');
    setStatus('Generating PDF with Arabic support...');
    
    try {
      const testData = {
        invoiceNumber: 'TEST-002',
        date: new Date().toLocaleDateString(),
        clientName: 'محمد مبارك / Mohamed Mubarak',
        clientEmail: 'test@example.com',
        clientPhone: '+1 234 567 8900',
        clientAddress: '123 Test Street, Test City, 12345',
        companyName: 'Electro Shop / متجر إلكترو',
        companyAddress: '456 Company Ave',
        companyPhone: '+1 555 123 4567',
        companyEmail: 'info@electroshop.com',
        currency: '$',
        items: [
          { description: 'منتج اختبار / Test Product', quantity: 2, price: 50 },
          { description: 'كمبيوتر محمول / Laptop', quantity: 1, price: 100 },
        ],
        paymentMethod: 'Credit Card',
        subtotal: 200,
        shippingCost: 10,
        taxAmount: 15,
        discount: 5,
        notes: 'Test invoice with Arabic text'
      };

      await generateInvoicePDF(testData, 'ar', 'download');
      setStatus('✓ Arabic PDF generated! Check your downloads.');
    } catch (error: any) {
      console.error('Error:', error);
      setStatus(`✗ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-4">PDF Generator Test</h1>
      <p className="text-gray-400 mb-8">Use this page to test PDF generation functionality</p>

      <div className="bg-surface-dark rounded-lg p-6 border border-white/10 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Status</h2>
        <div className="bg-input-background rounded p-4 text-white font-mono text-sm">
          {status}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={testSimplePDF}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">download</span>
          Test Simple PDF (English Only)
        </button>

        <button
          onClick={testArabicPDF}
          className="w-full bg-primary hover:bg-green-400 text-black font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">download</span>
          Test PDF with Arabic Support
        </button>
      </div>

      <div className="mt-8 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <h3 className="text-yellow-400 font-bold mb-2">Instructions:</h3>
        <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
          <li>Open browser console (F12) to see detailed logs</li>
          <li>Click a button to test PDF generation</li>
          <li>Check your Downloads folder for the PDF file</li>
          <li>If no PDF downloads, check console for errors</li>
        </ol>
      </div>
    </div>
  );
}
