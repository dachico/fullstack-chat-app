import Avatar from "./Avatar";
import styled from "styled-components";

export default function Contact({ id, username, onClick, selected, online }) {
  return (
    <PeopleDiv onClick={() => onClick(id)} key={id} $isSelected={selected}>
      {selected && <SelectedDiv></SelectedDiv>}
      <Container>
        <Avatar online={online} username={username} userId={id} />
        <Span>{username}</Span>
      </Container>
    </PeopleDiv>
  );
}

const PeopleDiv = styled.div`
  border-bottom-width: 1px;
  border-color: #f3f4f6;
  border-style: solid;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  /* background-color: ${(props) =>
    props.$isSelected ? "#EFF6FF" : "transparent"};
   */
  background-color: ${(props) =>
    props.$isSelected ? "#effff5" : "transparent"};
  font-family: "Arial";
`;

const Span = styled.span`
  color: #4b5563;
`;

const Container = styled.div`
  display: flex;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  gap: 0.5rem;
  align-items: center;
`;

const SelectedDiv = styled.div`
  border-top-right-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
  width: 0.25rem;
  height: 3rem;
  background-color: #10b981;
`;
