const mongoose = require("mongoose")

const emailSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User', 
     required: true
    },

   sender: { 
      type: String,
     required: true 
    },


  receiver: 
  { 
     type: String,
     required: true
     },

  subject:
   { 
    type: String
 },
  body:
   { 
    type: String
 },

  status:
   { 
    type: String, 
    enum: ['sent', 'failed', 'pending'], 
    default: 'pending'
 },

  sentAt: {
     type: Date, 
     default: Date.now
     },

  messageId: 
  { 
    type: String 
},

readStatus: {
  type: String,
  enum: ['sent', 'opened'],
  default: 'sent'
},

openedAt: {
  type: Date
},
openCount: {
  type: Number,
  default: 0
},

updation:
{
   type:String,
   enum:['enabled','disabled'],
   default:'enabled'
}

});

const Email = mongoose.model('Email', emailSchema);

module.exports= Email;