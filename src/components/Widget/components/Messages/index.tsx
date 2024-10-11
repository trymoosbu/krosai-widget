import { useEffect, useRef, useState, MouseEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import format from "date-fns/format";
import { scrollToBottom } from "../../../../utils/messages";
import {
  MessageTypes,
  Link,
  CustomCompMessage,
  GlobalState,
} from "../../../../store/types";
import { setBadgeCount, markAllMessagesRead } from "../../../../store/actions";
import { MESSAGE_SENDER } from "../../../../constants";
import Loader from "./components/Loader";
import "./styles.scss";
import { getCookie, setCookie } from "cookies-next";
import { GetChatSession, GetChatSessions } from "../api/Chatsession";

type Props = {
  showTimeStamp: boolean;
  profileAvatar?: string;
  profileClientAvatar?: string;
};

function Messages({
  profileAvatar,
  profileClientAvatar,
  showTimeStamp,
}: Props) {
  const dispatch = useDispatch();
  const { messages, typing, showChat } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    typing: state.behavior.messageLoader,
    showChat: state.behavior.showChat,
  }));
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const messageRef = useRef<HTMLDivElement | null>(null);

  const assistantID = getCookie("assistant_id") as unknown;

  const { chatSessions, error } = GetChatSessions(assistantID as number);
  console.log(chatSessions, error);

  const getIPAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data?.ip;
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return "0.0.0.0";
    }
  };

  const handleCreateChatSession = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // const ended_at = new Date().toISOString();

    const ip_address = await getIPAddress();

    const values = {
      assistant_id: assistantID,
      session_identifier: "",
      user_agent: navigator.userAgent,
      ip_address: ip_address,
      summary: "",
      sentiment: "",
      call_type: "chat",
      email: "",
      name: "",
      ended_at: null,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://krosai.azurewebsites.net/chat_session/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create chat session");
      }

      const res = await response.json();
      console.log(res);
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollToBottom(messageRef.current);
    const unreadMessages = messages.filter((message) => message.unread).length;
    setBadgeCount(unreadMessages);
  }, [messages, badgeCount]);

  const getComponentToRender = (
    message: MessageTypes | Link | CustomCompMessage
  ) => {
    const ComponentToRender = message.component;
    if (message.type === "component") {
      /* @ts-expect-error Server Component */

      return <ComponentToRender {...message.props} />;
    }

    return (
      /* @ts-expect-error Server Component */
      <ComponentToRender message={message} showTimeStamp={showTimeStamp} />
    );
  };

  const isClient = (sender) => sender === MESSAGE_SENDER.CLIENT;

  return (
    <div id="messages" className="rcw-messages-container" ref={messageRef}>
      {chatSessions?.length > 0 ? (
        <>
          {messages?.map((message, index) => (
            <div
              className={`rcw-message ${
                isClient(message.sender) ? "rcw-message-client" : ""
              }`}
              key={`${index}-${format(message.timestamp, "hh:mm")}`}
            >
              {((profileAvatar && !isClient(message.sender)) ||
                (profileClientAvatar && isClient(message.sender))) &&
                message.showAvatar && (
                  <img
                    src={
                      isClient(message.sender)
                        ? profileClientAvatar
                        : profileAvatar
                    }
                    className={`rcw-avatar ${
                      isClient(message.sender) ? "rcw-avatar-client" : ""
                    }`}
                    alt="profile"
                  />
                )}
              {getComponentToRender(message)}
            </div>
          ))}
          <Loader typing={false} />
        </>
      ) : (
        <>
          <div className="chatsession_btn_wrap">
            <button
              onClick={handleCreateChatSession}
              className="session-button"
            >
              Start Chat Session
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Messages;
