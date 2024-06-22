import axios from "axios";

export function getAllCarsCoordinate(callbackFunction: any = () => {}) {
  return axios
    .get("https://103f-178-160-200-178.ngrok-free.app/api/cars", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "any",
      },
    })
    .then((res) => {
      console.log(res.data, "<<<<<<");
      callbackFunction(res.data.cars);
      return res.data.cars;
    })
    .catch((error) => {
      console.error("Error fetching road data:", error);
      throw error;
    });
}
