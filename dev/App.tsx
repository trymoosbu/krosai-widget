import { Component } from "react";

import {
  Widget,
  addResponseMessage,
  setQuickButtons,
  toggleMsgLoader,
  addLinkSnippet,
} from "../index";
import { addUserMessage } from "..";
import React from "react";

export default class App extends Component {
  componentDidMount() {
    // addResponseMessage("Welcome to krosai, how can i help you!");
    // addLinkSnippet({ link: 'https://google.com', title: 'Google' });
    // addResponseMessage('![](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)');
    // addResponseMessage('![vertical](https://d2sofvawe08yqg.cloudfront.net/reintroducing-react/hero2x?1556470143)');
  }

  handleNewUserMessage = (newMessage: any) => {
    toggleMsgLoader();
    setTimeout(() => {
      toggleMsgLoader();
      if (newMessage === "fruits") {
        setQuickButtons([
          { label: "Apple", value: "apple" },
          { label: "Orange", value: "orange" },
          { label: "Pear", value: "pear" },
          { label: "Banana", value: "banana" },
        ]);
      } else {
        addResponseMessage(newMessage);
      }
    }, 2000);
  };

  handleQuickButtonClicked = (e: any) => {
    addResponseMessage("Selected " + e);
    setQuickButtons([]);
  };

  handleSubmit = (msgText: string) => {
    if (msgText.length < 80) {
      addUserMessage("Uh oh, please write a bit more.");
      return false;
    }
    return true;
  };

  render() {
    return (
      <>
        {/* @ts-expect-error Server Component */}
        <Widget
          title="KrosAI"
          subtitle="KrosAI Virtual Assistant"
          senderPlaceHolder="Type new Message."
          handleNewUserMessage={this.handleNewUserMessage}
          handleQuickButtonClicked={this.handleQuickButtonClicked}
          imagePreview
          handleSubmit={this.handleSubmit}
          emojis
        />
      </>
    );
  }
}
