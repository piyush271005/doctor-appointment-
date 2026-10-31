const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    doctorId:{
        type:String,
        required:true
    },
    doctorInfo:{
        type:String,
        required:true
    },
    userInfo:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    },
    time:{
        type:String,
        required:true
    }
},{timestamps:true})

// Unique compound index — prevents double-booking at the DB level.
// If two concurrent requests both pass the availability check, MongoDB will
// reject the second .save() with a duplicate key error (code 11000).
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 }, { unique: true });

const appointmentModel = mongoose.model("appointments",appointmentSchema)


module.exports = appointmentModel