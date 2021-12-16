import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  Container,
  Form,
  Button
 } from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
const API_URL = 'http://192.168.114.130:8000';
const MAX_INPUT_LENGTH: number = 500;
const MIN_INPUT_LENGTH: number = 1;
const HISTORY_BACK: number = -1;

interface FormData {
    author: string;
    title: string;
  };

function Post() {
  const navigate = useNavigate();
  const { register, getValues, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const onSubmit = handleSubmit(data => console.log(data));
  console.log(errors);

  const { id } = useParams();
  const currentUrl: string = `${API_URL}/posts/${id}`;
  
  const [ valueState, setValueState ] = useState({
    author: "",
    title: "",
  });

  async function getCurrentPost () {
    const post = await axios.get(currentUrl);
    const res: FormData = post.data;
    setValueState({
      author: res.author,
      title: res.title,
    });
  }
  
  useEffect(() => {
    if(id) {
      getCurrentPost()}
    }, []);

  // console.log("value", valueState);
setValue('author', valueState.author);
setValue('title', valueState.title);

async function rerenderNewState() {
  const newState = await axios.get(currentUrl);

  Swal.fire({
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500
  })
  
  setValue('author', newState.data.author);
  setValue('title', newState.data.title);
}

async function savePost () {
  const values: FormData = getValues();
  
  try {
    if (id) {
      await axios.put(currentUrl, values)
      await rerenderNewState();
      return;
    }

    await axios.post(`${API_URL}/posts`, values);
    navigate('/');

  } catch(err) {
    console.log(err);
  }
}

  return (
    <Container className="m-5">
      <Form onSubmit={onSubmit}>
        <Form.Group className="d-flex flex-column justify-content-center">
          <Form.Label>Author</Form.Label>
          <Form.Control className="mb-3" type="text" placeholder="Enter your name" {...register("author", {required: true, max: 150, min: MIN_INPUT_LENGTH, maxLength: 80})} />
          <Form.Label>Comment</Form.Label>
          <Form.Control className="mb-3" as="textarea" placeholder="Leave a comment here" {...register("title", { max: MAX_INPUT_LENGTH, min: MIN_INPUT_LENGTH, maxLength: MAX_INPUT_LENGTH })} />
        </Form.Group>
          <Button className="me-3" onClick={savePost} variant="primary" type="submit">Submit</Button>
          <Button className="me-3" onClick={() => {navigate(HISTORY_BACK)}} variant="outline-dark">Cancel</Button>
      </Form>
    </Container>
  );

}
export default Post;