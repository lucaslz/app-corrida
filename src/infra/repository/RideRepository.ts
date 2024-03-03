import pgp from "pg-promise";
import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

// Port
export interface RideRepository {
    save(ride: Ride): Promise <any>;
    get(rideId: string): Promise<Ride | undefined>;
    getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]>;
}

// Adapter Database
export class RideRepositoryDatabase implements RideRepository {

    constructor(readonly connection: DatabaseConnection) {
        
    }

    async save(ride: Ride): Promise<any> {
        await this.connection.query(
            "insert into app.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [ride.rideId, ride.passengerId, ride.passengerId, ride.status, 0, 0, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, new Date()]
        );
        const rideId = ride.rideId;
        return {
            rideId
        };
    }

    async get(rideId: string): Promise<Ride | undefined> {
        const [ride] = await this.connection.query("select * from app.ride where ride_id = $1", [rideId]);
        if(!ride) return;
        return Ride.restore(ride.ride_id, ride.passenger_id, ride.from_lat, ride.from_long, ride.to_lat, ride.to_long, ride.status, ride.date);
    }

    async getActiveRidesByPassengerId(passengerId: string): Promise<Ride[]> {
        const activeRidesData = await this.connection.query("select * from app.ride where passenger_id = $1", [passengerId]);
        const activeRides: Ride[] = [];
        for (const activeRideData of activeRidesData) {
            activeRides.push(Ride.restore(activeRideData.ride_id, activeRideData.passenger_id, activeRideData.from_lat, activeRideData.from_long, activeRideData.to_lat, activeRideData.to_long, activeRideData.status, activeRideData.date));
        }        
        return activeRides;
    }
}