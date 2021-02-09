const express = require('express');
const mongoose = require('mongoose');
const router  = express.Router();

const Project = require('../models/project-model')
const Task = require('../models/task-model')

// Get list of projects
router.get('/projects', (req, res, next) => {
  
  Project.find()
    .populate('tasks')
    .then( response => {
      res.json(response);
    })
    .catch( err => {
      res.status(500).json(err)
    });
  
})

// Create new project
router.post('/projects', (req, res, next) => {

  const { title, description } = req.body;

  Project.create({
    title,
    description,
    tasks: [],
    owner: req.user._id
  })
  .then( response => {
    res.json(response)
  })
  .catch(err => {
    res.status(500).json(err)
  });
});

// Get project
router.get('/projects/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
 

  Project.findById(req.params.id)
    .populate('tasks')
    .then( project => {
      res.json(project)
    })
    .catch( err => {
      res.status(500).json(err)
    })
});

// Update project
router.put('/projects/:id', (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.json({ message: `Project with ${req.params.id} is updated successfully.` });
    })
    .catch(error => {
      res.status(500).json(error);
    });

});

// Delete a project
router.delete('/projects/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  Project.findByIdAndRemove(req.params.id)
    .then( () => {
      res.json({ message: `Project with ${req.params.id} is deleted successfully.` });
    } )
    .catch(error => {
      res.status(500).json(error);
    });
})

module.exports = router;