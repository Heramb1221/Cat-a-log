import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { colors, radii, spacing } from "@/constants/theme";

interface NameCatModalProps {
  visible: boolean;
  initialName?: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}

/**
 * Lightweight centered modal for naming a cat, matching the reference
 * video's "What's that cat's name?" prompt with Cancel/Save actions.
 */
export function NameCatModal({ visible, initialName, onCancel, onSave }: NameCatModalProps) {
  const [name, setName] = useState(initialName ?? "");

  const handleSave = () => {
    const trimmed = name.trim();
    onSave(trimmed);
    setName("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <View style={styles.sheet}>
          <Text style={styles.title}>What&apos;s that cat&apos;s name?</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter cat's name"
            placeholderTextColor={colors.inkSoft}
            style={styles.input}
            autoFocus
            maxLength={30}
            returnKeyType="done"
            onSubmitEditing={handleSave}
          />
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setName(initialName ?? "");
                onCancel();
              }}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(36, 31, 26, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  sheet: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.paper,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.ink,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radii.pill,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: colors.washiGray,
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  cancelText: {
    color: colors.ink,
    fontWeight: "600",
  },
  saveText: {
    color: colors.white,
    fontWeight: "600",
  },
});
