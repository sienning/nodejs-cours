import React, { useEffect, useState } from 'react';
import { Container, Header, List, Segment } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from "react-router-dom";

const SeeProfile = () => {
    const [isNonExistant, setisNonExistant] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [age, setAge] = useState(0);
    const [description, setDescription] = useState(0);

    useEffect(() => {
        let mail = window.location.href.substr(34);
        setEmail(mail)
        console.log("Hello");
        getUserInfo(mail);
    }, []);

    const getUserInfo = async (email) => {
        setIsLoading(true);
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
                console.log(res);
                setFirstname(prenom);
                setLastname(nom);
                setAge(age);
                setDescription(description);
                setIsLoading(false);

            })
            .catch(err => {
                setIsLoading(false);
                setisNonExistant(true);
            })
    }

    return (
        <Container>
            <br /> {
                isNonExistant ?
                    <Segment>
                        <Header>Cet utilisateur n'existe pas</Header>
                        <p>Retourner à <Link to="/">l'accueil</Link></p>
                    </Segment> :
                    <div>
                        <Header as="h1">{firstname} {lastname}</Header>
                        <Segment loading={isLoading}>
                            <List size="large" divided verticalAlign='middle'>
                                <List.Item>
                                    <List.Content><Header>{firstname} {lastname}</Header></List.Content>
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
                    </div>
            }
            <br />
        </Container >
    );
}

export default SeeProfile;
