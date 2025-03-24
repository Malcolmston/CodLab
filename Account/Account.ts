import * as db from 'db';

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

    public  getFullName (): string{
        return `${this.firstname} ${this.lastname}`;
    }

    /**
     * soft deletes a user
     */
    public async delete () {
        if( await this.doseExist() ) {
            await db.User.destroy({
                where: {
                    id: this.id
                }
            });
        }
    }

    /**
     * restores a soft deleted user
     */
    public async restore () {
        if( await this.isDeleted() ) {
            await db.User.restore({
                where: {
                    id: this.id
                }
            });
        }
    }

    /**
     * gets the type of the user
     * @returns the type of the user
     */
    public getType (): Type {
        return this.type;
    }

    /**
     * gets the email of the user
     * @returns the email of the user
     */
    public getEmail (): string {
        return this.email;
    }

    /**
     * gets the username of the user
     * @returns the username of the user
     */
    public getUsername (): string {
        return this.username;
    }

    /**
     * gets the id of the user
     * @returns the id of the user
     */
    public getId (): number {
        return this.id;
    }

    /**
     * update an account
     * @param firstname the current fname
     * @param lastname the current lname
     * @param email the current email
     * @param username the current username
     * @param password the current password
     */
    private async update (firstname?: string, lastname?: string, email?: string, username?: string, password?: string) {
        if( await this.doseExist() ) {
            await db.User.update({
                firstname,
                lastname,
                email,
                username,
                password
            },{
                where: {
                    id: this.id
                }
            });
        }
    }

    abstract login (username: string,password: string) : Promise<boolean>;
    abstract signUp(): Promise<boolean>;

}
