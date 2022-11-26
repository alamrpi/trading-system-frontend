import React from 'react';

const InvalidMessage = ({name, invalidMessage}) => {
    if(invalidMessage)
        return (
            <div id={`invalid_${name}`} className="invalid-feedback">
                {invalidMessage}
            </div>
        );
    return null;
};

export default InvalidMessage;