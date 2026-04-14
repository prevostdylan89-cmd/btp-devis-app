import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, IconButton, Dialog, Portal, Provider, Chip } from 'react-native-paper';

interface Prestation {
  id: string;
  name: string;
  description: string;
  price: number;
  hourlyRate: number;
  category: string;
}

export default function PrestationsScreen() {
  const [prestations, setPrestations] = useState<Prestation[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newPrestation, setNewPrestation] = useState({
    name: '',
    description: '',
    price: '',
    hourlyRate: '',
    category: 'Prestation'
  });

  const addPrestation = () => {
    if (!newPrestation.name || !newPrestation.price) {
      Alert.alert('Erreur', 'Veuillez remplir le nom et le prix');
      return;
    }

    const prestation: Prestation = {
      id: Date.now().toString(),
      name: newPrestation.name,
      description: newPrestation.description,
      price: parseFloat(newPrestation.price),
      hourlyRate: parseFloat(newPrestation.hourlyRate) || 0,
      category: newPrestation.category
    };

    setPrestations([...prestations, prestation]);
    setNewPrestation({ name: '', description: '', price: '', hourlyRate: '', category: 'Prestation' });
    setDialogVisible(false);
    Alert.alert('Succès', 'Prestation ajoutée');
  };

  const deletePrestation = (id: string) => {
    Alert.alert(
      'Supprimer',
      'Voulez-vous vraiment supprimer cette prestation ?',
      [
        { text: 'Non', style: 'cancel' },
        { 
          text: 'Oui', 
          onPress: () => {
            setPrestations(prestations.filter(p => p.id !== id));
            Alert.alert('Succès', 'Prestation supprimée');
          }
        }
      ]
    );
  };

  const categories = ['Prestation', 'Main d\'œuvre', 'Matériel', 'Transport', 'Forfait'];

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Title style={styles.title}>Prestations</Title>
          <Button mode="contained" onPress={() => setDialogVisible(true)} icon="plus" style={styles.addButton}>
            Ajouter
          </Button>
        </View>

        <ScrollView>
          {prestations.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>Aucune prestation pour le moment</Text>
                <Text style={styles.emptySubtext}>Ajoutez vos prestations pour les retrouver dans les devis</Text>
              </Card.Content>
            </Card>
          ) : (
            prestations.map(prestation => (
              <Card key={prestation.id} style={styles.prestationCard}>
                <Card.Content>
                  <View style={styles.prestationHeader}>
                    <View style={styles.prestationTitle}>
                      <Title style={styles.prestationName}>{prestation.name}</Title>
                      <Chip style={styles.categoryChip}>{prestation.category}</Chip>
                    </View>
                    <IconButton icon="delete" size={20} onPress={() => deletePrestation(prestation.id)} />
                  </View>
                  {prestation.description ? (
                    <Text style={styles.description}>{prestation.description}</Text>
                  ) : null}
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Prix: </Text>
                    <Text style={styles.priceValue}>{prestation.price.toLocaleString('fr-FR')} €</Text>
                    {prestation.hourlyRate > 0 && (
                      <Text style={styles.hourlyRate}> | Taux horaire: {prestation.hourlyRate} €/h</Text>
                    )}
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </ScrollView>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} scrollable>
            <Dialog.Title>Nouvelle prestation</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Nom *"
                value={newPrestation.name}
                onChangeText={text => setNewPrestation({ ...newPrestation, name: text })}
                mode="outlined"
                style={styles.dialogInput}
              />
              <TextInput
                label="Description"
                value={newPrestation.description}
                onChangeText={text => setNewPrestation({ ...newPrestation, description: text })}
                mode="outlined"
                style={styles.dialogInput}
                multiline
              />
              <TextInput
                label="Prix HT *"
                value={newPrestation.price}
                onChangeText={text => setNewPrestation({ ...newPrestation, price: text })}
                mode="outlined"
                style={styles.dialogInput}
                keyboardType="numeric"
              />
              <TextInput
                label="Taux horaire (optionnel)"
                value={newPrestation.hourlyRate}
                onChangeText={text => setNewPrestation({ ...newPrestation, hourlyRate: text })}
                mode="outlined"
                style={styles.dialogInput}
                keyboardType="numeric"
              />
              <Text style={styles.categoryLabel}>Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                {categories.map(cat => (
                  <Chip
                    key={cat}
                    selected={newPrestation.category === cat}
                    onPress={() => setNewPrestation({ ...newPrestation, category: cat })}
                    style={styles.categoryChipSelect}
                  >
                    {cat}
                  </Chip>
                ))}
              </ScrollView>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDialogVisible(false)}>Annuler</Button>
              <Button onPress={addPrestation}>Ajouter</Button>
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
  prestationCard: {
    margin: 15,
    marginTop: 0,
    marginBottom: 10,
    elevation: 2,
  },
  prestationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  prestationTitle: {
    flex: 1,
  },
  prestationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 5,
    backgroundColor: '#e8f5e9',
  },
  description: {
    marginTop: 10,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'baseline',
  },
  priceLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  hourlyRate: {
    color: '#666',
    fontSize: 12,
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
  categoryLabel: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  categoryChipSelect: {
    marginRight: 8,
  },
});