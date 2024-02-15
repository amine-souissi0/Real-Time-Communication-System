import express from "express";
import http from "http";
import cors from "cors";
import { ExpressPeerServer } from "peer";
// Create a PeerJS server
const peerApp = express();
peerApp.use(cors());
const peerServer = http.createServer(peerApp);
const peerJsServer = ExpressPeerServer(peerServer, {
    path: "/myapp",
});
peerApp.use("/peerjs", peerJsServer);
// Start the PeerJS server on port 9000
const PORT = 9000;
peerServer.listen(PORT, () => console.log(`peerJS server running on port ${PORT}`));
//# sourceMappingURL=call-peer.js.map