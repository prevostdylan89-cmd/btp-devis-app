import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider, IconButton, Portal } from 'react-native-paper';
import SignatureModal from '../components/SignatureModal';
import { generatePDF, sharePDF, previewPDF } from '../services/pdfGenerator';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

interface PrestationItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CreateDevisScreen() {
  const [loading, setLoading] = useState(false);
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  
  const [company] = useState({
    name: 'SARL BTP PRO',
    siret: '123 456 789 00012',
    tva: '20',
    address: '12 Rue du Bâtiment, 75001 Paris',
    phone: '01 23 45 67 89',
    email: 'contact@btppro.fr'
  });
  
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [prestations, setPrestations] = useState<PrestationItem[]>([]);
  const [notes, setNotes] = useState('');
  const [newPrestationName, setNewPrestationName] = useState('');
  const [newPrestationPrice, setNewPrestationPrice] = useState('');
  const [newPrestationQuantity, setNewPrestationQuantity] = useState('1');

  const addPrestation = () => {
    if (!newPrestationName || !newPrestationPrice) {
      Alert.alert('Erreur', 'Veuillez remplir le nom et le prix');
      return;
    }

    const newPrestation: PrestationItem = {
      id: Date.now().toString(),
      name: newPrestationName,
      quantity: parseInt(newPrestationQuantity) || 1,
      price: parseFloat(newPrestationPrice)
    };

    setPrestations([...prestations, newPrestation]);
    setNewPrestationName('');
    setNewPrestationPrice('');
    setNewPrestationQuantity('1');
  };

  const removePrestation = (id: string) => {
    setPrestations(prestations.filter(p => p.id !== id));
  };

  const calculateTotals = () => {
    const totalHT = prestations.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const tvaRate = parseFloat(company.tva) / 100;
    const totalTVA = totalHT * tvaRate;
    const totalTTC = totalHT + totalTVA;
    return { totalHT, totalTVA, totalTTC };
  };

  const { totalHT, totalTVA, totalTTC } = calculateTotals();

