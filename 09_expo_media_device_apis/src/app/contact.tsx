import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as Contacts from 'expo-contacts';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Button,
    FlatList,
    Linking,
    Pressable,
    ScrollView
} from 'react-native';


function formatName(contact: Contacts.Contact) {
  const parts = [contact.firstName, contact.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : contact.name ?? 'Unnamed contact';
}

export default function ContactsScreen() {
  const [permission, setPermission] = useState<Contacts.ContactsPermissionResponse | null>(null);
  const [hasContacts, setHasContacts] = useState<boolean | null>(null);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contacts.Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    Contacts.getPermissionsAsync().then(setPermission);
  }, []);

  const requestPermission = async () => {
    const result = await Contacts.requestPermissionsAsync();
    setPermission(result);

    if (!result.granted && !result.canAskAgain) {
      Alert.alert('Contacts denied', 'Enable contacts access in Settings.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ]);
    }

    return result.granted;
  };

  const loadContacts = async () => {
    const granted = permission?.granted ?? (await requestPermission());
    if (!granted) {
      setStatus('Contacts permission required.');
      return;
    }

    setLoading(true);
    try {
      const exists = await Contacts.hasContactsAsync();
      setHasContacts(exists);

      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Emails,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Company,
        ],
        pageSize: 20,
        sort: Contacts.SortTypes.FirstName,
      });

      setContacts(data);
      setStatus(`Loaded ${data.length} contacts.`);
    } catch (error) {
      Alert.alert('Load failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const inspectContact = async (contact: Contacts.Contact) => {
    if (!contact) {
      setSelectedContact(contact);
      return;
    }

    try {
      const detailed = await Contacts.getContactByIdAsync(contact.id, [
        Contacts.Fields.Emails,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Company,
      ]);
      setSelectedContact(detailed ?? contact);
      setStatus(`Selected ${formatName(detailed ?? contact)}.`);
    } catch {
      setSelectedContact(contact);
    }
  };

  const openNativePicker = async () => {
    try {
      const contact = await Contacts.presentContactPickerAsync();
      if (!contact) {
        setStatus('Native picker canceled.');
        return;
      }

      setSelectedContact(contact);
      setStatus(`Picked ${formatName(contact)} from native UI.`);
    } catch (error) {
      Alert.alert('Picker failed', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  if (!permission) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <ThemedText>Checking contacts permission…</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
        <ThemedText style={{ fontSize: 18, fontWeight: '600' }}>Contacts</ThemedText>
        <ThemedText>Permission: {permission.granted ? 'Granted' : 'Not granted'}</ThemedText>

        {!permission.granted && (
          <Button title="Grant contacts access" onPress={requestPermission} />
        )}

        <Button title="Load contacts" onPress={loadContacts} />
        <Button title="Open native contact picker" onPress={openNativePicker} />

        {hasContacts === false && <ThemedText>No contacts on this device.</ThemedText>}
        {loading && <ActivityIndicator />}
        {status && <ThemedText>{status}</ThemedText>}

        {selectedContact && (
          <ThemedView style={{ gap: 4 }}>
            <ThemedText style={{ fontWeight: '600' }}>Selected contact</ThemedText>
            <ThemedText>{formatName(selectedContact)}</ThemedText>
            <ThemedText>{selectedContact.company ?? 'No company'}</ThemedText>
            <ThemedText>
              Phone: {selectedContact.phoneNumbers?.[0]?.number ?? 'None'}
            </ThemedText>
            <ThemedText>
              Email: {selectedContact.emails?.[0]?.email ?? 'None'}
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => item.id ?? `${item.name}-${index}`}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => inspectContact(item)} style={{ paddingVertical: 10 }}>
            <ThemedText>{formatName(item)}</ThemedText>
            <ThemedText style={{ opacity: 0.6 }}>
              {item.phoneNumbers?.[0]?.number ?? 'No phone'}
            </ThemedText>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}