import { AccountDAODatabase } from "./AccountDAO";
import { RideDAO, RideDAODatabase } from "./RideDAO";

export default class Ride {

    constructor(readonly rideDAO: RideDAO) {
	}

    async execute (ride: any): Promise<any> {
        const account = new AccountDAODatabase();
        const userAccount = await account.getById(ride.passengerId);
        if (userAccount.is_passenger !== true) throw new Error("Account is not passender");
        const rideDao = new RideDAODatabase();
        const oldRides = await rideDao.getByPassengerId(ride.passengerId);
        if (!!oldRides) throw new Error("There are no pending races.");
        const rideId = await rideDao.save(ride);
        return rideId;
    }
}