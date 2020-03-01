import axios from "axios";

export const getCustomerDataApi = async () => {
  return await axios
    .get("http://localhost:9000/customers")
    .then(response => {
      const data = response.data;
      return data;
    })
    .catch(err => {
      throw err;
    });
};
