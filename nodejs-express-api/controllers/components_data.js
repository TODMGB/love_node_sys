import { Router } from 'express';
import DB from '../models/db.js';


const router = Router();


 /**
 * Route to get l_n_id_option_list records
 * @GET /components_data/l_n_id_option_list
 */
router.get('/l_n_id_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT l_n_id as value, l_n_id as label FROM love_nodes` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @GET /components_data/users_username_exist/{fieldvalue}
 */
router.get('/users_username_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Users.count({ where:{ 'username': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to check if field value already exist in a Users table
 * @GET /components_data/users_email_exist/{fieldvalue}
 */
router.get('/users_email_exist/:fieldvalue', async (req, res) => {
	try{
		let val = req.params.fieldvalue
		let count = await DB.Users.count({ where:{ 'email': val } });
		if(count > 0){
			return res.ok("true");
		}
		return res.ok("false");
	}
	catch(err){
		return res.serverError(err);
	}
});


 /**
 * Route to get u_id_fk_option_list records
 * @GET /components_data/u_id_fk_option_list
 */
router.get('/u_id_fk_option_list', async (req, res) => {
	try{
		let sqltext = `SELECT u_id as value, username as label FROM users` ;
		
		let records = await DB.rawQueryList(sqltext);
		return res.ok(records);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
