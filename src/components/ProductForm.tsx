import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import type { Product } from "../context/ProductsContext";

interface Props {
  initial?: Partial<Product>;
  scannedCode?: string | null;
  onSubmit: (data: Omit<Product, "id"> | Product) => void;
  submitLabel?: string;
}

export default function ProductForm({
  initial,
  scannedCode,
  onSubmit,
  submitLabel = "Guardar",
}: Props) {
  const [code, setCode] = useState(initial?.code ?? scannedCode ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(String(initial?.price ?? ""));
  const [stock, setStock] = useState(String(initial?.stock ?? ""));

  useEffect(() => {
    if (scannedCode) setCode(scannedCode);
  }, [scannedCode]);

  const handleSubmit = () => {
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    if (
      Number.isNaN(parsedPrice) ||
      Number.isNaN(parsedStock) ||
      !code.trim() ||
      !name.trim()
    ) {
      // Validación mínima; las alertas globales se disparan desde el contexto al guardar
      return;
    }
    const payload: any = {
      code: code.trim(),
      name: name.trim(),
      price: parsedPrice,
      stock: parsedStock,
    };
    if (initial?.id) payload.id = initial.id;
    onSubmit(payload);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Código</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Escanear o escribir…"
      />

      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre del producto"
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
        placeholder="0"
      />

      <Text style={styles.label}>Stock</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
        placeholder="0"
      />

      <Pressable style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 10,
  },
  btn: {
    marginTop: 8,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
