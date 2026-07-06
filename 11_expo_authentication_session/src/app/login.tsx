import { BetterAuthPanel } from "@/components/better-auth-panel";
import { useAuth } from "@/context/auth-context";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AuthTab = "expo" | "better";

const TABS: { id: AuthTab; label: string }[] = [
  { id: "expo", label: "Expo Auth" },
  { id: "better", label: "Better Auth" },
];

const login = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>("expo");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1120" }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
        }}
      >
        <View style={{ alignItems: "center", gap: 16 }}>
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 28,
              borderCurve: "continuous",
              backgroundColor: "#208AEF",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 32px rgba(32, 138, 239, 0.45)",
            }}
          >
            <Image
              source="sf:lock.shield.fill"
              tintColor="#fff"
              style={{ width: 48, height: 48 }}
            />
          </View>
          <Text style={{ color: "#fff", fontSize: 30, fontWeight: "700" }}>
            Welcome back {user?.name || "guest"}
          </Text>
          <Text
            style={{
              color: "#94A3B8",
              fontSize: 16,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Choose a provider below to continue.
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: "100%",
            padding: 4,
            borderRadius: 14,
            borderCurve: "continuous",
            backgroundColor: "#111A2E",
            gap: 4,
          }}
        >
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  borderCurve: "continuous",
                  backgroundColor: isActive ? "#208AEF" : "transparent",
                }}
              >
                <Text
                  style={{
                    color: isActive ? "#fff" : "#94A3B8",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {activeTab === "better" ? (
          <View style={{ width: "100%" }}>
            <BetterAuthPanel />
          </View>
        ) : (
          <View style={{ width: "100%", gap: 14 }}>
            <Pressable
              onPress={() => {}}
              disabled={isLoading}
              style={({ pressed }) => ({
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                height: 56,
                borderRadius: 16,
                borderCurve: "continuous",
                backgroundColor: "#fff",
                opacity: pressed || isLoading ? 0.7 : 1,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
              })}
            >
              {isLoading ? (
                <ActivityIndicator color="#0B1120" />
              ) : (
                <>
                  <Image
                    source={{ uri: "https://www.google.com/favicon.ico" }}
                    style={{ width: 22, height: 22 }}
                  />
                  <Text
                    style={{
                      color: "#0B1120",
                      fontSize: 17,
                      fontWeight: "600",
                    }}
                  >
                    Continue with Google
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              onPress={() => {}}
              disabled={isLoading}
              style={({ pressed }) => ({
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                height: 56,
                borderRadius: 16,
                borderCurve: "continuous",
                backgroundColor: "#1F2937",
                borderWidth: 1,
                borderColor: "#334155",
                opacity: pressed || isLoading ? 0.7 : 1,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.25)",
              })}
            >
              <Image
                source="sf:chevron.left.forwardslash.chevron.right"
                tintColor="#fff"
                style={{ width: 20, height: 20 }}
              />
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>
                Continue with GitHub
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default login;

const styles = StyleSheet.create({});
