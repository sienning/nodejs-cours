import React, { Component } from 'react';
import { Form, Container, Button, Header, Message } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class SignUp extends Component {
    state = {
        isError: false,
        nbChar: 0,
    }
    signUp = async (email, password, lastname, firstname, age, description) => {
        this.setState({ isError: false })
        await axios.post("http://localhost:3000/user/signup", {
            email: email,
            password: password,
            lastname: lastname,
            firstname: firstname,
            age: age,
            description: description
        })
            .then((response) => {
                if (response.status === 201) {
                    this.login(email, password);
                }
            })
            .catch((err) => {
                this.setState({ isError: true })
                console.log(err)
            });
    }

    login = async (email, password) => {
        await axios.post("http://localhost:3000/user/login", {
            email: email,
            password: password,
        })
            .then((response) => {
                this.setState({ email: email, isLoading: false });
                this.props.getEmail(email, response.data);
                window.location.replace("/");
            })
            .catch((err) => console.log(err));
    }

    handleDescription = (e) => this.setState({ nbChar: e.target.value.length });

    handleSubmit = (e) => {
        const email = e.target[0].value,
            password = e.target[1].value,
            lastname = e.target[2].value,
            firstname = e.target[3].value,
            age = e.target[4].value,
            description = e.target[5].value;
        this.signUp(email, password, lastname, firstname, age, description);
    }

    render() {
        const {
            isError,
            nbChar,
        } = this.state;
        return (
            <Container>
                <br />
                <Header as="h1">S'inscrire</Header>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Email *</label>
                        <input required placeholder='Votre email' />
                    </Form.Field>
                    <Form.Field>
                        <label>Mot de passe *</label>
                        <input required type="password" placeholder='Votre mot de passe' />
                    </Form.Field>
                    <Form.Field>
                        <label>Nom</label>
                        <input placeholder='Nom' />
                    </Form.Field>
                    <Form.Field>
                        <label>Prénom</label>
                        <input placeholder='Prénom' />
                    </Form.Field>
                    <Form.Field>
                        <label>Âge</label>
                        <input placeholder='Âge' type="number" min="0" />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <textarea onChange={this.handleDescription} placeholder='Une description ...' maxLength="500" />
                        <p>{nbChar}/500</p>
                    </Form.Field>
                    {isError ? <Message negative content="Le mail ou le mot de passe est déjà existant." /> : null}
                    <Button type='submit'>Valider</Button>
                </Form>
                <p>Déjà inscrit ? <Link to="/login" >Connectez-vous</Link></p>
                <br />
            </Container >
        );
    }
}

export default SignUp;
