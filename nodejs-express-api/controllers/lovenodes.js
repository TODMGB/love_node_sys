import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list lovenodes records
 * @GET /lovenodes/index/{fieldname}/{fieldvalue}
 */
router.get(['/', '/index/:fieldname?/:fieldvalue?'], async (req, res) => {  
	try{
		const query = {};
		let queryFilters = [];
		let where = {};
		let replacements = {};
		let fieldName = req.params.fieldname;
		let fieldValue = req.params.fieldvalue;
		
		if (fieldName){
			queryFilters.push(DB.filterBy(fieldName, fieldValue));
		}
		let search = req.query.search;
		if(search){
			let searchFields = DB.LoveNodes.searchFields();
			where[DB.op.or] = searchFields;
			replacements.search = `%${search}%`;
		}
		where['u_id'] = req.user.u_id; //filter only current records
		
		if(queryFilters.length){
			where[DB.op.and] = queryFilters;
		}
		query.raw = true;
		query.where = where;
		query.replacements = replacements;
		query.order = DB.getOrderBy(req, 'l_n_id', 'desc');
		query.attributes = DB.LoveNodes.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.LoveNodes.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view LoveNodes record
 * @GET /lovenodes/view/{recid}
 */
router.get('/view/:recid', async (req, res) => {
	try{
		const recid = req.params.recid || null;
		const query = {}
		const where = {}
		where['u_id'] = req.user.u_id; //filter only current records
		where['l_n_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.LoveNodes.viewFields();
		let record = await DB.LoveNodes.findOne(query);
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
 * Route to insert LoveNodes record
 * @POST /lovenodes/add
 */
router.post('/add/', 
	[
		body('message').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata['u_id'] = req.user.u_id;
		
		//save LoveNodes record
		let record = await DB.LoveNodes.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['l_n_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  LoveNodes record for edit
 * @GET /lovenodes/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['l_n_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.LoveNodes.editFields();
		let record = await DB.LoveNodes.findOne(query);
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
 * Route to update  LoveNodes record
 * @POST /lovenodes/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('message').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['l_n_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.LoveNodes.editFields();
		let record = await DB.LoveNodes.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.LoveNodes.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete LoveNodes record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /lovenodes/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['l_n_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.LoveNodes.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.LoveNodes.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
