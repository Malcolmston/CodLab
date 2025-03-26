import Account, { Type } from "./Account";
import * as db from "../db";
import Project from "./Project";


class Basic extends Account {
    private projects: Array<Project>;

    constructor(firstname: string, lastname: string, email: string, username: string, password: string) {
        super(firstname, lastname, email, username, password, Type.Basic);
    }

    public static async Basic (id: number) {
        let user = await db.User.findOne({
            where: {
                id
            }
        });

        if( !user ) return null;

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

    async login(username: string, password: string): Promise<boolean> {
        let user = await db.User.findOne({
            where: {
                username
            }
        });

        if( !user ) return false;

        return !(await this.isDeleted()) && await this.doseExist() && Account.compare(password, user.password);
    }


    async signUp(): Promise<boolean> {
      if( (await this.isDeleted()) || (await this.doseExist()) ) return false;
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
    
    async createProject(name: string, description: string): Promise<Project | null> {
        if( !await this.doseExist() ) return null;

        let transaction = await db.sequelize.transaction();
        try {
            let user = await db.User.findByPk(this.id);
            if( !user ) return null;

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

    async getProjects(): Promise<Array<Project>> {
        if( !await this.doseExist() ) return [];

        let user = await db.User.findByPk(this.id, {
            include: [db.Project]
        });

        if( !user ) return [];

        return user.map((project: any) => new Project(project.name, project.description, this));
    }
}