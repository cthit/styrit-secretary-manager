import styled from "styled-components";
import { TextField } from "@material-ui/core";

export const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 50px;
`;

export const CodeTextField = styled(TextField)`
    min-width: 325px;
    margin: 20px;
`;

export const VSpace = styled.div`
  height: 10px;
`;
