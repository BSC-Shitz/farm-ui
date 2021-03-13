import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'

import Button from '../Button'
import CardIcon from '../CardIcon'
import Modal, { ModalProps } from '..//Modal'
import ModalActions from '..//ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../../components/Spacer'
import thugslogo from '../../assets/img/thugslogo.png'
import warslogo from '../../assets/img/gangwars.png'

interface DisclaimerModal extends ModalProps {
  onConfirm: () => void
}

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  text-decoration: bold;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

const DisclaimerModal: React.FC<DisclaimerModal> = ({
  onConfirm,
  onDismiss,
}) => {
  const [step, setStep] = useState('disclaimer')

  const handleConfirm = useCallback(() => {
    onConfirm()
    onDismiss()
  }, [onConfirm, onDismiss])

  const modalContent = useMemo(() => {
    {
      return (
        <div>
          <StyledInfo4>
          OCTOBER 20TH 2020
          </StyledInfo4>
          <StyledInfo3>
          THUGSWAP AMM, GUNS TOKEN & THE FUTURE OF THUGS
          </StyledInfo3>
          <Spacer size="sm" />
          <StyledInfo4>
          <StyledLink target="_blank" href="https://thugsfinance.medium.com/thugswap-amm-the-future-of-thugs-6f2aa48e67aa">
          {<img src={warslogo} height={"40%"} width={"40%"} />}
          </StyledLink>
          </StyledInfo4>
          <StyledInfo4>
          <StyledLink target="_blank" href="https://thugsfinance.medium.com/thugswap-amm-the-future-of-thugs-6f2aa48e67aa">
            Click to learn more about the soon to be launched GUNS tokens, Thugs NFTs and the Gang Wars
            Blockchain Game! There is no farm or defi project in existence that can do it quite like the THUGS!
          </StyledLink>
          </StyledInfo4>
        </div>
      )
    }
  }, [step])


  const button = useMemo(() => {
      return <Button text="Continue To The Trap" onClick={handleConfirm} />
  }, [setStep, step, handleConfirm])

  return (
    <Modal>
      <ModalTitle text={`Traphouse Announcements`} />
      <ModalContent>{modalContent}</ModalContent>
      <ModalActions>{button}</ModalActions>
    </Modal>
  )
}

const StyledInfo2 = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 32px;
  font-weight: 400;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: -20px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const StyledInfo3 = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 20px;
  font-weight: 400;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: -20px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const StyledInfo4 = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 12px;
  font-weight: 400;
  margin-left: 20%;
  margin-right: 20%;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default DisclaimerModal
