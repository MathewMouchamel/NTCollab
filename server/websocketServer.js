import { WebSocketServer } from "ws";
import * as Y from "yjs";
import * as syncProtocol from "y-protocols/sync";
import * as awarenessProtocol from "y-protocols/awareness";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";

const docs = new Map();
const messageSync = 0;
const messageAwareness = 1;

const messageHandlers = [];

messageHandlers[messageSync] = (conn, encoder, decoder) => {
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.readSyncMessage(decoder, encoder, conn.doc, conn);
};

messageHandlers[messageAwareness] = (conn, encoder, decoder) => {
  awarenessProtocol.applyAwarenessUpdate(
    conn.awareness,
    decoding.readVarUint8Array(decoder),
    conn
  );
};

const setupWSConnection = (conn, req, { docName = req.url.slice(1).split("?")[0], gc = true } = {}) => {
  conn.binaryType = "arraybuffer";
  
  const doc = docs.get(docName) || new Y.Doc();
  if (!docs.has(docName)) {
    docs.set(docName, doc);
  }
  
  conn.doc = doc;
  conn.awareness = new awarenessProtocol.Awareness(doc);
  
  conn.on("message", (message) => {
    try {
      const encoder = encoding.createEncoder();
      const decoder = decoding.createDecoder(new Uint8Array(message));
      const messageType = decoding.readVarUint(decoder);
      
      if (messageHandlers[messageType]) {
        messageHandlers[messageType](conn, encoder, decoder);
      }
      
      const response = encoding.toUint8Array(encoder);
      if (response.length > 1) {
        conn.send(response, (err) => {
          if (err) console.error("WebSocket send error:", err);
        });
      }
    } catch (err) {
      console.error("Message handling error:", err);
    }
  });

  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeSyncStep1(encoder, doc);
  conn.send(encoding.toUint8Array(encoder));
  
  const awarenessStates = conn.awareness.getStates();
  if (awarenessStates.size > 0) {
    const encoder2 = encoding.createEncoder();
    encoding.writeVarUint(encoder2, messageAwareness);
    encoding.writeVarUint8Array(encoder2, awarenessProtocol.encodeAwarenessUpdate(conn.awareness, Array.from(awarenessStates.keys())));
    conn.send(encoding.toUint8Array(encoder2));
  }
};

export function setupWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/collaboration",
  });

  wss.on("connection", (ws, req) => {
    console.log("WebSocket connection established");

    setupWSConnection(ws, req);

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return wss;
}
