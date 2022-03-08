const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(require('./routes'));

// mongoose connects when app is started - tells Mongoose which database we want to connect to.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pizza-hunt', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// MongoDB will find and connect to the database if it exists or create the database if it doesn't.
// use this to log mongo queries being executed!
mongoose.set('debug', true); 

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));
