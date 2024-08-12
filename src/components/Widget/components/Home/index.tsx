import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { scrollToBottom } from "../../../../utils/messages";
import { GlobalState } from "../../../../store/types";
import { setBadgeCount, markAllMessagesRead } from "../../../../store/actions";
import "./styles.scss";
type HomeProps = {
  title: string;
  subtitle: string;
  avatar: string;
  footerIcon: string;
  footerText: string;
  footerCN: string;
  toggleChat: () => void;
  onSwitchView: (view: "home" | "messages") => void;
};

function Home({
  title,
  subtitle,
  avatar,
  footerIcon,
  footerText,
  footerCN,
  toggleChat,
  onSwitchView,
}: HomeProps) {
  const dispatch = useDispatch();
  const { badgeCount, messages } = useSelector((state: GlobalState) => ({
    messages: state.messages.messages,
    badgeCount: state.messages.badgeCount,
  }));

  const messageRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // @ts-ignore
    scrollToBottom(messageRef.current);
    if (badgeCount) dispatch(markAllMessagesRead());
    else
      dispatch(
        setBadgeCount(messages.filter((message) => message.unread).length)
      );
  }, [badgeCount]);

  // TODO: Fix this function or change to move the avatar to last message from response
  // const shouldRenderAvatar = (message: Message, index: number) => {
  //   const previousMessage = messages[index - 1];
  //   if (message.showAvatar && previousMessage.showAvatar) {
  //     dispatch(hideAvatar(index));
  //   }
  // }

  // const isClient = (sender) => sender === MESSAGE_SENDER.CLIENT;

  return (
    <>
      <div id="messages" className="w-start-container" ref={messageRef}>
        <div className="rcw-header-action">
          <div></div>
          <div className="home-close-button">
            <button className="rcw-close-button" onClick={toggleChat}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                className="rcw-close"
              >
                <g fill="none" fill-rule="evenodd">
                  <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                  <path
                    fill="currentColor"
                    d="m12 14.122l5.303 5.303a1.5 1.5 0 0 0 2.122-2.122L14.12 12l5.304-5.303a1.5 1.5 0 1 0-2.122-2.121L12 9.879L6.697 4.576a1.5 1.5 0 1 0-2.122 2.12L9.88 12l-5.304 5.304a1.5 1.5 0 1 0 2.122 2.12z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
        <div className="w-action-container">
          <div className="w-description-container">
            <div className="">
              <img src={avatar} className="avatar" alt="profile" />
            </div>
            <h4 className="w-title">{title}</h4>
            <span className="w-subtitle">{subtitle}</span>
          </div>
          <div className="action-button-container">
            <div>
              <button className="action-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M21 6h-3V3h-2v3h-3v2h3v3h2V8h3zm0 9.46l-5.27-.61l-2.52 2.52a15.045 15.045 0 0 1-6.59-6.59l2.53-2.53L8.54 3H3.03C2.45 13.18 10.82 21.55 21 20.97z"
                  />
                </svg>
              </button>
              <h1 className="action-button-text">Call</h1>
            </div>
            <div>
              <button
                onClick={() => onSwitchView("messages")}
                className="action-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="currentColor"
                    d="M116 128a12 12 0 1 1 12 12a12 12 0 0 1-12-12m-32 12a12 12 0 1 0-12-12a12 12 0 0 0 12 12m88 0a12 12 0 1 0-12-12a12 12 0 0 0 12 12m60-76v128a16 16 0 0 1-16 16H83l-32.6 28.16l-.09.07A15.9 15.9 0 0 1 40 240a16.1 16.1 0 0 1-6.8-1.52A15.85 15.85 0 0 1 24 224V64a16 16 0 0 1 16-16h176a16 16 0 0 1 16 16m-16 0H40v160l34.77-30a8 8 0 0 1 5.23-2h136Z"
                  />
                </svg>
              </button>
              <h1 className="action-button-text">Chat</h1>
            </div>
          </div>
          <h1 className="footer-text">
            {footerText}
            <span className="footer-logo-container">
              <img className="footer-logo" src={footerIcon} />
            </span>
            {footerCN}
          </h1>
        </div>
      </div>
    </>
  );
}

export default Home;
