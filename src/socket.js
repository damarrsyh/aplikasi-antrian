import { io } from "socket.io-client";
const socket = io("http://192.168.4.141:3000"); // ganti sesuai alamat backend WebSocket-mu
export default socket;