import axios from "axios";

test('Deve cadastrar uma nova conta', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };

    const responseAccount = await axios.post("http://localhost:3000/signup", input);
    const outputAccount = responseAccount.data;

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputAccount.accountId}`);
    const outputGetAccount =  responseGetAccount.data;
    
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);
});

test.only('Deve solicitar uma corrida', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };

    const responseSignup = await axios.post("http://localhost:3000/signup", input);
    const outputSignup = responseSignup.data;

    const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	};

    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const outputRequestRide = responseRequestRide.data;

    const responseRides = await axios.post(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
    const outputRides = responseRides.data;
    expect(outputRequestRide.rideId).toBe(outputRides.ride_id);
});