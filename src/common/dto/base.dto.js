import joi from "joi"

class BaseDto {
    static schema = joi.object({})

    static validation(data){
        const{error, value} = this.schema.validate(data, {
            abortEarly:false,
            stripUnknown: true
        })
        if(error){
            const errors = error.details.map((d) => d.message) 
            return {error:errors, value:null};  
        }
        return {error: null, value}
    }
}

export default BaseDto