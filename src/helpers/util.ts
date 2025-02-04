// utility helper functiosn go here

export const checkForEnterKey = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter') {
    callback();
  }
};

export const resolveObjectField = (path: string, obj: any) => {
  return path.split('.').reduce((prev, curr) => {
    return prev ? prev[curr] : null;
  }, obj);
};
