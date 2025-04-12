const cors = require('cors');
const mongoose  = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');
const app = express();
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');

dotenv.config(); // <-- Make sure this line is here!
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next()
}
)

app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);

const port = process.env.PORT | 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the Express server!');
})

const startServer = async () => {
    app.listen(port, () => {
        console.log(`server app listening on port ${port}`)
    })

    try {
        await mongoose.connect(process.env.MONGO_URI);

          
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}   

startServer();