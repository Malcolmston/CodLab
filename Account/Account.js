const db = require('db');
const { compareSync } = require('bcrypt');

const Type = {
    Basic: "basic",
    Admin: "admin"
};

class Account {
    /**
     * creates an account
     * @param {...any} args - Either (id) or (firstname, lastname, email, username, password, type)
     */
    constructor(...args) {
        if (args.length === 1) {
            this.id = args[0];
        } else if (args.length === 6) {
            this.firstname = args[0];
            this.lastname = args[1];
            this.email = args[2];
            this.username = args[3];
            this.password = args[4];
            this.type = args[5];
        } else {
            throw new Error("Invalid arguments");
        }
    }
       
    /**
     * checls if a password is correct
     * @param {string} password raw str password
     * @param {string} hash the password hash
     * @returns {boolean} wether or not the password is correct
     */
    static compare(password, hash) {
        return compareSync(password, hash);
    }

    /**
     * get is a user by id is soft deleted
     * @returns {Promise<boolean>} true if the account is soft deleted and false otherwise
     */
    async isDeleted() {
        let user = await db.User.findByPk(this.id, { paranoid: false });

        if (!user) return true;
        return user.isSoftDeleted();
    }

    /**
     * gets if a user exists
     * @returns {Promise<boolean>} true if the user exists and false otherwise
     */
    async doseExist() {
        let user = await db.User.findByPk(this.id);
        
        return !!user;
    }

    /**
     * Gets the full name of the user
     * @returns {string} the full name of the user
     */
    getFullName() {
        return `${this.firstname} ${this.lastname}`;
    }

    /**
     * soft deletes a user
     */
    async delete() {
        if (await this.doseExist()) {
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
    async restore() {
        if (await this.isDeleted()) {
            await db.User.restore({
                where: {
                    id: this.id
                }
            });
        }
    }

    /**
     * gets the type of the user
     * @returns {string} the type of the user
     */
    getType() {
        return this.type;
    }

    /**
     * gets the email of the user
     * @returns {string} the email of the user
     */
    getEmail() {
        return this.email;
    }

    /**
     * gets the username of the user
     * @returns {string} the username of the user
     */
    getUsername() {
        return this.username;
    }

    /**
     * gets the id of the user
     * @returns {number} the id of the user
     */
    getId() {
        return this.id;
    }

    /**
     * update an account
     * @param {string} [firstname] the current fname
     * @param {string} [lastname] the current lname
     * @param {string} [email] the current email
     * @param {string} [username] the current username
     * @param {string} [password] the current password
     */
    async update(firstname, lastname, email, username, password) {
        if (await this.doseExist()) {
            await db.User.update({
                firstname,
                lastname,
                email,
                username,
                password
            }, {
                where: {
                    id: this.id
                }
            });
        }
    }
}

module.exports = { Account, Type };