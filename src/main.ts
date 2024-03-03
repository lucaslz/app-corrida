import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import GetRide from "./application/usecase/GetRide";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { ExpressAdapter } from "./infra/http/HtttpServer";
import MainController from "./infra/http/MainController";
import RequestRide from "./application/usecase/RequestRide";

const port = 3000;

const httpServer = new ExpressAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const rideRepository = new RideRepositoryDatabase(connection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository, rideRepository);
const getRide = new GetRide(rideRepository, accountRepository);
new MainController(httpServer, signup, getAccount, requestRide, getRide);
httpServer.listen(port);