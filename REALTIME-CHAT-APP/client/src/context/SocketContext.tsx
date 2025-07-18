import { useAppStore } from "@/store";
import type { Channel, Contact, Message, UserInfo } from "@/store/Interface";
import { HOST } from "@/utils/socketConstants";
import { SocketContext } from "@/context/socketContext";
import { useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketProviderProps {
  children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { userInfo } = useAppStore() as {
    userInfo: UserInfo | undefined;
  };

  useEffect(() => {
    if (userInfo) {
      const newSocket = io(HOST, {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      const handleReceiveMessage = (message: Message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addContactsInDMContacts,
        } = useAppStore.getState() as {
          selectedChatData: Contact | Channel | undefined;
          selectedChatType: string | undefined;
          addMessage: (message: Message) => void;
          addContactsInDMContacts: (message: Message) => void;
        };

        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          message &&
          message.sender &&
          message.recipient &&
          (selectedChatData._id ===
            (typeof message.sender === "string"
              ? message.sender
              : message.sender._id) ||
            selectedChatData._id ===
              (typeof message.recipient === "string"
                ? message.recipient
                : message.recipient._id))
        ) {
          addMessage(message);
        }
        addContactsInDMContacts(message);
      };

      const handleReceiveChannelMessage = (message: Message) => {
        const {
          selectedChatData,
          selectedChatType,
          addMessage,
          addChannelInChannelList,
        } = useAppStore.getState() as {
          selectedChatData: Channel | undefined;
          selectedChatType: string | undefined;
          addMessage: (message: Message) => void;
          addChannelInChannelList: (message: Message) => void;
        };
        if (
          selectedChatType !== undefined &&
          selectedChatData &&
          message &&
          message.sender &&
          message.channelId === selectedChatData._id
        ) {
          addMessage(message);
        }
        addChannelInChannelList(message);
      };

      newSocket.on("receiveMessage", handleReceiveMessage);
      newSocket.on("receiveChannelMessage", handleReceiveChannelMessage);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setSocket(null);
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
