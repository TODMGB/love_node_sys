
import { BaseModel, sequelize, Sequelize } from "./basemodel.js";

class LoveNodes extends BaseModel {
	static init() {
		return super.init(
			{
				
				l_n_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
				message: { type:Sequelize.STRING  ,defaultValue: Sequelize.literal('DEFAULT') },
				u_id: { type:Sequelize.INTEGER  ,defaultValue: Sequelize.literal('DEFAULT') }
			}, 
			{ 
				sequelize,
				
				tableName: "love_nodes",
				modelName: "love_nodes",
			}
		);
	}
	
	static listFields() {
		return [
			'l_n_id', 
			'message', 
			'u_id'
		];
	}

	static viewFields() {
		return [
			'l_n_id', 
			'message', 
			'u_id'
		];
	}

	static editFields() {
		return [
			'message', 
			'l_n_id'
		];
	}

	
	static searchFields(){
		return [
			Sequelize.literal("l_n_id LIKE :search"), 
			Sequelize.literal("message LIKE :search"),
		];
	}

	
	
}
LoveNodes.init();
export default LoveNodes;