  const generateDevisNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000);
    return `DEV-${year}${month}-${random}`;
  };

  // Fonction pour tester le PDF simple
  const testSimplePDF = async () => {
    setLoading(true);
    try {
      const testHtml = `
        <html>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="color: #2e7d32;">Test PDF</h1>
            <p>Ceci est un test de génération PDF.</p>
            <p>Si vous voyez ce message, le PDF fonctionne correctement !</p>
          </body>
        </html>
      `;
      
      const { uri } = await Print.printToFileAsync({ html: testHtml });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Partager le PDF de test'
      });
      
      Alert.alert('Succès', 'PDF de test généré et partagé !');
    } catch (error) {
      console.error('Erreur test:', error);
      Alert.alert('Erreur test', String(error));
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour l'aperçu du devis avec toutes les informations
  const previewDevis = async () => {
    if (!client.name) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du client');
      return;
    }
    
    if (prestations.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins une prestation');
      return;
    }

    setLoading(true);
    try {
      const devisData = {
        number: generateDevisNumber(),
        company,
        client,
        prestations: prestations.map(p => ({
          name: p.name,
          quantity: p.quantity,
          unitPrice: p.price,
          total: p.price * p.quantity
        })),
        totalHT,
        totalTVA,
        totalTTC,
        notes,
        signature: signature || '',
        signatureDate: signature ? new Date() : undefined,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };
      
      const pdfUri = await previewPDF(devisData);
      await sharePDF(pdfUri);
      Alert.alert('Succès', 'Aperçu du devis généré et partagé !');
    } catch (error) {
      console.error('Erreur aperçu:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la génération de l\'aperçu');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour créer et partager le devis complet avec signature
  const createAndShareDevis = async () => {
    if (!client.name) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du client');
      return;
    }
    
    if (prestations.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins une prestation');
      return;
    }
    
    if (!signature) {
      Alert.alert('Signature requise', 'Veuillez signer le devis');
      setSignatureVisible(true);
      return;
    }

    setLoading(true);

    try {
      const devisData = {
        number: generateDevisNumber(),
        company,
        client,
        prestations: prestations.map(p => ({
          name: p.name,
          quantity: p.quantity,
          unitPrice: p.price,
          total: p.price * p.quantity
        })),
        totalHT,
        totalTVA,
        totalTTC,
        notes,
        signature,
        signatureDate: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date()
      };

      const pdfUri = await generatePDF(devisData);
      await sharePDF(pdfUri);
      
      Alert.alert('Succès', 'Devis généré et partagé avec succès !');
      
      // Réinitialiser le formulaire
      setClient({ name: '', email: '', phone: '', address: '' });
      setPrestations([]);
      setNotes('');
      setSignature(null);
      
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Une erreur est survenue: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Génération du PDF en cours...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Informations entreprise */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Votre entreprise</Title>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyInfo}>SIRET: {company.siret}</Text>
            <Text style={styles.companyInfo}>TVA: {company.tva}%</Text>
          </Card.Content>
        </Card>

        {/* Informations client */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Informations client</Title>
            <TextInput
              label="Nom du client *"
              value={client.name}
              onChangeText={text => setClient({ ...client, name: text })}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={client.email}
              onChangeText={text => setClient({ ...client, email: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              label="Téléphone"
              value={client.phone}
              onChangeText={text => setClient({ ...client, phone: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
            <TextInput
              label="Adresse"
              value={client.address}
              onChangeText={text => setClient({ ...client, address: text })}
              mode="outlined"
              style={styles.input}
              multiline
            />
          </Card.Content>
        </Card>

        {/* Ajout prestations */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Ajouter une prestation</Title>
            <View style={styles.addPrestationContainer}>
              <TextInput
                label="Nom"
                value={newPrestationName}
                onChangeText={setNewPrestationName}
                mode="outlined"
                style={styles.prestationNameInput}
              />
              <TextInput
                label="Qté"
                value={newPrestationQuantity}
                onChangeText={setNewPrestationQuantity}
                mode="outlined"
                keyboardType="numeric"
                style={styles.prestationQuantityInput}
              />
              <TextInput
                label="Prix HT"
                value={newPrestationPrice}
                onChangeText={setNewPrestationPrice}
                mode="outlined"
                keyboardType="numeric"
                style={styles.prestationPriceInput}
              />
              <IconButton icon="plus" onPress={addPrestation} style={styles.addButton} />
            </View>
          </Card.Content>
        </Card>

        {/* Liste des prestations */}
        {prestations.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Prestations ajoutées</Title>
              {prestations.map(prestation => (
                <View key={prestation.id} style={styles.prestationItem}>
                  <View style={styles.prestationInfo}>
                    <Text style={styles.prestationName}>{prestation.name}</Text>
                    <Text style={styles.prestationDetails}>
                      {prestation.quantity} x {prestation.price.toLocaleString('fr-FR')} € = {(prestation.quantity * prestation.price).toLocaleString('fr-FR')} €
                    </Text>
                  </View>
                  <IconButton icon="delete" size={20} onPress={() => removePrestation(prestation.id)} />
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Récapitulatif */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Récapitulatif</Title>
            <View style={styles.totalLine}>
              <Text>Total HT:</Text>
              <Text style={styles.totalAmount}>{totalHT.toLocaleString('fr-FR')} €</Text>
            </View>
            <View style={styles.totalLine}>
              <Text>TVA ({company.tva}%):</Text>
              <Text>{totalTVA.toLocaleString('fr-FR')} €</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.totalLine}>
              <Text style={styles.totalText}>Total TTC:</Text>
              <Text style={styles.grandTotal}>{totalTTC.toLocaleString('fr-FR')} €</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Notes */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notes (optionnel)</Title>
            <TextInput
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              style={styles.notesInput}
              placeholder="Informations complémentaires..."
            />
          </Card.Content>
        </Card>

        {/* Signature */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Signature électronique</Title>
            {signature ? (
              <View style={styles.signaturePreview}>
                <Text style={styles.signatureSuccess}>✓ Signature ajoutée</Text>
                <Button mode="outlined" onPress={() => setSignatureVisible(true)} style={styles.resignButton}>
                  Modifier la signature
                </Button>
              </View>
            ) : (
              <Button mode="contained" onPress={() => setSignatureVisible(true)} style={styles.signButton}>
                Signer le devis
              </Button>
            )}
          </Card.Content>
        </Card>

        {/* SECTION DES BOUTONS - Tous les boutons sont ici */}
        
        {/* Bouton Tester le PDF */}
        <Button 
          mode="outlined" 
          onPress={testSimplePDF} 
          style={styles.testButton}
        >
          📄 Tester le PDF simple
        </Button>

        {/* Bouton Aperçu du devis */}
        <Button 
          mode="contained" 
          onPress={previewDevis} 
          style={styles.previewButton}
          buttonColor="#2196f3"
        >
          👁️ Aperçu du devis
        </Button>

        {/* Bouton Générer et partager */}
        <Button 
          mode="contained" 
          onPress={createAndShareDevis} 
          style={styles.createButton}
          disabled={!client.name || prestations.length === 0 || !signature}
        >
          ✓ Générer et partager le devis PDF
        </Button>
      </ScrollView>

      <Portal>
        <SignatureModal
          visible={signatureVisible}
          onClose={() => setSignatureVisible(false)}
          onSave={(sig) => setSignature(sig)}
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 4,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  addPrestationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  prestationNameInput: {
    flex: 3,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  prestationQuantityInput: {
    flex: 1,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  prestationPriceInput: {
    flex: 1,
    marginRight: 5,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  addButton: {
    marginBottom: 5,
  },
  prestationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  prestationInfo: {
    flex: 1,
  },
  prestationName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  prestationDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  divider: {
    marginVertical: 10,
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  grandTotal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  totalAmount: {
    fontWeight: 'bold',
  },
  notesInput: {
    backgroundColor: '#fff',
    minHeight: 100,
  },
  signButton: {
    backgroundColor: '#ff9800',
  },
  signaturePreview: {
    alignItems: 'center',
  },
  signatureSuccess: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resignButton: {
    marginTop: 5,
  },
  testButton: {
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
    borderColor: '#2e7d32',
  },
  previewButton: {
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
  },
  createButton: {
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
    backgroundColor: '#2e7d32',
  },
});