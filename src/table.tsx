import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, 
  ButtonGroup, 
  Button
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';

var _ = require('lodash');
const API_URL = 'http://178.151.207.216:8000';

function TablePosts () {
  const [ currentState, setCurrentState]  = useState({
      list: [],
      perPage: 10,
      page: 0,
      pages: 0,
    }
  )
  
  const navigate = useNavigate();
  const { list, perPage, page: current_page, pages } = currentState;

  async function getData () {
    const { data: paginList, headers } = await axios.get(`${API_URL}/posts?_page=${current_page + 1}&_limit=${perPage}`);
    console.log('headers', headers['x-total-count'])
    const allPosts: number | string = headers['x-total-count'];
    
    if(!paginList && !allPosts) {
      console.log('no data');
      return;
    }

    const countPages: number = _.chain(allPosts)
                                .divide(perPage)
                                .ceil()
                                .value();

    // console.log('paginList', paginList);
    // console.log ('length:', countPages);

    setCurrentState({
      ...currentState,
      list: paginList,
      pages: countPages
    })

    if(paginList.length === 0 && pages > 1) {
      const prevPage = current_page - 1;
      setCurrentState({
        ...currentState,
        page: prevPage
      })
      console.log('you are here!', list.length, 'page:', currentState.page);
    }  
  }

  useEffect (() => {
    getData()
  }, [currentState.page]);

  let items = list;
  
  let rows = _.map(items, (item: {id: number; author: string; title: string}) => {
    const { id, author, title } = item;  
    return (
      <tr key={id}>
        <td>{id}</td>
        <td>{author}</td>
        <td>{title}</td>
        <td>
          <ButtonGroup>
            <Button onClick={() => {navigate (`/edit/${id}`)}} variant="outline-dark">Edit</Button>
            <Button onClick={() => {popUp(id)}} variant="dark">Delete</Button>
          </ButtonGroup>
        </td>
      </tr>
    );
    });

  function handlePageClick (event: any) {    
    let currentPage: number = event.selected;
    console.log("currentPage", currentPage);
   
    setCurrentState({
      ...currentState,
      page: currentPage
    })
  }


  async function deletePost (id: number) {

    const currentUrl = `${API_URL}/posts/${id}`;

    try {
      const response = await axios.delete(currentUrl);

      console.log(response);
      await getData();

    } catch (error) { 
      console.log(error);

    }
  }

  async function popUp (param: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })
    if (result.isConfirmed) {
      Swal.fire(
        'Deleted!',
        'Your post has been deleted.',
        'success'
      )
      deletePost(param);
    }
  }

  return (   
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Autor</th>
            <th>Title</th>
            <th>Edit/Delete</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
      <ReactPaginate
        pageRangeDisplayed={2}
        marginPagesDisplayed={3}
        pageCount={pages} 
        previousLabel={'< previous'}
        nextLabel={'next >'}
        
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
        forcePage={current_page}

        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
      />
    </>
  )
}

export default TablePosts;
