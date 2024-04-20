export default {
	app: {
		name: "love_node_sys",
		url: "http://localhost:8060",
		frontendUrl: "http://localhost:8050",
		secret: "de83165327b8a2aa3cd3ba8761412639",
		language: "english",
		publicDir: "assets",
	},
	auth: {
		userTokenSecret: "0d1f64bA-1ax%W@330f2YY6Q!!0-8061dfe8ebca8fafb97e",
		apiTokenSecret: "9d022d18$Xax%W!b5a459B#Q-!07e4b3d6ccc80ec7a2c2d7",
		jwtDuration: 30, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"love_sys_db",
		type: "mysql",
		host: "localhost",
		username: "root",
		password: "123456",
		port: "3306",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"",
		password: "",
		senderemail:"",
		sendername:"",
		host: "",
		secure: true,
		port: ""
	},
	upload: {
		tempDir: "uploads/temp/",
		import_data: {
			filenameType: "timestamp",
			extensions: "json,csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "us-west-2",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}