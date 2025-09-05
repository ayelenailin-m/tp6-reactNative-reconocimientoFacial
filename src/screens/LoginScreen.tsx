import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { getUserCUIL } from "../services/storage";
import type { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [cuil, setCuil] = useState("");

  // dejo precargado el CUIL si lo tengo guardado de un registro previo
  useEffect(() => {
    getUserCUIL().then((v) => v && setCuil(v));
  }, []);

  const goToFaceLogin = () => {
    if (!cuil.trim()) return;
    navigation.navigate("RecognizeFace", { cuil: cuil.trim() });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso</Text>
      <Text style={styles.subtitle}>Ingresá tu CUIL para continuar</Text>

      <TextInput
        placeholder="CUIL"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        value={cuil}
        onChangeText={setCuil}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={goToFaceLogin}
        disabled={!cuil.trim()}
      >
        <Text style={styles.primaryButtonText}>Ingresar con rostro</Text>
      </TouchableOpacity>

      <View style={{ height: 14 }} />

      <TouchableOpacity onPress={() => navigation.navigate("RegisterFace")}>
        <Text style={{ color: colors.primary, fontWeight: "700" }}>
          ¿Primera vez? Registrate escaneando tu rostro
        </Text>
      </TouchableOpacity>
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
});
