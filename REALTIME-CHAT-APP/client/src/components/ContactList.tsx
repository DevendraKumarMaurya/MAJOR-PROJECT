import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
import type {
  Channel,
  Contact,
  ContactListProps,
  Message,
} from "@/store/Interface";

export default function ContactList({
  contacts,
  isChannel = false,
}: ContactListProps) {
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    setSelectedChatMessage,
  } = useAppStore() as {
    selectedChatData: Contact | Channel | null;
    setSelectedChatData: (selectedChatData: Contact | Channel) => void;
    setSelectedChatType: (type: "contact" | "channel") => void;
    setSelectedChatMessage: (selectedChatMessage: Message[]) => void;
  };

  const handleClick = (contact: Contact | Channel) => {
    if (isChannel) setSelectedChatType("channel");
    else setSelectedChatType("contact");
    setSelectedChatData(contact);
    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessage([]);
    }
  };

  return (
    <div className="mt-5">
      {contacts.map((contact) => (
        <div
          key={contact._id}
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-[#8417ff] hover:bg-[#8417ff]"
              : "hover:bg-[#2f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-3 items-center justify-start text-neutral-300">
            {!isChannel && (
              <>
                <Avatar className="h-10 w-10 rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`
                        ${
                          selectedChatData &&
                          selectedChatData._id === contact.id
                            ? "bg-[fffffff22] border border-white/70"
                            : getColor(contact.color ?? 0)
                        }
                        uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full `}
                    >
                      {contact.firstName
                        ? contact.firstName.split("")[0]
                        : contact.email
                        ? contact.email.split("")[0]
                        : "?"}
                    </div>
                  )}
                </Avatar>
              </>
            )}
            {isChannel && (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            )}
            {isChannel ? (
              <span>{contact.name}</span>
            ) : (
              <span className="text-md md:text-xl font-semibold">
                {contact.firstName
                  ? `${contact.firstName} ${contact.lastName}`
                  : contact.email}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
