const db = require('db');

class Project {
    /**
     * Creates a new project
     * @param {string} name project name
     * @param {string} description project description
     * @param {Object} owner project owner (Account instance)
     */
    constructor(name, description, owner) {
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    /**
     * Get the project ID
     * @returns {number} project ID
     */
    get projectId() {
        return this.id;
    }

    /**
     * Get the project name
     * @returns {string} project name
     */
    get projectName() {
        return this.name;
    }

    /**
     * Get the project description
     * @returns {string} project description
     */
    get projectDescription() {
        return this.description;
    }

    /**
     * Get the project owner
     * @returns {Object} owner (Account instance)
     */
    get projectOwner() {
        return this.owner;
    }

    /**
     * Creates a new project in the database.
     * This method uses a transaction to ensure that the project is created atomically.
     * @returns {Promise<void>}
     */
    async create() {
        let transaction = await db.sequelize.transaction();
        try {
            // Create the project in the database
            var pro = await db.Project.create({
                name: this.name,
                description: this.description,
                ownerId: this.owner.getId(), // Assuming owner has an getId method
            }, { transaction });

            // Commit the transaction
            await transaction.commit();
            this.id = pro.id; // Set the id of the created project
        } catch (error) {
            console.error("Error creating project:", error);
            // Rollback the transaction in case of error
            await transaction.rollback();
        }
    }

    /**
     * Deletes the project from the database.
     * @returns {Promise<void>}
     */
    async delete() {
        if (!this.id) {
            throw new Error("Project ID is not set. Cannot delete project.");
        }

        let transaction = await db.sequelize.transaction();
        try {
            // Delete the project from the database
            await db.Project.destroy({
                where: { id: this.id },
                transaction
            });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            console.error("Error deleting project:", error);
            // Rollback the transaction in case of error
            await transaction.rollback();
        }
    }

    /**
     * Recovers a deleted project from the database.
     * @returns {Promise<void>}
     */
    async recover() {
        if (!this.id) {
            throw new Error("Project ID is not set. Cannot recover project.");
        }

        let transaction = await db.sequelize.transaction();
        try {
            // Recover the project in the database
            await db.Project.restore({
                where: { id: this.id },
                transaction
            });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            console.error("Error recovering project:", error);
            // Rollback the transaction in case of error
            await transaction.rollback();
        }
    }

    /**
     * Hard deletes the project from the database.
     * This method permanently removes the project from the database.
     * @returns {Promise<void>}
     */
    async hardDelete() {
        if (!this.id) {
            throw new Error("Project ID is not set. Cannot hard delete project.");
        }

        let transaction = await db.sequelize.transaction();
        try {
            // Hard delete the project from the database
            await db.Project.destroy({
                where: { id: this.id },
                force: true, // Force deletion
                transaction
            });

            // Commit the transaction
            await transaction.commit();
        } catch (error) {
            console.error("Error hard deleting project:", error);
            // Rollback the transaction in case of error
            await transaction.rollback();
        }
    }
}

module.exports = Project;