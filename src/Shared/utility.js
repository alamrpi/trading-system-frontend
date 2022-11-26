import * as VALIDATIONS from "../Const/VALIDATIONS"

export const checkValidation = (value, rules, label) => {
    let validStatus = {
        isValid: true,
        validationError: ''
    };

    if(!rules){
        validStatus.isValid = true;
        return validStatus;
    }

    if(rules[VALIDATIONS.IS_REQUIRED] && value !== null){
        if(!(value.length !== 0 && validStatus.isValid)){
            validStatus.isValid = false;
            validStatus.validationError = label + " field is required!";
            return validStatus
        }
    }

    if(rules[VALIDATIONS.IS_EMAIL] && value !== null){
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!(value.match(regex)&& validStatus.isValid)){
            validStatus.isValid = false;
            validStatus.validationError = label + " field is must be an email!";
            return validStatus
        }
    }

    if(rules[VALIDATIONS.IS_NUMBER]){
        if(!(!isNaN(value) && validStatus.isValid)){
            validStatus.isValid = false;
            validStatus.validationError = label + " is must number value!"
            return validStatus
        }
    }
    if(rules[VALIDATIONS.LENGTH]){
        if(!(value.length === rules.length && validStatus.isValid)){
            validStatus.isValid = false;
            validStatus.validationError = label + " field is must on "+ rules.length +" character!";
            return validStatus
        }
    }
    if(rules[VALIDATIONS.MIN_LENGTH]){
        if(!(value.length >= rules.minLength && validStatus.isValid)){
            validStatus.isValid = false;
            validStatus.validationError = label + " must on " + rules.minLength+ " characters!"
            return validStatus
        }
    }


    if(rules[VALIDATIONS.VALID_EXTENSIONS]){

        const ext =  value.name.substring(value.name.lastIndexOf('.') + 1).toLowerCase();

        if(!rules[VALIDATIONS.VALID_EXTENSIONS].includes(ext)){
            validStatus.isValid = false;
            validStatus.validationError = label + " is must " + rules[VALIDATIONS.VALID_EXTENSIONS].join(', ') +" extension !"
            return validStatus
        }
    }
    return validStatus;
}

export const reFormatForRequestBody = (controls) => {
    const formData = {};
    for (let formElementIdentifier in controls){
        if(formElementIdentifier !== 'multiForms')
            formData[formElementIdentifier] = controls[formElementIdentifier].value;
    }
    return formData;
}

export const updateObject = (currentState, updatedState) =>{
    return{
        ...currentState,
        ...updatedState
    }
}

export const errorHandler = (error) => {
    let errors;
    if(error.response){
        const {status, data} = error.response;
        switch (status){
            case 404:
                errors = "Data/page Not found.";
                break;
            case 400:
                if(data.title === undefined)
                {
                    errors = data;
                }
                else
                {
                    errors = data.title;
                    console.log(data.errors);
                }
                break;
            case 405:
                errors = "Method not allowed";
                break;
            case 500:
                if(data.errors)
                    errors = data.errors;
                else
                    errors = data;
                break;
            case 401:
                errors = "Un-authorized request."
                break;
            default:
                errors = "Something went wrong."
        }

    }else if(error.request){
        errors = "The request was made but no response was received."
    }else{
        errors = error.message;
    }
    return errors;
}

export const serialGenerateByPage = (currentPage, pageSize, index) => {
    return ((currentPage - 1) * pageSize) + (index + 1);
}

export const dataBindForUpdate = (controls, data) => {
    const updatedControls = {...controls};
    for (const controlKey in updatedControls){
        updatedControls[controlKey].value = data[controlKey]
        updatedControls[controlKey].isValid = true
    }
    return updatedControls;
}

export const convertLocalDate = (dateString) => {
    const date = new Date(dateString),
        month = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), month, day].join("-");
}