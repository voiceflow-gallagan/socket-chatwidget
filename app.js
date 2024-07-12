const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*', // Be careful with this in production!
    methods: ['GET', 'POST'],
  },
})

// Enable CORS for all routes
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/trigger', (req, res) => {
  const { chat, userId } = req.body

  if (!chat || !userId) {
    return res
      .status(400)
      .json({ error: 'Missing chat or userId in request body.' })
  }

  if (chat === 'zendesk') {
    console.log('Triggering Zendesk chat')
    io.to(userId).emit('trigger_zd')
    res.sendStatus(200)
  } else if (chat === 'voiceflow') {
    console.log('Triggering Voiceflow chat')
    io.to(userId).emit('trigger_vf')
    res.sendStatus(200)
  } else {
    res
      .status(400)
      .json({ error: 'Invalid chat value. Use "zendesk" or "voiceflow".' })
  }
})
io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} registered`)
  })
})

http.listen(3000, () => {
  console.log('Server is running on port 3000')
})
