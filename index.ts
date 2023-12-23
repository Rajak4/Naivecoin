import { Blockchain } from "./Blockchain";
import { WebServer } from "./web-server";


export const blockchain = new Blockchain();

const webServer = new WebServer(80);
