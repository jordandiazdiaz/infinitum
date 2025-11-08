const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    }
    return this.transporter;
  }

  // Enviar cotización por email
  async sendQuotationEmail(quotation) {
    const message = {
      from: `${quotation.user.company?.name || quotation.user.name} <${process.env.EMAIL_USER}>`,
      to: quotation.client.email,
      subject: `Cotización ${quotation.quotationNumber} - ${quotation.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Hola ${quotation.client.firstName}!</h2>

          <p>Nos complace enviarte la cotización para tu evento:</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">${quotation.title}</h3>
            <p><strong>Número de Cotización:</strong> ${quotation.quotationNumber}</p>
            <p><strong>Fecha del Evento:</strong> ${quotation.eventDate ? new Date(quotation.eventDate).toLocaleDateString('es-PE') : 'Por definir'}</p>
            <p><strong>Total:</strong> S/ ${quotation.total.toFixed(2)}</p>
            <p><strong>Válido hasta:</strong> ${new Date(quotation.validUntil).toLocaleDateString('es-PE')}</p>
          </div>

          <p>Puedes revisar los detalles completos en el PDF adjunto.</p>

          <p>Si tienes alguna pregunta o deseas hacer alguna modificación, no dudes en contactarnos.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 5px 0;"><strong>${quotation.user.company?.name || quotation.user.name}</strong></p>
            <p style="margin: 5px 0;">${quotation.user.email}</p>
            <p style="margin: 5px 0;">${quotation.user.company?.phone || ''}</p>
          </div>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Transforma tus eventos sociales - Powered by SEVEM
          </p>
        </div>
      `,
      attachments: quotation.pdfUrl ? [{
        filename: `cotizacion-${quotation.quotationNumber}.pdf`,
        path: `.${quotation.pdfUrl}`
      }] : []
    };

    await this.getTransporter().sendMail(message);
  }

  // Enviar factura por email
  async sendInvoiceEmail(invoice) {
    const message = {
      from: `${invoice.user.company?.name || invoice.user.name} <${process.env.EMAIL_USER}>`,
      to: invoice.client.email,
      subject: `${invoice.invoiceType === 'factura' ? 'Factura' : 'Boleta'} Electrónica ${invoice.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Comprobante Electrónico</h2>

          <p>Estimado(a) ${invoice.client.firstName} ${invoice.client.lastName},</p>

          <p>Adjuntamos su comprobante de pago electrónico:</p>

          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Tipo:</strong> ${invoice.invoiceType === 'factura' ? 'Factura Electrónica' : 'Boleta de Venta Electrónica'}</p>
            <p><strong>Número:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Fecha de Emisión:</strong> ${new Date(invoice.issueDate).toLocaleDateString('es-PE')}</p>
            <p><strong>Total:</strong> S/ ${invoice.total.toFixed(2)}</p>
          </div>

          <p>Este documento ha sido emitido de forma electrónica y tiene plena validez legal.</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="margin: 5px 0;"><strong>${invoice.user.company?.name || invoice.user.name}</strong></p>
            <p style="margin: 5px 0;">RUC: ${invoice.user.company?.ruc || ''}</p>
            <p style="margin: 5px 0;">${invoice.user.email}</p>
          </div>
        </div>
      `,
      attachments: invoice.pdfUrl ? [{
        filename: `${invoice.invoiceType}-${invoice.invoiceNumber}.pdf`,
        path: `.${invoice.pdfUrl}`
      }] : []
    };

    await this.getTransporter().sendMail(message);
  }

  // Enviar recordatorio de pago
  async sendPaymentReminder(invoice, client) {
    const daysUntilDue = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

    const message = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: `Recordatorio de Pago - ${invoice.invoiceNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recordatorio de Pago</h2>

          <p>Estimado(a) ${client.firstName} ${client.lastName},</p>

          <p>Le recordamos que tiene un pago pendiente:</p>

          <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p><strong>Factura:</strong> ${invoice.invoiceNumber}</p>
            <p><strong>Monto:</strong> S/ ${invoice.total.toFixed(2)}</p>
            <p><strong>Fecha de Vencimiento:</strong> ${new Date(invoice.dueDate).toLocaleDateString('es-PE')}</p>
            <p><strong>Días restantes:</strong> ${daysUntilDue} días</p>
          </div>

          <p>Para evitar inconvenientes, le pedimos realizar el pago a la brevedad posible.</p>

          <p>Si ya realizó el pago, por favor ignore este mensaje.</p>
        </div>
      `
    };

    await this.getTransporter().sendMail(message);
  }

  // Enviar email de seguimiento personalizado
  async sendFollowUpEmail(client, subject, message) {
    const emailMessage = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hola ${client.firstName},</p>

          ${message}

          <p style="margin-top: 30px;">Saludos cordiales,</p>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Transforma tus eventos sociales - Powered by SEVEM
          </p>
        </div>
      `
    };

    await this.getTransporter().sendMail(emailMessage);
  }
}

module.exports = new EmailService();
