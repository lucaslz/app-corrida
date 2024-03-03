import GetAccount from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import HttpServer from "./HtttpServer";
import ResquestRide from "../../application/usecase/RequestRide";
import Signup from "../../application/usecase/Signup";

export default class MainController {
    constructor(httpServer: HttpServer, signup: Signup, getAccount: GetAccount, requestRide: ResquestRide, getRide: GetRide) {
        httpServer.register('post', '/signup', async function (params: any, body: any) {
            const outputAccount = await signup.execute(body);
            return outputAccount;
        });

        httpServer.register('get', '/accounts/:accountId', async function (params: any, body: any) {
            const outputGetAccount = await getAccount.execute(params.accountId);
            return outputGetAccount; 
        });

        httpServer.register('post', '/request_ride', async function (params: any, body: any) {
            const rideId = await requestRide.execute(body);
            return rideId;
        });
        
        httpServer.register('post', '/rides/:rideId', async function (params: any, body: any) {
            const ride = await getRide.execute(params.rideId);
            return ride;
        });
    }
}