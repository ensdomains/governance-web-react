import React, { useEffect, useState } from "react"
import styled from "styled-components/macro"
import { useHistory } from "react-router-dom"
import { utils } from "ethers"
import { useQuery, gql } from "@apollo/client"

import Footer from "../components/Footer"
import Gap from "../components/Gap"
import { Header, Content } from "../components/text"
import { NarrowColumn } from "../components/layout"
import { ContentBox } from "../components/layout"
import { getEthersProvider } from "../web3modal"
import {
  getDelegateChoice,
  setDelegateChoice,
} from "./ENSConstitution/delegateHelpers"

const Input = styled.input`
  height: 64px;
  width: 100%;
  -webkit-appearance: none;
  outline: none;
  border: none;
  background: #f6f6f6;
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
  background: ${(p) =>
    p.error ? "rgba(213, 85, 85, 0.1)" : "rgba(73, 179, 147, 0.1)"};
  border-radius: 10px;
  padding: 10px 14px;
  box-sizing: border-box;

  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;

  display: flex;
  align-items: center;

  color: ${(p) => (p.error ? "#D55555" : "#49B393")};
`

const ValidationMessage = (props) => {
  return (
    <ValidationMessageContainer error={props.error}>
      {props.children}
    </ValidationMessageContainer>
  )
}

const AddressMessage = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;

  color: #989898;
  margin-bottom: 14px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const InputComponent = ({
  validationMessage,
  setValidationMessage,
  ensNameAddress,
  setEnsNameAddress,
  setValue,
  defaultValue,
  ...props
}) => {
  const onChange = (event) => {
    const value = event.target.value
    setValue(value)

    const run = async () => {
      if (value.includes(".")) {
        try {
          const result = await getEthersProvider().resolveName(value)
          if (result) {
            setEnsNameAddress(result)
            setValidationMessage({
              message: "Valid ENS name",
              isError: false,
            })
            return
          }
          throw "error"
        } catch (error) {
          setValidationMessage({
            message: "ENS name does not resolve to an ETH address",
            isError: true,
          })
        }
        setEnsNameAddress("")
        return
      }

      try {
        utils.getAddress(value)
        setValidationMessage({
          message: "Valid Ethereum address",
          isError: false,
        })
      } catch (error) {
        setValidationMessage({
          message: "Invalid ethereum address",
          isError: true,
        })
      }
      setEnsNameAddress("")
    }

    if (value) {
      run()
    } else {
      setValidationMessage({
        message: "",
        isError: false,
      })
    }
  }

  useEffect(() => {
    if (defaultValue) {
      onChange({
        target: {
          value: defaultValue,
        },
      })
    }
  }, [defaultValue])

  return (
    <div>
      <Input {...props} onChange={onChange} defaultValue={defaultValue} />
      {ensNameAddress && <AddressMessage>{ensNameAddress}</AddressMessage>}
      {validationMessage.message && (
        <ValidationMessage error={validationMessage.isError}>
          {validationMessage.message}
        </ValidationMessage>
      )}
    </div>
  )
}

const EnteryourDelegate = () => {
  const history = useHistory()
  const [validationMessage, setValidationMessage] = useState({
    message: "",
    isError: false,
  })

  const {
    data: { address },
  } = useQuery(gql`
    query getAddress @client {
      address
    }
  `)

  const [ensNameAddress, setEnsNameAddress] = useState("")
  const [value, setValue] = useState(null)

  useEffect(() => {
    if (address) {
      setValue(getDelegateChoice(address))
    }
  }, [address])

  return (
    <NarrowColumn>
      <ContentBox>
        <Header>Custom delegate</Header>
        <Gap height={3} />
        <Content>
          Delegate your voting power to an ENS name. You can also enter their
          Ethereum address.
        </Content>
        <Gap height={5} />
        <InputComponent
          placeholder={"delegate.eth"}
          {...{
            validationMessage,
            setValidationMessage,
            ensNameAddress,
            setEnsNameAddress,
            setValue,
            defaultValue: value,
          }}
        />
      </ContentBox>
      <Footer
        disabled={validationMessage.isError || !value}
        rightButtonText="Next"
        rightButtonCallback={() => {
          setDelegateChoice(address, value)
          history.push("/summary")
        }}
        leftButtonText="Back"
        leftButtonCallback={() => {
          history.push("/delegates")
        }}
      />
    </NarrowColumn>
  )
}

export default EnteryourDelegate
