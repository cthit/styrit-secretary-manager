import styled from "styled-components";

export const InfoCard = styled.div`
  margin: 20px;
  padding: 10px;
  background-color: orange;
  min-width: 300px;
  display: flex;
  min-height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
`;

export const Space = styled.div`
  min-height: 10px;
`;

export const CenterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FingerParagraph = styled.p`
  font-size: 32px;
  margin: 15px;
`