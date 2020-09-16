import styled from "styled-components";

export const GeneralConfigContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin-top: 30px;
`;

export const ConfigListContainer = styled.div`
  width: 80%;
  max-width: 1000px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;  
`

export const ConfigContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  padding-right: 8px;  
  display: flex;
  flex-direction: row;
`

export const HLine = styled.div`
  height: 1px;
  width: 100%;
  background-color: gray;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const LeftCol = styled.div`
  width: 20%
`;

export const HelpCard = styled.div`
  margin-top: 40px;
  position: sticky;
  position: -webkit-sticky;
  top: 10px;
  border-radius: 4px;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px -1px rgba(0,0,0,0.12);
  padding: 10px;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`