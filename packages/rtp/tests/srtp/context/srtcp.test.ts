import { RtcpHeader } from "../../../src/rtcp/header";
import { SrtcpContext } from "../../../src/srtp/context/srtcp";

const rtcpTestMasterKey = Buffer.from([
  0xfd, 0xa6, 0x25, 0x95, 0xd7, 0xf6, 0x92, 0x6f, 0x7d, 0x9c, 0x02, 0x4c, 0xc9,
  0x20, 0x9f, 0x34,
]);
const rtcpTestMasterSalt = Buffer.from([
  0xa9, 0x65, 0x19, 0x85, 0x54, 0x0b, 0x47, 0xbe, 0x2f, 0x27, 0xa8, 0xb8, 0x81,
  0x23,
]);

const rtcpTestEncrypted = Buffer.from([
  0x80, 0xc8, 0x00, 0x06, 0x66, 0xef, 0x91, 0xff, 0xcd, 0x34, 0xc5, 0x78, 0xb2,
  0x8b, 0xe1, 0x6b, 0xc5, 0x09, 0xd5, 0x77, 0xe4, 0xce, 0x5f, 0x20, 0x80, 0x21,
  0xbd, 0x66, 0x74, 0x65, 0xe9, 0x5f, 0x49, 0xe5, 0xf5, 0xc0, 0x68, 0x4e, 0xe5,
  0x6a, 0x78, 0x07, 0x75, 0x46, 0xed, 0x90, 0xf6, 0xdc, 0x9d, 0xef, 0x3b, 0xdf,
  0xf2, 0x79, 0xa9, 0xd8, 0x80, 0x00, 0x00, 0x01, 0x60, 0xc0, 0xae, 0xb5, 0x6f,
  0x40, 0x88, 0x0e, 0x28, 0xba,
]);
const rtcpTestEncrypted2 = Buffer.from([
  0x80, 0xc8, 0x00, 0x06, 0x11, 0x11, 0x11, 0x11, 0x17, 0x8c, 0x15, 0xf1, 0x4b,
  0x11, 0xda, 0xf5, 0x74, 0x53, 0x86, 0x2b, 0xc9, 0x07, 0x29, 0x40, 0xbf, 0x22,
  0xf6, 0x46, 0x11, 0xa4, 0xc1, 0x3a, 0xff, 0x5a, 0xbd, 0xd0, 0xf8, 0x8b, 0x38,
  0xe4, 0x95, 0x38, 0x5d, 0xcf, 0x1b, 0xf5, 0x27, 0x77, 0xfb, 0xdb, 0x3f, 0x10,
  0x68, 0x99, 0xd8, 0xad, 0x80, 0x00, 0x00, 0x01, 0x34, 0x3c, 0x2e, 0x83, 0x17,
  0x13, 0x93, 0x69, 0xcf, 0xc0,
]);
const rtcpTestDecrypted = Buffer.from([
  0x80, 0xc8, 0x00, 0x06, 0x66, 0xef, 0x91, 0xff, 0xdf, 0x48, 0x80, 0xdd, 0x61,
  0xa6, 0x2e, 0xd3, 0xd8, 0xbc, 0xde, 0xbe, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00,
  0x16, 0x04, 0x81, 0xca, 0x00, 0x06, 0x66, 0xef, 0x91, 0xff, 0x01, 0x10, 0x52,
  0x6e, 0x54, 0x35, 0x43, 0x6d, 0x4a, 0x68, 0x7a, 0x79, 0x65, 0x74, 0x41, 0x78,
  0x77, 0x2b, 0x00, 0x00,
]);
const rtcpTestDecrypted2 = Buffer.from([
  0x80, 0xc8, 0x00, 0x06, 0x11, 0x11, 0x11, 0x11, 0xdf, 0x48, 0x80, 0xdd, 0x61,
  0xa6, 0x2e, 0xd3, 0xd8, 0xbc, 0xde, 0xbe, 0x00, 0x00, 0x00, 0x09, 0x00, 0x00,
  0x16, 0x04, 0x81, 0xca, 0x00, 0x06, 0x66, 0xef, 0x91, 0xff, 0x01, 0x10, 0x52,
  0x6e, 0x54, 0x35, 0x43, 0x6d, 0x4a, 0x68, 0x7a, 0x79, 0x65, 0x74, 0x41, 0x78,
  0x77, 0x2b, 0x00, 0x00,
]);

describe("srtp/context/srtcp", () => {
  test("TestRTCPLifecycle", () => {
    const encryptContext = new SrtcpContext(
      rtcpTestMasterKey,
      rtcpTestMasterSalt,
      1
    );
    const decryptContext = new SrtcpContext(
      rtcpTestMasterKey,
      rtcpTestMasterSalt,
      1
    );

    const [decryptResult] = decryptContext.decryptRTCP(rtcpTestEncrypted);
    expect(decryptResult).toEqual(rtcpTestDecrypted);

    const encryptResult = encryptContext.encryptRTCP(rtcpTestDecrypted);
    expect(encryptResult).toEqual(rtcpTestEncrypted);
  });

  test("TestRTCPLifecycleInPlace", () => {
    const encryptHeader = new RtcpHeader();
    const encryptContext = new SrtcpContext(
      rtcpTestMasterKey,
      rtcpTestMasterSalt,
      1
    );

    const decryptContext = new SrtcpContext(
      rtcpTestMasterKey,
      rtcpTestMasterSalt,
      1
    );

    const decryptInput = Buffer.from(rtcpTestEncrypted);
    const [actualDecrypted, decryptHeader] =
      decryptContext.decryptRTCP(decryptInput);
    expect(decryptHeader.type).toBe(200);
    expect(actualDecrypted).toEqual(rtcpTestDecrypted);
  });
});
