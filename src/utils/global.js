export const globalUtils = {
  getLocalData(key) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  },
  setLocalData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  },
};