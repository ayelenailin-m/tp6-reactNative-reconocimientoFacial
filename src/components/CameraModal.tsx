import React, { useRef, useState } from "react";
import {
  Modal,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { CameraView, CameraType } from "expo-camera";
import { colors } from "../theme/colors";

type Props = {
  visible: boolean;
  facing?: CameraType;
  onClose: () => void;
  onCapture: (uri: string) => void;
};

export default function CameraModal({
  visible,
  facing = "front",
  onClose,
  onCapture,
}: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [currentFacing, setCurrentFacing] = useState<CameraType>(facing);
  const [ready, setReady] = useState(false);

  const handleCapture = async () => {
    if (!ready || !cameraRef.current) return;
    try {
      const pic = await cameraRef.current.takePictureAsync();
      onCapture(pic.uri);
    } catch (e) {
      console.warn("Error capturando foto:", e);
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalRoot}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={currentFacing}
          onCameraReady={() => setReady(true)}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() =>
                setCurrentFacing((prev) =>
                  prev === "front" ? "back" : "front"
                )
              }
            >
              <Text style={styles.smallButtonText}>↺ Cambiar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={handleCapture}
            >
              <Text style={styles.captureText}>Capturar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.smallButton} onPress={onClose}>
              <Text style={styles.smallButtonText}>✕ Cerrar</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1, backgroundColor: "black" },
  camera: { flex: 1 },
  overlay: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  smallButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  smallButtonText: { color: colors.text, fontWeight: "700" },
  captureButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 999,
  },
  captureText: { color: colors.text, fontWeight: "800", fontSize: 16 },
});
