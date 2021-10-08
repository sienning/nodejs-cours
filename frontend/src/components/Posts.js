import React, { Component } from 'react';
import { List, Container, Button, Header, Loader } from 'semantic-ui-react';
import axios from 'axios';

class Posts extends Component {
    state = {
        token: "",
        email: "",
        isLoaded: false,
        isLoading: false,
        posts: [],
    }
    componentDidMount() {
        this.setState({
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token')
        });
        this.getPosts();
    }

    getPosts = async () => {
        this.setState({ isLoading: true });
        await axios.get("http://localhost:3000/test/", {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.length === 0) {
                    this.setState({ isLoaded: false });
                } else {
                    this.setState({ posts: response.data, isLoaded: true, isLoading: false });
                }
            })
            .catch(err => console.log(err))
    }

    deletePost = async (id) => {
        this.setState({ isLoading: true });
        await axios.delete(`http://localhost:3000/test/${id}`, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                this.getPosts();
            })
            .catch(err => console.log(err))
    }

    render() {
        const {
            email,
            isLoaded,
            isLoading,
            posts,
        } = this.state;
        return (
            <Container>
                <br />
                <Header as="h1">Les posts <Button
                    as="a"
                    floated="right"
                    href="/write-post"
                    primary
                    icon='plus'
                    content="Ajouter un post"
                /></Header>

                <List divided verticalAlign='middle'>
                    {
                        !isLoaded ?
                            <List.Item>
                                <List.Content>
                                    <List.Header>Pas de posts ...</List.Header>
                                </List.Content>
                            </List.Item> :
                            isLoading ?
                                <Loader /> :
                                posts.map((p, i) => (
                                    <List.Item key={i}>
                                        <List.Content floated='right'>
                                            {
                                                email === p.autor ?
                                                    <Button onClick={() => this.deletePost(p._id)} basic color="red" icon="trash" />
                                                    : null
                                            }
                                        </List.Content>

                                        <List.Content>
                                            <List.Header><a href={`/post/${p._id}`}>{p.titre.length > 20 ? p.titre.substring(0, 20) + " ..." : p.titre}</a> <Header as='h6'>par {p.autor}</Header></List.Header>
                                            {
                                                p.text.length > 100 ?
                                                    p.text.substring(0, 100) + " ..." : p.text
                                            }
                                        </List.Content>
                                    </List.Item>
                                ))
                    }
                </List>
                <br/>
            </Container>
        );
    }
}

export default Posts;
