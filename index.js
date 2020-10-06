const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 4007
// app.get('/', (req, res) =>{
//   res.send('working')
// })

const app = express()
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://volun:volun007@cluster0.tnjvj.mongodb.net/volunteer?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const bookings = client.db("volunteer").collection("volunteertyp");
    const ordersCollection = client.db("volunteer").collection("orders");
    console.log('connected successfully')
    
    app.get('/volunteer', (req, res) => {
    bookings.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

    app.post('/register', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })


    app.get('/events', (req, res) => {
    ordersCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })


      app.get('/events', (req, res) => {
        console.log(req.headers.authorization)
        const bearer = req.headers.authorization;
        if (bearer && bearer.startsWith('Bearer ')) {
            const idToken = bearer.split(' ')[1];
            console.log({ idToken })
            admin.auth().verifyIdToken(idToken)
                .then(function (decodedToken) {
                    const tokenEmail = decodedToken.email;
                    const queryEmail = req.query.email;
                    console.log(queryEmail, tokenEmail)
                    if (tokenEmail == req.query.email) {
                        ordersCollection.find({ email: req.query.email })
                            .toArray((err, documents) => {
                                res.send(documents);
                            })
                    }
                    let uid = decodedToken.uid;
                    console.log({ uid })
                    // ...
                }).catch(function (error) {
                    // Handle error
                });
        }
        else{
            res.status(401).send('un-authorized access')
        }


    })


    app.delete('/delete/:id', (req,res) => {
    console.log(req.params.id);
    ordersCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then (( result) => {
      console.log(result);
      // res.send(result.deletedCount>0);
    })
  })



});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)