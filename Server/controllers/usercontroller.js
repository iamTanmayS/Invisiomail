const config = require("../configs/configenv");
const User = require("../database/models/userModel");

const fetchUser = async (req, res) => {
    try {
      const tokenUser = req.user;
      console.log(tokenUser)
      if (!tokenUser) {
      
        return res.status(401).json({ message: "Unauthorized: User not found in token" });
      }
  
      const user = await User.findById({ _id: tokenUser.id }).select("email userName picture");
      
      if (!user) {
        
        return res.status(404).json({ message: "User not found in DB" });
      }
  
      return res.status(200).json(user);
    }
     catch (err) {
      
      return res.status(500).json({ message: `Internal Server Error: ${err.message}` });
    }
  };
  

module.exports = fetchUser;