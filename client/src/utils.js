//Configurations for Axios
export const AxiosConfig = (url = '/', data={}, method='post' )=>{
    return {
        method,
        url,
        data,
      }
}
//Object to handle errors
export const ErrorObject = (errorType='false', message='') => {
    if(errorType === 'false') return null
    return{
        errorType,
        message
    }
}