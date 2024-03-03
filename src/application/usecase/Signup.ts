import MailerGateway from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";
import { AccountRepository } from "../../infra/repository/AccountRepository";

export default class Signup {

	constructor(readonly accountRepository: AccountRepository) {
	}

	async execute(input: any): Promise<any> {
		const acc = await this.accountRepository.getByEmail(input.email);
		if (acc) throw new Error("Account Already Exists");
		const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
		await this.accountRepository.save(account);
		const mailerGateway = new MailerGateway();
		mailerGateway.send('Welcome', account.email, 'Use this link to confirm your account');
		return {
			accountId: account.accountId
		};
	}
}