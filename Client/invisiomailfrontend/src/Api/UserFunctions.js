import { fetchWithAutoRefresh } from "./Authentication";
import config from "../configs/configenv";
import { setError, setLoading, setUser } from "../Redux/Slice/authslice";


export const fetchUserProfile = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetchWithAutoRefresh(`${config.Server.serverUrl}/user`, {
      method: "GET",
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    
    const user = await response.json();
    dispatch(setUser(user));
    return user;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    dispatch(setError(error.message));
    return null;
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => (dispatch) => {
  // Add your logout API call here if needed
  dispatch(logout());
};