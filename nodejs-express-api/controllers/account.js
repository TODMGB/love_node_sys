import { Router } from 'express';
import { body } from 'express-validator';
import utils from '../helpers/utils.js';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';
const router = Router();
/**
 * Route to view user account record
 * @GET /account
 */
router.get(['/','/index'], async (req, res) => {
	try{
		let recid = req.user.u_id;
		let query = {};
		let where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['u_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.accountviewFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
 * Route to get  Users record for edit
 * @GET /users/edit/{recid}
 */
router.get(['/edit'], async (req, res) => {
	try{
		const recid = req.user.u_id;
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['u_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.accounteditFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		return res.ok(record);
	}
	catch(err){
		return res.serverError(err);
	}
});
/**
 * Route to update  Users record
 * @POST /users/edit/{recid}
 */
router.post(['/edit'], 
	[
		body('username').optional({nullable: true, checkFalsy: true}),
		body('telephone').optional({nullable: true, checkFalsy: true}),
		body('u_id_fk').optional({nullable: true, checkFalsy: true}).isNumeric(),
		body('is_linked').optional({nullable: true, checkFalsy: true}).isNumeric(),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.user.u_id;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['u_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Users.accounteditFields();
		let record = await DB.Users.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Users.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});
router.get('/currentuserdata', async function (req, res)
{
	const user = req.user;
    return res.ok(user);
});
/**
 * Route to change user password
 * @POST /account
 */
router.post('/changepassword' , 
	[
		body('oldpassword').not().isEmpty(),
		body('newpassword').not().isEmpty(),
		body('confirmpassword').not().isEmpty().custom((value, {req}) => (value === req.body.newpassword))
	], validateFormData, async function (req, res) {
	try{
		let oldPassword = req.body.oldpassword;
		let newPassword = req.body.newpassword;
		let userId = req.user.u_id;
		let query = {};
		let where = {
			u_id: userId,
		};
		query.raw = true;
		query.where = where;
		query.attributes = ['password'];
		let user = await DB.Users.findOne(query);
		let currentPasswordHash = user.password;
		if(!utils.passwordVerify(oldPassword, currentPasswordHash)){
			return res.badRequest("Current password is incorrect");
		}
		let modeldata = {
			password: utils.passwordHash(newPassword)
		}
		await DB.Users.update(modeldata, {where: where});
		return res.ok("Password change completed");
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
