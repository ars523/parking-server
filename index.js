const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const admin = require("firebase-admin");
const stripe = require("stripe")('sk_test_51L0lwtHGg1scLdsyhevcIYE2QkaXKnXBE8qDnrLNRtRZBv0X3JznXSAU9nsGPzyDR7cDEYJWl5PsTilDXuv6Oe5G00Pmg9XGuK');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require('express');
const password = 'gWvytrY09IP2D8Gw';
const user = 'parkinguser';

const app = express();
app.use(cors());
app.use(bodyparser.json())
const port = 5000

const uri = `mongodb+srv://${user}:${password}@cluster0.zm4oi.mongodb.net/parking?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const usersCollection = client.db("parking").collection("users");
    const bookingCollection = client.db("parking").collection("bookings");

    //Get a single user
    app.get('/user', async (req, res)=>{
        const email = req.query.email;
        const query = {email: email};
        const cursor = usersCollection.find(query);
        const user = await cursor.toArray()
        res.json(user)
        
    })

    //Get all users
    app.get('/users', async (req, res)=>{
        const cursor = usersCollection.find({});
        const users = await cursor.toArray()
        res.json(users)
        
    })

    //Upsert after login
    app.put('/users', async(req, res)=>{
        const user = req.body;
        const filter = {email: user.email};
        const options = {upsert: true};
        const updateDoc = {$set: user};
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    })

    //update user 
    app.patch('/user/update', async(req, res)=>{ 
        const user = req.body;
        const filter = {email: user.email};
        const updateDoc = {$set: user}
        const result = await usersCollection.updateOne(filter, updateDoc)
        res.json(result);
    })

    //POST bookings
    app.post('/bookings', async(req, res)=>{
        const booking = req.body;

        const query = { email: booking.ownerEmail, "parkingSlots.slotName": booking.parkNo};
        const updateDocument = {
          $set: { "parkingSlots.$.booked": true}
        };

        const result = await bookingCollection.insertOne(booking);
        const result2 = await usersCollection.updateOne(query, updateDocument);
        res.json(result)
    })
    //Get a single bookings by id

    app.get('/booking/:bookingId', async (req, res)=>{
        const id = req.params.bookingId;
        const query = {_id: ObjectId(id)};
        const result = await bookingCollection.findOne(query);
        res.json(result);
    })

    //Get all driver booking by email
    app.get('/driverBooking', async (req, res)=>{
        const email = req.query.email;
        const query = {driverEmail: email};
        const cursor = bookingCollection.find(query);
        const driverBookings = await cursor.toArray()
        res.json(driverBookings)
        
    })

    //Get all owner booking by email
    app.get('/ownerBooking', async (req, res)=>{
        const email = req.query.email;
        const query = {ownerEmail: email};
        const cursor = bookingCollection.find(query);
        const ownerBookings = await cursor.toArray()
        res.json(ownerBookings)
        
    })

    //Stripe payment
    app.post('/create-payment-intent', async (req, res)=>{
        const paymentInfo = req.body;
        const amount = paymentInfo.price*100;
        const paymentIntent = await stripe.paymentIntents.create({
            currency: 'usd',
            amount: amount,
            payment_method_types: ['card']
        })
        res.json({clientSecret: paymentIntent.client_secret})
    })

});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})