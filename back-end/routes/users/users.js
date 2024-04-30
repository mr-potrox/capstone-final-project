import express from "express";
import {client, connect} from './database-access/db.js';
connect(); // Connect to MongoDB
const router = express.Router();

const dbName = 'usersdb';
const collectionName = 'users';
const db = client.db(dbName);
const collection = db.collection(collectionName);

router.get('/', async (req, res) => {
	try {
		// The prj variable holds an array that determines which data columns(properties) from the
		//collection we want returned.
		const prj = {user:1,email:1, _id:0};
		const users = await collection.find({}).project(prj).toArray();
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}   
});

router.post('/authenticate', async (req, res) => {
	try {
		const loginCredentials = req.body;
		const result = await collection.findOne({"user":loginCredentials.user});
		if( result ){
		  if(result.password === loginCredentials.password){
			res.status(200).send("user passed authentication!")
		  }else{
			res.status(401).send("unauthorized: bad password");
		  }
		}else{
		  res.status(401).send("unauthorized: user not found");
		} 
	  } catch (err) {
		res.status(400).json({ error: err.message });
	  }
});

export default router;