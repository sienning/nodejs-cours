import React, { Component } from 'react';
import { Container, Button, Header, List, Form, Segment } from 'semantic-ui-react';
import axios from 'axios';

class Profile extends Component {
    state = {
        isLoadingData: true,
        isLoading: false,
        modeModify: false,
        id: "",
        email: "",
        nom: "",
        prenom: "",
        age: 0,
        description: "",
        nbChar: 0,
    }
    componentDidMount() {
        const email = window.localStorage.getItem('email');
        const id = window.localStorage.getItem('userId');
        this.setState({ email: email, id: id });
        this.getUserInfo(email);
    }

    getUserInfo = async (email) => {
        this.setState({ isLoadingData: true });
        await axios.post("http://localhost:3000/user/see-user/", {
            email: email
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                const nom = res.lastname;
                const prenom = res.firstname;
                const age = res.age;
                const description = res.description;
                this.setState({
                    nom: nom,
                    prenom: prenom,
                    age: age,
                    description: description,
                    nbChar: description.length,
                    isLoadingData: false
                });
            })
            .catch(err => console.log(err))
    }

    updateUserInfo = async (email, nom, prenom, age, description) => {
        this.setState({ isLoading: true });
        console.log(this.state.id);
        await axios.post("http://localhost:3000/user/update", {
            id: this.state.id,
            email: email,
            lastname: nom,
            firstname: prenom,
            age: age,
            description: description
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response.data);
                this.setState({ modeModify: false, isLoading: false });
            })
            .catch(err => console.log(err))
    }

    handleDescription = (e) => this.setState({ nbChar: e.target.value.length });

    handleSubmit = (e) => {
        const lastname = e.target[0].value,
            firstname = e.target[1].value,
            email = e.target[2].value,
            age = e.target[3].value,
            description = e.target[4].value;

        console.log(firstname);
        this.setState({
            email: email,
            nom: lastname,
            prenom: firstname,
            age: age,
            description: description
        });
        this.updateUserInfo(email, lastname, firstname, age, description);
    }

    render() {
        const {
            isLoadingData,
            isLoading,
            modeModify,
            email,
            nom,
            prenom,
            age,
            description,
            nbChar,
        } = this.state
        return (
            <Container>
                <br />
                <Header as="h1">Mon profil</Header>
                {
                    modeModify ? null :
                        <Button onClick={() => this.setState({ modeModify: true })} icon="pencil alternate" basic content="Modifier mon profil" />
                }
                {
                    modeModify ?
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label>Nom</label>
                                <input
                                    name="lastname"
                                    defaultValue={nom}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Prénom</label>
                                <input
                                    name="firstname"
                                    defaultValue={prenom}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Email</label>
                                <input
                                    name="email"
                                    type="mail"
                                    defaultValue={email}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Âge</label>
                                <input
                                    name="age"
                                    type="number"
                                    defaultValue={age}
                                    min="0"
                                />

                            </Form.Field>
                            <Form.Field>
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    onChange={this.handleDescription}
                                    defaultValue={description}
                                    maxLength="500"
                                    style={{ minHeight: 150 }}
                                />
                            </Form.Field>
                            <p>{nbChar}/500</p>
                            <Button loading={isLoading} type="submit" content="Valider" primary />
                            <Button onClick={() => this.setState({ modeModify: false })} content="Annuler" basic />
                        </Form>
                        :
                        <Segment loading={isLoadingData}>
                            <List size="large" divided verticalAlign='middle'>
                                <List.Item>
                                    <List.Content><Header>{prenom} {nom}</Header></List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>Email :</b> {email}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content><b>Âge :</b> {age}</List.Content>
                                </List.Item>
                                <List.Item>
                                    <List.Content>{description}</List.Content>
                                </List.Item>
                            </List>
                        </Segment>

                }
            </Container >
        );
    }
}

export default Profile;
