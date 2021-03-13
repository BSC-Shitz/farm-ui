import React from 'react'
import styled from 'styled-components'
import chef from '../../assets/img/chef.png'
import upgrade from '../../assets/img/upgrade.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
      <Spacer size="lg" />
          <StyledLink2
        target="__blank"
        href="/Upgrade"
      >
     {<img src={upgrade} height={240} />}
    </StyledLink2>
    <div
        style={{
          margin: '0 auto',
        }}
      >
     <Button text="💊️ Upgrade to DRUGSV2 💊️" to="/Upgrade" />
      </div>
      <StyledInfo5>
        OriginalGangsterV2 is Here
      </StyledInfo5>
        <StyledInfo>
        Welcome to the TRAPHOUSE! Don't forget to upgrade your old DRUGS if you haven't already! Now that you're here playa, you can put in work by Staking LP tokens to claim your very own stash of DRUGS! Then stake those DRUGS to stack HOES 😁️
      </StyledInfo>
      <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />
      <StyledInfo>
        📱️<b>Text from the OG</b>: You could just sell your DRUGS but staking them
        directly or staking DRUGS-BNB LP will grow your stacks the fastest (yields the most rewards per block)!
      </StyledInfo>
      <Spacer size="md" />
      <div
        style={{
          margin: '0 auto',
        }}
      >
        <Button text="🏚️ Check the Traps" to="/traps" variant="tertiary" />
      </div>
    </Page>
  )
}

const StyledLink2 = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  font-size: 15px;
  margin-top: -40px;
  margin-bottom: 20px;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin-left: 100px;
  margin-right: 100px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

const StyledInfo5 = styled.h3`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 32px;
  font-weight: 400;
  margin-top: 25px;
  margin-left: 50px;
  margin-right: 50px;
  margin-bottom: 10px;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Home
