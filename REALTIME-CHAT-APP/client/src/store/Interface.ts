export interface ReactProps {
  children: React.ReactNode
}

export interface TitleProps {
  text: string;
}

export interface MultipleSelectorProps {
  className?: string;
  defaultOptions: Option[];
  placeholder?: string;
  value: Option[];
  onChange: (value: Option[]) => void;
  emptyIndicator?: React.ReactNode;
  options?: Option[];
  delay?: number;
  onSearch?: (value: string) => Promise<Option[]> | Option[];
  loadingIndicator?: React.ReactNode;
  maxSelected?: number;
  onMaxSelected?: (maxLimit: number) => void;
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  groupBy?: keyof Option;
  badgeClassName?: string;
  selectFirstItem?: boolean;
  creatable?: boolean;
  triggerSearchOnFocus?: boolean;
  commandProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;
  hideClearAllButton?: boolean;
}

export interface Option {
  value: string;
  label: string;
  fixed?: boolean;
  disable?: boolean;
  [key: string]: unknown;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  image?: string | null;
  color?: number;
  profileSetup: boolean;
}

export interface AuthSlice {
  userInfo: UserInfo | undefined;
  setUserInfo: (userInfo: UserInfo | undefined) => void;
}

export interface Contact {
  _id: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  image?: string;
  color?: number;
  name?: string;
}

export interface ContactOption {
  value: string;
  label: string;
}

export interface Channel {
  _id: string;
  id?: string;
  name: string;
  members: Contact[];
  admin: string;
  messages: Message[];
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactListProps {
  contacts: (Contact | Channel)[];
  isChannel?: boolean;
}

export interface Message {
  _id: string;
  sender: Contact | string;
  recipient: Contact | string;
  messageType: "text" | "file";
  content?: string;
  fileUrl?: string;
  fileName?: string;
  timestamp: string;
  channelId?: string;
}

export interface ChatSlice {
  selectedChatType: "contact" | "channel" | undefined;
  selectedChatData: Contact | Channel | undefined;
  selectedChatMessage: Message[];
  isUploading: boolean;
  isDownloading: boolean;
  fileUploadProgress: number;
  fileDownloadProgress: number;
  channel: Channel[];
  directMessagesContacts: Contact[];
  userInfo?: { id: string } | undefined;

  setChannel: (channel: Channel[]) => void;
  setSelectedChatType: (selectedChatType: "contact" | "channel") => void;
  setSelectedChatData: (selectedChatData: Contact | Channel) => void;
  setSelectedChatMessage: (selectedChatMessage: Message[]) => void;
  addChannel: (channel: Channel) => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsDownloading: (isDownloading: boolean) => void;
  setFileUploadProgress: (fileUploadProgress: number) => void;
  setFileDownloadProgress: (fileDownloadProgress: number) => void;
  addContactsInDMContacts: (message: Message) => void;
  addChannelInChannelList: (message: Message) => void;
}
