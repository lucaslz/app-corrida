import { AccountRepository } from "../../infra/repository/AccountRepository";
import Ride from "../../domain/Ride";
import { RideRepository } from "../../infra/repository/RideRepository";

export default class RequestRide {

    constructor(readonly rideRepository: RideRepository, readonly account: AccountRepository, readonly ride: RideRepository) {
	}

    async execute (input: Input): Promise<Output> {
        const userAccount = await this.account.getById(input.passengerId);
        if (userAccount && userAccount.isPassenger !== true) throw new Error("Account is not a passenger");
        const [oldRides] = await this.ride.getActiveRidesByPassengerId(input.passengerId);
        if (oldRides) throw new Error("Passenger has an active ride");
        const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
        const rideId = await this.ride.save(ride);
        return rideId;
    }
}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
};

type Output = {
    rideId: string
};