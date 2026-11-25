import mongoose, { Schema, models, model, type InferSchemaType, type Types } from "mongoose";

const pointSchema = new Schema(
  {
    placeId: { type: String, required: true },
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true, maxlength: 80 },
    venmo: { type: String, trim: true, maxlength: 40 },
    blocked: [{ type: Schema.Types.ObjectId, ref: "User" }],
    suspended: { type: Boolean, default: false },
    verifiedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const loginTokenSchema = new Schema({
  email: { type: String, required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  usedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

const sessionSchema = new Schema({
  tokenHash: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const TRIP_STATUSES = ["open", "matched", "cancelled"] as const;

const tripSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    origin: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
    windowStart: { type: Date, required: true, index: true },
    windowEnd: { type: Date, required: true },
    riders: { type: Number, min: 1, max: 4, default: 1 },
    luggage: { type: String, enum: ["none", "carry-on", "checked"], default: "none" },
    note: { type: String, maxlength: 280 },
    status: { type: String, enum: TRIP_STATUSES, default: "open", index: true },
    ride: { type: Schema.Types.ObjectId, ref: "Ride" },
  },
  { timestamps: true },
);
tripSchema.index({ "destination.location": "2dsphere" });
// Trips are deleted 90 days after their window ends (see the terms page).
tripSchema.index({ windowEnd: 1 }, { expireAfterSeconds: 90 * 86400 });

const joinRequestSchema = new Schema(
  {
    fromTrip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    toTrip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
    fromUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUser: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: Number,
    status: { type: String, enum: ["pending", "accepted", "declined", "withdrawn"], default: "pending" },
  },
  { timestamps: true },
);
joinRequestSchema.index({ fromTrip: 1, toTrip: 1 }, { unique: true });

const rideSchema = new Schema(
  {
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true },
        riders: { type: Number, default: 1 },
        paid: { type: Boolean, default: false },
        _id: false,
      },
    ],
    booker: { type: Schema.Types.ObjectId, ref: "User" },
    fareCents: Number,
    status: { type: String, enum: ["planning", "booked", "completed", "cancelled"], default: "planning" },
  },
  { timestamps: true },
);

const messageSchema = new Schema(
  {
    ride: { type: Schema.Types.ObjectId, ref: "Ride", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true },
);

const reportSchema = new Schema(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reported: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ride: { type: Schema.Types.ObjectId, ref: "Ride" },
    reason: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ["open", "resolved"], default: "open", index: true },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export type TripDoc = InferSchemaType<typeof tripSchema> & { _id: Types.ObjectId };
export type RideDoc = InferSchemaType<typeof rideSchema> & { _id: Types.ObjectId };

export const User = models.User || model("User", userSchema);
export const LoginToken = models.LoginToken || model("LoginToken", loginTokenSchema);
export const Session = models.Session || model("Session", sessionSchema);
export const Trip = models.Trip || model("Trip", tripSchema);
export const JoinRequest = models.JoinRequest || model("JoinRequest", joinRequestSchema);
export const Ride = models.Ride || model("Ride", rideSchema);
export const Message = models.Message || model("Message", messageSchema);
export const Report = models.Report || model("Report", reportSchema);

export { mongoose };
