const express = require('express');
const { spawn } = require("child_process");
const path = require('path');
const app = express();
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'dipto.html')));
const http = require('http');
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
const io = new Server(httpServer);

function startBot() {
  const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "main.js"], {
      cwd: __dirname,
      stdio: "inherit",
      shell: true
  });

  child.on("close", (codeExit) => {
    console.log(`Bot process exited with code: ${codeExit}`);
    if (codeExit !== 0) {
       setTimeout(startBot, 3000); 
    }
  });

  child.on("error", (error) => {
    console.error(`An error occurred starting the bot: ${error}`);
  });
}
startBot(); 
const port = process.env.PORT || 5000;
httpServer.listen(port, () => {
  console.log(`Server with real-time updates running on http://localhost:${port}`);
});
module.exports = app;

//Modified by Jonell Magallanes
