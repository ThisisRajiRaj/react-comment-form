import './App.css';
import { Container } from "react-bootstrap";
import CommentForm from "./components/CommentForm"
function App() {
  return (
    <Container>
      <CommentForm parentId="motivation"/>
      </Container>
 
  );
}

export default App;
