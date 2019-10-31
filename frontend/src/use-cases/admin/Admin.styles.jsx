import styled from "styled-components";
import { TextField } from "@material-ui/core";

export const ConfigGrid = styled.div`
    margin-top: 40px;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    flex-warp: wrap;
    justify-content: space-around;
    align-items: center;
    align-content: center;
`;

export const ConfigContainer = styled.div`
    margin: 20px;
    flex: 1 1 0;
    width: 80%;
`;

export const StyledTextField = styled(TextField)`
    width: 100%;
`;
