const express = require('express');

const server = express();

server.use(express.json());

let numReqs = 0;
const projects = [];

// Global middleware
function countReqs(req, res, next) {
  numReqs++;

  numReqs == 1 ? 
    console.log(`Foi feita ${numReqs} requisição na aplicação até então.`) : 
    console.log(`Foram feitas ${numReqs} requisições na aplicação até então.`);
  
  next();
}

// Local middleware
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exist'})
  }

  return next();
}

// Creating projects
server.post('/projects', countReqs, (req, res) => {
  const project = req.body;
  
  projects.push(project);

  return res.json(projects);
})

// Showing all projects
server.get('/projects', countReqs, (req, res) => {
  return res.json(projects);
})

// Changing a specific project title
server.put('/projects/:id', countReqs, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  // goes through the array and takes the project with the same req.params.id 
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(projects);
})

// Deleting a specific project
server.delete('/projects/:id', countReqs, checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  projects.splice(project, 1);

  return res.json(projects);
})

// Adding a task to a specific project
server.post('/projects/:id/tasks', countReqs, checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  
  project.tasks.push(title);

  return res.json(projects);
})

server.listen(3000);