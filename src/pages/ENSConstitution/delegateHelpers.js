export const setDelegateChoice = (choice) => {
  return window.localStorage.setItem("delegateChoice", choice);
};

export const getDelegateChoice = () => {
  return window.localStorage.getItem("delegateChoice");
};
