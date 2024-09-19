import {
  useEffect,
  useRef,
  useState,
  ElementRef,
  ImgHTMLAttributes,
  MouseEvent,
  useCallback,
} from "react";
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
import { io } from "socket.io-client";
import useWebSocket, { ReadyState } from "react-use-websocket";

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

  const [socketUrl, setSocketUrl] = useState(
    "wss://krosai.azurewebsites.net/agent/ws/chat/36383"
  );
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  console.log(connectionStatus);

  useEffect(() => {
    // @ts-ignore
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

  // TODO: Fix this function or change to move the avatar to last message from response
  // const shouldRenderAvatar = (message: Message, index: number) => {
  //   const previousMessage = messages[index - 1];
  //   if (message.showAvatar && previousMessage.showAvatar) {
  //     dispatch(hideAvatar(index));
  //   }
  // }

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
