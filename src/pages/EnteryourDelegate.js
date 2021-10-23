import React, {useState} from 'react';
import styled from 'styled-components/macro'
import {useHistory} from "react-router-dom";
import {utils} from 'ethers';

import Footer from '../components/Footer'
import Gap from '../components/Gap'
import {Header, Content} from '../components/text'
import {NarrowColumn} from "../components/layout";
import {ContentBox} from "../components/layout";
import {getEthersProvider} from "../web3modal";

const Img = styled.img`
  width: 100%;
  margin-top: -15px;
`

const WrappedNarrowColumn = styled(NarrowColumn)`
  max-width: 670px;
`

const Input = styled.input`
  height: 64px;
  width: 100%;
  -webkit-appearance: none;
  outline: none;
  border: none;
  background: #F6F6F6;
  border-radius: 14px;
  padding: 0px 20px;
  box-sizing: border-box;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-bottom: 12px;

  &::placeholder {
    color: black;
    opacity: 0.23;
  }
`

const ValidationMessageContainer = styled.div`
  background: ${p => p.error ? 'rgba(213, 85, 85, 0.1)' : 'rgba(73, 179, 147, 0.1)'};
  border-radius: 10px;
  padding: 10px 14px;
  box-sizing: border-box;

  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: ${p => p.error ? '#D55555' : '#49B393'};
`

const ValidationMessage = (props) => {
    return (
        <ValidationMessageContainer error={props.error}>
            {props.children}
        </ValidationMessageContainer>
    )
}

const InputComponent = (props) => {
    const [validationMessage, setValidationMessage] = useState({
        message: '',
        isError: false
    })

    const onChange = (event) => {
        const value = event.target.value

        const run = async () => {
            if (value.includes('.eth')) {
                try {
                    getEthersProvider().resolveName(value)
                    setValidationMessage({
                        message: 'Valid ENS name',
                        isError: false
                    })
                } catch (error) {
                    setValidationMessage({
                        message: 'ENS name does not exist',
                        isError: true
                    })
                }
                return
            }

            try {
                utils.getAddress(value)
                setValidationMessage({
                    message: 'Valid Ethereum address',
                    isError: false
                })
            } catch (error) {
                setValidationMessage({
                    message: 'Invalid ethereum address or ENS name',
                    isError: true
                })
            }
        }

        if (value) {
            run()
        } else {
            setValidationMessage({
                message: '',
                isError: false
            })
        }
    }

    return (
        <div>
            <Input {...props} onChange={onChange}/>
            {validationMessage.message && (
                <ValidationMessage error={validationMessage.isError}>
                    {validationMessage.message}
                </ValidationMessage>
            )}
        </div>
    )
}

const EnteryourDelegate = () => {
    const history = useHistory();

    return (
        <NarrowColumn>
            <ContentBox>
                <Header>Custom delegate</Header>
                <Gap height={3}/>
                <Content>
                    Delegate your voting power to an ENS name.
                    You can also enter their Ethereum address.
                </Content>
                <Gap height={5}/>
                <InputComponent placeholder={"delegate.eth"}/>
            </ContentBox>
            <Footer
                rightButtonText="Next"
                rightButtonCallback={() => {
                    history.push('/delegates')
                }}
                leftButtonText="Back"
                leftButtonCallback={() => {
                    history.push('/why')
                }}
            />
        </NarrowColumn>
    );
};

export default EnteryourDelegate;
