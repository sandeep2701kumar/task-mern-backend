const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const getTasks = asyncHandler( async(req, res) => {
    const tasks = await Task.find({user: req.user.id});
    res.status(200).json(tasks);
});

const setTasks = asyncHandler( async(req, res) => {
    if(!req.body.text){
        res.status(400);
        throw new Error('please add a text field');
    }
    const tasks = await Task.create({text: req.body.text, user: req.user.id});
    res.status(201).json(tasks);  
});

const updateTasks = asyncHandler( async(req, res) => {
    const task = await Task.findById(req.params.id);
    let user;
    console.log('task value',task);
    console.log('req.user.id',req.user.id);
    if(!task){
        res.status(400);
        throw new Error('Task not found');
    }
    try{
        user = await User.findById(req.user.id);
        console.log('test user', user);
    }catch(error){
        console.log('DB connection error', error);
    }   
    
    if(!user){
        res.status(401)
        throw new Error('user is not available');
    }

    if(task?.user.toString() !== user.id){
        res.status(401)
        throw new Error('Not authorized to update this task');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
    console.log('test updatedtask', updatedTask);
    res.status(200).json(updatedTask);
});

const deleteTasks = asyncHandler( async(req, res) => {
    const deleteTask = await Task.findById(req.params.id);
    if(!deleteTask){
        res.status(400)
        throw new Error('Task not found');
    }

    if(deleteTask.user){
        const user = await User.findById(req.user.id);
        if(!user){
            res.status(401)
            throw new Error('user is not available');
        }

        if(deleteTask.user.toString() !== user.id){
            res.status(401)
            throw new Error('THis user is not authorized to delete the task');
        }
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({id: req.params.id});
    }
    else{
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({id: req.params.id});
    }
    
});
module.exports = { getTasks, setTasks, updateTasks, deleteTasks };