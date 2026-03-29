import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../../services/projectService';
import taskService from '../../services/taskService';

export const fetchBoards = createAsyncThunk('tasks/fetchBoards', async (projectId, thunkAPI) => {
  try { return await projectService.getBoards(projectId); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch boards'); }
});

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ projectId, params }, thunkAPI) => {
  try {
    return await taskService.getTasks(projectId, { limit: 200, ...params });
  } catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch failed'); }
});

export const updateTaskData = createAsyncThunk('tasks/updateData', async ({ taskId, data }, thunkAPI) => {
  try { return await taskService.updateTask(taskId, data); } 
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed'); }
});

export const createTask = createAsyncThunk('tasks/create', async ({ boardId, taskData }, thunkAPI) => {
    try { return await taskService.createTask(boardId, taskData); } 
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Creation failed'); }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (taskId, thunkAPI) => {
    try { await taskService.deleteTask(taskId); return taskId; } 
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed'); }
});

export const deleteBoard = createAsyncThunk('tasks/deleteBoard', async (boardId, thunkAPI) => {
    try { await projectService.deleteBoard(boardId); return boardId; } 
    catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete failed'); }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { boards: [], tasks: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => { state.boards = action.payload; })
      .addCase(fetchTasks.pending, (state) => { state.isLoading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks || [];
      })
      .addCase(updateTaskData.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks[index] = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter(t => t._id !== action.payload);
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
          state.boards = state.boards.filter(b => b._id !== action.payload);
      });
  }
});

export default taskSlice.reducer;
