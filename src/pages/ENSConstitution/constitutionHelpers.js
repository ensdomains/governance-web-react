import constitution from "./constitution";

export const initLocalStorage = () => {
    if(!window.localStorage.getItem('constitution')) {
        window.localStorage.setItem('constitution', JSON.stringify(constitution))
    }
}

export const getConstitution = () => {
 return JSON.parse(window.localStorage.getItem('constitution'))
}

export const saveConstitution = (cons) => {
    window.localStorage.setItem('constitution', JSON.stringify(cons))
}

export const getEarliestUnvotedArticle = () => {
    const cons = getConstitution()
    for(let i = 0; i < cons.length; i++) {
        if(cons[i].vote === null) return i
    }
}

export const hasVotedOnEachArticle = () => {
    const cons = getConstitution()
    for(let i = 0; i < cons.length; i++) {
        if(cons[i].vote === null) return false
    }
    return true
}

export const saveSignedVote = () => {

}

export const getSignedVote = () => {

}

export const getTotalNumberOfArticles = () => {
    return getConstitution()?.length ?? 0
}

export const getArticle = (n = 0) => {
    return getConstitution()?.[n]
}

export const voteOnArticle = (n, vote) => {
    const constitution = getConstitution()
    constitution[n].vote = vote;
    saveConstitution(constitution)
}
