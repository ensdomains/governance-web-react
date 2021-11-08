export const setDelegateChoice = (account, choice) => {
  const normalisedAccount = account.toLowerCase()
  if (!account) {
    window.localStorage.setItem(
      normalisedAccount,
      JSON.stringify({ delegate: choice })
    )
  }

  if (account) {
    const localStorageAccount = JSON.parse(window.localStorage.getItem(account))
    return window.localStorage.setItem(
      account,
      JSON.stringify({
        ...localStorageAccount,
        delegate: choice,
      })
    )
  }
}

export const getDelegateChoice = (account) => {
  return JSON.parse(window.localStorage.getItem(account))?.delegate
}

export const setDelegateReferral = (choice) => {
  window.localStorage.setItem("delegateReferral", choice)
}

export const getDelegateReferral = () => {
  return window.localStorage.getItem("delegateReferral")
}
