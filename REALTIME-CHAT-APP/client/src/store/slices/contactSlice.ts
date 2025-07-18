// Define the Contact interface
interface Contact {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  color?: number;
}

// Define the ContactSlice interface
interface ContactSlice {
  directMessagesContacts: Contact[];
  setDirectMessagesContacts: (contacts: Contact[]) => void;
}

// Create the typed contact slice
export const createContactsSlice = (
  set: (state: Partial<ContactSlice>) => void
): ContactSlice => ({
  directMessagesContacts: [],
  setDirectMessagesContacts: (contacts: Contact[]) => set({ directMessagesContacts: contacts }),
});
