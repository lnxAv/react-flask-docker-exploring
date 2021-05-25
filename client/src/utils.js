//Configurations for Axios
const __APIURL = 'http://localhost:5000'
export const AxiosConfig = (url = '/', data={}, method='post' )=>{
    const _url = __APIURL + url
    return {
        method,
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
        },
        url: _url,
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
//ChunkLoads
export const ChunkLoads = (top=[], view=[], bottom=[]) => {
    return{
        top,
        view,
        bottom
    }
}