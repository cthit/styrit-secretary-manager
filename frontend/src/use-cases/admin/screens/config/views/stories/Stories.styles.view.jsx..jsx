import styled from "styled-components";
import {DigitText} from "@cthit/react-digit-components";

export const StoriesContainer = styled.div`
    padding-top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
`;

export const StoriesSelectContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 60px;
    align-items: flex-start;
`;

export const HSpace = styled.div`
  width: 20px
`

export const HLine = styled.div`
  width: 85%;
  height: 1px;
  background-color: #909090;
  margin: 10px;
`;

export const SmallVSpace = styled.div`
  height: 20px
`;

export const VSpace = styled.div`
  height: 40px
`

export const StoryChipContainer = styled.div`
  width: 85%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  
`;

export const Margin = styled.div`
  margin: 20px
`
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


export const WarningText = styled(DigitText.Text)`
  color: orange;
  font-weight: bold;
`;