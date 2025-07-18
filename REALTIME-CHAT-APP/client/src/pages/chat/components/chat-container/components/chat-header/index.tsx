import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import type { Channel, Contact } from "@/store/Interface";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";

export default function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore() as {
    closeChat: () => void;
    selectedChatData: Contact | Channel | undefined;
    selectedChatType: "contact" | "channel" | undefined;
  };
  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20">
      <div className="flex items-center w-full gap-5 justify-between">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative">
            {selectedChatType === "contact" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                {selectedChatData?.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData?.color ?? 0
                    )}`}
                  >
                    {selectedChatData?.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData?.email?.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-[#ffffff22] h-12 w-12 flex items-center justify-center rounded-full border-[1px] border-[#ffffff33]">
                #
              </div>
            )}
          </div>
          <div className="text-lg md:text-2xl font-semibold">
            {selectedChatType === "channel" && `${selectedChatData?.name}`}
            {selectedChatType === "contact" &&
              (selectedChatData?.firstName
                ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
                : selectedChatData?.email)}
          </div>
        </div>
        <div className="flex gap-5 items-center justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white cursor-pointer transition-all duration-300"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
}
