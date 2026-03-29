import api from './ApiServices';

const projectService = {
  getProjects: async (page = 1, limit = 10) => {
    const response = await api.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  },

  getProjectById: async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  updateProject: async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  },

  deleteProject: async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  },

  inviteToProject: async (projectId, email) => {
    const response = await api.post(`/projects/${projectId}/invite`, { email });
    return response.data;
  },

  getBoards: async (projectId) => {
    const response = await api.get(`/projects/${projectId}/boards`);
    return response.data;
  },

  createBoard: async (projectId, boardData) => {
    const response = await api.post(`/projects/${projectId}/boards`, boardData);
    return response.data;
  },

  deleteBoard: async (boardId) => {
    const response = await api.delete(`/boards/${boardId}`);
    return response.data;
  },
};

export default projectService;
