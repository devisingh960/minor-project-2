const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
},
  password: { 
    type: String, 
    required: true,
    minlength: 6
},
  name: { 
    type: String, 
    required: true,
    trim: true
},
  employeeId: { 
    type: String, 
    required: true, 
    unique: true,
    uppercase: true
},
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Assistant Professor'],
    default: 'Assistant Professor',
    required: true
},
  department: { 
    type: String, 
    default: 'School of Engineering & Technology',
    trim: true
},
  specialization: [{ type: String, trim: true }],
  role: { type: String, enum: ['faculty', 'admin'], default: 'faculty' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
facultySchema.index({ email: 1, employeeId: 1 });
facultySchema.virtual('isAdmin').get(function () {
    return this.role === 'admin';
});
facultySchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
const bcrypt = require('bcrypt');

facultySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('Faculty', facultySchema);

