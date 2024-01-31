import crypto from "crypto";
import { AccountDAO } from "./AccountDAO";
import { validateCpf } from "./validateCpf";
import MailerGateway from "./MailerGateway";

export default class Signup {

	constructor(readonly accountDao: AccountDAO) {
	}

	async execute(input: any): Promise<any> {
		input.accountId = crypto.randomUUID();
		const acc = await this.accountDao.getByEmail(input.email);
		if (acc) throw new Error("Account Already Exists");
		if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name");
		if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid CPF");
		if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid Car Plate");	
		await this.accountDao.save(input);
		const mailerGateway = new MailerGateway();
		mailerGateway.send('Welcome', input.email, 'Use this link to confirm your account');
		return {
			accountId: input.accountId
		};
	}
}