import React from 'react';
import styled from 'styled-components'

const ButtonContainer = styled.div`
    width: 150px;
    height: 50px;
    background: lightpink;
    display: flex;
    align-items: center;
    justify-content: center;
`

const Button = (props) => {
    return (
        <ButtonContainer {...props}>
            {props.text}
        </ButtonContainer>
    );
};

export default Button;
