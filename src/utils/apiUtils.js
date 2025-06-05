/**
 * Handles API responses
 * @param {Response} response - The fetch response object
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the response is not OK
 */
export const handleResponse = async (response) => {
    const data = await response.json();
    
    if (!response.ok) {
      const error = data.message || `HTTP error! status: ${response.status}`;
      throw new Error(error);
    }
    
    return data;
  };
  
  /**
   * Handles API errors
   * @param {Error} error - The error object
   * @throws {Error} The error with a user-friendly message
   */
  export const handleError = (error) => {
    console.error('API Error:', error);
    throw new Error(error.message || 'Something went wrong. Please try again later.');
  };