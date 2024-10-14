import { useEffect, useRef, useState } from "react";
import "./style.scss";
import { getCookie, setCookie } from "cookies-next";
import { GetChatSession, GetChatSessions } from "../api/Chatsession";
import Sessions, {
  ChatSessionsModel,
} from "../Conversation/components/Sessions";

type Props = {
  title: string;
  subtitle: string;
  toggleChat: () => void;
  showCloseButton: boolean;
  titleAvatar?: string;
  icon_color: string;
};

function Header({
  title,
  subtitle,
  toggleChat,
  showCloseButton,
  titleAvatar,
  icon_color,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionID, setSessionID] = useState<number | null>(null);
  const [, selectedSession] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [chatSessionExists, setChatSessionExists] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);

  useEffect(() => {
    const handleDropdownBg = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleDropdownBg);
    } else {
      document.removeEventListener("mousedown", handleDropdownBg);
    }

    return () => {
      document.removeEventListener("mousedown", handleDropdownBg);
    };
  }, [showDropdown]);

  const assistantID = getCookie("assistant_id") as unknown;

  const { chatSession } = GetChatSession(sessionID as number);
  console.log(chatSession);

  const { chatSessions } = GetChatSessions(assistantID as number);
  console.log(chatSessions);

  useEffect(() => {
    if (!sessionID && chatSessions?.length > 0) {
      const firstSessionID = chatSessions[0]?.id;
      setSessionID(firstSessionID);
      selectedSession(chatSessions[0]?.id);
      setCookie("session_id", firstSessionID);
    }
  }, [chatSessions, sessionID]);

  console.log(sessionID);

  const handleChangeSession = (id: number) => {
    setSessionID(id);
    setCookie("session_id", id);
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  const ToggleSession = () => {
    setShowDropdown(!showDropdown);
  };
  return (
    <div className="rcw-header">
      <div
        style={{
          display: "flex",
          gap: "0px",
        }}
      >
        {titleAvatar && (
          <img src={titleAvatar} className="title_avatar" alt="profile" />
        )}
        <div
          style={{
            maxWidth: "250px",
            maxHeight: "60px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <h4 className="rcw-title">{title}</h4>
          <span className="rcw-subtitle">{subtitle}</span>
        </div>
      </div>

      <div className="rcw-header-action">
        {/* <button className="rcw-call-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m19.23 15.26l-2.54-.29a1.99 1.99 0 0 0-1.64.57l-1.84 1.84a15.05 15.05 0 0 1-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52a2 2 0 0 0-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07c.53 8.54 7.36 15.36 15.89 15.89c1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98"
            />
          </svg>
        </button> */}

        <button onClick={ToggleSession} className="chatsession_btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            color={icon_color}
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 5.92A.96.96 0 1 0 12 4a.96.96 0 0 0 0 1.92m0 7.04a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92M12 20a.96.96 0 1 0 0-1.92a.96.96 0 0 0 0 1.92"
            ></path>
          </svg>
        </button>
        <button className="toggle-button" onClick={toggleChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            color={icon_color}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m10.828 12l4.95 4.95l-1.414 1.415L8 12l6.364-6.364l1.414 1.414z"
            ></path>
          </svg>
        </button>
      </div>

      {showDropdown && (
        <>
          <div className="modal-overlay"></div>

          <div className="chatsession_content" ref={dropdownRef}>
            {chatSessions?.map((session: ChatSessionsModel, index: number) => (
              <Sessions
                key={index}
                active={Number(sessionID) === session.id}
                handleChangeSession={handleChangeSession}
                dateTime={formatDateTime(session.started_at)}
                mode={session.call_type}
                chatSessions={session}
                SelectedSessionID={selectedSession}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Header;
