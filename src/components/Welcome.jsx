import React from 'react';
import styled from 'styled-components';

const Welcome = ({user}) => {
    return <Container>
        <div><iframe src="https://giphy.com/embed/ASd0Ukj0y3qMM" frameBorder="0" className="giphy-embed" allowFullScreen></iframe></div>
        <h1>Welcome <span>{user.username}!</span></h1>
        <h3>Please select a chat to start messaging</h3>
    </Container>
}

export default Welcome;

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
color: white;

@media screen and (max-width: 719px) {
    height: 100%

}

h1 {
    @media screen and (max-width: 719px) {
        font-size: 8vw;
        padding: 2vw;   
    }
}

h3 {
    @media screen and (max-width: 719px) {
        font-size: 5vw;
        padding: 4vw;   

    }
}

`;