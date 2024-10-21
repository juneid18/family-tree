import axios from "axios";

const UploadImage = async (image) => {
  if (!image) {
    console.log("Please select an image first.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", {
      uri: image,
      type: "image/jpeg", // Ensure this matches the image type
      name: "uploaded_image.jpg", // Set the name for the image
    });
    formData.append("upload_preset", "Default"); // Replace with your Cloudinary upload preset

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/dbvrz0jdo/image/upload", // Replace with your Cloudinary cloud name
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  } catch (error) {
    // Log full error response for debugging
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error
    );
  }
};

export default UploadImage;
