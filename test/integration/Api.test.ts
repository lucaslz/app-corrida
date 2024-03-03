import axios from "axios";

axios.defaults.validateStatus = function () {
    return true;
}

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
    expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test('Deve solicitar uma corrida', async() => {
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
    expect(outputRequestRide.rideId).toBeDefined();

    const responseGetRide = await axios.post(`http://localhost:3000/rides/${outputRequestRide.rideId}`);
    const outputGetRide = responseGetRide.data;
    expect(outputGetRide.passengerName).toBe("Mara Vilar Laporte");
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.fromLat).toBe("-27.584905257808835");
    expect(outputGetRide.status).toBe("requested");
    expect(outputGetRide.date).toBeDefined();
});

test('Não Deve solicitar uma corrida se não for passageiro', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        carPlate: 'AAA9999',
        isPassenger: false,
        isDriver: true
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
    expect(responseRequestRide.status).toBe(422);
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.message).toBe("Account is not a passenger");
});

test('Não Deve solicitar uma corrida se o passageiro tiver com outra corrida ativa', async() => {
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

    await axios.post("http://localhost:3000/request_ride", inputRequestRide);
    const responseRequestRide = await axios.post("http://localhost:3000/request_ride", inputRequestRide); 
    expect(responseRequestRide.status).toBe(422);
    const outputRequestRide = responseRequestRide.data;
    expect(outputRequestRide.message).toBe("Passenger has an active ride");
});