import * as React from "react";
import ReactDOM from "react-dom";
import type { ClientAppProps } from "./components/client-app/client-app.component";
import { ClientApp } from "./components/client-app/client-app.component";

export default (initialState: ClientAppProps, el: HTMLElement) => {
  ReactDOM.render(<ClientApp {...initialState} />, el);
};
