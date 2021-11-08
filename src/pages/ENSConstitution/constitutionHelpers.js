import constitution from "./constitution"

export const initLocalStorage = (address) => {
  const account = window.localStorage.getItem(address)
  const normalisedAccount = address.toLowerCase()
  if (!account) {
    window.localStorage.setItem(
      normalisedAccount,
      JSON.stringify({ constitution, delegate: "" })
    )
  }
  if (account) {
    const parsedAccount = JSON.parse(account)
    if (!parsedAccount.constitution) {
      window.localStorage.setItem(
        normalisedAccount,
        JSON.stringify({ ...parsedAccount, constitution })
      )
    }
  }
}

export const getConstitution = (address) => {
  const normalisedAddr = address.toLowerCase()
  return JSON.parse(window.localStorage.getItem(normalisedAddr))?.constitution
}

export const saveConstitution = (address, cons) => {
  const accountObj = JSON.parse(window.localStorage.getItem(address))
  const normalisedAddr = address.toLowerCase()
  window.localStorage.setItem(
    normalisedAddr,
    JSON.stringify({ ...accountObj, constitution: cons })
  )
}

export const getEarliestUnvotedArticle = (address) => {
  const cons = getConstitution(address)
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === null) return i
  }
  return cons.length - 1
}

export const getChoices = (address) => {
  const cons = getConstitution(address)
  const choices = []
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === true) choices.push(i + 1)
  }
  return choices
}

export const hasVotedOnEachArticle = (address) => {
  const cons = getConstitution(address)
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === null) return false
  }
  return true
}

export const getTotalNumberOfArticles = (address) => {
  return getConstitution(address)?.length ?? 0
}

export const getArticle = (address, n = 0) => {
  return getConstitution(address)?.[n]
}

export const voteOnArticle = (account, n, vote) => {
  const constitution = getConstitution(account)
  constitution[n].vote = vote
  saveConstitution(account, constitution)
}

export const isCompleted = (address) => {
  const constitution = getConstitution(address)
  const length = constitution.length
  const completed = constitution.reduce((accum, next) => {
    if (next.vote !== null) return accum + 1
    return accum
  }, 0)
  return length === completed
}
