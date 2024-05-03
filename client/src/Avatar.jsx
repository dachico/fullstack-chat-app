import styled from "styled-components";

export default function Avatar({ userId, username, online }) {
  const colors = [
    "#99F6E4",
    "#FECACA",
    "#A7F3D0",
    "#DDD6FE",
    "#BFDBFE",
    "#FDE68A",
  ];
  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  return (
    <AvatarDiv color={color}>
      <Div>{username && username[0]} </Div>
      {online && <IsOnline></IsOnline>}
      {!online && <IsOffline></IsOffline>}
    </AvatarDiv>
  );
}

const IsOnline = styled.div`
  position: absolute;
  width: 0.625rem;
  height: 0.625rem;
  background-color: #34d399;
  border-radius: 9999px;
  right: 0;
  bottom: 0;
  border: solid;
  border-width: 1px;
  border-color: #ffffff;
`;

const IsOffline = styled.div`
  position: absolute;
  width: 0.625rem;
  height: 0.625rem;
  background-color: #9ca3af;
  border-radius: 9999px;
  right: 0;
  bottom: 0;
  border: solid;
  border-width: 1px;
  border-color: #ffffff;
`;

const AvatarDiv = styled.div`
  position: relative;
  border-radius: 9999px;
  width: 2rem;
  height: 2rem;
  background-color: ${(props) => props.color};
  display: flex;
  align-items: center;
`;

const Div = styled.div`
  text-align: center;
  width: 100%;
  font-size: 1.2rem;
  opacity: 0.7;
`;
