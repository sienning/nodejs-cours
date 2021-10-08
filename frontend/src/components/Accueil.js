import React from 'react';
import { Header, Container, Card, Image } from 'semantic-ui-react';

const Accueil = ({ email, userData }) => {

    return (
        <Container>
            <br />
            <Header as='h1'>Bonjour, {userData.firstname} {userData.lastname}</Header>
            <Card
                link
                href="/posts"
                header="Voir les posts"
                color="orange"
                meta="Liste des posts"
            />
            <Card
                link
                href="/write-post"
                header="Écrire un post"
                color="blue"
            />
            <Image src="./post.gif" />
        </Container >
    );
}

export default Accueil;
