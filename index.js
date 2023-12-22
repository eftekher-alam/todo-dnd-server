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
        const todoItemsCollection = database.collection("todoItems");


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

        /* ===================================================
                        todo
        ===================================================*/


        app.get("/tasks", async (req, res) => {
            const email = req.query.email;
            // console.log(email);
            const taskFilter = { email: email };
            const result = await todoItemsCollection.find(taskFilter).toArray();
            res.status(200).send(result);
        })
        app.get("/task/:id", async (req, res) => {
            const _id = req.params.id;
            // console.log(_id);
            const taskFilter = { _id: new ObjectId(_id) };
            const result = await todoItemsCollection.findOne(taskFilter);
            res.status(200).send(result);
        })

        app.post("/task", async (req, res) => {
            const body = req.body;
            const result = await todoItemsCollection.insertOne(body);
            if (result.insertedId.toString().length)
                return res.send({ success: true });
            else
                return res.send({ success: false });
        })

        app.patch("/task", async (req, res) => {
            const body = req.body;
            // console.log(body);
            const taskFilter = { _id: new ObjectId(body._id) };

            const updateTask = {
                $set: {
                    name: body.name,
                    desc: body.desc,
                    status: body.status,
                    priority: body.priority,
                    email: body.email
                },
            };

            const result = await todoItemsCollection.updateOne(taskFilter, updateTask);
            if (result.modifiedCount)
                return res.send({ success: true });
            else
                return res.send({ success: false });
        })

        app.patch("/task", async (req, res) => {
            const body = req.body;
            // console.log(body);
            const taskFilter = { _id: new ObjectId(body._id) };

            const updateTask = {
                $set: {
                    status: body.status
                },
            };

            const result = await todoItemsCollection.updateOne(taskFilter, updateTask);
            if (result.modifiedCount)
                return res.send({ success: true });
            else
                return res.send({ success: false });
        })

        app.delete("/task/:id", async (req, res) => {
            const id = req.params.id;

            const taskFilter = { _id: new ObjectId(id) };

            const result = await todoItemsCollection.deleteOne(taskFilter);
            if (result.deletedCount)
                return res.send({ success: true });
            else
                return res.send({ success: false });
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