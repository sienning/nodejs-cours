import React, { Component } from 'react';
import { List, Container, Button, Header, Form } from 'semantic-ui-react';
import axios from 'axios';

class WritePost extends Component {
    state = {
        token: "",
        email: "",
        isLoading: false,
    }
    componentDidMount() {
        this.setState({
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token')
        });
    }

    sendPost = async (titre, text, autor) => {
        this.setState({ isLoading: true });
        await axios.post("http://localhost:3000/test/", {
            titre: titre,
            text: text,
            autor: autor
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data);
                this.setState({ isLoading: false });
                window.location.replace("/posts");
            })
            .catch(err => console.log(err))
    }

    handlePost = (e) => {
        const titre = e.target[0].value;
        const text = e.target[1].value;
        const autor = this.state.email;
        this.sendPost(titre, text, autor);
    }

    render() {
        const {
            isLoading,
        } = this.state;
        return (
            <Container>
                <br />
                <Header as="h1">Écrire un post</Header>
                <Form onSubmit={this.handlePost}>
                    <Form.Field>
                        <input placeholder="Titre du post" />
                    </Form.Field>
                    <Form.Field>
                        <textarea placeholder="Contenu du post" />
                    </Form.Field>
                    <Button loading={isLoading} type="submit" icon="paper plane" content="Poster" />
                </Form>
            </Container>
        );
    }
}

export default WritePost;
