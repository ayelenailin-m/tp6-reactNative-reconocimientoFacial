import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useProducts, Product } from "../context/ProductsContext";
import ScannerSheet from "../components/ScannerSheet";
import ProductForm from "../components/ProductForm";

export default function AdminProductsScreen() {
  const { products, addProduct, updateProduct, deleteProduct, loading } =
    useProducts();

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleAddFromScan = async (payload: Omit<Product, "id">) => {
    try {
      await addProduct(payload);
      setScannedCode(null);
    } catch (e) {
      Alert.alert("Error", "No se pudo agregar el producto.");
    }
  };

  const handleUpdate = async (p: Product) => {
    try {
      await updateProduct(p);
      setEditing(null);
    } catch (e) {
      Alert.alert("Error", "No se pudo modificar el producto.");
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Eliminar este producto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteProduct(id),
      },
    ]);
  };

  const header = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.title}>Gestión de Productos</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable style={styles.btn} onPress={() => setScannerOpen(true)}>
            <Text style={styles.btnText}>Escanear + Agregar</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnSecondary]}
            onPress={() => setScannedCode("")}
          >
            <Text style={styles.btnText}>Agregar manual</Text>
          </Pressable>
        </View>

        {/* Agregar manual o desde escaneo muestra formulario inline */}
        {scannedCode !== null && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              {scannedCode
                ? `Código escaneado: ${scannedCode}`
                : "Nuevo producto (código manual)"}
            </Text>
            <ProductForm
              scannedCode={scannedCode}
              onSubmit={(data) =>
                handleAddFromScan(data as Omit<Product, "id">)
              }
              submitLabel="Agregar"
            />
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => setScannedCode(null)}
            >
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </Pressable>
          </View>
        )}
      </View>
    ),
    [scannedCode]
  );

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>Procesando…</Text>
        </View>
      )}

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>Código: {item.code}</Text>
              <Text style={styles.itemMeta}>
                Precio: ${item.price} • Stock: {item.stock}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                style={[styles.smallBtn, styles.editBtn]}
                onPress={() => setEditing(item)}
              >
                <Text style={styles.smallBtnText}>Editar</Text>
              </Pressable>
              <Pressable
                style={[styles.smallBtn, styles.delBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.smallBtnText}>Borrar</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Scanner */}
      <ScannerSheet
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScanned={(code) => {
          setScannedCode(code);
        }}
      />

      {/* Modal de edición */}
      <Modal
        visible={!!editing}
        transparent
        animationType="slide"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
              Editar producto
            </Text>
            {editing && (
              <ProductForm
                initial={editing}
                onSubmit={(data) => handleUpdate(data as Product)}
                submitLabel="Guardar cambios"
              />
            )}
            <Pressable
              style={[styles.btn, styles.btnGhost, { marginTop: 12 }]}
              onPress={() => setEditing(null)}
            >
              <Text style={styles.btnGhostText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, gap: 8, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "800" },
  btn: {
    backgroundColor: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  btnText: { color: "#fff", fontWeight: "700" },
  btnSecondary: { backgroundColor: "#2563eb" },
  btnGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#9ca3af",
  },
  btnGhostText: { color: "#111827", fontWeight: "700" },

  item: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  itemName: { fontSize: 16, fontWeight: "700" },
  itemMeta: { color: "#6b7280", marginTop: 2 },

  smallBtn: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  smallBtnText: { color: "#fff", fontWeight: "700" },
  editBtn: { backgroundColor: "#2563eb" },
  delBtn: { backgroundColor: "#dc2626" },

  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    zIndex: 2,
  },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
});
