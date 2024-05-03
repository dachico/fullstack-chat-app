import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperPlane,
  faUser,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState, useRef } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniq, uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setonlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { username, id, setUsername, setId } = useContext(UserContext);
  const divUnderMessages = useRef();
  useEffect(() => {
    connectToWs();
  }, []);

  // function isImage(file) {
  //   const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  //   const extension = file.split(".").pop().toLowerCase();
  //   return imageExtensions.includes(extension);
  // }

  axios.defaults.baseURL = "https://fullstack-chat-app-ten.vercel.app";

  function connectToWs() {
    const ws = new WebSocket("wss://fullstack-chat-app-ten.vercel.app/");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Disconnected, Trying to reconnect.");
        connectToWs();
      }, 1000);
    });
  }

  function setupWebSocket() {
    const ws = new WebSocket("wss://fullstack-chat-app-ten.vercel.app/");

    ws.onclose = function () {
      console.log("Disconnected, trying to reconnect...");
      setTimeout(setupWebSocket, 5000); // Reconnect every 5 seconds
    };

    ws.onerror = function (err) {
      console.error("WebSocket encountered an error:", err);
      ws.close();
    };

    ws.onmessage = function (message) {
      console.log("Received:", message.data);
    };

    setWs(ws);
  }

  useEffect(() => {
    setupWebSocket();
    return () => ws && ws.close();
  }, []);

  function showOnlinePepole(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setonlinePeople(people);
  }
  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ("online" in messageData) {
      showOnlinePepole(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  function logout() {
    axios.post("logout").then(() => {
      setWs(null);
      setUsername(null);
      setId(null);
    });
  }

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        console.log(res.data);
        setMessages(res.data);
      });
    } else {
      setNewMessageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMessageText,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        console.log(res.data);
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  const onlinePepoleExclOurUser = { ...onlinePeople };
  delete onlinePepoleExclOurUser[id];

  const messagesWithoutDupes = uniqBy(messages, "_id");

  return (
    <Div>
      <ADiv>
        <WrapLeft>
          <Logo />
          {Object.keys(onlinePepoleExclOurUser).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={true}
              username={onlinePepoleExclOurUser[userId]}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}

          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              id={userId}
              online={false}
              username={offlinePeople[userId].username}
              onClick={() => setSelectedUserId(userId)}
              selected={userId === selectedUserId}
            />
          ))}
        </WrapLeft>

        <Links>
          <LoggedSpan>
            <FontAwesomeIcon icon={faUser} /> {username}
          </LoggedSpan>
          <LogoutBtn onClick={logout}>Logout</LogoutBtn>
        </Links>
      </ADiv>
      <BDiv>
        <CDiv>
          {!selectedUserId && (
            <NoSelected>
              <SelectedColor>
                &larr; Select a person from the sidebar
              </SelectedColor>
            </NoSelected>
          )}
          {!!selectedUserId && (
            <AboveMsg>
              <ScrollDiv>
                {messagesWithoutDupes.map((message, index) => (
                  <WrapMsg $sender={message.sender === id} key={index}>
                    <MsgDiv $sender={message.sender === id} key={index}>
                      {message.text}
                      {message.file && (
                        <ALink
                          $sender={message.sender === id}
                          target="_blank"
                          href={
                            axios.defaults.baseURL + "/uploads/" + message.file
                          }
                        >
                          <FontAwesomeIcon icon={faLink} />
                          {message.file}
                        </ALink>
                      )}
                    </MsgDiv>
                  </WrapMsg>
                ))}
                <div ref={divUnderMessages}></div>
              </ScrollDiv>
            </AboveMsg>
          )}
        </CDiv>
        {!!selectedUserId && (
          <InputForm onSubmit={sendMessage}>
            <Input
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              type="text"
              placeholder="Type your message here"
            />
            <FilesButton>
              <FilesInput type="file" onChange={sendFile} />
              <FontAwesomeIcon icon={faLink} />
            </FilesButton>
            <Button type="submit">
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </InputForm>
        )}
      </BDiv>
    </Div>
  );
}

const ALink = styled.a`
  display: flex;
  gap: 0.25rem;
  align-items: center;
  border-bottom-width: 1px;
  color: ${(props) => (props.$sender ? "white" : "#4B5563")};
`;

const FilesInput = styled.input`
  display: none;
`;

const FilesButton = styled.label`
  background-color: #c1f1dc;
  padding: 0.5rem;
  border-radius: 50%;
  color: #4b5563;
  text-align: center;
  cursor: pointer;
`;

const LoggedSpan = styled.span`
  margin-right: 0.5rem;
  font-size: 1rem;
  line-height: 1.25rem;
  color: #4b5563;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoutBtn = styled.div`
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  border-radius: 0.375rem;
  border: solid;
  border-width: 0.5px;
  border-color: lightgray;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #6b7280;
  background-color: #a7f3d0;
  display: inline-block;
  cursor: pointer;
`;

const Links = styled.div`
  padding: 0.5rem;
  text-align: center;
  font-family: Arial, Helvetica, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WrapLeft = styled.div`
  flex-grow: 1;
`;

const AboveMsg = styled.div`
  position: relative;
  height: 100%;
`;

const WrapMsg = styled.div`
  text-align: ${(props) => (props.$sender ? "right" : "left")};
`;

const ScrollDiv = styled.div`
  overflow-y: scroll;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0.5rem;
  left: 0;
`;

const MsgDiv = styled.div`
  display: inline-block;
  text-align: left;
  color: ${(props) => (props.$sender ? "white" : "#4B5563")};
  background-color: ${(props) => (props.$sender ? "#10B981" : "white")};
  padding: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-family: "Arial";
`;

const SelectedColor = styled.div`
  color: #959699;
`;

const NoSelected = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Div = styled.div`
  display: flex;
  height: 100vh;
`;

const ADiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 25%;
`;

const BDiv = styled.div`
  background-color: #f3f3f3;
  width: 75%;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const CDiv = styled.div`
  flex-grow: 1;
`;

const InputForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  background-color: #ffffff;
  box-sizing: border-box;
  flex-grow: 1;
  border: none;
  border-radius: 15px;
`;

const Button = styled.button`
  background-color: #10b981;
  padding: 0.5rem;
  border-radius: 50%;
  color: #ffffff;
  border: none;
  text-align: center;
  cursor: pointer;
`;
