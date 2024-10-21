import axios from "axios";

const UserInfo = async (validEmail) => {
  try {    
    const response = await axios.post("http://192.168.80.236:3000/userinfoapi", { email: validEmail });

    if (response.data && response.data.success === true) {
      return response.data.UserData; // Return the existing user data
    }
    
    return response.data; // Return the actual data if it's not an existing user

  } catch (error) {
    console.log("Error caught", error);
    return null; // Handle error case
  }
};

export default UserInfo;
