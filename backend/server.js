const express = require('express');
const cors = require('cors');
const path = require('path');
const advancedTaskRoutes = require('./routes/advancedTaskRoutes');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/advanced', advancedTaskRoutes);

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
});