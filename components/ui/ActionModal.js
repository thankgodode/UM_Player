// components/HideLoadingModal.jsx
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";

export function HideLoadingModal({ visible, count, label }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.title}>{label} {count} video{count > 1 ? "s" : ""}...</Text>
          <Text style={styles.subtitle}>Please wait, do not close the app</Text>
        </View>
      </View>
    </Modal>
  );
}

export function DeleteModal({ visible, count, onConfirm, onCancel, deleting,type }) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          {deleting ? (
            // 👇 show loading state after user confirms
            <>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.title}>
                Deleting {count} file{count > 1 ? "s" : ""}...
              </Text>
              <Text style={styles.subtitle}>
                Please wait, do not close the app
              </Text>
            </>
          ) : (
            // 👇 show confirmation prompt first
            <>
                {type === "folder" ?
                  <Text style={styles.title}>
                    Are you sure you want to delete this folder?
                  </Text>
                  :
                  <Text style={styles.title}>Delete {count} file{count > 1 ? "s" : ""}?</Text>
                }
                {type === "folder" ?
                  <Text style={styles.subtitle}>
                    Videos and every other files in this folder will be deleted.
                  </Text>
                  :
                  <Text style={styles.subtitle}>
                    This action is permanent and cannot be undone.
                  </Text>
                }
              <View style={styles.buttons}>
                <Pressable style={styles.cancelBtn} onPress={onCancel}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={onConfirm}>
                  <Text style={styles.deleteText}>Delete</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    gap: 12,
    width: 280,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: "#aaa",
    fontSize: 13,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "600",
  },
  deleteBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#e53935",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  // overlay: {
  //   flex: 1,
  //   backgroundColor: "rgba(0,0,0,0.6)",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // box: {
  //   backgroundColor: "#222",
  //   borderRadius: 16,
  //   padding: 32,
  //   alignItems: "center",
  //   gap: 12,
  //   width: 260,
  // },
  // title: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  // },
  // subtitle: {
  //   color: "#aaa",
  //   fontSize: 13,
  //   textAlign: "center",
  // },
});
