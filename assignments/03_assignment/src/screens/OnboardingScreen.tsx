import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, Radius } from '../constants/theme';

const { width, height } = Dimensions.get('window');

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export default function OnboardingScreen(_: Props) {
  const { setHasSeenOnboarding } = useApp();

  function handleGetStarted() {
    setHasSeenOnboarding(true);
  }

  function handleSignIn() {
    setHasSeenOnboarding(true);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require('../../assets/images/image1.png')}
        style={styles.heroImage}
      />

      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Savor the{'\n'}Moment</Text>
        <Text style={styles.subtitle}>
          Experience curated culinary masterpieces from the city's finest establishments,
          delivered with uncompromising care. Elevate your everyday dining.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={handleGetStarted} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>Get Started  →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignIn} style={styles.signInRow}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <Text style={styles.signInLink}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
  heroImage: {
    width,
    height: height * 0.55,
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: height * 0.35,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 48,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 23,
    marginBottom: Spacing.xl,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  primaryBtnText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});
