import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, ProgressBar, useTheme } from 'react-native-paper';

export default function DashboardScreen() {
  const theme = useTheme();

  // Données temporaires pour tester l'affichage
  const stats = {
    ca: 45780,
    devisEnCours: 12,
    devisASigner: 5,
    devisARelancer: 3,
    tauxAcceptation: 78.5,
    chiffreAffairesMois: 12350
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Tableau de bord</Title>
        <Text style={styles.subtitle}>Bonjour professionnel BTP</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Chiffre d'affaires</Title>
          <Text style={styles.caText}>{stats.ca.toLocaleString('fr-FR')} €</Text>
          <Text>Ce mois-ci: {stats.chiffreAffairesMois.toLocaleString('fr-FR')} €</Text>
        </Card.Content>
      </Card>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.devisEnCours}</Title>
            <Text>Devis en cours</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.devisASigner}</Title>
            <Text>À signer</Text>
          </Card.Content>
        </Card>
        
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statNumber}>{stats.devisARelancer}</Title>
            <Text>À relancer</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Taux d'acceptation</Title>
          <ProgressBar progress={stats.tauxAcceptation / 100} color={theme.colors.primary} style={styles.progressBar} />
          <Text style={styles.tauxText}>{stats.tauxAcceptation}%</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  card: {
    margin: 15,
    marginTop: 0,
    elevation: 4,
  },
  caText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    marginVertical: 10,
  },
  tauxText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});