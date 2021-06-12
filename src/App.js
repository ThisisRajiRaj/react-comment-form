import './App.css';
import { Container } from "react-bootstrap";
import CommentForm from "./components/CommentForm"
function App() {
  return (
    <Container>
      <CommentForm blogPostId="motivation"/>
      </Container>
 
  );
}

export default App;
