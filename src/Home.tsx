import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import TablePosts from './table'
// import React from "react";

function Home () {

  let navigate = useNavigate();
  
  return (
  <Container>
    <div className="d-flex flex-row justify-content-between py-5">
      {/* <Button variant="outline-success" onClick={() => {navigate('/button')}}>Push the button</Button> */}
      <h3>New cool forum</h3>
      <Button onClick={() => {navigate('/create')}}>Create</Button>
    </div>         
  <TablePosts />          
  </Container>
  )
}

export default Home;
