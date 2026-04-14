import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, Divider } from 'react-native-paper';

export default function SettingsScreen() {
  const [company, setCompany] = useState({
    name: '',
    siret: '',
    tva: '20',
    address: '',
    phone: '',
    email: '',
    logo: ''
  });

  const saveSettings = () => {
    if (!company.name) {
      Alert.alert('Erreur', 'Veuillez entrer le nom de votre entreprise');
      return;
    }
    Alert.alert('Succès', 'Informations sauvegardées');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Informations de l'entreprise</Title>
          <Text style={styles.subtitle}>Ces informations apparaîtront sur vos devis</Text>
          
          <TextInput
            label="Nom de l'entreprise *"
            value={company.name}
            onChangeText={text => setCompany({ ...company, name: text })}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Numéro SIRET"
            value={company.siret}
            onChangeText={text => setCompany({ ...company, siret: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TextInput
            label="TVA (%)"
            value={company.tva}
            onChangeText={text => setCompany({ ...company, tva: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
          
          <TextInput
            label="Adresse"
            value={company.address}
            onChangeText={text => setCompany({ ...company, address: text })}
            mode="outlined"
            style={styles.input}
            multiline
          />
          
          <TextInput
            label="Téléphone"
            value={company.phone}
            onChangeText={text => setCompany({ ...company, phone: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Email"
            value={company.email}
            onChangeText={text => setCompany({ ...company, email: text })}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Paramètres des devis</Title>
          
          <TextInput
            label="Numéro de devis suivant"
            value="DEV-2026-001"
            mode="outlined"
            style={styles.input}
            editable={false}
          />
          
          <TextInput
            label="Délai de validité (jours)"
            value="30"
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>À propos</Title>
          <Text style={styles.aboutText}>BTP Devis Pro</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Divider style={styles.divider} />
          <Text style={styles.copyright}>© 2024 - Application de devis pour professionnels du BTP</Text>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={saveSettings} style={styles.saveButton}>
        Sauvegarder les informations
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 4,
  },
  subtitle: {
    color: '#666',
    marginBottom: 15,
    fontSize: 12,
  },
  input: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    margin: 15,
    marginTop: 0,
    marginBottom: 30,
    backgroundColor: '#2e7d32',
  },
  aboutText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  versionText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 15,
  },
  copyright: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
});