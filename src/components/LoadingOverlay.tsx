import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

export default function LoadingOverlay({
  message = "Cargando...",
}: {
  message: string;
}) {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  text: { color: colors.text, fontWeight: "700" },
});
