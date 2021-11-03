import constitution from "./constitution";

export const initLocalStorage = () => {
  if (!window.localStorage.getItem("constitution")) {
    window.localStorage.setItem("constitution", JSON.stringify(constitution));
  }
};

export const getConstitution = () => {
  return JSON.parse(window.localStorage.getItem("constitution"));
};

export const saveConstitution = (cons) => {
  window.localStorage.setItem("constitution", JSON.stringify(cons));
};

export const getEarliestUnvotedArticle = () => {
  const cons = getConstitution();
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === null) return i;
  }
  return cons.length - 1;
};

export const getChoices = () => {
  const cons = getConstitution();
  const choices = [];
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === true) choices.push(i + 1);
  }
  return choices;
};

export const hasVotedOnEachArticle = () => {
  const cons = getConstitution();
  for (let i = 0; i < cons.length; i++) {
    if (cons[i].vote === null) return false;
  }
  return true;
};

export const saveSignedVote = () => {};

export const getSignedVote = () => {};

export const getTotalNumberOfArticles = () => {
  return getConstitution()?.length ?? 0;
};

export const getArticle = (n = 0) => {
  return getConstitution()?.[n];
};

export const voteOnArticle = (n, vote) => {
  const constitution = getConstitution();
  constitution[n].vote = vote;
  saveConstitution(constitution);
};

export const isCompleted = () => {
  const constitution = getConstitution();
  const length = constitution.length;
  const completed = constitution.reduce((accum, next) => {
    if (next.vote !== null) return accum + 1;
    return accum;
  }, 0);
  return length === completed;
};
