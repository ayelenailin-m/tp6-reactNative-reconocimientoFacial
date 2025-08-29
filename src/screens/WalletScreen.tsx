import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  photoUri: string | null;
  onLogout: () => void;
};

export default function WalletScreen({ photoUri, onLogout }: Props) {
  const [balance, setBalance] = useState<number>(12800500);

  const addFunds = () => setBalance((b) => b + 1000000);
  const paySample = () => setBalance((b) => Math.max(0, b - 50000));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]} />
        )}
        <View>
          <Text style={styles.title}>Bienvenido a tu cuenta</Text>
          <Text style={styles.subtitle}> Administrá tus fondos</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Saldo</Text>
        <Text style={styles.cardValue}>${balance.toLocaleString("es-AR")}</Text>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.action} onPress={addFunds}>
          <Text style={styles.actionText}>Recargar $1.000.000</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={paySample}>
          <Text style={styles.actionText}>Pagar $50.000</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>

      <Text style={styles.footnote}>*Ojalá, así pagaría mis deudas.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarFallback: { backgroundColor: colors.surface2 },
  title: { color: colors.text, fontSize: 22, fontWeight: "800" },
  subtitle: { color: colors.textMuted, fontSize: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardLabel: { color: colors.textSecondary, fontSize: 12 },
  cardValue: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    marginTop: 6,
  },
  row: { flexDirection: "row", gap: 12 },
  action: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  actionText: { color: colors.text, fontWeight: "800" },
  logout: {
    marginTop: 14,
    backgroundColor: colors.surface2,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  logoutText: { color: colors.text, fontWeight: "700" },
  footnote: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },
});
