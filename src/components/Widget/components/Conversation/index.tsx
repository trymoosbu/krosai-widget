import { useRef, useState, useEffect } from "react";
import { Picker } from "emoji-mart";
import cn from "classnames";
import QuickButtons from "../Messages/QuickButtons";
import { AnyFunction } from "../../../../utils/types";
import "./style.scss";
import Home from "../Home";
import Sender from "../Messages/Sender";
import Messages from "../Messages";
import Header from "../Header";
import { io } from "socket.io-client";

// Default Message Component
const DefaultMessageComponent: React.FC<{
  message: string;
  showTimeStamp: boolean;
}> = ({ message, showTimeStamp }) => (
  <div>
    <p>{message}</p>
    {showTimeStamp && <span>{new Date().toLocaleTimeString()}</span>}
  </div>
);

interface ISenderRef {
  onSelectEmoji: (event: any) => void;
}

type ConversationProps = {
  title: string;
  subtitle: string;
  senderPlaceHolder: string;
  showCloseButton: boolean;
  disabledInput: boolean;
  autofocus: boolean;
  className: string;
  sendMessage: AnyFunction;
  toggleChat: AnyFunction;
  profileAvatar?: string;
  profileClientAvatar?: string;
  titleAvatar?: string;
  onQuickButtonClicked?: AnyFunction;
  onTextInputChange?: (event: any) => void;
  sendButtonAlt: string;
  showTimeStamp: boolean;
  resizable?: boolean;
  emojis?: boolean;
  avatar: string;
  footerIcon: string;
  background_color: string;
  icon_color: string;
};

function Conversation({
  title,
  subtitle,
  senderPlaceHolder,
  showCloseButton,
  disabledInput,
  autofocus,
  className,
  sendMessage,
  toggleChat,
  profileAvatar,
  profileClientAvatar,
  titleAvatar,
  avatar,
  onQuickButtonClicked,
  onTextInputChange,
  sendButtonAlt,
  showTimeStamp,
  resizable,
  emojis,
  footerIcon,
  background_color,
  icon_color,
}: ConversationProps) {
  const [containerDiv, setContainerDiv] = useState<HTMLElement | null>();
  const [currentView, setCurrentView] = useState<"home" | "messages">("home");

  const handleViewSwitch = (view: "home" | "messages") => {
    setCurrentView(view);
  };

  const handleToggleChat = () => {
    setCurrentView("home");
  };

  let startX, startWidth;

  useEffect(() => {
    const containerDiv = document.getElementById("rcw-conversation-container");
    setContainerDiv(containerDiv);
  }, []);

  const initResize = (e) => {
    if (resizable) {
      startX = e.clientX;
      if (document.defaultView && containerDiv) {
        startWidth = parseInt(
          document.defaultView.getComputedStyle(containerDiv).width
        );
        window.addEventListener("mousemove", resize, false);
        window.addEventListener("mouseup", stopResize, false);
      }
    }
  };

  const resize = (e) => {
    if (containerDiv) {
      containerDiv.style.width = startWidth - e.clientX + startX + "px";
    }
  };

  const stopResize = (e) => {
    window.removeEventListener("mousemove", resize, false);
    window.removeEventListener("mouseup", stopResize, false);
  };

  const [pickerOffset, setOffset] = useState(0);
  const senderRef = useRef<ISenderRef>(null!);
  const [pickerStatus, setPicket] = useState(false);

  const onSelectEmoji = (emoji) => {
    senderRef.current?.onSelectEmoji(emoji);
  };

  const togglePicker = () => {
    setPicket((prevPickerStatus) => !prevPickerStatus);
  };

  const handlerSendMsn = (event) => {
    sendMessage(event);
    if (pickerStatus) setPicket(false);
  };

  return (
    <div
      id="rcw-conversation-container"
      onMouseDown={initResize}
      className={cn("rcw-conversation-container", className)}
      aria-live="polite"
    >
      {resizable && <div className="rcw-conversation-resizer" />}
      {currentView === "home" ? (
        <>
          <Home
            title={title}
            subtitle={subtitle}
            avatar={avatar}
            footerText="Powered by"
            footerIcon={footerIcon}
            footerCN="KrosAI"
            onSwitchView={handleViewSwitch}
            background_color={background_color}
            icon_color={icon_color}
          />
        </>
      ) : (
        <>
          <Header
            title={title}
            subtitle={subtitle}
            toggleChat={handleToggleChat}
            showCloseButton={showCloseButton}
            titleAvatar={titleAvatar}
            icon_color={icon_color}
          />
          <Messages
            profileAvatar={profileAvatar}
            profileClientAvatar={profileClientAvatar}
            showTimeStamp={showTimeStamp}
          />

          <QuickButtons onQuickButtonClicked={onQuickButtonClicked} />
          {emojis && pickerStatus && (
            <Picker
              style={{
                position: "absolute",
                bottom: pickerOffset,
                left: "0",
                width: "100%",
              }}
              onSelect={onSelectEmoji}
            />
          )}
          <Sender
            ref={senderRef}
            sendMessage={handlerSendMsn}
            placeholder={senderPlaceHolder}
            disabledInput={disabledInput}
            autofocus={autofocus}
            onTextInputChange={onTextInputChange}
            buttonAlt={sendButtonAlt}
            onPressEmoji={togglePicker}
            onChangeSize={setOffset}
          />
        </>
      )}
    </div>
  );
}

export default Conversation;
