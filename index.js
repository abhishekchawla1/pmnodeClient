// Program that caputure local machine data and send it the node server using socket
// why we are not using here http reson is this data will change in each milisecond.
// dependencies
const http = require("http");
const io = require("socket.io-client");
const dotenv = require("dotenv");
const macAddres = require("./services/networkService/getNetworkData.js");
const producedDataOfCpu = require("./services/cpuService/cpuData.js");
dotenv.config();
const options = {
  auth: {
    token: "aaeygaotohmodihe",
  },
};

const socket = io("https://pmserver-98nl.onrender.com", options);
socket.on("connect", () => {
  const prefInterval = setInterval(() => {
    producedDataOfCpu()
      .then((data) => {
        let prefData = data;
        // prefData.mac = macAddres + Math.floor(Math.random()*100000); // run when only you are in dev mode
        prefData.mac = macAddres; // run when you are only in prod mode;
        // console.log(prefData)
        socket.emit("prefData", prefData);
      })
      .catch((error) => console.error(error));
  }, 1000);
  socket.on("disconnect", () => {
    clearInterval(prefInterval);
  });
});

const port = process.env.PORT || 3000; // Use a specific port or fallback to 3000
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Client is running\n");
});

server.listen(port, () => {
  console.log(`Client is listening on port on some port..`);
});
// this is console.log statement
