const { Schema, model } = require("mongoose");

const MensajeSchema = Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    mensaje: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
MensajeSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("mensaje", MensajeSchema);
