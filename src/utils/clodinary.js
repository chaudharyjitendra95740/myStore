export const uploadImageToCloudinary = async (imageFile) => {
  if (!imageFile) return "";

  try {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET  ;

    console.log("Cloud Name:", cloudName);
    console.log("Upload Preset:", uploadPreset);

    if (!cloudName) {
      throw new Error("VITE_CLOUDINARY_CLOUD_NAME not found in .env file");
    }

    if (!uploadPreset) {
      throw new Error("VITE_CLOUDINARY_UPLOAD_PRESET not found in .env file");
    }

    const formData = new FormData();

    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    console.log("Cloudinary Response:", data);

    if (!response.ok) {
      throw new Error(data.error?.message || "Upload Failed");
    }

    return data.secure_url;
  } catch (error) {
    console.error("Cloudinary Error:", error);
    throw error;
  }
};
