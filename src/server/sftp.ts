import Client, { ConnectOptions } from "ssh2-sftp-client";
import { env } from "~/env";
export const sftpConfig: ConnectOptions = {
  host: "172.17.0.1",
  port: 9902,
  username: env.SFTP_USER,
  password: env.SFTP_PASS_E,
};
export const sftp = new Client();
