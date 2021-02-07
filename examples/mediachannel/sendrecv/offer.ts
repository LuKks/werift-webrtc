import {
  RTCPeerConnection,
  useAbsSendTime,
  useSdesMid,
} from "../../../packages/webrtc/src";
import { Server } from "ws";

const server = new Server({ port: 8888 });
console.log("start");

server.on("connection", async (socket) => {
  const pc = new RTCPeerConnection({
    headerExtensions: {
      video: [useSdesMid(), useAbsSendTime()],
    },
  });

  const transceiver = pc.addTransceiver("video", "sendrecv");
  transceiver.onTrack.subscribe((track) =>
    track.onRtp.subscribe(transceiver.sendRtp)
  );

  await pc.setLocalDescription(pc.createOffer());
  const sdp = JSON.stringify(pc.localDescription);
  socket.send(sdp);

  socket.on("message", (data: any) => {
    pc.setRemoteDescription(JSON.parse(data));
  });
});
