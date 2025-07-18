import type { Channel, ChatSlice, Contact, Message } from "../Interface";

export const createChatSlice = (
  set: (state: Partial<ChatSlice>) => void,
  get: () => ChatSlice
): ChatSlice => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessage: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channel: [],
  directMessagesContacts: [],

  setChannel: (channel: Channel[]) => set({ channel }),
  setSelectedChatType: (selectedChatType: "contact" | "channel") => set({ selectedChatType }),
  setSelectedChatData: (selectedChatData: Contact | Channel) => set({ selectedChatData }),
  setSelectedChatMessage: (selectedChatMessage: Message[]) => set({ selectedChatMessage }),

  addChannel: (channel: Channel) => {
    const channels = get().channel;
    set({ channel: [channel, ...channels] });
  },

  closeChat: () =>
    set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessage: [],
    }),

  addMessage: (message: Message) => {
    const selectedChatMessage = get().selectedChatMessage;
    const selectedChatType = get().selectedChatType;
    set({
      selectedChatMessage: [
        ...selectedChatMessage,
        {
          ...message,
          recipient:
            selectedChatType === "channel"
              ? message.recipient
              : (message.recipient as Contact)._id,
          sender:
            selectedChatType === "channel"
              ? message.sender
              : (message.sender as Contact)._id,
        },
      ],
    });
  },

  setIsUploading: (isUploading: boolean) => set({ isUploading }),
  setIsDownloading: (isDownloading: boolean) => set({ isDownloading }),
  setFileUploadProgress: (fileUploadProgress: number) => set({ fileUploadProgress }),
  setFileDownloadProgress: (fileDownloadProgress: number) => set({ fileDownloadProgress }),

  addContactsInDMContacts: (message: Message) => {
    const userId = get().userInfo?.id;
    if (!userId) return;

    const sender = message.sender as Contact;
    const recipient = message.recipient as Contact;

    const formId = sender._id === userId ? recipient._id : sender._id;
    const formData = sender._id === userId ? recipient : sender;
    const dmContacts = get().directMessagesContacts || [];
    const index = dmContacts.findIndex((contact: Contact) => contact._id === formId);
    const data = dmContacts.find((contact: Contact) => contact._id === formId);

    if (index !== -1 && data) {
      dmContacts.splice(index, 1);
      dmContacts.unshift(data);
    } else {
      dmContacts.unshift(formData);
    }
    set({ directMessagesContacts: dmContacts });
  },

  addChannelInChannelList: (message: Message) => {
    const channels = get().channel ?? [];
    const data = channels.find((channel: Channel) => channel._id === message.channelId);
    const index = channels.findIndex((channel: Channel) => channel._id === message.channelId);

    if (index !== -1 && data) {
      channels.splice(index, 1);
      channels.unshift(data);
      set({ channel: channels });
    }
  },
});
