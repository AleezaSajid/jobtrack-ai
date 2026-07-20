const mongoose = require("mongoose");
const Application = require("../models/Application");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizePayload = (body = {}) => {
  const position = body.position ?? body.role;
  const jobType = body.jobType ?? body.type;
  const appliedDate = body.appliedDate ?? body.applied;

  return {
    company: body.company,
    position,
    status: body.status,
    location: body.location,
    salary: body.salary,
    jobType,
    jobUrl: body.jobUrl,
    notes: body.notes,
    appliedDate: appliedDate || undefined,
    interviewDate: body.interviewDate,
  };
};

const createApplication = async (req, res) => {
  try {
    const payload = normalizePayload(req.body);

    if (!payload.company || !payload.position) {
      return res.status(400).json({
        success: false,
        message: "Company and position are required",
      });
    }

    const application = await Application.create({
      user: req.user.id,
      ...payload,
    });

    return res.status(201).json({
      success: true,
      application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const payload = normalizePayload(req.body);
    const allowedFields = [
      "company",
      "position",
      "status",
      "location",
      "salary",
      "jobType",
      "jobUrl",
      "notes",
      "appliedDate",
      "interviewDate",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (payload[field] !== undefined) {
        updates[field] = payload[field];
      }
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
