import { AccountDAO } from "./AccountDAO";

export default class GetAccount {

	constructor(readonly accountDao: AccountDAO) {
	}

	async execute (accountId: string){	
		const account = await this.accountDao.getById(accountId);
		// console.log(account);
		// account.is_passenger = account.isPassenger;
		// account.is_driver = account.isDriver;
		return account;
	}
}