import axios from "axios";

export async function getNewAccessToken() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/token/newToken`,
      {
        withCredentials: true,
      },
    );
    return response;
  } catch (error) {
    console.log(error);
  }
}
