export const getEnv = () => window.location.href.includes('localhost') ? 'dev' : 'prod'

export const formatTokenAmount = (tokenAmount, length = 9) =>
    new Intl.NumberFormat(
        'en-US',
        { maximumSignificantDigits: length }
        ).format(Number(tokenAmount)/Math.pow(10,18))
