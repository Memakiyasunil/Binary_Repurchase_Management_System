import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import walletService from './walletService';

export const fetchWallet = createAsyncThunk('wallet/fetch', async (_, thunkAPI) => {
  try { return await walletService.getWallet(); }
  catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const fetchTransactions = createAsyncThunk('wallet/fetchTransactions', async ({ page, limit } = {}, thunkAPI) => {
  try { return await walletService.getTransactions(page, limit); }
  catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    wallet: null,
    transactions: [],
    total: 0,
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    resetWallet: (state) => { state.isError = false; state.message = ''; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload.wallet;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.isLoading = false; state.isError = true; state.message = action.payload;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload.transactions;
        state.total = action.payload.total;
      });
  }
});

export const { resetWallet } = walletSlice.actions;
export default walletSlice.reducer;
