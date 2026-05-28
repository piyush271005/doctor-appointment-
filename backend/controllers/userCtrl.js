
const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");


// ======================================================
// REGISTER CONTROLLER
// ======================================================

const registerController = async (req, res) => {
  try {

    const existingUser = await userModel.findOne({
      email: req.body.email,
    });

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exists",
      });
    }

    const password = req.body.password;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);

    await newUser.save();

    res.status(201).send({
      success: true,
      message: "Register Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};


// ======================================================
// LOGIN CONTROLLER
// ======================================================

const loginController = async (req, res) => {
  try {

    const user = await userModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(200).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(200).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).send({
      success: true,
      message: "Login Success",
      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: `Login Controller Error: ${error.message}`,
    });
  }
};


// ======================================================
// AUTH CONTROLLER
// ======================================================

const authController = async (req, res) => {
  try {

    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;

    res.status(200).send({
      success: true,
      data: user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Auth Error",
      error,
    });
  }
};


// ======================================================
// APPLY DOCTOR CONTROLLER
// ======================================================

const applyDoctorController = async (req, res) => {
  try {

    console.log("Apply Doctor API Called");

    // find current user
    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // create doctor object
    const newDoctor = new doctorModel({
      ...req.body,
      email: user.email, // IMPORTANT FIX
      status: "pending",
    });

    // save doctor
    await newDoctor.save();

    // find admin
    const adminUser = await userModel.findOne({
      isAdmin: true,
    });

    // send notification to admin
    if (adminUser) {

      const notification = adminUser.notification || [];

      notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
        data: {
          doctorId: newDoctor._id,
          name: `${newDoctor.firstName} ${newDoctor.lastName}`,
          onClickPath: "/admin/doctors",
        },
      });

      await userModel.findByIdAndUpdate(adminUser._id, {
        notification,
      });
    }

    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error While Applying For Doctor",
      error: error.message,
    });
  }
};




// ======================================================
// GET ALL NOTIFICATIONS
// ======================================================

const getAllNotificationController = async (req, res) => {
  try {

    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const seennotification = user.seennotification || [];
    const notification = user.notification || [];

    seennotification.push(...notification);

    user.notification = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();

    res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in notifications",
      error,
    });
  }
};


// ======================================================
// DELETE ALL NOTIFICATIONS
// ======================================================

const deleteAllNotificationController = async (req, res) => {
  try {

    const user = await userModel.findById(req.body.userId);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();

    updatedUser.password = undefined;

    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Unable to delete notifications",
      error,
    });
  }
};


// ======================================================
// GET ALL APPROVED DOCTORS
// ======================================================

const getAllDoctorsController = async (req, res) => {
  try {

    const doctors = await doctorModel.find({
      status: "approved",
    });

    res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while fetching doctors",
      error,
    });
  }
};


// ======================================================
// BOOK APPOINTMENT
// ======================================================

const bookAppointmentController = async (req, res) => {
  try {

    req.body.date = moment(
      req.body.date,
      "DD-MM-YYYY"
    ).toISOString();

    req.body.time = moment(
      req.body.time,
      "HH:mm"
    ).toISOString();

    req.body.status = "pending";

    const newAppointment = new appointmentModel(req.body);

    await newAppointment.save();

    const user = await userModel.findById(
      req.body.doctorInfo.userId
    );

    if (user) {

      user.notification.push({
        type: "new-appointment-request",
        message: `A new appointment request from ${req.body.userInfo.name}`,
        onClickPath: "/doctor/appointments",
      });

      await user.save();
    }

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error,
    });
  }
};


// ======================================================
// BOOKING AVAILABILITY
// ======================================================

const bookingAvailabilityController = async (req, res) => {
  try {

    const date = moment(
      req.body.date,
      "DD-MM-YYYY"
    ).toISOString();

    const fromTime = moment(
      req.body.time,
      "HH:mm"
    )
      .subtract(1, "hours")
      .toISOString();

    const toTime = moment(
      req.body.time,
      "HH:mm"
    )
      .add(1, "hours")
      .toISOString();

    const doctorId = req.body.doctorId;

    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments not available at this time",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointment Available",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in booking availability",
      error,
    });
  }
};


// ======================================================
// USER APPOINTMENTS
// ======================================================

const userAppointmentsController = async (req, res) => {
  try {

    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in user appointments",
      error,
    });
  }
};


module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
};

