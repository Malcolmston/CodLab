import * as db from '../db/';

enum Type {
    Basic = "basic",
    Admin = "admin"
}

abstract class Account {
    protected id: number;
    protected firstname: string;
    protected lastname: string;
    protected email: string;
    protected type: Type;
    protected username: string;
    protected password: string;

    public static async init () {

    } 

    /**
     * get is a user by id is soft deleted
     * @returns true if the account is soft deleted and false otherwise
     */
    protected async isDeleted (): Promise<boolean> {
        let user = await db.User.findByPk(this.id);

        if( !user ) return true;
        return user.isSoftDeleted();
    }

    /**
     * gets if a user exists
     * @returns true if the user exists and false otherwise
     */
    protected async doseExist (): Promise<boolean> {
        let user = await db.User.findByPk(this.id);
        
        return !!user;
    }
}