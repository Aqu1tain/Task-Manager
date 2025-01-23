const express = require('express');
const axios = require('axios'); // To make HTTP requests to JSON Server
const router = express.Router();

const JSON_SERVER = 'http://localhost:3030'; // Choose to run on 3030, to avoid conflict with other processes, usually on 3000

router.get('/tasks/stats', async (req, res) => {
    try {
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        const tasks = response.data;
        
        const stats = { // Simple statistics
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            overdue: tasks.filter(t => {
                return !t.completed && new Date(t.dueDate) < new Date()
            }).length
        };
        
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/tasks/dueSoon', async (req, res) => {
    try {
        const daysAhead = parseInt(req.query.days) || 7; // Arbitrary choose 7, but could be any number. You can provide it as query parameter (days)
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        
        const now = new Date().toISOString().split('T')[0]; // To get today's date, without time part
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const futureDateStr = futureDate.toISOString().split('T')[0]; // Same as above, but for future date
        
        const dueSoonTasks = response.data.filter(task => // Filter tasks due between today and future date
            task.dueDate && task.dueDate >= now && task.dueDate <= futureDateStr
        ).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
        
        res.json(dueSoonTasks);
        
    } catch (error) {
        console.error('Error fetching due soon tasks:', error);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch due soon tasks',
            details: error.message
        });
    }
});

router.get('/tasks/search', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        const tasks = response.data;
        
        const filteredTasks = tasks.filter(task => { // Filter tasks by title or description
            return task.title.toLowerCase().includes(query.toLowerCase()) ||
                task.description.toLowerCase().includes(query.toLowerCase());
        });
        
        res.json(filteredTasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/tasks/complete', async (req, res) => {
    console.log('Completing task:', req.body);
    try {
        const { id } = req.body;
        const taskResponse = await axios.get(`${JSON_SERVER}/tasks/${id}`);
        const task = taskResponse.data;
        const response = await axios.patch(`${JSON_SERVER}/tasks/${id}`, { completed: !task.completed }); // Toggle completed status of task
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/tasks/completeAll', async (req, res) => {
    try {
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        const tasks = response.data;
        
        const updatePromises = tasks.map(task =>
            axios.patch(`${JSON_SERVER}/tasks/${task.id}`, { completed: true }) // Patch over put for partial updates
        );
        
        await Promise.all(updatePromises);
        res.json({ message: 'All tasks marked as completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/tasks/resetAll', async (req, res) => {
    try {
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        const tasks = response.data;
        
        const updatePromises = tasks.map(task =>
            axios.patch(`${JSON_SERVER}/tasks/${task.id}`, { completed: false }) // Same as above
        );
        
        await Promise.all(updatePromises);
        res.json({ message: 'All tasks marked as incomplete' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
