import { auth, db } from "@/FirebaseConfig";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const palette = {
    bg: "rgba(180, 180, 180, 0.35)",
    glassBg: "rgba(255, 255, 255, 0.4)",
    border: "rgba(0, 0, 0, 0.1)",
    text: "#222222",
    sub: "#555555",
    inputBg: "rgba(255, 255, 255, 0.6)",
    inputText: "#111111",
    primary: "#9C27B0",
    primaryText: "#FFFFFF",
    link: "#7E22CE",
  };

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(1, {
      duration: 700,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  async function ensureUserDoc(
    uid: string,
    defaults?: Partial<Record<string, any>>
  ) {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const fallbackUsername =
        email && email.includes("@") ? `@${email.split("@")[0]}` : "@user";
      await setDoc(ref, {
        uid,
        email: email || null,
        name: defaults?.name ?? null,
        username: defaults?.username ?? fallbackUsername,
        username_lower: (defaults?.username ?? fallbackUsername).toLowerCase(),
        theme: defaults?.theme ?? "system",
        photoURL: defaults?.photoURL ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const handleAuth = async () => {
    try {
      if (mode === "login") {
        const cred = await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        await ensureUserDoc(cred.user.uid);
      } else {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
        if (name.trim())
          await updateProfile(cred.user, { displayName: name.trim() });
        await ensureUserDoc(cred.user.uid, {
          name: name.trim() || null,
          theme: "system",
        });
      }
      router.replace("/(tabs)/homefeed");
    } catch (err: any) {
      alert(err?.message ?? "Authentication error");
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        <Image
          source={require("@/assets/images/ChumLogo.webp")}
          style={styles.logo}
        />
        <Text style={[styles.brand, { color: palette.text }]}>Chum Bucket</Text>
        <Text style={[styles.subtitle, { color: palette.sub }]}>
          Your recipe collection
        </Text>

        <Animated.View style={[styles.overlay, animatedStyle]}>
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 25 },
            ]}
          />
          <BlurView
            intensity={100}
            tint="light"
            style={[styles.glass, { backgroundColor: palette.glassBg }]}
          >
            <Text style={[styles.title, { color: palette.text }]}>
              {mode === "login" ? "Sign In" : "Sign Up"}
            </Text>

            {mode === "signup" && (
              <TextInput
                placeholder="Your name"
                placeholderTextColor={palette.sub}
                style={[
                  styles.input,
                  {
                    backgroundColor: palette.inputBg,
                    color: palette.inputText,
                  },
                ]}
                value={name}
                onChangeText={setName}
              />
            )}

            <TextInput
              placeholder="Email"
              placeholderTextColor={palette.sub}
              style={[
                styles.input,
                { backgroundColor: palette.inputBg, color: palette.inputText },
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor={palette.sub}
              style={[
                styles.input,
                { backgroundColor: palette.inputBg, color: palette.inputText },
              ]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.primary }]}
              onPress={handleAuth}
            >
              <Text style={[styles.buttonText, { color: palette.primaryText }]}>
                {mode === "login" ? "Sign In" : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setMode((m) => (m === "login" ? "signup" : "login"))
              }
            >
              <Text style={[styles.switchText, { color: palette.link }]}>
                {mode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  inner: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 130, height: 130, borderRadius: 25, marginBottom: 10 },
  brand: { fontSize: 28, fontWeight: "bold" },
  subtitle: { marginBottom: 25 },
  overlay: {
    width: "88%",
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  glass: {
    width: "100%",
    borderRadius: 25,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { fontWeight: "600", fontSize: 16 },
  switchText: { fontSize: 14, textDecorationLine: "underline" },
});
