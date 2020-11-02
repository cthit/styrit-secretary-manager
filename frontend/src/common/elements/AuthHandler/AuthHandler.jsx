import React from "react";
import {Redirect, Route} from "react-router";
import {DigitText} from "@cthit/react-digit-components";

export class AuthHandler extends React.Component {
    componentDidMount() {
        const paramsResponse = new URLSearchParams(window.location.search)
        this.props.postGammaCode(paramsResponse.get(
            "code"
        ))
    }

    render() {
        return (
            <div>
                {
                    this.props.redirectTo !== "" && (
                        <Route>
                            <Redirect to={this.props.redirectTo}/>
                        </Route>
                    )
                }
                {
                    this.props.errors === "" ?
                        <DigitText.Text text="Authorizing..."/>
                        :
                        <DigitText.Text
                            text={"Failed to authenticate, error: " + this.props.errors}
                            style={{color: "red"}}/>
                }
            </div>
        )
    }
}