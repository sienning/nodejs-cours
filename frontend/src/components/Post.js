import React, { Component } from 'react';
import { Container, Button, Header, Loader, Segment, Input, TextArea, Comment, Form } from 'semantic-ui-react';
import axios from 'axios';
import { Link } from "react-router-dom";
class Post extends Component {
    state = {
        isLoading: true,
        isLoadingForComments: true,
        isLoadingForPostingComment: false,
        isLoadingForLike: false,
        isLoadingForDislike: false,
        modifyMode: false,
        userId: "",
        likedPosts: [],
        dislikedPosts: [],
        idPost: "",
        token: "",
        email: "",
        titre: "",
        text: "",
        autor: "",
        likes: 0,
        dislikes: 0,
        likedIt: false,
        dislikedIt: false,
        modif: {
            titre: "",
            text: ""
        },
        comments: [],
    }
    componentDidMount() {
        let id = window.location.href.substr(27)
        this.setState({
            idPost: id,
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token')
        });
        this.getPost(id);
        this.getComments(id)
    }

    getPost = async (id) => {
        this.setState({ isLoading: true });
        await axios.get(`http://localhost:3000/test/${id}`, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                this.setState({
                    titre: res.titre,
                    text: res.text,
                    autor: res.autor,
                    likes: res.likes,
                    dislikes: res.dislikes,
                });
                this.getUserInfo(window.localStorage.getItem('email'));
            })
            .catch(err => console.log(err))
    }
    getUserInfo = async (email) => {
        await axios.post(`http://localhost:3000/user/see-user`, {
            email: email
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                this.setState({ userId: res._id, likedPosts: res.likedPosts, dislikedPosts: res.dislikedPosts });
                res.likedPosts.forEach(idPost => {
                    if (idPost === this.state.idPost)
                        this.setState({ likedIt: true });
                });
                res.dislikedPosts.forEach(idPost => {
                    if (idPost === this.state.idPost)
                        this.setState({ dislikedIt: true });
                });
                this.setState({ isLoading: false });
            })
            .catch(err => console.log(err))
    }
    userLikedDislikedIt = async (idUser, isLike, likedPosts, dislikedPosts) => {
        if (isLike) this.setState({ isLoadingForLike: true });
        else this.setState({ isLoadingForDislike: true });

        await axios.post(`http://localhost:3000/user/like-dislike`, {
            id: idUser,
            likes: likedPosts,
            dislikes: dislikedPosts,
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                if (isLike) this.setState({ isLoadingForLike: false });
                else this.setState({ isLoadingForDislike: false });
            })
            .catch(err => console.log(err))
    }
    postLikedDisliked = async (idPost, likes, dislikes) => {
        await axios.post(`http://localhost:3000/test/like-dislike/${idPost}`, {
            likes: likes,
            dislikes: dislikes,
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                console.log(res);
            })
            .catch(err => console.log(err))
    }
    modifyPost = async (id, titre, text) => {
        console.log("modifyPost");
        console.log(id);
        console.log(titre);
        console.log(text);
        this.setState({ isLoading: true });
        await axios.put(`http://localhost:3000/test/${id}`, {
            titre: titre,
            text: text,
            autor: this.state.autor
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                const res = response.data;
                console.log(res);
                this.setState({ modifyMode: false, isLoading: false });
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
                this.setState({ isLoading: false });
                window.location.replace("/");
            })
            .catch(err => console.log(err))
    }
    getComments = async (id) => {
        this.setState({ isLoadingForComments: true });
        await axios.get(`http://localhost:3000/comments/${id}`, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                this.setState({ comments: response.data, isLoadingForComments: false });
            })
            .catch(err => console.log(err))
    }
    addComment = async (titre, text, idPost, email) => {
        this.setState({ isLoadingForPostingComment: true });
        await axios.post(`http://localhost:3000/comments/`, {
            titre: titre,
            text: text,
            idPost: idPost,
            email: email
        }, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                this.setState({ comments: response.data, isLoadingForPostingComment: false });
                this.getComments(idPost)
            })
            .catch(err => console.log(err))
    }
    deleteComment = async (id) => {
        await axios.delete(`http://localhost:3000/comments/delete/${id}`, {
            headers: {
                Authorization: window.localStorage.getItem('token')
            }
        })
            .then(response => {
                this.getComments(this.state.idPost);
            })
            .catch(err => console.log(err))
    }
    handleTitre = (e, { value }) => {
        let modif = this.state.modif;
        modif.titre = value;
        this.setState({
            modif: modif
        })
    }
    handleText = (e, { value }) => {
        let modif = this.state.modif;
        modif.text = value;
        this.setState({
            modif: modif
        })
    }
    handleModifier = () => {
        let modif = this.state.modif;
        if (modif.titre === "") {
            modif.titre = this.state.titre
        }
        if (modif.text === "") {
            modif.text = this.state.text
        }
        this.setState({ titre: modif.titre, text: modif.text });
        this.modifyPost(this.state.idPost, modif.titre, modif.text);
    }
    handleAnnuler = () => { this.setState({ modifyMode: false }) }
    handleSupprimer = () => {
        this.deletePost(this.state.idPost);
    }
    handleComment = (e) => {
        const titre = e.target[0].value,
            texte = e.target[1].value,
            idPost = this.state.idPost,
            email = this.state.email;
        this.addComment(titre, texte, idPost, email);
        e.target.reset();
    }
    handleDeleteComment = (idComm) => {
        this.deleteComment(idComm);
    }
    handleLike = () => {
        let likes = this.state.likes;
        let dislikes = this.state.dislikes;
        let likedIt = this.state.likedIt;
        let dislikedIt = this.state.dislikedIt;
        let likedPosts = this.state.likedPosts;
        let dislikedPosts = this.state.dislikedPosts;
        const idPost = this.state.idPost;
        if (likedPosts.includes(idPost)) {
            this.makeRemoveLikeDislikeArray(likedPosts, idPost);
        } else if (dislikedPosts.includes(idPost)) {
            this.makeRemoveLikeDislikeArray(dislikedPosts, idPost);
        }

        if (likedIt) {
            likes--;
            this.setState({ likes: likes, likedIt: !likedIt });
        } else {
            likedPosts.push(idPost)
            likes++;
            this.setState({ likes: likes, likedIt: !likedIt });
            if (dislikedIt) {
                dislikes--;
                this.setState({ dislikedIt: false, dislikes: dislikes });
            }
        }
        this.setState({
            likedPosts: likedPosts,
            dislikedPosts: dislikedPosts,
        })
        this.userLikedDislikedIt(this.state.userId, true, likedPosts, dislikedPosts);
        this.postLikedDisliked(this.state.idPost, likes, dislikes);

    }
    handleDislike = () => {
        let likes = this.state.likes;
        let dislikes = this.state.dislikes;
        let likedIt = this.state.likedIt;
        let dislikedIt = this.state.dislikedIt;
        let likedPosts = this.state.likedPosts;
        let dislikedPosts = this.state.dislikedPosts;
        const idPost = this.state.idPost;

        if (likedPosts.includes(idPost)) {
            this.makeRemoveLikeDislikeArray(likedPosts, idPost);
        } else if (dislikedPosts.includes(idPost)) {
            this.makeRemoveLikeDislikeArray(dislikedPosts, idPost);
        }

        if (dislikedIt) {
            dislikes--;
            this.setState({ dislikes: dislikes, dislikedIt: !dislikedIt });
        } else {
            dislikedPosts.push(idPost);
            dislikes++;
            this.setState({ dislikes: dislikes, dislikedIt: !dislikedIt });
            if (likedIt) {
                likes--;
                this.setState({ likedIt: false, likes: likes });
            }
        }
        this.setState({
            likedPosts: likedPosts,
            dislikedPosts: dislikedPosts,
        })
        this.userLikedDislikedIt(this.state.userId, false, likedPosts, dislikedPosts);
        this.postLikedDisliked(this.state.idPost, likes, dislikes);
    }
    makeRemoveLikeDislikeArray = (list, idPost) => {
        let index;
        let res = [];
        index = list.indexOf(idPost);
        res = list.splice(index, 1)
        return res;
    }

    render() {
        const {
            modifyMode,
            email,
            isLoading,
            titre,
            text,
            autor,
            likes,
            dislikes,
            comments,
            isLoadingForComments,
            isLoadingForPostingComment,
            isLoadingForLike,
            isLoadingForDislike,
            likedIt,
            dislikedIt,
        } = this.state;
        return (
            <Container>
                <br />
                {
                    modifyMode ? null : <Link to='/posts'>Retour</Link>
                }
                {
                    isLoading ? <Loader /> :
                        modifyMode ?
                            <Input
                                onChange={this.handleTitre}
                                defaultValue={titre}
                            />
                            : <Header as="h1">{titre}</Header>
                }
                {
                    modifyMode ? null :
                        <div style={{ marginBottom: 10 }}>
                            <Button
                                loading={isLoadingForLike}
                                onClick={this.handleLike}
                                content={likes}
                                basic={!likedIt}
                                circular
                                primary
                                icon="thumbs up outline"
                            />
                            <Button
                                loading={isLoadingForDislike}
                                onClick={this.handleDislike}
                                content={dislikes}
                                basic={!dislikedIt}
                                circular
                                color="red"
                                icon="thumbs down outline"
                            />
                        </div>
                }
                <Header.Subheader>{isLoading ? <Loader /> : modifyMode ? null : <span>par <Link to={`/see-profile/${autor}`}>{autor}</Link></span>}
                    {
                        isLoading ? <Loader /> :
                            modifyMode ? null :
                                email === autor ?
                                    <span style={{ marginLeft: 10 }}>
                                        <Button onClick={() => this.setState({ modifyMode: true })} basic icon="pencil alternate" />
                                        <Button onClick={this.handleSupprimer} basic color="red" icon="trash" />
                                    </span> : null
                    } </Header.Subheader>
                {
                    isLoading ? <Loader /> :
                        modifyMode ?
                            <TextArea
                                onChange={this.handleText}
                                style={{ marginTop: 30, minHeight: 100, minWidth: 800 }}
                                defaultValue={text}
                            /> :
                            <Segment>
                                {text}
                            </Segment>
                }
                {
                    modifyMode ?
                        <div>
                            <Button primary onClick={this.handleModifier} content="Modifier" />
                            <Button basic onClick={this.handleAnnuler} content="Annuler" />
                        </div>
                        : null
                }
                {
                    modifyMode ? null :
                        <Segment>
                            <Comment.Group>
                                <Header as='h3' dividing>
                                    Commentaires
                                </Header>

                                {
                                    isLoadingForComments ?
                                        <Loader /> :
                                        comments.length > 0 ?
                                            comments.map((comment, i) => (
                                                <Comment key={i}>
                                                    <Comment.Content>
                                                        {
                                                            comment.author === email ?
                                                                <Button color='red' basic onClick={() => this.handleDeleteComment(comment._id)} size="mini" icon="trash" /> : null
                                                        }
                                                        De <Comment.Author href={`/see-profile/${comment.author}`} as='a'>{comment.author}</Comment.Author>
                                                        <Comment.Metadata> <div>{comment.date}</div> </Comment.Metadata>
                                                        <Comment.Text>
                                                            <Header as='h4'>{comment.titre}</Header>
                                                            {comment.text}
                                                        </Comment.Text>
                                                    </Comment.Content>
                                                </Comment>
                                            )) :
                                            <p>Sans commentaire ...</p>
                                }



                                <Form onSubmit={this.handleComment} reply>
                                    <Header>Ajouter un commentaire</Header>
                                    <Form.Input required placeholder="Titre" />
                                    <Form.TextArea required placeholder="Commentaire ..." />
                                    <Button
                                        loading={isLoadingForPostingComment}
                                        content='Poster le commentaire'
                                        labelPosition='left'
                                        icon='edit'
                                        primary
                                        type="submit"
                                    />
                                </Form>
                            </Comment.Group>
                        </Segment>
                }
            </Container>
        );
    }
}

export default Post;
