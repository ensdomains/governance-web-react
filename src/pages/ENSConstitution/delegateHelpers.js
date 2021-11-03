export const setDelegateChoice = (account, choice) => {
  return window.localStorage.setItem(
    account,
    JSON.stringify({
      delegate: choice,
    })
  );
};

export const getDelegateChoice = (account) => {
  return JSON.parse(window.localStorage.getItem(account))?.delegate;
};
