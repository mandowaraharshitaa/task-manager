const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },duedate: {
    type: String,
    
    required: true,
  },
 
  duetime: {
    type: String,
    required: true,
    min: 0,
    max: 23, // Assuming 24-hour format
},
}, {
  timestamps: true
});


const Task = mongoose.model("Task", taskSchema);
module.exports = Task;