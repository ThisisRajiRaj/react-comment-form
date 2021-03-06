import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import ReCAPTCHA from "react-google-recaptcha";
import DOMPurify from 'dompurify'
import './Comment.css'
import Like from './Like'

class CommentFormImpl extends React.Component {
    constructor(props) {
        super(props);
        
        this.previewInput = React.createRef(); 
        this.state = { 
            email: '', 
            message: '', 
            name: '', 
            result: '', 
            verified: false, 
            like: false, 
            comments: "", 
            likes: 0,
            messageHeight: 3 };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLikeChange = this.handleLikeChange.bind(this);
    }

    onVerify = recaptchaResponse => {
        this.setState({
            verified: false
        });
        if (recaptchaResponse !== null) {
            this.setState({
                verified: true
            });
        }
    };

    componentDidMount() {
        this.getBlogInfo(this.props.parentId)
    }

    getBlogInfo(blogname) {
        var headers = new Headers();
        headers.append("Content-Type", "text/json");

        var postStatsAPIUrl = `${process.env.REACT_APP_BLOGMETADATA_URL}?code=${process.env.REACT_APP_API_KEY}`;
        let request = JSON.stringify(
            {
                "name": blogname
            });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: request,
            redirect: 'follow'
        };
        fetch(
            postStatsAPIUrl,
            requestOptions)
            .then(response => { return response.json(); })
            .then(res => { this.setState({ likes: res.likes === undefined ? 0 : res.likes, comments: res.comments }); })
            .catch(error => { this.setState({ result: "An error occurred. Please try again later." }); });
    }

    addLike(value, blogname) {
        let i = 1;
        if (value === false) {
            i = -1
        }

        var headers = new Headers();
        headers.append("Content-Type", "text/json");

        var postStatsAPIUrl = `${process.env.REACT_APP_UPDATELIKES_URL}?code=${process.env.REACT_APP_API_KEY}`;
        let request = JSON.stringify(
            {
                "name": blogname,
                "likes": i
            });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: request,
            redirect: 'follow'
        };
        fetch(
            postStatsAPIUrl,
            requestOptions)
            .then(response => { return response.json(); })
            .then(res => { this.setState({ likes: res }); })
            .catch(error => { this.setState({ result: "An error occurred. Please try again later." }); });
        if(value === true) {
            this.sendEmail("Someone liked this post!")
        }
    }

    createNewComment(blogname) {
        var headers = new Headers();
        headers.append("Content-Type", "text/json");

        let now = new Date()
        let datetime = now.toLocaleDateString("en-US") + " at " + now.toLocaleTimeString("en-US");
        let message = this.state.message.substring(0, 500)
        let comment = `<small>${this.state.name} said...</small><br/><br/>${message}<br/><small>${datetime}</small><br/><hr/>`;
        var postStatsAPIUrl = `${process.env.REACT_APP_COMMENTS_URL}?code=${process.env.REACT_APP_API_KEY}`;
        let request = JSON.stringify(
            {
                "name": blogname,
                "comments": comment
            });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: request,
            redirect: 'follow'
        };

        fetch(
            postStatsAPIUrl,
            requestOptions)
            .then(response => { return response.text() })
            .then(res => { this.setState({ comments: res }); })
            .catch(error => { this.setState({ result: "An error occurred. Please try again later." }); });
    }

    sendEmail(message) {
        if (process.env.REACT_APP_SENDMAIL === "false") {
            return;
        }
        var headers = new Headers();
        headers.append("Content-Type", "text/json");

        let request = JSON.stringify(
            {
                "fromemail": this.state.email,
                "from": this.state.name,
                "message": `Parent Id:${this.props.parentId}. Message:${message}`,
                "devflag": "false"
            });

        var requestOptions = {
            method: 'POST',
            headers: headers,
            body: request,
            redirect: 'follow'
        };

        const url = process.env.REACT_APP_SENDMAIL_URL;

        fetch(
            url + "?code=" + process.env.REACT_APP_SENDMAIL_API_KEY,
            requestOptions)
            .then(response => response.text())
            .catch(error => { this.setState({ result: "An error occurred. Please try again later." }); });

    }

    handleLikeChange(value) {
        this.setState({ like: value });
        this.addLike(value, this.props.parentId)
    }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }

    handleEmailChange(event) {
        this.setState({ email: event.target.value });
    }

    handleMessageChange(event) {
        this.setState({ message: event.target.value });       
        this.setState({messageHeight: document.getElementById('formMessage').scrollHeight});
    }

    handleSubmit(event) {
        if (this.state.message === "" ||
            this.state.name === "") {
            this.setState({ result: 'Please fill in all fields before submitting.' })
            return;
        }
        this.setState({ result: '' })
        this.createNewComment(this.props.parentId)
        this.sendEmail(this.state.message);

        if (this.state.result === '') {
            this.setState({
                message: '',
                email: '',
                name: '',                
                messageHeight: 3

            })
            this.messageForm.reset();
        }
        event.preventDefault();
    }


    render() {
        return (
            <div>
                <br />
                <Like currentLikes={this.state.likes} onLikeChange={this.handleLikeChange}></Like>
                <br />
                <Form id='myForm' ref={form => this.messageForm = form}>

                    <Form.Group controlId="formName" onChange={this.handleNameChange}>
                        <Form.Label>Name<span className="required">*</span></Form.Label>
                        <Form.Control type="text" required={true} placeholder="Enter name" />
                    </Form.Group>


                    <Form.Group controlId="formEmail" onChange={this.handleEmailChange}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control required={false} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email address with anyone else and it will not be displayed on the site.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="formMessage" onChange={this.handleMessageChange}>
                        <Form.Label>Message<span className="required">*</span></Form.Label>
                        <Form.Control required={true} as="textarea" placeholder="Message" 
                         rows={Math.round(this.state.messageHeight / 25)}/>
                    </Form.Group>
                    <ReCAPTCHA
                        sitekey={process.env.REACT_APP_GOOGLE_CAPTCHA_SITE_KEY}
                        onChange={this.onVerify}
                    />
                    <br />
                    <Button variant="primary" type="submit" onClick={this.handleSubmit} disabled={!this.state.verified}>
                        Submit
                    </Button>
                    <br />
                    {this.state.result}
                    <br />
                    <div className="comment" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(this.state.comments) }}></div>
                </Form>
            </div>
        );
    }
}

export default CommentFormImpl;