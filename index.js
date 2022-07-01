const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const query = require('express/lib/middleware/query');

// middle wire
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nqmbu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'UnAuthorized access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'Forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     });
// }


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("task-manager").collection("tasks");
        const taskCompleted = client.db("task-manager").collection("completed");

        // post user information
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            // const token = jwt.sign({ email: newUser.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' });
            const result = await taskCollection.insertOne(newTask);
            res.send({ success: true, result });
        });

        // get all tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            tasks = await cursor.toArray();
            res.send(tasks);
        });
        // get single task
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        // put single task information in database
        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const editedTask = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: editedTask,
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        // delete Single task
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });
        //for complete  delete Single task
        app.delete('/tasks-complete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const cursor = taskCollection.find(query);
            comp = await cursor.toArray();
            const completed = await taskCompleted.insertOne(comp[0]);

            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        // get completed  product
        app.get('/tasks-complete', async (req, res) => {
            const query = {};
            const cursor = taskCompleted.find(query);
            complete = await cursor.toArray();
            res.send(complete);
        });

        // delete single product
        // app.delete('/tasks-complete/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };

        //     const cursor = taskCollection.find(query);
        //     complete = await cursor.toArray();
        //     const completed = await taskCompleted.insertOne(complete[0]);

        //     const result = await taskCollection.deleteOne(query);
        //     res.send(result);
        // });







    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})