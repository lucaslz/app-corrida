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