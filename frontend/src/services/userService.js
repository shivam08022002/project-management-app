import api from './ApiServices';

const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

const getNotifications = async () => {
  const response = await api.get('/users/notifications');
  return response.data;
};

const respondToInvitation = async (id, action) => {
  const response = await api.post(`/users/notifications/${id}/respond`, { action });
  return response.data;
};

const userService = {
  getAllUsers,
  getNotifications,
  respondToInvitation,
};

export default userService;
