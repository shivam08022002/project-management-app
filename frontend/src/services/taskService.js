import api from './ApiServices';

const taskService = {
  getTasks: async (projectId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/projects/${projectId}/tasks?${query}`);
    return response.data;
  },

  createTask: async (boardId, taskData) => {
    const response = await api.post(`/boards/${boardId}/tasks`, taskData);
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  },
  
  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

export default taskService;
