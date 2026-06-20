// SIGN UP SCREEN
// - Full name, email, password, confirm password inputs
// - Client-side password match validation before submit
// - Password strength indicator (length-based for MVP)
// - On success: creates profiles row, navigates to onboarding
// - Inline errors only — no alerts

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import PrimaryButton from "@/components/shared/PrimaryButton";
import LoadingDots from "@/components/shared/LoadingDots";

function passwordStrength(pw: string): { label: string; color: string } {
  if (pw.length === 0) return { label: "", color: "" };
  if (pw.length < 8) return { label: "Too short", color: "#D85A30" };
  if (pw.length < 12) return { label: "Fair", color: "#F59E0B" };
  return { label: "Strong", color: "#1D9E75" };
}

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const strength = passwordStrength(password);

  async function handleSignup() {
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (authError || !data.user) {
      setLoading(false);
      setError(authError?.message ?? "Sign up failed. Please try again.");
      return;
    }

    await supabase.from("profiles").insert({
      id: data.user.id,
      name: name.trim(),
    });

    setLoading(false);
    router.replace("/(onboarding)/goal");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16">
          <Text className="text-[22px] font-medium text-textPrimary mb-1">
            Create your account
          </Text>
          <Text className="text-base text-textSecondary mb-10">
            Start your health journey today
          </Text>

          {(["Full name", "Email"] as const).map((label) => (
            <View key={label} className="mb-4">
              <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
                {label}
              </Text>
              <TextInput
                className="bg-card border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary"
                value={label === "Full name" ? name : email}
                onChangeText={(t) => {
                  setError("");
                  label === "Full name" ? setName(t) : setEmail(t);
                }}
                keyboardType={label === "Email" ? "email-address" : "default"}
                autoCapitalize={label === "Email" ? "none" : "words"}
                autoCorrect={false}
                placeholder={label === "Full name" ? "Rahul Sharma" : "you@example.com"}
                placeholderTextColor="#6B6B6B"
              />
            </View>
          ))}

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
            Password
          </Text>
          <TextInput
            className="bg-card border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary mb-1"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
            secureTextEntry
            placeholder="Min. 8 characters"
            placeholderTextColor="#6B6B6B"
          />
          {strength.label ? (
            <Text className="text-xs mb-4" style={{ color: strength.color }}>
              {strength.label}
            </Text>
          ) : <View className="mb-4" />}

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
            Confirm password
          </Text>
          <TextInput
            className="bg-card border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary mb-6"
            value={confirm}
            onChangeText={(t) => { setConfirm(t); setError(""); }}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#6B6B6B"
          />

          {error ? (
            <Text className="text-sm text-comebackCoral mb-4">{error}</Text>
          ) : null}

          {loading ? (
            <LoadingDots />
          ) : (
            <PrimaryButton label="Create account" onPress={handleSignup} />
          )}

          <View className="flex-row justify-center mt-8">
            <Text className="text-base text-textSecondary">
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-base text-coachGreen font-medium">
                  Log in
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
