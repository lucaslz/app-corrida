import express from "express";
import { AccountDAODatabase } from "./AccountDAO";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import Ride from "./Ride";
import { RideDAODatabase } from "./RideDAO";
import pgp from "pg-promise";
import crypto from "crypto";

const app = express();
app.use(express.json());
const port = 3000;

app.post('/signup', async function (req, res) {
    const accountDAO = new AccountDAODatabase();
    const signup = new Signup(accountDAO);
    const outputAccount = await signup.execute(req.body);
    res.json(outputAccount);
});

app.get('/accounts/:accountId', async function (req, res) {
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const outputGetAccount = await getAccount.execute(req.params.accountId);
    res.json(outputGetAccount);
});

app.post('/request_ride', async function (req, res) {
    const data = req.body;
    const rideDao = new RideDAODatabase();
    const ride = new Ride(rideDao);
    const rideId = await ride.execute(data);
    res.json(rideId);
});

app.post('/rides/:rideId', async function (req, res) {
    const rideParam = req.params;
    const rideDao = new RideDAODatabase();
    const ride = await rideDao.getById(rideParam.rideId);
    res.json(ride);
});

app.listen(port);