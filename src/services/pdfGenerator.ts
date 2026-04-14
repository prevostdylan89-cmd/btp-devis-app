import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

interface Company {
  name: string;
  siret: string;
  tva: string;
  address: string;
  phone: string;
  email: string;
}

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Prestation {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface DevisData {
  number: string;
  company: Company;
  client: Client;
  prestations: Prestation[];
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes?: string;
  signature?: string;
  signatureDate?: Date;
  validUntil: Date;
  createdAt: Date;
}

// Fonction pour générer le PDF complet avec signature
export const generatePDF = async (devisData: DevisData): Promise<string> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Devis ${devisData.number}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          background: #fff;
          padding: 40px;
          color: #333;
        }
        
        .devis-container {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2e7d32;
        }
        
        .title {
          font-size: 32px;
          color: #2e7d32;
          font-weight: bold;
        }
        
        .devis-number {
          font-size: 16px;
          color: #666;
          margin-top: 5px;
        }
        
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 20px;
        }
        
        .company-info, .client-info {
          flex: 1;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .info-title {
          font-size: 16px;
          font-weight: bold;
          color: #2e7d32;
          margin-bottom: 10px;
          border-bottom: 2px solid #2e7d32;
          padding-bottom: 5px;
        }
        
        .info-line {
          margin-bottom: 5px;
          font-size: 12px;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th {
          background: #2e7d32;
          color: white;
          padding: 10px;
          text-align: left;
          font-size: 12px;
        }
        
        td {
          padding: 10px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 12px;
        }
        
        .text-right {
          text-align: right;
        }
        
        .totals {
          text-align: right;
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #e0e0e0;
        }
        
        .total-line {
          margin: 5px 0;
        }
        
        .total-ttc {
          font-size: 20px;
          font-weight: bold;
          color: #2e7d32;
        }
        
        .signature-section {
          margin-top: 40px;
          display: flex;
          justify-content: space-between;
        }
        
        .signature-box {
          width: 45%;
          text-align: center;
        }
        
        .signature-label {
          font-size: 11px;
          color: #999;
          margin-bottom: 10px;
        }
        
        .signature-image {
          max-width: 200px;
          max-height: 80px;
          border: 1px solid #e0e0e0;
          padding: 5px;
        }
        
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #999;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }
      </style>
    </head>
    <body>
      <div class="devis-container">
        <div class="header">
          <div class="title">DEVIS</div>
          <div class="devis-number">N° ${devisData.number}</div>
          <div>Émis le ${new Date(devisData.createdAt).toLocaleDateString('fr-FR')}</div>
        </div>
        
        <div class="info-section">
          <div class="company-info">
            <div class="info-title">VOTRE ENTREPRISE</div>
            <div class="info-line"><strong>${devisData.company.name}</strong></div>
            <div class="info-line">${devisData.company.address}</div>
            <div class="info-line">SIRET: ${devisData.company.siret}</div>
            <div class="info-line">TVA: ${devisData.company.tva}%</div>
            <div class="info-line">Tel: ${devisData.company.phone}</div>
            <div class="info-line">Email: ${devisData.company.email}</div>
          </div>
          
          <div class="client-info">
            <div class="info-title">CLIENT</div>
            <div class="info-line"><strong>${devisData.client.name}</strong></div>
            <div class="info-line">${devisData.client.address || 'Adresse non renseignée'}</div>
            <div class="info-line">Tel: ${devisData.client.phone || 'Non renseigné'}</div>
            <div class="info-line">Email: ${devisData.client.email || 'Non renseigné'}</div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Prestation</th>
              <th class="text-right">Qté</th>
              <th class="text-right">Prix HT</th>
              <th class="text-right">Total HT</th>
            </tr>
          </thead>
          <tbody>
            ${devisData.prestations.map(p => `
              <tr>
                <td>${p.name}</td>
                <td class="text-right">${p.quantity}</td>
                <td class="text-right">${p.unitPrice.toFixed(2)} €</td>
                <td class="text-right">${p.total.toFixed(2)} €</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-line">Total HT: ${devisData.totalHT.toFixed(2)} €</div>
          <div class="total-line">TVA (${devisData.company.tva}%): ${devisData.totalTVA.toFixed(2)} €</div>
          <div class="total-line total-ttc">TOTAL TTC: ${devisData.totalTTC.toFixed(2)} €</div>
        </div>
        
        ${devisData.notes ? `
          <div style="margin: 20px 0; padding: 10px; background: #f5f5f5; border-radius: 5px;">
            <strong>Notes:</strong><br/>
            ${devisData.notes}
          </div>
        ` : ''}
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-label">Signature de l'entreprise</div>
            <div style="height: 80px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center;">
              Cachet et signature
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-label">Signature du client</div>
            ${devisData.signature ? 
              `<img src="${devisData.signature}" class="signature-image" />` : 
              '<div style="height: 80px; border: 1px dashed #ccc; display: flex; align-items: center; justify-content: center;">Signature requise</div>'
            }
            ${devisData.signatureDate ? `<div style="font-size: 10px; margin-top: 5px;">Le ${new Date(devisData.signatureDate).toLocaleDateString('fr-FR')}</div>` : ''}
          </div>
        </div>
        
        <div class="footer">
          <div>Devis valable jusqu'au ${new Date(devisData.validUntil).toLocaleDateString('fr-FR')}</div>
          <div>Merci de votre confiance</div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    throw error;
  }
};

// Fonction pour partager le PDF
export const sharePDF = async (pdfUri: string) => {
  try {
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Partager le devis'
      });
    } else {
      alert('Le partage n\'est pas disponible sur cet appareil');
    }
  } catch (error) {
    console.error('Erreur partage PDF:', error);
    throw error;
  }
};

// Fonction pour l'aperçu du devis (sans signature)
export const previewPDF = async (devisData: DevisData): Promise<string> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Aperçu Devis ${devisData.number}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          padding: 20px;
          background: #fff;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #2e7d32; 
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h1 {
          color: #2e7d32;
          margin: 0;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          gap: 20px;
        }
        .company-info, .client-info {
          flex: 1;
          padding: 15px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        .info-title {
          font-size: 16px;
          font-weight: bold;
          color: #2e7d32;
          margin-bottom: 10px;
          border-bottom: 1px solid #2e7d32;
          padding-bottom: 5px;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 10px; 
          text-align: left; 
        }
        th { 
          background: #2e7d32; 
          color: white; 
        }
        .text-right {
          text-align: right;
        }
        .total { 
          text-align: right; 
          margin-top: 20px;
          padding-top: 10px;
          border-top: 2px solid #ddd;
        }
        .total-ttc {
          font-size: 18px;
          font-weight: bold;
          color: #2e7d32;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>APERÇU DEVIS</h1>
        <h2>N° ${devisData.number}</h2>
        <p>Date: ${new Date(devisData.createdAt).toLocaleDateString('fr-FR')}</p>
      </div>
      
      <div class="info-section">
        <div class="company-info">
          <div class="info-title">ENTREPRISE</div>
          <p><strong>${devisData.company.name}</strong></p>
          <p>${devisData.company.address}</p>
          <p>SIRET: ${devisData.company.siret}</p>
          <p>TVA: ${devisData.company.tva}%</p>
          <p>Tel: ${devisData.company.phone}</p>
          <p>Email: ${devisData.company.email}</p>
        </div>
        
        <div class="client-info">
          <div class="info-title">CLIENT</div>
          <p><strong>${devisData.client.name}</strong></p>
          <p>${devisData.client.address || 'Adresse non renseignée'}</p>
          <p>Tel: ${devisData.client.phone || 'Non renseigné'}</p>
          <p>Email: ${devisData.client.email || 'Non renseigné'}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Prestation</th>
            <th class="text-right">Quantité</th>
            <th class="text-right">Prix unitaire HT</th>
            <th class="text-right">Total HT</th>
          </tr>
        </thead>
        <tbody>
          ${devisData.prestations.map(p => `
            <tr>
              <td>${p.name}</td>
              <td class="text-right">${p.quantity}</td>
              <td class="text-right">${p.unitPrice.toFixed(2)} €</td>
              <td class="text-right">${p.total.toFixed(2)} €</td>
            </tr>
          `).join('')}
        </tbody>
       </table>
      
      <div class="total">
        <p><strong>Total HT: ${devisData.totalHT.toFixed(2)} €</strong></p>
        <p><strong>TVA (${devisData.company.tva}%): ${devisData.totalTVA.toFixed(2)} €</strong></p>
        <p class="total-ttc"><strong>Total TTC: ${devisData.totalTTC.toFixed(2)} €</strong></p>
      </div>
      
      ${devisData.notes ? `
        <div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;">
          <strong>Notes:</strong><br/>
          ${devisData.notes}
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Devis valable jusqu'au ${new Date(devisData.validUntil).toLocaleDateString('fr-FR')}</p>
        <p>Ceci est un aperçu. La signature sera ajoutée sur le devis final.</p>
      </div>
    </body>
    </html>
  `;
  
  const { uri } = await Print.printToFileAsync({ html });
  return uri;
};