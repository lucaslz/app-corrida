import express from "express";
import { AccountDAODatabase } from "./AccountDAO";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
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

app.listen(port);