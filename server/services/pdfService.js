const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  // Generar PDF de cotización
  async generateQuotationPDF(quotation, user) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `cotizacion-${quotation.quotationNumber}.pdf`;
        const filepath = path.join(__dirname, '../../uploads/quotations', filename);

        // Asegurar que el directorio existe
        const dir = path.dirname(filepath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        const stream = fs.createWriteStream(filepath);
        doc.pipe(stream);

        // Header con logo (si existe)
        if (user.company && user.company.logo) {
          // doc.image(user.company.logo, 50, 45, { width: 100 });
        }

        // Información de la empresa
        doc
          .fontSize(20)
          .text(user.company?.name || user.name, 50, 50)
          .fontSize(10)
          .text(user.company?.address || '', 50, 80)
          .text(`RUC: ${user.company?.ruc || ''}`, 50, 95)
          .text(`Email: ${user.email}`, 50, 110)
          .text(`Teléfono: ${user.company?.phone || ''}`, 50, 125);

        // Título
        doc
          .fontSize(20)
          .text('COTIZACIÓN', 400, 50, { align: 'right' })
          .fontSize(10)
          .text(`N° ${quotation.quotationNumber}`, 400, 80, { align: 'right' })
          .text(`Fecha: ${new Date(quotation.createdAt).toLocaleDateString('es-PE')}`, 400, 95, { align: 'right' })
          .text(`Válido hasta: ${new Date(quotation.validUntil).toLocaleDateString('es-PE')}`, 400, 110, { align: 'right' });

        // Línea divisoria
        doc
          .strokeColor('#000000')
          .lineWidth(1)
          .moveTo(50, 150)
          .lineTo(550, 150)
          .stroke();

        // Información del cliente
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Cliente:', 50, 170)
          .font('Helvetica')
          .fontSize(10)
          .text(`${quotation.client.firstName} ${quotation.client.lastName}`, 50, 190)
          .text(`Email: ${quotation.client.email}`, 50, 205)
          .text(`Teléfono: ${quotation.client.phone}`, 50, 220);

        // Detalles del evento
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Detalles del Evento:', 300, 170)
          .font('Helvetica')
          .fontSize(10)
          .text(quotation.title, 300, 190);

        if (quotation.eventDate) {
          doc.text(`Fecha: ${new Date(quotation.eventDate).toLocaleDateString('es-PE')}`, 300, 205);
        }

        if (quotation.numberOfGuests) {
          doc.text(`N° de Invitados: ${quotation.numberOfGuests}`, 300, 220);
        }

        // Tabla de items
        const tableTop = 270;
        doc.fontSize(10);

        // Encabezados de la tabla
        this.generateTableRow(
          doc,
          tableTop,
          'Descripción',
          'Cant.',
          'P. Unit.',
          'Desc.',
          'Total',
          true
        );

        // Línea debajo del encabezado
        doc
          .strokeColor('#cccccc')
          .lineWidth(1)
          .moveTo(50, tableTop + 20)
          .lineTo(550, tableTop + 20)
          .stroke();

        // Items
        let position = tableTop + 30;
        quotation.items.forEach((item) => {
          this.generateTableRow(
            doc,
            position,
            item.name,
            item.quantity.toString(),
            `S/ ${item.unitPrice.toFixed(2)}`,
            `${item.discount}%`,
            `S/ ${item.total.toFixed(2)}`
          );
          position += 25;
        });

        // Línea antes de los totales
        doc
          .strokeColor('#cccccc')
          .lineWidth(1)
          .moveTo(50, position)
          .lineTo(550, position)
          .stroke();

        position += 10;

        // Subtotal
        this.generateTableRow(
          doc,
          position,
          '',
          '',
          '',
          'Subtotal:',
          `S/ ${quotation.subtotal.toFixed(2)}`
        );

        position += 20;

        // Descuento
        if (quotation.discount > 0) {
          this.generateTableRow(
            doc,
            position,
            '',
            '',
            '',
            `Descuento (${quotation.discount}%):`,
            `- S/ ${((quotation.subtotal * quotation.discount) / 100).toFixed(2)}`
          );
          position += 20;
        }

        // IGV
        const taxAmount = ((quotation.subtotal * (100 - quotation.discount) / 100) * quotation.tax) / 100;
        this.generateTableRow(
          doc,
          position,
          '',
          '',
          '',
          `IGV (${quotation.tax}%):`,
          `S/ ${taxAmount.toFixed(2)}`
        );

        position += 20;

        // Total
        doc.font('Helvetica-Bold');
        this.generateTableRow(
          doc,
          position,
          '',
          '',
          '',
          'TOTAL:',
          `S/ ${quotation.total.toFixed(2)}`
        );

        position += 40;

        // Términos y condiciones
        doc
          .font('Helvetica-Bold')
          .fontSize(12)
          .text('Términos y Condiciones:', 50, position);

        doc
          .font('Helvetica')
          .fontSize(10)
          .text(quotation.terms || 'Válido por 15 días. Se requiere adelanto del 50% para confirmar la reserva.', 50, position + 20, {
            width: 500,
            align: 'justify'
          });

        if (quotation.notes) {
          position += 80;
          doc
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('Notas:', 50, position);

          doc
            .font('Helvetica')
            .fontSize(10)
            .text(quotation.notes, 50, position + 20, {
              width: 500,
              align: 'justify'
            });
        }

        // Footer
        const pageHeight = doc.page.height;
        doc
          .fontSize(8)
          .text(
            'Gracias por su preferencia',
            50,
            pageHeight - 50,
            { align: 'center', width: 500 }
          );

        doc.end();

        stream.on('finish', () => {
          resolve(`/uploads/quotations/${filename}`);
        });

        stream.on('error', (err) => {
          reject(err);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Generar fila de tabla
  generateTableRow(doc, y, col1, col2, col3, col4, col5, isHeader = false) {
    if (isHeader) {
      doc.font('Helvetica-Bold');
    } else {
      doc.font('Helvetica');
    }

    doc
      .fontSize(10)
      .text(col1, 50, y, { width: 200 })
      .text(col2, 260, y, { width: 50, align: 'center' })
      .text(col3, 320, y, { width: 80, align: 'right' })
      .text(col4, 410, y, { width: 50, align: 'center' })
      .text(col5, 470, y, { width: 80, align: 'right' });
  }

  // Generar PDF de factura
  async generateInvoicePDF(invoice, user) {
    // Similar a la cotización, pero con formato de factura oficial
    // Implementación similar a generateQuotationPDF
    return `/uploads/invoices/invoice-${invoice.invoiceNumber}.pdf`;
  }

  // Generar PDF de contrato
  async generateContractPDF(contract, user) {
    // Implementación de generación de contrato
    return `/uploads/contracts/contract-${contract.contractNumber}.pdf`;
  }
}

module.exports = new PDFService();
