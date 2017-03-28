const path = require('path');
const fs = require('fs');
const parse = require('csv-parse');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const http = require('http').Server(app);

const port = process.env.PORT || 7001;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 读取csv文件至内存
const inputFile='./public/报名表.csv';
const db = [];
const parser = parse({delimiter: ','}, (err, data) => {
  const key = data[0];
  for(let i=1; i< data.length; i++){
    const temp = {};
    data[i].forEach((item, index) => {
      temp[key[index]] = data[i][index];
    });
    db.push(temp);
  }
  console.log(db);
})
fs.createReadStream(inputFile).pipe(parser);

app.get('/', (req, res) => {
  res.send(db);
});

app.post('/getqrcode', (req, res) => {
  const phone = req.body.phone;
  let id;
  db.forEach((item) => {
    if (item['手机号码'] === phone){
      id = item['报名编号'];
    }
  });
  res.redirect(`./result.html?${id}`);
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
