import express from "express";
const router = express.Router();

let fixedQueryObject = {
	"country":"us",
	"q":"news"
}
const apiKey = process.env.API_KEY;

let queryObject = addApiKey(fixedQueryObject);


if(!apiKey){
	console.log("Please set the API_KEY environment variable with a valid newsapi.org apiKey and restart the server!");
	process.exit(0);
}

const baseUrl = 'https://newsapi.org/v2/top-headlines';

function addApiKey(queryObject){
	return {...queryObject, apiKey: apiKey}
}
router.get('/', async (req, res) => {
  let url = createUrlFromQueryObject(queryObject);
	let newsArticles = await fetchData(url);
	res.send(newsArticles);
});

router.post('/', async (req, res) => {
  let query = req.body;
	let queryObjectWithApiKey = addApiKey(query);
	let url = createUrlFromQueryObject(queryObjectWithApiKey);
	let newsArticles = await fetchData(url);
	res.send(newsArticles);
});

export function createUrlFromQueryObject(queryObjectWithApiKey) {
	const queryString = new URLSearchParams(queryObjectWithApiKey).toString();
	const url = baseUrl + "?" + queryString;
	return url;
}

export async function fetchData(url) {
	let data = null;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data:', error);
		return null;
	}
}

export default router;