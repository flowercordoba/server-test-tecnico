const mongoose = require("mongoose");

const { Schema, model } = require("mongoose");

const taskSchema = Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 1024,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  assignedTo: {
    type:  Schema.Types.ObjectId,
    ref: "Usuario",
    required: false,
  },
  complete: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

taskSchema.method("toJSON", function () {
  const { __v, _id,...object } = this.toObject();
  object.uid = _id;
  return object;
});

module.exports = model("Task", taskSchema);
