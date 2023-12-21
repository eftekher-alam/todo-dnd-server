const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PROT || 5000;
// middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions));
app.use(express.json())



const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASS}@cluster0.ougk6tn.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const database = client.db("todoDndDB");
        const usersCollection = database.collection("users");


        /* ===================================================
                                Users
         ===================================================*/

        app.post("/user", async (req, res) => {
            const user = req.body;

            const query = { uid: user.uid };
            const userExist = await usersCollection.findOne(query);
            if (userExist)
                return;

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", async (req, res) => {
    res.send("Working Server");
});


app.listen(port, () => {
    console.log("todo-dnd-server is running on the prot ", port);
})