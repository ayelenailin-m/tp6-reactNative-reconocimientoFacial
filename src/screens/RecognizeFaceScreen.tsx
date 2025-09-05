import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCameraPermissions } from "expo-camera";
import CameraModal from "../components/CameraModal";
import LoadingOverlay from "../components/LoadingOverlay";
import { colors } from "../theme/colors";
import { recognizeFace } from "../services/api";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "RecognizeFace">;

export default function RecognizeFaceScreen({ navigation, route }: Props) {
  const cuilFromLogin = route.params?.cuil?.trim();
  const [permission, requestPermission] = useCameraPermissions();
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setOpen(true);
  };

  const submitRecognize = async () => {
    if (!photo)
      return Alert.alert("Foto requerida", "Capturá tu rostro para ingresar.");
    setLoading(true);
    try {
      const resp = await recognizeFace(photo);
      // esta API devuelve { matches: ["CUIL1","CUIL2",...] }
      const matches: string[] = Array.isArray(resp?.matches)
        ? resp.matches.map(String)
        : [];
      const ok = cuilFromLogin ? matches.includes(cuilFromLogin) : false;

      if (!ok) throw new Error("El rostro no coincide con el CUIL ingresado.");

      navigation.replace("Wallet", { photoUri: photo });
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo reconocer el rostro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay message="Validando rostro..." />}
      <Text style={styles.title}>Ingreso por Rostro</Text>
      <Text style={styles.subtitle}>
        Tomo una foto y la valido en el servicio
      </Text>

      <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
        <Text style={styles.primaryButtonText}>
          {photo ? "Re-capturar" : "Abrir cámara"}
        </Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.preview} />}

      <View style={{ height: 12 }} />
      <TouchableOpacity
        style={[styles.secondaryButton, !photo && { opacity: 0.6 }]}
        onPress={submitRecognize}
        disabled={!photo}
      >
        <Text style={styles.secondaryButtonText}>Ingresar</Text>
      </TouchableOpacity>

      <CameraModal
        visible={open}
        facing="front"
        onClose={() => setOpen(false)}
        onCapture={(uri) => {
          setPhoto(uri);
          setOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    justifyContent: "center",
  },
  title: { color: colors.text, fontSize: 26, fontWeight: "800" },
  subtitle: { color: colors.textMuted, marginBottom: 14 },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: { color: colors.text, fontWeight: "800" },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.border,
    padding: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryButtonText: { color: colors.text, fontWeight: "800" },
  preview: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: colors.primary,
    alignSelf: "center",
    marginTop: 12,
  },
});
