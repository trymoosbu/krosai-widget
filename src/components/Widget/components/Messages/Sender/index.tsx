import {
  useRef,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  MouseEvent,
} from "react";
import { useSelector } from "react-redux";
import cn from "classnames";

import { GlobalState } from "src/store/types";
import {
  getCaretIndex,
  isFirefox,
  updateCaret,
  insertNodeAtCaret,
  getSelection,
} from "../../../../../utils/contentEditable";
const brRegex = /<br>/g;

import "./style.scss";
import { getCookie } from "cookies-next";
import { GetChatSessions } from "../../api/Chatsession";
import { v4 as uuidv4 } from "uuid";

type Props = {
  placeholder: string;
  disabledInput: boolean;
  autofocus: boolean;
  sendMessage: (message: string, sessionId: string | null) => void; // Updated to send session ID
  buttonAlt: string;
  onPressEmoji: () => void;
  onChangeSize: (height: number) => void;
  onTextInputChange?: (event: any) => void;
};

function Sender(
  {
    sendMessage,
    placeholder,
    disabledInput,
    autofocus,
    onTextInputChange,
    buttonAlt,
    onPressEmoji,
    onChangeSize,
  }: Props,
  ref
) {
  const showChat = useSelector((state: GlobalState) => state.behavior.showChat);
  const inputRef = useRef<HTMLDivElement>(null!);
  const refContainer = useRef<HTMLDivElement>(null);
  const [enter, setEnter] = useState(false);
  const [firefox, setFirefox] = useState(false);
  const [height, setHeight] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chatSessionExists, setChatSessionExists] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const assistantID = getCookie("assistant_id") as unknown;

  const { chatSessions, error } = GetChatSessions(assistantID as number);

  useEffect(() => {
    if (chatSessions && chatSessions.length > 0) {
      setChatSessionExists(true);
      setCurrentSessionId(chatSessions[0].id);
    }
  }, [chatSessions]);

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

  const handleCreateChatSession = async () => {
    if (chatSessionExists) {
      return;
    }
    console.log(chatSessionExists);

    const ip_address = await getIPAddress();
    const session_identifier = uuidv4();

    const values = {
      assistant_id: assistantID,
      session_identifier: session_identifier,
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
      setChatSessionExists(true);
      setCurrentSessionId(res.id);
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlerPressEmoji = () => {
    onPressEmoji();
    checkSize();
  };
  const checkSize = () => {
    const senderEl = refContainer.current;
    if (senderEl && height !== senderEl.clientHeight) {
      const { clientHeight } = senderEl;
      setHeight(clientHeight);
      onChangeSize(clientHeight ? clientHeight - 1 : 0);
    }
  };
  useImperativeHandle(ref, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });
  const handlerOnSelectEmoji = (emoji) => {
    const el = inputRef.current;
    const { start, end } = getSelection(el);
    if (el.innerHTML) {
      const firstPart = el.innerHTML.substring(0, start);
      const secondPart = el.innerHTML.substring(end);
      el.innerHTML = `${firstPart}${emoji.native}${secondPart}`;
    } else {
      el.innerHTML = emoji.native;
    }
    updateCaret(el, start, emoji.native.length);
  };

  const handlerOnKeyUp = (event) => {
    const el = inputRef.current;
    if (!el) return true;
    if (firefox && event.key === "Backspace") {
      if (el.innerHTML.length === 1 && enter) {
        el.innerHTML = "";
        setEnter(false);
      } else if (brRegex.test(el.innerHTML)) {
        el.innerHTML = el.innerHTML.replace(brRegex, "");
      }
    }
    checkSize();
  };
  useImperativeHandle(ref, () => {
    return {
      onSelectEmoji: handlerOnSelectEmoji,
    };
  });

  const handlerSendMessage = async () => {
    const el = inputRef.current;
    if (el.innerHTML) {
      if (!chatSessionExists) {
        await handleCreateChatSession();
      }
      sendMessage(el.innerText, currentSessionId);
      el.innerHTML = "";
    }
  };

  const handlerOnKeyPress = async (event) => {
    const el = inputRef.current;

    if (event.charCode == 13 && !event.shiftKey) {
      event.preventDefault();
      await handlerSendMessage();
    }
    if (event.charCode === 13 && event.shiftKey) {
      event.preventDefault();
      insertNodeAtCaret(el);
      setEnter(true);
    }
  };

  return (
    <div ref={refContainer} className="rcw-sender">
      <button
        className="rcw-picker-btn"
        type="submit"
        onClick={handlerPressEmoji}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="rcw-picker-icon"
        >
          <path
            fill="currentColor"
            d="M16 4C9.383 4 4 9.383 4 16s5.383 12 12 12s12-5.383 12-12S22.617 4 16 4m0 2c5.535 0 10 4.465 10 10s-4.465 10-10 10S6 21.535 6 16S10.465 6 16 6m-4.5 6a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m9 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m-9.688 7l-1.718 1c1.383 2.387 3.953 4 6.906 4s5.523-1.613 6.906-4l-1.718-1A5.98 5.98 0 0 1 16 22a5.98 5.98 0 0 1-5.188-3"
          />
        </svg>
      </button>
      <div
        className={cn("rcw-new-message", {
          "rcw-message-disable": disabledInput,
        })}
      >
        <div
          spellCheck
          className="rcw-input"
          role="textbox"
          contentEditable={!disabledInput}
          ref={inputRef}
          placeholder={placeholder}
          onInput={onTextInputChange}
          onKeyPress={handlerOnKeyPress}
        />
      </div>
      <button type="submit" className="rcw-send" onClick={handlerSendMessage}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          className="rcw-send-icon"
        >
          <path
            fill="currentColor"
            d="m4 8.25l7.51 1l-7.5-3.22zm.01 9.72l7.5-3.22l-7.51 1z"
            opacity="0.3"
          />
          <path
            fill="currentColor"
            d="M2.01 3L2 10l15 2l-15 2l.01 7L23 12zM4 8.25V6.03l7.51 3.22zm.01 9.72v-2.22l7.51-1z"
          />
        </svg>
      </button>
    </div>
  );
}

export default forwardRef(Sender);
