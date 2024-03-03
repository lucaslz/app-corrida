import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";


export default class GetRide {

	constructor(readonly rideRepository: RideRepository, readonly accountRepository: AccountRepository) {
	}

	async execute (accountId: string): Promise<Output> {	
		const ride = await this.rideRepository.get(accountId);
		if (!ride) throw new Error("Ride does not exist");
		const passenger = await this.accountRepository.getById(ride.passengerId);
		if (!passenger) throw new Error("Passenger not found");
		 
		return {
			passengerId: ride.passengerId,
			rideId: ride.rideId,
			fromLat: ride.fromLat,
			fromLong: ride.fromLong,
			status: ride.status,
			date: ride.date,
			passengerName: passenger.name
		};
	}
}

type Output = {
	passengerId: string,
	rideId: string,
	fromLat: number,
	fromLong: number,
	status: string,
	date: Date,
	passengerName: string
};