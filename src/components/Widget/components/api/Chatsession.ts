import useWebSocket, { ReadyState } from "react-use-websocket";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const GetChatSession = (session_id: number) => {
  const url = `https://krosai.azurewebsites.net/chat_session/${session_id}`;

  const { data: chatSession, error } = useSWR(url, fetcher);

  if (error) return { error: "An error occurred" };
  if (!chatSession) return { loading: true };

  return { chatSession };
};

export const GetChatSessions = (assistant_id: number) => {
  const url = `https://krosai.azurewebsites.net/chat_session/${assistant_id}`;

  const { data: chatSessions, error } = useSWR(url, fetcher);

  if (error) return { error: "An error occurred" };
  if (!chatSessions) return { loading: true };

  return { chatSessions };
};

// export const GetWebsocketChat = (message: string) => {
//   const socketUrl = `wss://krosai.azurewebsites.net/agent/chat/${session_id}`

//   const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
//   // const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

//   // useEffect(() => {
//   //   if (lastMessage !== null) {
//   //     setMessageHistory((prev) => prev.concat(lastMessage));
//   //   }
//   // }, [lastMessage]);

//   const connectionStatus = {
//     [ReadyState.CONNECTING]: "Connecting",
//     [ReadyState.OPEN]: "Open",
//     [ReadyState.CLOSING]: "Closing",
//     [ReadyState.CLOSED]: "Closed",
//     [ReadyState.UNINSTANTIATED]: "Uninstantiated",
//   }[readyState];

//   console.log(connectionStatus);

// }
