import { apiClient } from "@/lib/api-clients";
import { useAppStore } from "@/store";
import {
  GET_ALL_MESSAGES_ROUTE,
  GET_CHANNEL_MESSAGES_ROUTE,
  HOST,
} from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import type { Contact, Message, UserInfo } from "@/store/Interface";

export default function MessageContainer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    userInfo,
    selectedChatType,
    selectedChatData,
    selectedChatMessage,
    setIsDownloading,
    setSelectedChatMessage,
    setFileDownloadProgress,
  } = useAppStore() as {
    userInfo: UserInfo;
    selectedChatType: "contact" | "channel" | undefined;
    selectedChatData: Contact;
    selectedChatMessage: Message[];
    setIsDownloading: (isDownloading: boolean) => void;
    setSelectedChatMessage: (messages: Message[]) => void;
    setFileDownloadProgress: (progress: number) => void;
  };

  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          {
            withCredentials: true,
          }
        );
        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    const getChannelMessages = async () => {
      try {
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,
          { withCredentials: true }
        );

        if (res.data.messages) {
          setSelectedChatMessage(res.data.messages);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessage]);

  const checkIfImage = (filePath: string) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const downloadFile = async (Url: string) => {
    try {
      setIsDownloading(true);
      const res = await apiClient.get(
        showImage ? `${imageUrl}` : `${HOST}/${Url}`,
        {
          responseType: "blob",
          onDownloadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            if (typeof total === "number" && total > 0) {
              setFileDownloadProgress(Math.round((100 * loaded) / total));
            }
          },
        }
      );
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", Url.split("/").pop() || "file");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (error) {
      setIsDownloading(false);
      setFileDownloadProgress(0);
      console.log("Error downloading file:", error);
    }
  };

  const renderDMMessages = (message: Message) => {
    // For DM messages, sender is typically a string (user ID)
    const senderId =
      typeof message.sender === "string" ? message.sender : message.sender._id;

    return (
      <div
        className={`${
          senderId === selectedChatData._id ? "text-left" : "text-right"
        } `}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              senderId === selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && message.fileUrl && (
          <div
            className={`${
              senderId === selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(`${HOST}/${message.fileUrl}`);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="break-words text-left">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 text-2xl rounded-full p-3 cursor-pointer hover:bg-black/50 transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl!)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message: Message) => {
    // Type guard to ensure sender is a Contact object
    if (typeof message.sender === "string") {
      return null; // Skip rendering if sender is just a string ID
    }

    const sender = message.sender as Contact;

    return (
      <div
        className={`${
          sender._id !== userInfo.id ? "text-left" : "text-right"
        } `}
      >
        {message.messageType === "text" && (
          <div
            className={`${
              sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && message.fileUrl && (
          <div
            className={`${
              sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageUrl(`${HOST}/${message.fileUrl}`);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span className="break-words text-left">
                  {message.fileUrl.split("/").pop()}
                </span>
                <span
                  className="bg-black/20 text-2xl rounded-full p-3 cursor-pointer hover:bg-black/50 transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl!)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8 rounded-full overflow-hidden">
              {sender.image && (
                <AvatarImage
                  src={`${HOST}/${sender.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 text-lg flex items-center justify-center rounded-full ${getColor(
                  sender.color ?? 0
                )}`}
              >
                {sender.firstName
                  ? sender.firstName.split("").shift()
                  : sender.email.split("").shift()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">
              {`${sender.firstName || ""} ${sender.lastName || ""}`.trim() ||
                sender.email}
            </span>
            <span className="text-xs text-gray-600">
              {moment(message.timestamp).format("LT")}
            </span>
          </div>
        ) : (
          <div className="text-xs text-gray-600 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate: string | null = null;
    return selectedChatMessage.map((message) => {
      const messageDate = moment(message.timestamp).format("DD-MM-YYYY");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={message._id}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw]">
      {renderMessages()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img src={imageUrl || ""} className="w-full h-[80vh] bg-cover" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 text-2xl rounded-full p-3 cursor-pointer hover:bg-black/50 transition-all duration-300"
              onClick={() => downloadFile(imageUrl as string)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 text-2xl rounded-full p-3 cursor-pointer hover:bg-black/50 transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageUrl(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
