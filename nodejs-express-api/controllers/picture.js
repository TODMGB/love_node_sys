import { Router } from 'express';
import { body } from 'express-validator';
import validateFormData from '../helpers/validate_form.js';
import DB from '../models/db.js';


const router = Router();




/**
 * Route to list picture records
 * @GET /picture/index/{fieldname}/{fieldvalue}
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
			let searchFields = DB.Picture.searchFields();
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
		query.order = DB.getOrderBy(req, 'p_id', 'desc');
		query.attributes = DB.Picture.listFields();
		let page = parseInt(req.query.page) || 1;
		let limit = parseInt(req.query.limit) || 10;
		let result = await DB.Picture.paginate(query, page, limit);
		return res.ok(result);
	}
	catch(err) {
		return res.serverError(err);
	}
});


/**
 * Route to view Picture record
 * @GET /picture/view/{recid}
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
		query.attributes = DB.Picture.viewFields();
		let record = await DB.Picture.findAll(query);
		console.log(record);
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
 * Route to insert Picture record
 * @POST /picture/add
 */
router.post('/add/', 
	[
		body('url').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('l_n_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async function (req, res) {
	try{
		let modeldata = req.getValidFormData();
		modeldata['u_id'] = req.user.u_id;
		
		//save Picture record
		let record = await DB.Picture.create(modeldata);
		//await record.reload(); //reload the record from database
		const recid =  record['p_id'];
		
		return res.ok(record);
	} catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to get  Picture record for edit
 * @GET /picture/edit/{recid}
 */
router.get('/edit/:recid', async (req, res) => {
	try{
		const recid = req.params.recid;
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['p_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Picture.editFields();
		let record = await DB.Picture.findOne(query);
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
 * Route to update  Picture record
 * @POST /picture/edit/{recid}
 */
router.post('/edit/:recid', 
	[
		body('url').optional({nullable: true, checkFalsy: true}),
		body('description').optional({nullable: true, checkFalsy: true}),
		body('l_n_id').optional({nullable: true, checkFalsy: true}),
	], validateFormData
, async (req, res) => {
	try{
		const recid = req.params.recid;
		let modeldata = req.getValidFormData({ includeOptionals: true });
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['p_id'] = recid;
		query.raw = true;
		query.where = where;
		query.attributes = DB.Picture.editFields();
		let record = await DB.Picture.findOne(query);
		if(!record){
			return res.notFound();
		}
		await DB.Picture.update(modeldata, {where: where});
		return res.ok(modeldata);
	}
	catch(err){
		return res.serverError(err);
	}
});


/**
 * Route to delete Picture record by table primary key
 * Multi delete supported by recid separated by comma(,)
 * @GET /picture/delete/{recid}
 */
router.get('/delete/:recid', async (req, res) => {
	try{
		const recid = (req.params.recid || '').split(',');
		const query = {};
		const where = {};
		where['u_id'] = req.user.u_id; //filter only current records
		where['p_id'] = recid;
		query.raw = true;
		query.where = where;
		let records = await DB.Picture.findAll(query);
		records.forEach(async (record) => { 
			//perform action on each record before delete
		});
		await DB.Picture.destroy(query);
		return res.ok(recid);
	}
	catch(err){
		return res.serverError(err);
	}
});
export default router;
