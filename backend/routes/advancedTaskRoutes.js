const express = require('express');
const axios = require('axios');
const router = express.Router();

const JSON_SERVER = 'http://localhost:3030';

router.get('/tasks/stats', async (req, res) => {
    try {
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        const tasks = response.data;
        
        const stats = {
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
        const daysAhead = parseInt(req.query.days) || 7;
        const response = await axios.get(`${JSON_SERVER}/tasks`);
        
        const now = new Date().toISOString().split('T')[0];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + daysAhead);
        const futureDateStr = futureDate.toISOString().split('T')[0];
        
        const dueSoonTasks = response.data.filter(task =>
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
        
        const filteredTasks = tasks.filter(task => {
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
        const response = await axios.patch(`${JSON_SERVER}/tasks/${id}`, { completed: !task.completed });
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
            axios.patch(`${JSON_SERVER}/tasks/${task.id}`, { completed: true })
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
            axios.patch(`${JSON_SERVER}/tasks/${task.id}`, { completed: false })
        );
        
        await Promise.all(updatePromises);
        res.json({ message: 'All tasks marked as incomplete' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
