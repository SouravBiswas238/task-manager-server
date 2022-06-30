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

        // // get single email
        // app.get('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const user = await userCollection.findOne(query);
        //     res.send(user);
        // })

        // // put single email information in database
        // app.put('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        // })

        // // post Single product
        // app.post('/product', async (req, res) => {
        //     const newProduct = req.body;
        //     const query = { name: newProduct.name }
        //     console.log(query)
        //     const exists = await productCollection.findOne(query);
        //     if (exists) {
        //         return res.send({ success: false, product: exists })
        //     }
        //     const result = await productCollection.insertOne(newProduct);
        //     res.send({ success: true, result });
        // });

        // // delete Single product
        // app.delete('/product/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productCollection.deleteOne(query);
        //     res.send(result);
        // });



        // // get single email order
        // app.get('/order/:email', verifyJWT, async (req, res) => {
        //     const email = req.params.email;
        //     const decodedEmail = req.decoded.email;
        //     if (email === decodedEmail) {
        //         const query = { email: email }
        //         const result = await orderCollection.find(query).toArray();
        //         return res.send(result);
        //     }
        //     else {
        //         return res.status(403).send({ message: 'forbidden access' });
        //     }

        // })





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