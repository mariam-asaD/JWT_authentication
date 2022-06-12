const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');
const jwt = require('jsonwebtoken');
// const geocoder = require(`${config.path.config}/geocoder`);

const userSchema = new Schema({
    first_name : { type: String, trim: true, match: /[آ-یa-zA-Z]/, maxlength: 50 },
    last_name : { type: String, trim: true, match: /[آ-یa-zA-Z]/, maxlength: 50 },
    phone_number : { type: Number, dropDups: true, unique : true, maxlength: 11 },
    email : { type: String, unique : true, dropDups: true, match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
    email_verified : { type: Boolean, default: false},
    location_detail : { type: String, match: /[آ-یa-zA-Z]/ },
    location: {
        type: { type: String, enum: ['Point'] },
        coordinates: { type: [Number], index: '2dsphere' },
        formattedAddress: String
    },
});
userSchema.plugin(timestamp,{
    createdAt: 'created_at',
    updatedAt: 'update_at'
});

userSchema.methods.generateVerificationToken = function () {
    const user = this;
    const verificationToken = jwt.sign({ ID: user._id }, process.env.USER_VERIFICATION_TOKEN_SECRET, { 
        expiresIn: "1d" ,
        algorithm: 'HS512'
    });
    return verificationToken;
};

// //Geocode & create location
// AddressSchema.pre('save' , async function(next){
//     const loc = await geocoder.geocode(this.location_detail);
//     this.location = {
//         type: 'Point',
//         coordinates: [loc[0].longitude, loc[0].latitude],
//         formattedAddress: loc[0].formattedAddress
//     }
//     // Do not save address
//     this.Address_detail = undefined;
//     next();
// });

module.exports = mongoose.model('users', userSchema);