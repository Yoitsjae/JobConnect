// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let jobs = [];
let applications = [];

app.post('/jobs', (req, res) => {
    const job = req.body;
    job.id = jobs.length + 1;
    jobs.push(job);
    res.status(201).send({ job });
});

app.get('/jobs', (req, res) => {
    res.send(jobs);
});

app.post('/jobs/:id/apply', (req, res) => {
    const application = req.body;
    application.jobId = parseInt(req.params.id, 10);
    applications.push(application);
    res.status(201).send({ application });
});

app.post('/pay', (req, res) => {
    const payment = req.body;
    // Process payment here
    res.status(200).send({ payment });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
