import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";

interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
}

export default function ScannerSheet({ visible, onClose, onScanned }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      // Evitar múltiples lecturas
      if (!isScanning) return;
      setIsScanning(false);
      try {
        const code = result.data?.trim();
        if (code) {
          onScanned(code);
        }
      } finally {
        // cerrar después de un pequeño delay
        setTimeout(() => {
          setIsScanning(true);
          onClose();
        }, 400);
      }
    },
    [isScanning, onClose, onScanned]
  );

  if (!permission) return null;

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.centered}>
          <Text style={styles.title}>Se requiere permiso de cámara</Text>
          <Pressable style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Conceder permiso</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={onClose}>
            <Text style={styles.btnOutlineText}>Cancelar</Text>
          </Pressable>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{
            // Tipos comunes: QR, Code128, EAN_13, EAN_8, UPC_A, UPC_E, etc.
            barcodeTypes: ["qr", "ean13", "code128", "upc_a", "upc_e", "ean8"],
          }}
          onBarcodeScanned={handleBarcodeScanned}
        />

        {!isScanning && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 8, color: "#fff" }}>Procesando…</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Pressable style={styles.btn} onPress={onClose}>
            <Text style={styles.btnText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  btn: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  btnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#111827",
  },
  btnOutlineText: { color: "#111827", fontWeight: "600" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
});
