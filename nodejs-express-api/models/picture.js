
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class Picture extends BaseModel {
	static init() {
		return super.init(
			{
				
				p_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				url: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				description: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				l_n_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') },
				u_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "picture",
				modelName: "picture",
			}
		);
	}
	
	static listFields() {
		return [
			'p_id', 
			'url', 
			'description', 
			'l_n_id', 
			'u_id'
		];
	}

	static viewFields() {
		return [
			'p_id', 
			'url', 
			'description', 
			'u_id'
		];
	}

	static editFields() {
		return [
			'url', 
			'description', 
			'l_n_id', 
			'p_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("p_id LIKE :search"), 
			Sequelize.literal("url LIKE :search"), 
			Sequelize.literal("description LIKE :search"),
		];
	}

	
	
}
Picture.init();
export default Picture;
