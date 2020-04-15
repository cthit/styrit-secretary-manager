import styled from "styled-components";
import { DigitDesign } from "@cthit/react-digit-components";

export const UploadCardCard = styled(DigitDesign.Card)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    margin-right: 20px;
    margin-bottom: 20px;
`;

export const UploadCardContainer = styled.div`
    display: flex;
    flex-drection: row;
    justify-content: center;
    min-width: 500px;
    min-height: 60px;
`;

export const UploadCardButton = styled.button`
    border: 2px solid #909090;
    border-radius: 5px;
    background-color: #d0d0d0;
    width: 500px;
    height: 70px;
    margin: 10px;
`;

export const UploadCardInput = styled.input`
    width: 100%;
    height: 100%;
`;
