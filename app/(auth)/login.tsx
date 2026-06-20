// LOGIN SCREEN
// - Email + password inputs
// - Inline error display (no alerts)
// - Loading state on submit button
// - "Forgot password?" → supabase.auth.resetPasswordForEmail()
// - "Sign up" link → navigates to signup screen
// - On success → session check in _layout redirects to home or onboarding

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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (authError) {
      setError("Incorrect email or password. Please try again.");
    } else {
      router.replace("/");
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email address above, then tap Forgot password.");
      return;
    }
    await supabase.auth.resetPasswordForEmail(email.trim());
    setResetSent(true);
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
            Welcome back
          </Text>
          <Text className="text-base text-textSecondary mb-10">
            Log in to your Health-First account
          </Text>

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
            Email
          </Text>
          <TextInput
            className="bg-card border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary mb-4"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(""); }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="you@example.com"
            placeholderTextColor="#6B6B6B"
          />

          <Text className="text-xs font-medium uppercase tracking-widest text-textSecondary mb-2">
            Password
          </Text>
          <TextInput
            className="bg-card border border-gray-200 rounded-lg px-4 py-3 text-base text-textPrimary mb-2"
            value={password}
            onChangeText={(t) => { setPassword(t); setError(""); }}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#6B6B6B"
          />

          <TouchableOpacity onPress={handleForgotPassword} className="self-end mb-6">
            <Text className="text-sm text-coachGreen">Forgot password?</Text>
          </TouchableOpacity>

          {error ? (
            <Text className="text-sm text-comebackCoral mb-4">{error}</Text>
          ) : null}

          {resetSent ? (
            <Text className="text-sm text-coachGreen mb-4">
              Reset link sent — check your email.
            </Text>
          ) : null}

          {loading ? (
            <LoadingDots />
          ) : (
            <PrimaryButton label="Log in" onPress={handleLogin} />
          )}

          <View className="flex-row justify-center mt-8">
            <Text className="text-base text-textSecondary">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text className="text-base text-coachGreen font-medium">
                  Sign up
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
