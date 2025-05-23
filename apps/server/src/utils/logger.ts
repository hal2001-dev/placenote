export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ? JSON.stringify(error, null, 2) : '');
  },
  query: (query: string, params?: any) => {
    console.log(`[QUERY] ${query}`, params ? JSON.stringify(params, null, 2) : '');
  }
}; 