import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, IconButton, Dialog, Portal, Provider } from 'react-native-paper';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function ClientsScreen() {
  const [clients, setClients] = useState<Client[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const addClient = () => {
    if (!newClient.name) {
      Alert.alert('Erreur', 'Veuillez entrer le nom du client');
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      ...newClient
    };

    setClients([...clients, client]);
    setNewClient({ name: '', email: '', phone: '', address: '' });
    setDialogVisible(false);
    Alert.alert('Succès', 'Client ajouté avec succès');
  };

  const deleteClient = (id: string) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer ce client ?',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui', 
          onPress: () => {
            setClients(clients.filter(c => c.id !== id));
            Alert.alert('Succès', 'Client supprimé');
          }
        }
      ]
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.title}>Clients</Title>
          <Button mode="contained" onPress={() => setDialogVisible(true)} icon="plus" style={styles.addButton}>
            Ajouter
          </Button>
        </View>

        <ScrollView>
          {clients.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>Aucun client pour le moment</Text>
                <Text style={styles.emptySubtext}>Appuyez sur "Ajouter" pour créer votre premier client</Text>
              </Card.Content>
            </Card>
          ) : (
            clients.map(client => (
              <Card key={client.id} style={styles.clientCard}>
                <Card.Content>
                  <View style={styles.clientHeader}>
                    <Title style={styles.clientName}>{client.name}</Title>
                    <IconButton icon="delete" size={20} onPress={() => deleteClient(client.id)} />
                  </View>
                  <Text style={styles.clientInfo}>📧 {client.email || 'Non renseigné'}</Text>
                  <Text style={styles.clientInfo}>📞 {client.phone || 'Non renseigné'}</Text>
                  <Text style={styles.clientInfo}>📍 {client.address || 'Non renseigné'}</Text>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
            <Dialog.Title>Nouveau client</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nom *"
                value={newClient.name}
                onChangeText={text => setNewClient({ ...newClient, name: text })}
                mode="outlined"
                style={styles.dialogInput}
              />
              <TextInput
                label="Email"
                value={newClient.email}
                onChangeText={text => setNewClient({ ...newClient, email: text })}
                mode="outlined"
                style={styles.dialogInput}
                keyboardType="email-address"
              />
              <TextInput
                label="Téléphone"
                value={newClient.phone}
                onChangeText={text => setNewClient({ ...newClient, phone: text })}
                mode="outlined"
                style={styles.dialogInput}
                keyboardType="phone-pad"
              />
              <TextInput
                label="Adresse"
                value={newClient.address}
                onChangeText={text => setNewClient({ ...newClient, address: text })}
                mode="outlined"
                style={styles.dialogInput}
                multiline
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
              <Button onPress={addClient}>Ajouter</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#2e7d32',
  },
  clientCard: {
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
    elevation: 2,
  },
  clientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clientInfo: {
    marginTop: 5,
    color: '#666',
  },
  emptyCard: {
    margin: 15,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 10,
  },
  dialogInput: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
});