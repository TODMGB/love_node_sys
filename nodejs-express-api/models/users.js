
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Users extends BaseModel {
	static init() {
		return super.init(
			{
				
				u_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				username: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				password: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				telephone: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				email: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				u_id_fk: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				is_linked: { type:Sequelize.INTEGER   }
			}, 
			{ 
				sequelize,
				
				tableName: "users",
				modelName: "users",
			}
		);
	}
	
	static listFields() {
		return [
			'u_id', 
			'username', 
			'telephone', 
			'email', 
			'u_id_fk', 
			'is_linked'
		];
	}

	static viewFields() {
		return [
			'u_id', 
			'username', 
			'telephone', 
			'email', 
			'u_id_fk', 
			'is_linked'
		];
	}

	static accounteditFields() {
		return [
			'u_id', 
			'username', 
			'telephone', 
			'u_id_fk', 
			'is_linked'
		];
	}

	static accountviewFields() {
		return [
			'u_id', 
			'username', 
			'telephone', 
			'email', 
			'u_id_fk', 
			'is_linked'
		];
	}

	static editFields() {
		return [
			'u_id', 
			'username', 
			'telephone', 
			'u_id_fk', 
			'is_linked'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("u_id LIKE :search"), 
			Sequelize.literal("username LIKE :search"), 
			Sequelize.literal("telephone LIKE :search"), 
			Sequelize.literal("email LIKE :search"),
		];
	}

	
	
}
Users.init();
export default Users;
