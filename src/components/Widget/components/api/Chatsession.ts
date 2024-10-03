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
