// utility helper functiosn go here

export const checkForEnterKey = (e: React.KeyboardEvent, callback: () => void) => {
  if (e.key === 'Enter') {
    callback();
  }
};