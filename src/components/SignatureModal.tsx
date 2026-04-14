import React, { useRef, useState } from 'react';
import { View, StyleSheet, Modal, Dimensions, TouchableOpacity } from 'react-native';
import { Button, Text, Portal } from 'react-native-paper';
import SignatureScreen from 'react-native-signature-canvas';

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
}

export default function SignatureModal({ visible, onClose, onSave }: SignatureModalProps) {
  const signatureRef = useRef<any>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleOK = (signature: string) => {
    setSignatureData(signature);
    onSave(signature);
    onClose();
  };

  const handleClear = () => {
    if (signatureRef.current) {
      signatureRef.current.clearSignature();
    }
    setSignatureData(null);
  };

  const style = `
    .m-signature-pad {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      box-shadow: none;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }
    .m-signature-pad--body {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 40px;
      width: 100%;
      height: auto;
      border: none;
    }
    .m-signature-pad--body canvas {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
    .m-signature-pad--footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      background: #f5f5f5;
    }
    .btn {
      background-color: #2e7d32;
      color: white;
      border: none;
      padding: 5px 15px;
      margin: 5px;
      border-radius: 5px;
      font-size: 14px;
    }
    .btn-clear {
      background-color: #f44336;
    }
    .description {
      display: none;
    }
  `;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Signature électronique</Text>
          <Text style={styles.subtitle}>Signez dans le cadre ci-dessous</Text>
          
          <View style={styles.signatureContainer}>
            <SignatureScreen
              ref={signatureRef}
              onOK={handleOK}
              onEmpty={() => console.log('empty')}
              descriptionText=""
              clearText="Effacer"
              confirmText="Valider"
              webStyle={style}
              autoClear={false}
              imageType="image/png"
              backgroundColor="#ffffff"
              penColor="#000000"
              minWidth={2}
              maxWidth={4}
            />
          </View>
          
          <View style={styles.buttonsContainer}>
            <Button mode="outlined" onPress={onClose} style={styles.cancelButton}>
              Annuler
            </Button>
            <Button mode="contained" onPress={() => signatureRef.current?.readSignature()} style={styles.validateButton}>
              Valider la signature
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '95%',
    height: '85%',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  signatureContainer: {
    flex: 1,
    width: '100%',
    minHeight: 350,
    marginBottom: 15,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
  },
  validateButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: '#2e7d32',
  },
});