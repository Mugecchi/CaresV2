import api from "./axios";

export const getOffices = async () => {
	const response = await api.get("/options/offices");
	return response.data;
};
