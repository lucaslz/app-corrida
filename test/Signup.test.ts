import Sinon from "sinon";
import { AccountDAO, AccountDAODatabase, AccountDAOInMemory } from "../src/AccountDAO";
import GetAccount from "../src/GetAccount";
import Signup from "../src/Signup";
import MailerGateway from "../src/MailerGateway";

let accountDao: AccountDAO;
let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
    accountDao = new AccountDAOInMemory();
    signup = new Signup(accountDao);
    getAccount = new GetAccount(accountDao);
});

test('Deve cadastrar uma nova conta', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };

    const sendEmailSpy = Sinon.stub(MailerGateway.prototype, 'send').resolves();

    const outputAccount = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputAccount.accountId);
    
    expect(outputGetAccount.name).toBe(input.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_passenger).toBe(input.isPassenger);

    expect(sendEmailSpy.calledOnce).toBe(true);
    expect(sendEmailSpy.calledWith('Welcome', input.email, 'Use this link to confirm your account')).toBe(true);
});

test('Deve cadastrar uma nova conta de motorista', async() => {
    const input = {
        name: 'Diego Vilar Laporte',
        email: `diego.laporte${Math.random()}@geradornv.com.br`,
        cpf: '314.215.150-83',
        carPlate: 'MIY6956',
        isDriver: true
    };

    const outputAccount = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputAccount.accountId);
    expect(outputGetAccount.name).toBe(outputGetAccount.name);
    expect(outputGetAccount.email).toBe(input.email);
    expect(outputGetAccount.cpf).toBe(input.cpf);
    expect(outputGetAccount.is_driver).toBe(input.isDriver);
});

test('Deve cadastrar uma nova conta de Passageiro', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };

    const outputAccount = await signup.execute(input);
    const outputGetAccount = await getAccount.execute(outputAccount.accountId);
    expect(input.name).toBe(outputGetAccount.name);
});

test('Email nao deve ser duplicado', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };
    await signup.execute(input);
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account Already Exists"));
});

test('Nome deve ser válido', async() => {
    const input = {
        name: '3!@#$%¨&*()_+`^}{:><?"',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };

    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid Name"));
});

test('Email deve ser válido', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}geradornv.com.br`,
        cpf: '636.469.860-34',
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid Email"));
});

test('CPF deve ser válido', async() => {
    const input = {
        name: 'Mara Vilar Laporte',
        email: `mara.laporte${Math.random()}@geradornv.com.br`,
        cpf: '636.469.860-3',
        isPassenger: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid CPF"));
});

test('A placa do carro deve ser inválida', async() => {
    const input = {
        name: 'Diego Vilar Laporte',
        email: `diego.laporte${Math.random()}@geradornv.com.br`,
        cpf: '314.215.150-83',
        carPlate: 'MIY-6956',
        isDriver: true
    };
    await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid Car Plate"));
});
