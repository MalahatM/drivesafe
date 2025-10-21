import express from 'express';
const app = express();
app.listen(3700, () => {
	console.log("server is running on port 3700");});
export default app;
