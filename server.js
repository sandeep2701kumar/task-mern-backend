const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMiddleware');
const connectDB = require('./connect/database');
const os = require("os");

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/debug-egress-ip", async (req, res) => {
    try {
        const response = await fetch("https://api.ipify.org");
        const ip = await response.text();

        console.log("Back4App outbound IP:", ip);

        res.json({ outboundIP: ip });
    } catch (error) {
        console.error("Unable to determine outbound IP:", error.message);
        res.status(500).json({ error: "Could not determine outbound IP" });
    }
});

app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));



app.use(errorHandler);
const startServer = async () => {
    try{
        await connectDB();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    }
    catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
}

startServer();
