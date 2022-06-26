const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");
require('dotenv').config();
const cookieParser = require('cookie-parser');
const app = express();
const path = require("path")
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit:'512kb' }));
app.use(express.static('public'))
let service = true;
if(service === true){
  service = "http://localhost:3000"
} else {
  service = "https://reactspotify.vercel.app"
}

app.get('/', (req,res) => {
  res.sendFile('index.html', { root: path.join(__dirname, './files') });
})

app.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: `${service}/dashboard`,
    clientId: '3a7cc4035bcb44618275ce790c0197fa',
    clientSecret: 'fa4f489c5d7540e98e05de61a62d21ec',
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
      console.log(err)
    })
})
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: `${service}/dashboard`,
    clientId: '3a7cc4035bcb44618275ce790c0197fa',
    clientSecret: 'fa4f489c5d7540e98e05de61a62d21ec',
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})
app.listen(process.env.PORT || 3001, function() {
  console.log("hello")
})
