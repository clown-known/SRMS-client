interface BaseResponse<T>{
    data: {
        data:T
    },
    status:number
}