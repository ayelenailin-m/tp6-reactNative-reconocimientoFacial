import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCameraPermissions } from "expo-camera";
import CameraModal from "../components/CameraModal";
import LoadingOverlay from "../components/LoadingOverlay";
import { colors } from "../theme/colors";
import { registerFace } from "../services/api";
import { setFaceRegistered, setUserCUIL } from "../services/storage";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "RegisterFace">;

export default function RegisterFaceScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [open, setOpen] = useState(false);
  const [cuil, setCuil] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const openCamera = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setOpen(true);
  };

  const submitRegister = async () => {
    if (!cuil.trim()) {
      Alert.alert(
        "CUIL requerido",
        "Ingresá tu CUIL para asociarlo al rostro."
      );
      return;
    }
    if (!photo) {
      Alert.alert("Foto requerida", "Capturá tu rostro antes de registrar.");
      return;
    }
    setLoading(true);
    try {
      const resp = await registerFace(cuil.trim(), photo);
      // acá asumo que el endpoint devuelve success:true si salió todo ok
      if (resp?.success === false)
        throw new Error("El servidor no confirmó el registro.");

      // marco en storage que ya registré rostro y guardo el CUIL
      await setFaceRegistered(true);
      await setUserCUIL(cuil.trim());

      Alert.alert("Listo", "Rostro registrado correctamente.");
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "No se pudo registrar el rostro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay message="Subiendo foto..." />}
      <Text style={styles.title}>Registro Facial</Text>
      <Text style={styles.subtitle}>
        Capturo mi rostro y lo asocio a mi CUIL
      </Text>

      <TextInput
        placeholder="CUIL"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={cuil}
        onChangeText={setCuil}
        keyboardType="number-pad"
      />

      <TouchableOpacity style={styles.primaryButton} onPress={openCamera}>
        <Text style={styles.primaryButtonText}>
          {photo ? "Re-capturar" : "Registrar rostro"}
        </Text>
      </TouchableOpacity>

      {photo && <Image source={{ uri: photo }} style={styles.preview} />}

      <View style={{ height: 12 }} />
      <TouchableOpacity
        style={[styles.secondaryButton, !photo && { opacity: 0.6 }]}
        onPress={submitRegister}
        disabled={!photo}
      >
        <Text style={styles.secondaryButtonText}>Enviar registro</Text>
      </TouchableOpacity>

      <CameraModal
        visible={open}
        facing="front"
        onClose={() => setOpen(false)}
        onCapture={(uri) => {
          setPhoto(uri); // dejo la foto en preview
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
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
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
