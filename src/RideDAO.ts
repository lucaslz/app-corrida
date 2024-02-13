import pgp from "pg-promise";
import crypto from "crypto";

// Port
export interface RideDAO {
    save(ride: any): Promise <any>;
    getById(rideId: any): Promise<any>;
    getByPassengerId(passengerId: any): Promise<any>;
}

// Adapter Database
export class RideDAODatabase implements RideDAO {

    async save(ride: any): Promise<any> {
        const rideId = crypto.randomUUID();
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query(
            "insert into app.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [rideId, ride.passengerId, ride.passengerId, 'requested', 0, 0, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, new Date()]
        );
        await connection.$pool.end();
        return {
            rideId
        };
    }

    async getById(rideId: any): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [ride] = await connection.query("select * from app.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return ride;
    }

    async getByPassengerId(passengerId: any): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [rides] = await connection.query("select * from app.ride where passenger_id = $1", [passengerId]);
        await connection.$pool.end();
        return rides;
    }
}