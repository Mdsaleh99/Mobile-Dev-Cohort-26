import { Image } from "expo-image";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

import { authClient } from "../lib/auth-client";

type Mode = "sign-in" | "sign-up";

export function BetterAuthPanel() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <View style={{ paddingVertical: 36, alignItems: "center" }}>
        <ActivityIndicator color="#208AEF" />
      </View>
    );
  }

  if (session) {
    return <SignedInCard name={session.user.name} email={session.user.email} />;
  }

  return <AuthForm />;
}

function SignedInCard({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await authClient.signOut();
    setLoading(false);
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        gap: 12,
        paddingVertical: 28,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderCurve: "continuous",
        backgroundColor: "#111A2E",
        borderWidth: 1,
        borderColor: "#1E293B",
      }}
    >
      <Image
        source="sf:checkmark.seal.fill"
        tintColor="#22C55E"
        style={{ width: 36, height: 36 }}
      />
      <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
        Signed in with Better Auth
      </Text>
      <Text
        selectable
        style={{ color: "#94A3B8", fontSize: 15, textAlign: "center" }}
      >
        {name ?? "No name"}
        {email ? `\n${email}` : ""}
      </Text>
      <Pressable
        onPress={handleSignOut}
        disabled={loading}
        style={({ pressed }) => ({
          marginTop: 8,
          width: "100%",
          height: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          borderCurve: "continuous",
          backgroundColor: "#EF4444",
          opacity: pressed || loading ? 0.7 : 1,
        })}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            Sign out
          </Text>
        )}
      </Pressable>
    </View>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "sign-up") {
        const { error } = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (error) setError(error.message ?? "Sign up failed");
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) setError(error.message ?? "Sign in failed");
      }
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setError(null);
    try {
      // On native this opens the system browser; the session updates via
      // useSession() once the OAuth redirect returns to the app.
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (error) setError(error.message ?? "Social sign in failed");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    }
  };

  return (
    <View style={{ width: "100%", gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          padding: 4,
          borderRadius: 12,
          borderCurve: "continuous",
          backgroundColor: "#111A2E",
          gap: 4,
        }}
      >
        {(["sign-in", "sign-up"] as Mode[]).map((m) => {
          const active = m === mode;
          return (
            <Pressable
              key={m}
              onPress={() => {
                setMode(m);
                setError(null);
              }}
              style={{
                flex: 1,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9,
                borderCurve: "continuous",
                backgroundColor: active ? "#1F2937" : "transparent",
              }}
            >
              <Text
                style={{
                  color: active ? "#fff" : "#94A3B8",
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {m === "sign-in" ? "Sign in" : "Sign up"}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === "sign-up" && (
        <Field placeholder="Name" value={name} onChangeText={setName} />
      )}
      <Field
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Field
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      {error && <Text style={{ color: "#F87171", fontSize: 13 }}>{error}</Text>}

      <Pressable
        onPress={handleEmailAuth}
        disabled={loading}
        style={({ pressed }) => ({
          height: 52,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          borderCurve: "continuous",
          backgroundColor: "#208AEF",
          opacity: pressed || loading ? 0.7 : 1,
        })}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </Text>
        )}
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginVertical: 4,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: "#1E293B" }} />
        <Text style={{ color: "#475569", fontSize: 12 }}>OR</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#1E293B" }} />
      </View>

      <Pressable
        onPress={() => handleSocial("google")}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          height: 52,
          borderRadius: 14,
          borderCurve: "continuous",
          backgroundColor: "#fff",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Image
          source={{ uri: "https://www.google.com/favicon.ico" }}
          style={{ width: 20, height: 20 }}
        />
        <Text style={{ color: "#0B1120", fontSize: 15, fontWeight: "600" }}>
          Continue with Google
        </Text>
      </Pressable>

      <Pressable
        onPress={() => handleSocial("github")}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          height: 52,
          borderRadius: 14,
          borderCurve: "continuous",
          backgroundColor: "#1F2937",
          borderWidth: 1,
          borderColor: "#334155",
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <Image
          source="sf:chevron.left.forwardslash.chevron.right"
          tintColor="#fff"
          style={{ width: 18, height: 18 }}
        />
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
          Continue with GitHub
        </Text>
      </Pressable>
    </View>
  );
}

function Field(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor="#64748B"
      {...props}
      style={{
        height: 52,
        borderRadius: 14,
        borderCurve: "continuous",
        backgroundColor: "#111A2E",
        borderWidth: 1,
        borderColor: "#1E293B",
        paddingHorizontal: 16,
        color: "#fff",
        fontSize: 15,
      }}
    />
  );
}
