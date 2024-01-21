import { signup } from "../src/signup";

test('O Nome deve ser invalido', async () => {
    const input = {
        name: '1',
        email: 'fulano.detal@gmail.com',
        cpf: '974.563.215-58',
        carPlate: 'KKS0398',
        isPassenger: false,
        isDriver: true
    };
    await expect(signup(input)).rejects.toThrow('Invalid Name');
});

test('O E-mail deve ser invalido', async () => {
    const input = {
        name: 'Fulano de Tal',
        email: 'fulano.detal',
        cpf: '974.563.215-58',
        carPlate: 'KKS0398',
        isPassenger: false,
        isDriver: true
    };
    await expect(signup(input)).rejects.toThrow('Invalid Email');
});

test('O CPF deve ser invalido', async () => {
    const input = {
        name: 'Fulano de Tal',
        email: 'fulano.detal@gmail.com',
        cpf: '974.563.215-588',
        carPlate: 'KKS0398',
        isPassenger: false,
        isDriver: true
    };
    await expect(signup(input)).rejects.toThrow('Invalid CPF');
});

test('Deve ser motorista e a Placa do Carro deve ser invalida', async () => {
    const input = {
        name: 'Fulano de Tal',
        email: 'fulano.detal@gmail.com',
        cpf: '974.563.215-58',
        carPlate: 'KKS-0398',
        isPassenger: false,
        isDriver: true
    };
    await expect(signup(input)).rejects.toThrow('Invalid Car Plate');
});

test('Deve inserir o motorista', async () => {
    const input = {
        name: 'Fulano de Tal',
        email: 'fulano.detal@gmail.com',
        cpf: '974.563.215-58',
        carPlate: 'KKS0398',
        isPassenger: false,
        isDriver: true
    };
    let dadosMotorista = await signup(input);
    expect(dadosMotorista).toHaveProperty('accountId');
});

test('Deve inserir o passageiro', async () => {
    const input = {
        name: 'Fulano de Tal',
        email: 'fulano.detal2@gmail.com',
        cpf: '974.563.215-58',
        carPlate: 'KKS0398',
        isPassenger: true,
        isDriver: false
    };
    let dadosMotorista = await signup(input);
    expect(dadosMotorista).toHaveProperty('accountId');
});

