import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";

import { websocket, reconnect } from "./websocket";
import { network } from "./network";
import { fetchIssueDocumentCheque } from "./document/";
import { documentSlice } from "./document";
import { appSlice } from "./app";

interface IOoptions {
  reconnection: boolean;
  timeout: number;
  path?: string;
}

const socketMiddleware: Middleware = store => {
  let socket: Socket;

  return next => action => {
    if (network.success.match(action) || websocket.connect.match(action)) {
      const socketIOAddress = action.payload ? action.payload.socketIOAddress : store.getState().websocket.socketIOAddress;
      const socketIOPath = action.payload ? action.payload.socketIOPath : store.getState().websocket.socketIOPath;
      const options: IOoptions = {
        reconnection: false,
        timeout: 1000
      };
      if (socketIOPath) options.path = socketIOPath;
      // socket.disconnect()
      if (!socket) {
        socket = io(socketIOAddress, options);
        const guid = store.getState().app.guid;
        socket.on('connect', () => store.dispatch(websocket.setConnected({
          guid, socketIOAddress, socketIOPath
        })));
        socket.on("disconnect", () => store.dispatch(websocket.setDisconnected()));
        socket.on("connect_error", () => store.dispatch(websocket.setConnectError()));
        socket.on("connect_timeout", () => store.dispatch(websocket.setConnectTimeout()));
        socket.on("ping", () => store.dispatch(websocket.ping()));
        socket.on("pong", () => store.dispatch(websocket.pong()));

        // const checkInterval = setInterval(() => {
        //   var state = store.getState().websocket.state;
        //   if (!state.connected) {
        //     store.dispatch(reconnect());
        //   }
        // }, 10000);
      }
      store.dispatch(websocket.setConnecting());
      socket.connect();
    }

    if (websocket.setConnected.match(action)) {
      socket.emit(
        "subscribe",
        {guid: action.payload},
        (zoneId: number) => {
          store.dispatch(websocket.subscribe(zoneId));
        }
      );
    }

    if (documentSlice.actions.fetchDocumentCheque.match(action)) {
      socket.once("issueResult", (msg: any) => { 
        store.dispatch(documentSlice.actions.fetchDocumentCheque(false))
        store.dispatch(documentSlice.actions.successCloseChequeApp(msg))
        // reloadDeviceStatus();
      });
    }

    if (appSlice.actions.websocketOpenShift.match(action)) {
      socket.once("issueResult", (msg: any) => { 
        store.dispatch(appSlice.actions.toggleOpenShiftButtonClick(false));
        store.dispatch(documentSlice.actions.successCloseChequeApp(msg))
        // reloadDeviceStatus();
      });
    }

    next(action);
  };
};

export default socketMiddleware;
