import Account, { Type } from "./Account";
import * as db from "../db";

class Project {
    private id: number;
    private name: string;
    private description: string;
    private owner: Account;

    constructor(name: string, description: string, owner: Account) {
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    public get projectId(): number {
        return this.id;
    }

    public get projectName(): string {
        return this.name;
    }

    public get projectDescription(): string {
        return this.description;
    }

    public get projectOwner(): Account {
        return this.owner;
    }

    /**
     * Creates a new project in the database.
     * This method uses a transaction to ensure that the project is created atomically.
     */
    public async create(): Promise<void> {
        let transaction = await db.sequelize.transaction();
        try {
            // Create the project in the database
            var pro = await db.Project.create({
                name: this.name,
                description: this.description,
                ownerId: this.owner.getId, // Assuming owner has an accountId property
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
}