import { jsPDF } from 'jspdf';
import { Order } from '../types';

/**
 * Generates an official, beautifully styled PDF invoice for an order
 * and triggers client-side file download.
 */
export const generateInvoicePDF = async (order: Order): Promise<void> => {
  // Simulate realistic invoice rendering & document encryption delay
  await new Promise((resolve) => setTimeout(resolve, 650));

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const brandCobalt: [number, number, number] = [7, 63, 175]; // #073faf
  const darkNavy: [number, number, number] = [8, 52, 152]; // #083498
  const textDark: [number, number, number] = [16, 24, 40]; // #101828
  const textMuted: [number, number, number] = [102, 112, 133]; // #667085
  const lineGrey: [number, number, number] = [231, 234, 240]; // #e7eaf0
  const emeraldGreen: [number, number, number] = [22, 163, 74];
  const amberOrange: [number, number, number] = [217, 119, 6];
  const roseRed: [number, number, number] = [225, 29, 72];

  // 1. Top Decorative Brand Bar
  doc.setFillColor(...brandCobalt);
  doc.rect(0, 0, pageWidth, 5, 'F');

  let currentY = 18;

  // 2. Header Brand Mark & Info (Left)
  // Vector Brand Mark
  const iconX = margin;
  const iconY = currentY;
  
  // Icon Top Square
  doc.setFillColor(...brandCobalt);
  doc.rect(iconX, iconY, 5, 5, 'F');
  
  // Icon L-Stem
  doc.rect(iconX, iconY + 7, 5, 11, 'F');
  doc.rect(iconX + 5, iconY + 13, 8, 5, 'F');
  
  // Icon Inner Square
  doc.setFillColor(...textDark);
  doc.rect(iconX + 7, iconY + 7, 6, 4.5, 'F');

  // Brand Name Typography
  doc.setTextColor(...textDark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('INSIGHT STORE', iconX + 18, iconY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text('Smarter tech, better living · Authorized Consumer Electronics', iconX + 18, iconY + 12);
  doc.text('Central Logistics Hub: House 18-B, Gulberg III, Lahore, Pakistan', iconX + 18, iconY + 16);
  doc.text('Helpline: 03145338340 | Email: billing@insightstore.pk | NTN: 7892401-4', iconX + 18, iconY + 20);

  // 3. Invoice Meta Block (Right)
  const metaRightX = pageWidth - margin;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...brandCobalt);
  doc.text('TAX INVOICE', metaRightX, iconY + 4, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  const cleanId = order.id.replace('#', '');
  doc.text(`INV-${cleanId}`, metaRightX, iconY + 10, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textMuted);
  doc.text(`Order Date: ${order.date}`, metaRightX, iconY + 14, { align: 'right' });
  doc.text(`Invoice Issued: ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`, metaRightX, iconY + 18, { align: 'right' });

  // Status Badge on PDF
  const statusColor = order.status === 'Delivered' 
    ? emeraldGreen 
    : order.status === 'Cancelled' 
    ? roseRed 
    : order.status === 'Processing' 
    ? amberOrange 
    : brandCobalt;

  doc.setFillColor(...statusColor);
  doc.roundedRect(metaRightX - 32, iconY + 20.5, 32, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(order.status.toUpperCase(), metaRightX - 16, iconY + 24.2, { align: 'center' });

  currentY = 46;

  // 4. Horizontal Separator
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 6;

  // 5. Customer & Shipment Details Grid
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
  doc.setDrawColor(...lineGrey);
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'D');

  const colWidth = contentWidth / 3;

  // Col 1: Billed To
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandCobalt);
  doc.text('BILLED & DELIVERED TO:', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.text(order.customer.fullName || 'Customer', margin + 4, currentY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...textMuted);
  doc.text(order.customer.address, margin + 4, currentY + 15, { maxWidth: colWidth - 6 });
  doc.text(`${order.customer.city}, Pakistan`, margin + 4, currentY + 19.5);

  // Col 2: Contact
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandCobalt);
  doc.text('RECIPIENT CONTACT:', margin + colWidth + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  doc.text(`Phone: ${order.customer.phone}`, margin + colWidth + 4, currentY + 10.5);
  doc.text(`Email: ${order.customer.email}`, margin + colWidth + 4, currentY + 15);
  doc.text('National Carrier: TCS / Leopards Express', margin + colWidth + 4, currentY + 19.5);

  // Col 3: Payment & Fulfillment
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandCobalt);
  doc.text('PAYMENT DETAILS:', margin + colWidth * 2 + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...textDark);
  const paymentMethodLabel = order.paymentMethod === 'cod' 
    ? 'Cash on Delivery (COD)' 
    : order.paymentMethod === 'bank' 
    ? 'Direct Bank Transfer / IBFT' 
    : 'Debit / Credit Card';
  doc.text(`Method: ${paymentMethodLabel}`, margin + colWidth * 2 + 4, currentY + 10.5);
  doc.text(`Payment Status: ${order.status === 'Cancelled' ? 'Void / Cancelled' : 'Verified'}`, margin + colWidth * 2 + 4, currentY + 15);
  doc.text('Currency: PKR (Pakistani Rupee)', margin + colWidth * 2 + 4, currentY + 19.5);

  currentY += 32;

  // 6. Itemized Table Header
  doc.setFillColor(...brandCobalt);
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('#', margin + 3, currentY + 5.2);
  doc.text('ITEM DESCRIPTION', margin + 12, currentY + 5.2);
  doc.text('QTY', margin + contentWidth - 75, currentY + 5.2, { align: 'center' });
  doc.text('UNIT PRICE', margin + contentWidth - 42, currentY + 5.2, { align: 'right' });
  doc.text('TOTAL (PKR)', margin + contentWidth - 4, currentY + 5.2, { align: 'right' });

  currentY += 8;

  // 7. Table Rows
  order.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 11;

    if (isEven) {
      doc.setFillColor(252, 253, 255);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    // Border bottom
    doc.setDrawColor(...lineGrey);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    // Number
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    doc.text((index + 1).toString(), margin + 3, currentY + 6.8);

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    const titleSnippet = item.product.title.length > 55 
      ? item.product.title.substring(0, 52) + '...' 
      : item.product.title;
    doc.text(titleSnippet, margin + 12, currentY + 5);

    // Category / Brand subline
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(...textMuted);
    doc.text(`Brand: ${item.product.brand || 'Insight Official'} · Category: ${item.product.category}`, margin + 12, currentY + 8.8);

    // Qty
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(item.quantity.toString(), margin + contentWidth - 75, currentY + 6.8, { align: 'center' });

    // Unit Price
    doc.setFont('helvetica', 'normal');
    doc.text(`PKR ${item.product.price.toLocaleString()}`, margin + contentWidth - 42, currentY + 6.8, { align: 'right' });

    // Line Total
    doc.setFont('helvetica', 'bold');
    doc.text(`PKR ${(item.product.price * item.quantity).toLocaleString()}`, margin + contentWidth - 4, currentY + 6.8, { align: 'right' });

    currentY += rowHeight;
  });

  currentY += 4;

  // 8. Totals Calculation Summary (Right Aligned)
  const summaryBoxWidth = 84;
  const summaryX = pageWidth - margin - summaryBoxWidth;

  const calculatedSubtotal = order.subtotal || order.items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const calculatedShipping = order.shipping || 0;
  const calculatedDiscount = order.discount || 0;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...textMuted);
  doc.text('Subtotal:', summaryX, currentY + 4);
  doc.setTextColor(...textDark);
  doc.text(`PKR ${calculatedSubtotal.toLocaleString()}`, pageWidth - margin - 4, currentY + 4, { align: 'right' });

  // Shipping
  doc.setTextColor(...textMuted);
  doc.text('Courier Shipping:', summaryX, currentY + 9);
  doc.setTextColor(...emeraldGreen);
  doc.text(calculatedShipping === 0 ? 'FREE (Store Promo)' : `PKR ${calculatedShipping.toLocaleString()}`, pageWidth - margin - 4, currentY + 9, { align: 'right' });

  // Discount
  if (calculatedDiscount > 0) {
    doc.setTextColor(...textMuted);
    doc.text('Discount Applied:', summaryX, currentY + 14);
    doc.setTextColor(...roseRed);
    doc.text(`- PKR ${calculatedDiscount.toLocaleString()}`, pageWidth - margin - 4, currentY + 14, { align: 'right' });
    currentY += 5;
  }

  currentY += 13;

  // Grand Total Highlight Bar
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(summaryX - 4, currentY, summaryBoxWidth + 4, 10, 1.5, 1.5, 'F');
  doc.setDrawColor(...brandCobalt);
  doc.setLineWidth(0.3);
  doc.roundedRect(summaryX - 4, currentY, summaryBoxWidth + 4, 10, 1.5, 1.5, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...brandCobalt);
  doc.text('TOTAL AMOUNT:', summaryX, currentY + 6.6);

  doc.setFontSize(11);
  doc.setTextColor(...darkNavy);
  doc.text(`PKR ${order.total.toLocaleString()}`, pageWidth - margin - 4, currentY + 6.8, { align: 'right' });

  // 9. Guarantee & Authorized Stamp (Left of Summary)
  const stampY = currentY - 14;
  doc.setDrawColor(...brandCobalt);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, stampY, 82, 24, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandCobalt);
  doc.text('AUTHENTIC PURCHASE GUARANTEE', margin + 4, stampY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(...textMuted);
  doc.text('• Genuine products with 7-day hassle-free checking warranty.', margin + 4, stampY + 10);
  doc.text('• All taxes and import tariffs accounted for under Sales Tax Act.', margin + 4, stampY + 14);
  doc.text(`• Verification signature: ISS-PKG-${cleanId}`, margin + 4, stampY + 18);
  doc.text('• System generated e-invoice: No manual signature required.', margin + 4, stampY + 22);

  // 10. Footer Bottom Note
  const footerY = pageHeight - 16;
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...brandCobalt);
  doc.text('Thank you for shopping at Insight Store Pakistan!', margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...textMuted);
  doc.text(
    'For tracking & courier delivery inquiries, visit your Account portal or WhatsApp support at 03145338340.',
    margin,
    footerY + 4
  );

  doc.text(`Generated on ${new Date().toLocaleTimeString()} · Page 1 of 1`, pageWidth - margin, footerY + 2, { align: 'right' });

  // 11. Trigger Download
  const filename = `InsightStore-Invoice-${cleanId}.pdf`;
  doc.save(filename);
};
