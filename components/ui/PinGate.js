import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from "react-native";
import { getEmail, getPin, setEmail, setPin } from "../store/pinStore";
import { sendOtp, verifyOtp } from "../utils/api";


const SCREEN = {
  ENTER_PIN: "ENTER_PIN",       // default
  SETUP_PIN: "SETUP_PIN",       // first time
  FORGOT_PIN: "FORGOT_PIN",     // request OTP
  VERIFY_OTP: "VERIFY_OTP",     // enter OTP
  RESET_PIN: "RESET_PIN",       // set new PIN after OTP verified
  CHANGE_EMAIL: "CHANGE_EMAIL", // change recovery email
};

export default function PinGate({ onUnlocked }) {
  const [screen, setScreen] = useState(SCREEN.ENTER_PIN);
  const [pin, setLocalPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [email, setLocalEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState(false)

  useEffect(() => {
    async function init() {
      const storedPin = await getPin();
      const storedEmail = await getEmail();
      if (storedEmail) setRecoveryEmail(storedEmail);
      if (!storedPin) setScreen(SCREEN.SETUP_PIN);
    }
    init();
  }, []);

  function resetError() { setError(""); }

  // ── Setup PIN (first time) ──────────────────────────────
  async function handleSetup() {
    if (pin.length < 4) return setError("PIN must be at least 4 digits");
    if (!email) return setError("Recovery email is required");
    setLoading(true);
    await setPin(pin);
    await setEmail(email);
    setLoading(false);
    if(resetEmail) {
      setScreen(SCREEN.ENTER_PIN);
      setResetEmail(false)
      setPin("")
      return
    }

    onUnlocked();
  }

  // ── Enter PIN ───────────────────────────────────────────
  async function handleEnterPin() {
    const storedPin = await getPin();
    if (pin === storedPin) {
      onUnlocked();
    } else {
      setError("Incorrect PIN");
      setTimeout(() => {
        setError(null)
      }, 2000)
      
      setLocalPin("");
    }
  }

  // ── Forgot PIN — send OTP ───────────────────────────────
  async function handleSendOtp() {
    setLoading(true);
    resetError();
    const result = await sendOtp(recoveryEmail);
    setLoading(false);
    if (result.error) return setError(result.error);
    setScreen(SCREEN.VERIFY_OTP);
  }

  // ── Verify OTP ──────────────────────────────────────────
  async function handleVerifyOtp() {
    setLoading(true);
    resetError();
    const result = await verifyOtp(recoveryEmail, otp);
    setLoading(false);
    if (result.error) return setError(result.error);
    console.log("RESET: ", resetEmail);
    if (resetEmail) {
      setScreen(SCREEN.SETUP_PIN);
      return
    }

    setPin("");
    setOtp("");
    setScreen(SCREEN.ENTER_PIN);
  }

  // ── Reset PIN ───────────────────────────────────────────
  async function handleResetPin() {
    if (newPin.length < 4) return setError("PIN must be at least 4 digits");
    await setPin(newPin);
    onUnlocked();
  }

  // ── Change Email ────────────────────────────────────────
  async function handleChangeEmail() {
    if (!email) return setError("Email cannot be empty");
    setLoading(true);
    // Send OTP to new email to verify ownership
    const result = await sendOtp(email);
    setLoading(false);
    if (result.error) return setError(result.error);
    setRecoveryEmail(email);
    setScreen(SCREEN.VERIFY_OTP);
  }

  async function handleVerifyEmailChange() {
    setLoading(true);
    resetError();
    const result = await verifyOtp(recoveryEmail, otp);
    setLoading(false);
    if (result.error) return setError(result.error);
    await setEmail(recoveryEmail);
    setScreen(resetEmail? SCREEN.SETUP_PIN : SCREEN.ENTER_PIN);
    setResetEmail(false)
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {screen === SCREEN.SETUP_PIN && (
        <>
          <Text style={styles.title}>Set a PIN</Text>
          <Text style={styles.subtitle}>You&apos;ll use this to access hidden videos</Text>
          <Input keyboardType={"numeric"} placeholder="····" value={pin} onChangeText={setLocalPin} maxLength={4} secureTextEntry />
          <Input placeholder="Recovery email" value={email} onChangeText={setLocalEmail} keyboardType="email-address" type="email"/>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Set PIN" onPress={handleSetup} loading={loading} />
        </>
      )}

      {screen === SCREEN.ENTER_PIN && (
        <>
          <Text style={styles.title}>Enter PIN</Text>
          <Input placeholder="····" value={pin} keyboardType={"numeric"} onChangeText={setLocalPin} maxLength={4} secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Unlock" onPress={handleEnterPin} />
          <Pressable onPress={() => setScreen(SCREEN.FORGOT_PIN)}>
            <Text style={styles.link}>Forgot PIN?</Text>
          </Pressable>
            <Pressable onPress={() => {
              setResetEmail(true)
              setScreen(SCREEN.CHANGE_EMAIL)  
            }}>
            <Text style={styles.link}>Change recovery email</Text>
          </Pressable>
        </>
      )}

      {screen === SCREEN.FORGOT_PIN && (
        <>
          <Text style={styles.title}>Reset PIN</Text>
          <Text style={styles.subtitle}>
            We&apos;ll send an OTP to{" "}
            <Text style={styles.bold}>{recoveryEmail}</Text>
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Send OTP" onPress={handleSendOtp} loading={loading} />
          <Pressable onPress={() => setScreen(SCREEN.ENTER_PIN)}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
        </>
      )}

      {screen === SCREEN.VERIFY_OTP && (
        <>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>Check your email for the 4-digit code</Text>
          <Input placeholder="0000" value={otp} onChangeText={setOtp} keyboardType="numeric" maxLength={4} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            label="Verify"
            onPress={handleVerifyOtp}
            loading={loading}
            />
        </>
      )}

      {screen === SCREEN.RESET_PIN && (
        <>
          <Text style={styles.title}>New PIN</Text>
          <Input placeholder="Enter new PIN" value={newPin} maxLength={4}  onChangeText={setNewPin} secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Save PIN" onPress={handleResetPin} />
        </>
      )}

      {screen === SCREEN.CHANGE_EMAIL && (
        <>
          <Text style={styles.title}>Change Email</Text>
          <Text style={styles.subtitle}>
            We&apos;ll send an OTP to{" "}
            <Text style={styles.bold}>{recoveryEmail}</Text>
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button label="Send OTP" onPress={handleSendOtp} loading={loading} />
            <Pressable onPress={() => {
              setScreen(SCREEN.ENTER_PIN)
            }}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  </KeyboardAvoidingView>
  );
}

// ── Reusable sub-components ──────────────────────────────
function Input({ placeholder, value, onChangeText, secureTextEntry, keyboardType, maxLength,type}) {
  return (
    <TextInput
      style={type === "email" ? [{ ...styles.input }, {fontSize:15,letterSpacing:0}]:styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize="none"
    />
  );
}

function Button({ label, onPress, loading }) {
  return (
    <Pressable style={styles.btn} onPress={onPress} disabled={loading}>
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.btnText}>{label}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center" },
  bold: { fontWeight: "bold", color: "#000" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12, width: "100%",
    textAlign: "center",
    fontSize: 24,
    letterSpacing: 8
  },
  error: { color: "red", fontSize: 13 },
  btn: {
    backgroundColor: "#000", padding: 14,
    borderRadius: 8, width:"100%", alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#007AFF", marginTop: 4 },
});