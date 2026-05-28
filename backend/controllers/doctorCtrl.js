
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModels");


// ========================= GET DOCTOR INFO =========================

const getDoctorInfoController = async (req, res) => {
  try {

    const doctor = await doctorModel.findOne({
      userId: req.body.userId,
    });

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in fetching doctor details",
      error,
    });
  }
};


// ========================= UPDATE DOCTOR PROFILE =========================

const updateProfileController = async (req, res) => {
  try {

    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Doctor profile update issue",
      error,
    });
  }
};


// ========================= GET SINGLE DOCTOR =========================

const getDoctorByIdController = async (req, res) => {
  try {

    console.log("Request Body:", req.body);

    const doctor = await doctorModel.findById(
      req.body.doctorId.trim()
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Single doctor info fetched successfully",
      data: doctor,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in fetching single doctor info",
      error,
    });
  }
};


// ========================= DOCTOR APPOINTMENTS =========================

const doctorAppointmentController = async (req, res) => {
  try {

    // frontend should send doctorId
    const doctor = await doctorModel.findById(
      req.body.doctorId
    );

    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }

    // fetch only this doctor's appointments
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });

    console.log("Appointments:", appointments);

    res.status(200).send({
      success: true,
      message: "Doctor appointments fetched successfully",
      data: appointments,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in doctor appointments",
      error,
    });
  }
};


// ========================= UPDATE APPOINTMENT STATUS =========================

const updateStatusController = async (req, res) => {
  try {

    const { appointmentsId, status } = req.body;

    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    if (!appointments) {
      return res.status(404).send({
        success: false,
        message: "Appointment not found",
      });
    }

    const user = await userModel.findById(
      appointments.userId
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const notification = user.notification;

    notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${status}`,
      onClickPath: "/user/appointments",
    });

    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in updating appointment status",
      error,
    });
  }
};


module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentController,
  updateStatusController,
};

