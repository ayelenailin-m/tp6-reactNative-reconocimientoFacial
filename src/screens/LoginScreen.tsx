import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraModal from "../components/CameraModal";
import { colors } from "../theme/colors";

type Props = {
  onSuccess: (photoUri: string | null) => void;
};

export default function LoginScreen({ onSuccess }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [open, setOpen] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const openCamera = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.subtitle}>
        Escanea tu cara para ingresar a tu cuenta
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
        <Text style={styles.primaryButtonText}>Escanear</Text>
      </TouchableOpacity>

      {previewUri && (
        <Image source={{ uri: previewUri }} style={styles.preview} />
      )}

      <CameraModal
        visible={open}
        facing="front"
        onClose={() => setOpen(false)}
        onCapture={(uri) => {
          setPreviewUri(uri); // vista previa
          setOpen(false);
          onSuccess(uri); // autenticación simulada
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg_login,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 18,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  primaryButtonText: { color: colors.text, fontWeight: "700", fontSize: 16 },
  preview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
