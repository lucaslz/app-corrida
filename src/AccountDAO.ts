import pgp from "pg-promise";

// Port
export interface AccountDAO {
    save(account: any): Promise<void>;
    getByEmail(email: string): Promise <any>;
    getById(id: string): Promise <any>;
}

// Adapter Database
export class AccountDAODatabase implements AccountDAO {

    async save(account: any): Promise<void> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        await connection.query(
            "insert into app.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
            [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]
        );
        await connection.$pool.end();
    }

    async getByEmail(email: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from app.account where email = $1", [email]);
        await connection.$pool.end();
        return account;
    }

    async getById(id: string): Promise<any> {
        const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await connection.query("select * from app.account where account_id = $1", [id]);
        await connection.$pool.end();
        return account;
    }
}

// Adapter InMemory
export class AccountDAOInMemory implements AccountDAO {

    accounts: any = [];

    async save(account: any): Promise<void> {
        account.is_passenger = account.isPassenger;
        account.is_driver = account.isDriver;
        this.accounts.push(account);
    }

    async getByEmail(email: string): Promise<any> {
        return this.accounts.find((account: any) => account.email === email);
    }

    async getById(id: string): Promise<any> {
        return this.accounts.find((account: any) => account.accountId === id);
    }
}