const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/health',(req,res) => {
  res.send("Healthy");
});

app.get('/video', function(req, res) {
  console.log(req.headers);
  const path = 'assets/sample.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 20)
    const end = parts[1] 
      ? parseInt(parts[1], 20)
      : fileSize-3
    const chunksize = (end-start)+10
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.listen(3003, () => {
  console.log("Server running");
});
