import { useEffect } from "react";
import NewDM from "./components/new-dm";
import ProfileInfo from "./components/profile-info";
import { apiClient } from "@/lib/api-clients";
import {
  GET_DM_CONTACTS_ROUTE,
  GET_USER_CHANNELS_ROUTE,
} from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/create-channel";
import type { Channel, Contact, TitleProps } from "@/store/Interface";
import ChatLogo from "@/assets/chat-logo.svg";

export default function ContactsContainer() {
  const {
    directMessagesContacts,
    setDirectMessagesContacts,
    channel,
    setChannel,
  } = useAppStore() as {
    directMessagesContacts: Contact[];
    setDirectMessagesContacts: (contacts: Contact[]) => void;
    channel: Channel[];
    setChannel: (channels: Channel[]) => void;
  };

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await apiClient.get(GET_DM_CONTACTS_ROUTE, {
          withCredentials: true,
        });
        if (res.data.contacts) {
          setDirectMessagesContacts(res.data.contacts);
        }
      } catch (error) {
        console.log("Error fetching contacts:", error);
      }
    };

    const getUserChannels = async () => {
      try {
        const res = await apiClient.get(GET_USER_CHANNELS_ROUTE, {
          withCredentials: true,
        });
        if (res.data.channels) {
          setChannel(res.data.channels);
        }
      } catch (error) {
        console.log("Error fetching channels:", error);
      }
    };

    getContacts();
    getUserChannels();
  }, [setChannel, setDirectMessagesContacts]);

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
      <div className="pt-3">
        <Logo />
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Direct Messages" />
          <NewDM />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={directMessagesContacts} />
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
          <Title text="Channels" />
          <CreateChannel />
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts={channel} isChannel={true} />
        </div>
      </div>
      <ProfileInfo />
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex p-5  justify-start items-center gap-2">
      <img src={ChatLogo} alt="chat-logo" className="w-16 h-16" />
      <span className="text-3xl font-semibold ">Realtime Chat</span>
    </div>
  );
};

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
      {text}
    </h6>
  );
};
