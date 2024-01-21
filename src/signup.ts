import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function signup (input: any): Promise<any> {
	const id = crypto.randomUUID();
	await emailExiste(input.email);
	nomeEInvalido(input.name);
	emailEInvalido(input.email);
	cpfEInvalido(input.cpf);
	
	if (input.isDriver) {
		placaDoCarroEInvalida(input.carPlate);
		let dadosMotorista = await persistirMotorista(id, input);
		return dadosMotorista;
	} else {
		let dadosPassageiro = await persistirPassageiro(id, input);
		return dadosPassageiro;
	}
}

async function emailExiste(email: string) {
	const connection = pgp()("postgres://postgres:123456@db:5432/cccat15");
	const [acc] = await connection.query("select * from cccat15.account where email = $1", [email]);
	await connection.$pool.end();
	if (acc) throw new Error("Already Exists");
}

function nomeEInvalido(name: string) {
	if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name")
}

function emailEInvalido(email: string) {
	if (!email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email");
}

function cpfEInvalido(cpf: string) {
	if (!validateCpf(cpf)) throw new Error("Invalid CPF");
}

function placaDoCarroEInvalida(carPlate: string) {
	if (!carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid Car Plate");
}

async function persistirMotorista(id: string, input: any) {
	const connection = pgp()("postgres://postgres:123456@db:5432/cccat15");
	await connection.query(
		"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
		[id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]
	);
	await connection.$pool.end();
	const obj = {
		accountId: id
	};
	return obj;
}

async function persistirPassageiro(id: string, input: any) {
	const connection = pgp()("postgres://postgres:123456@db:5432/cccat15");
	await connection.query(
		"insert into cccat15.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
		[id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]
	);
	await connection.$pool.end();
	const obj = {
		accountId: id
	};
	return obj;
}
