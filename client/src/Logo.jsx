import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

export default function Logo() {
  return (
    <LogoDiv>
      <FontAwesomeIcon icon={faComments} />
      <BoldText>Chat-App</BoldText>
    </LogoDiv>
  );
}

const LogoDiv = styled.div`
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 800;
  color: #059669;
`;

const BoldText = styled.span`
  font-weight: 800;
  font-family: "Arial";
`;
