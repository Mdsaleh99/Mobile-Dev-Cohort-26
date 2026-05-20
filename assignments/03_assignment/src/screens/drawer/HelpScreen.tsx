import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadow } from '../../constants/theme';

const FAQS = [
  { q: 'How do I track my order?', a: 'Once your order is placed, you\'ll see a live tracking update on the Orders screen with estimated delivery time.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 5 minutes of placement. Head to Orders → select order → Cancel.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, Apple Pay, and Google Pay.' },
  { q: 'Is there a minimum order amount?', a: 'Most restaurants have a minimum of $20. This is shown before you checkout.' },
];

export default function HelpScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Help & Support</Text>

        <View style={styles.contactRow}>
          {[
            { icon: 'chatbubble-outline' as const, label: 'Live Chat' },
            { icon: 'call-outline' as const, label: 'Call Us' },
            { icon: 'mail-outline' as const, label: 'Email' },
          ].map(c => (
            <TouchableOpacity key={c.label} style={styles.contactCard} activeOpacity={0.8}>
              <Ionicons name={c.icon} size={24} color={Colors.primary} />
              <Text style={styles.contactLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map(faq => (
          <TouchableOpacity
            key={faq.q}
            style={styles.faqItem}
            onPress={() => setExpanded(expanded === faq.q ? null : faq.q)}
            activeOpacity={0.8}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ}>{faq.q}</Text>
              <Ionicons
                name={expanded === faq.q ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.textSecondary}
              />
            </View>
            {expanded === faq.q && (
              <Text style={styles.faqA}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: Colors.text, marginBottom: Spacing.lg },
  contactRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  contactCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.card,
  },
  contactLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.text,
    marginBottom: Spacing.md,
  },
  faqItem: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.card,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQ: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1, paddingRight: Spacing.sm },
  faqA: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
