export const debounceFetching = (func: Function, delay: number = 2000) => {
    let timeoutId: NodeJS.Timeout;
  
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  