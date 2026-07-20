const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
        message: "Status must be Wishlist, Applied, Interview, Offer, or Rejected",
      },
      default: "Applied",
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    salary: {
      type: String,
      default: "",
      trim: true,
    },
    jobType: {
      type: String,
      enum: {
        values: [
          "Full-time",
          "Part-time",
          "Internship",
          "Contract",
          "Freelance",
          "Remote",
        ],
        message:
          "Job type must be Full-time, Part-time, Internship, Contract, Freelance, or Remote",
      },
      default: "Full-time",
    },
    jobUrl: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    interviewDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ user: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ company: 1 });

module.exports = mongoose.model("Application", applicationSchema);
