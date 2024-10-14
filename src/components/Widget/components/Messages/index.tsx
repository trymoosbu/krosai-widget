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

  const messageRef = useRef<HTMLDivElement | null>(null);

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
                  isClient(message.sender) ? profileClientAvatar : profileAvatar
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
    </div>
  );
}

export default Messages;
