import { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setisLoginOrRegister] = useState("login");

  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  // async function handleSubmit(ev) {
  //   ev.preventDefault();
  //   const url = isLoginOrRegister === "register" ? "register" : "login";

  //   const { data } = await axios.post(url, { username, password });
  //   setLoggedInUsername(username);
  //   setId(data.id);
  // }

  async function handleLogin(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("login", { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (err) {
      console.error("Login Failed:", err);
    }
  }

  async function handleRegister(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("register", { username, password });
      setLoggedInUsername(username);
      setId(data.id);
    } catch (err) {
      console.error("Registration failed:", err);
    }
  }

  return (
    <Wrapper>
      <Form>
        <Input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          type="text"
          placeholder="username"
        />
        <Input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          type="password"
          placeholder="password"
          autoComplete="current-password"
        />

        <BtnsWrapper>
          <LoginBtn onClick={handleLogin}>Login</LoginBtn>
          <RegisterBtn onClick={handleRegister}>Register</RegisterBtn>
        </BtnsWrapper>
      </Form>
    </Wrapper>
  );
}

//   return (
//     <Wrapper>
//       <Form onSubmit={handleSubmit}>
//         <Input
//           value={username}
//           onChange={(ev) => setUsername(ev.target.value)}
//           type="text"
//           placeholder="username"
//         />
//         <Input
//           value={password}
//           onChange={(ev) => setPassword(ev.target.value)}
//           type="password"
//           placeholder="password"
//         />
//         <RegisterBtn>
//           {isLoginOrRegister === "register" ? "Register" : "Login"}
//         </RegisterBtn>
//         <Login>
//           {isLoginOrRegister === "register" && (
//             <div>
//               Already a member?
//               <Btn onClick={() => setisLoginOrRegister("login")}>
//                 Login Here
//               </Btn>
//             </div>
//           )}
//           {isLoginOrRegister === "login" && (
//             <div>
//               Dont have an account?
//               <Btn onClick={() => setisLoginOrRegister("register")}>
//                 Register
//               </Btn>
//             </div>
//           )}
//         </Login>
//       </Form>
//     </Wrapper>
//   );
// }

const BtnsWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const Wrapper = styled.div`
  height: 100vh;
  background-color: #eff6ff;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  width: 16rem;
  margin: auto;
`;

const Input = styled.input`
  display: block;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 0.125rem;
  border: none;
  width: 100%;
  box-sizing: border-box;
`;

const RegisterBtn = styled.button`
  display: block;
  width: 50%;
  color: #ffffff;
  background-color: #059669;
  border-radius: 0.375rem;
  border: none;
  padding: 8px;
  box-sizing: border-box;
  cursor: pointer;
`;

const LoginBtn = styled.button`
  display: block;
  width: 50%;
  color: #ffffff;
  background-color: #059669;
  border-radius: 0.375rem;
  border: none;
  padding: 8px;
  box-sizing: border-box;
  cursor: pointer;
`;

const Login = styled.div`
  text-align: center;
  margin-top: 0.5rem;
`;

const Btn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
