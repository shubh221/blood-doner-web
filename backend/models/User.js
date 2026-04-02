const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    contact: {
      type: String,
      validate: {
        validator: v => /^\d{10}$/.test(v),
        message: props => `${props.value} is not a valid 10-digit number`
      },
      required: [true, 'Contact is required']
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    bloodGroup: { type: String, required: [true, 'Blood group is required'], enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    location: { type: String, required: [true, 'Location is required'], trim: true },
    isDonor: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // faster hashing
  next();
});

// Compare password helper
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
