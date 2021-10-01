import constitution from "./constitution";

export const initLocalStorage = () => {
    if(!window.localStorage.getItem('constitution')) {
        window.localStorage.setItem('constitution', constitution)
    }
}

export const getConstitution = () => {
 return window.localStorage.getItem('constitution')
}

export const saveConstitution = (cons) => {
    window.localStorage.setItem('constitution', cons)
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
