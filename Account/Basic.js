const { Account, Type } = require('./Account');
const db = require('../db');
const Project = require('./Project');

class Basic extends Account {
    /**
     * Creates a new Basic account
     * @param {string} firstname first name
     * @param {string} lastname last name
     * @param {string} email email address
     * @param {string} username username
     * @param {string} password password
     */
    constructor(firstname, lastname, email, username, password) {
        super(firstname, lastname, email, username, password, Type.Basic);
        this.projects = [];
    }

    /**
     * Factory method to create a Basic instance from an ID
     * @param {number} id user ID
     * @returns {Promise<Basic|null>} Basic instance or null if not found
     */
    static async Basic(id) {
        let user = await db.User.findOne({
            where: {
                id
            }
        });

        if (!user) return null;

        let basic = new Basic(
            user.firstname,
            user.lastname,
            user.email,
            user.username,
            user.password,
        );

        basic.id = user.id;
        return basic;
    }

    /**
     * Authenticate a user
     * @param {string} username username
     * @param {string} password password
     * @returns {Promise<boolean>} true if login successful
     */
    async login(username, password) {
        let user = await db.User.findOne({
            where: {
                username
            }
        });

        if (!user) return false;

        return !(await this.isDeleted()) && await this.doseExist() && Account.compare(password, user.password);
    }

    /**
     * Register a new user
     * @returns {Promise<boolean>} true if signup successful
     */
    async signUp() {
        if ((await this.isDeleted()) || (await this.doseExist())) return false;
        let transaction = await db.sequelize.transaction();

        try {
            await db.User.create({
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                username: this.username,
                password: this.password,
                type: Type.Basic
            }, { transaction });

            await transaction.commit();
            return true;
        } catch (error) {
            await transaction.rollback();
            console.error("Error during sign up:", error);
            return false;
        }
    }
    
    /**
     * Create a new project
     * @param {string} name project name
     * @param {string} description project description
     * @returns {Promise<Project|null>} Project instance or null if failed
     */
    async createProject(name, description) {
        if (!await this.doseExist()) return null;

        let transaction = await db.sequelize.transaction();
        try {
            let user = await db.User.findByPk(this.id);
            if (!user) return null;

            let project = user.createProject({
                name,
                description
            }, { transaction });

            await transaction.commit();
            return new Project(name, description, this);
        } catch (error) {
            await transaction.rollback();
            console.error("Error creating project:", error);
            return null;
        }
    }

    /**
     * Get all projects for this user
     * @returns {Promise<Array<Project>>} array of projects
     */
    async getProjects() {
        if (!await this.doseExist()) return [];

        let user = await db.User.findByPk(this.id, {
            include: [db.Project]
        });

        if (!user) return [];

        return user.Projects.map(project => new Project(project.name, project.description, this));
    }
}

module.exports = Basic;