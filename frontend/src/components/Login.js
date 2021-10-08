import React, { Component } from 'react';
import { Header, Container, Form, Button, Input } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from "react-router-dom";

class App extends Component {
    state = {
        isError : false,
        email: "",
        isLoading: false,
    }

    login = async (email, password) => {
        this.setState({ isError: false })
        await axios.post("http://localhost:3000/user/login", {
            email: email,
            password: password,
        })
            .then((response) => {
                this.setState({ email: email, isLoading: false });
                this.props.getEmail(email, response.data);
                window.location.replace("/");
            })
            .catch((err) => {
                console.log(err)
                this.setState({ isError: true, isLoading: false });
            });
    }

    handleLogin = (e) => {
        let email = e.target[0].value;
        let password = e.target[1].value;
        this.setState({ isLoading: true });
        this.login(email, password);
    }

    render() {
        const {
            isError,
            isLoading,
        } = this.state;
        return (
            <Container>
                <br />
                <Header as="h1">Se connecter</Header>
                <Form onSubmit={this.handleLogin}>
                    <Form.Field>
                        <label>Email</label>
                        <Input error={isError} name="email" placeholder='Votre email' />
                    </Form.Field>
                    <Form.Field>
                        <label>Mot de passe</label>
                        <Input error={isError} name="password" type="password" placeholder='Votre mot de passe' />
                    </Form.Field>
                    <Button loading={isLoading} type='submit'>Valider</Button>
                </Form>
                <p>Pas encore inscrit ? <Link to="/signup" >Rejoingez-nous</Link></p>
            </Container >
        );
    }
}

export default App;
