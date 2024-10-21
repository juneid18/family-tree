import axios from "axios";

const UserInfo = async (validEmail) => {
  try {
    const response = await axios.post(
      "http://192.168.80.236:3000/fetchfamilytree",
      { createdBy: validEmail }
    );

    if (response.data && response.data.success === true) {
      return response.data.UserTree; // Return the existing user data
    }

    return response.data;
  } catch (error) {
    console.log("Error caught", error);
    return null;
  }
};

export default UserInfo;
