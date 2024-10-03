import "../components/Header/sessionstyles.scss";

export interface ChatSessionsModel {
  id: number;
  assistant_id: number | string;
  session_identifier: string;
  user_agent: string;
  ip_address: string;
  summary: string;
  sentiment: string;
  call_type: string;
  email: string;
  name: string;
  started_at: string;
  ended_at: string;
}

type SessionsType = {
  dateTime: string;
  mode: string;
  SelectedSessionID: (e: number) => void;
  handleChangeSession: (e: number) => void;
  chatSessions: ChatSessionsModel;
  active: boolean;
};

const Sessions = ({
  dateTime,
  mode,
  active,
  chatSessions,
  handleChangeSession,
}: SessionsType) => {
  return (
    <div onClick={() => handleChangeSession(chatSessions?.id)}>
      <div
        className={` container ${active ? "container_active" : "container"}`}
      >
        <div>
          <h1>{dateTime}</h1>
          <h1>{mode}</h1>
        </div>
      </div>
    </div>
  );
};

export default Sessions;
