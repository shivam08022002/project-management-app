import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (_, thunkAPI) => {
  try { return await projectService.getProjects(1, 100); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed'); }
});

export const fetchProjectById = createAsyncThunk('projects/fetchProjectById', async (id, thunkAPI) => {
    try { return await projectService.getProjectById(id); } 
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed'); }
});

export const createProject = createAsyncThunk('projects/create', async (data, thunkAPI) => {
  try { return await projectService.createProject(data); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Create failed'); }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }, thunkAPI) => {
  try { return await projectService.updateProject(id, data); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed'); }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id, thunkAPI) => {
  try { 
      await projectService.deleteProject(id); 
      return id;
  } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed'); }
});

export const inviteToProject = createAsyncThunk('projects/invite', async ({ id, email }, thunkAPI) => {
  try { return await projectService.inviteToProject(id, email); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Invite failed'); }
});

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    projects: [],
    currentProject: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.isLoading = true; })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload.projects || [];
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.projects[index] = action.payload;
        if(state.currentProject?._id === action.payload._id) state.currentProject = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      .addCase(inviteToProject.fulfilled, (state) => {
        // No state update needed on the inviter's side immediately
        state.isLoading = false;
      });
  }
});

export default projectSlice.reducer;
