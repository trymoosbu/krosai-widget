import { Provider } from "react-redux";

import Widget from "./components/Widget";

import store from "./store";

import { AnyFunction } from "./utils/types";

import Avatar from "../assets/widget-logo.png";
import footerIcon from "../assets/logo_black.png";
import { useGetWidget } from "./components/Widget/components/api/Widget";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { setCookie } from "cookies-next";

export type widgetProps = {
  id: number;
  name: string;
  description: string;
  background_color: string;
  icon_color: string;
  logo: string;
};

type Props = {
  handleNewUserMessage: AnyFunction;
  handleQuickButtonClicked?: AnyFunction;
  title?: string;
  titleAvatar?: string;
  subtitle?: string;
  senderPlaceHolder?: string;
  showCloseButton?: boolean;
  fullScreenMode?: boolean;
  autofocus?: boolean;
  profileAvatar?: string;
  profileClientAvatar?: string;
  launcher?: AnyFunction;
  handleTextInputChange?: (event: any) => void;
  chatId?: string;
  handleToggle?: AnyFunction;
  launcherOpenLabel?: string;
  launcherCloseLabel?: string;
  launcherCloseImg?: string;
  launcherOpenImg?: string;
  sendButtonAlt?: string;
  showTimeStamp?: boolean;
  imagePreview?: boolean;
  zoomStep?: number;
  emojis?: boolean;
  handleSubmit?: AnyFunction;
  showBadge?: boolean;
  resizable?: boolean;
  widget_id?: string;
  avatar: string;
  // footerIcon: string;
} & typeof defaultProps;

function ConnectedWidget({
  title,
  titleAvatar,
  subtitle,
  senderPlaceHolder,
  showCloseButton,
  fullScreenMode,
  autofocus,
  profileAvatar,
  profileClientAvatar,
  launcher,
  handleNewUserMessage,
  handleQuickButtonClicked,
  handleTextInputChange,
  chatId,
  handleToggle,
  launcherOpenLabel,
  launcherCloseLabel,
  launcherCloseImg,
  launcherOpenImg,
  sendButtonAlt,
  showTimeStamp,
  imagePreview,
  zoomStep,
  handleSubmit,
  showBadge,
  resizable,
  emojis,
  widget_id,
  avatar,
}: // footerIcon,
Props) {
  
  const data: widgetProps = useGetWidget(widget_id as string); //get widget

  useEffect(() => {
    if (data) {
      setCookie("assistant_id", data?.id);
      console.log(data?.id);
    }
  }, [data]);

  return (
    <Provider store={store}>
      <Widget
        title={data?.name as string}
        titleAvatar={data?.logo}
        subtitle={data?.description}
        handleNewUserMessage={handleNewUserMessage}
        handleQuickButtonClicked={handleQuickButtonClicked}
        senderPlaceHolder={senderPlaceHolder}
        profileAvatar={profileAvatar}
        profileClientAvatar={profileClientAvatar}
        showCloseButton={showCloseButton}
        fullScreenMode={fullScreenMode}
        autofocus={autofocus}
        customLauncher={launcher}
        handleTextInputChange={handleTextInputChange}
        chatId={chatId}
        handleToggle={handleToggle}
        launcherOpenLabel={launcherOpenLabel}
        launcherCloseLabel={launcherCloseLabel}
        launcherCloseImg={launcherCloseImg}
        launcherOpenImg={launcherOpenImg}
        sendButtonAlt={sendButtonAlt}
        showTimeStamp={showTimeStamp}
        imagePreview={imagePreview}
        zoomStep={zoomStep}
        handleSubmit={handleSubmit}
        showBadge={showBadge}
        resizable={resizable}
        emojis={emojis}
        footerIcon={footerIcon}
        avatar={data?.logo}
        background_color={data?.background_color}
        icon_color={data?.icon_color}
        openLauncher={data?.logo}
      />
    </Provider>
  );
}

const defaultProps = {
  avatar: `${Avatar}`,
  footerIcon: `${footerIcon}`,
  title: "Welcome",
  subtitle: "This is your chat subtitle",
  senderPlaceHolder: "Type a message...",
  showCloseButton: true,
  fullScreenMode: false,
  autofocus: true,
  chatId: "rcw-chat-container",
  launcherOpenLabel: "Open chat",
  launcherCloseLabel: "Close chat",
  launcherOpenImg: "",
  launcherCloseImg: "",
  sendButtonAlt: "Send",
  showTimeStamp: true,
  imagePreview: false,
  zoomStep: 80,
  showBadge: true,
  widget_id: "Kros20240930093547",
};
ConnectedWidget.defaultProps = defaultProps;

export default ConnectedWidget;
