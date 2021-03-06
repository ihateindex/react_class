import './App.css';
import { createContext, useEffect, useState, lazy, Suspence } from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import data from './data';
import Card from './components/Card.js';
import { useQuery } from 'react-query';
import Detail from './pages/Detail.js';
import Cart from './pages/Cart.js';

// * Detail, Cart 컴포넌트는 App.js가 로드 될때 당장 필요치 않은 컴포넌트
// * 같이 로드하면 로드 속도에 영향을 미칩니다.
// * lazy()를 이용해서 필요할때 import하도록 합니다.
// * 아래는 리액트 18이상의 방식입니다.
// const Detail = lazy(() => import('./pages/Detail.js'))
// const Cart = lazy(() => import('./pages/Cart.js'))

export let Context1 = createContext()

function App() {
    let [shoes, setShoes] = useState(data);
    let [재고, 재고변경] = useState([10, 11, 12]);
    let [btnCount, setBtnCount] = useState(0);
    let [loadingTxt,setLoadingTxt] = useState(false);
    // console.log(btnCount);

    useEffect(() => {
        if(!localStorage.getItem('watched')) {
            localStorage.setItem('watched', JSON.stringify( [] ))
        }
        let watchedData = localStorage.getItem('watched');
        console.log(watchedData);
    }, [])

    let result = useQuery('작명', ( )=> {
        return axios.get('https://codingapple1.github.io/userdata.json').then((a)=>{
            return a.data
        })
        // * stableTime = 리액트 쿼리는 axios 요청을 틈만 나면 자동으로 refetch 해줌
        // * refetch하는 시간을 설정하고 싶다면 아래 처럼 stableTime을 이용
        // { staleTime : 2000}
    })

    // * 리액트 쿼리 데이터 -> result.data
    // * 리액트 쿼리 로딩중일때 -> result.isLoading
    // * 리액트 쿼리 에러일때 -> result.error

    return (
        <div className="App">
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand>
                        <Link to="/">ShoeShop</Link>
                    </Navbar.Brand>
                    <Nav className='ms-auto'>
                        {/* // * 삼항 연산자의 경우 */}
                        {/* { result.isLoading ? '로딩중' : result.data.name } */}
                        {/* // * && 연산자의 경우 */}
                        {result.isLoading && '로딩중'}
                        {result.error && '에러남'}
                        {result.data && result.data.name}
                    </Nav>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav>
                                <Link to="/">Home</Link>
                            </Nav>
                            <Nav>
                                <Link to="/detail">Detail</Link>
                            </Nav>
                            <Nav>
                                <Link to="/cart">Cart</Link>
                            </Nav>
                            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Switch>
                <Route exact path="/">
                    <div className="banner-main">
                        <h1>20% Season Off</h1>
                        <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                        <p>
                            <Button bsStyle="primary">Learn more</Button>
                        </p>
                    </div>
                    <div className="container">
                        <div className="row">
                            {shoes.map(function (shoe, idx) {
                                return (
                                    // * 기본
                                    // <Card key={idx} id={shoes.id} title={shoes.title} content={shoes.content} price={shoes.price}></Card>
                                    // * 축약형
                                    <Card key={idx} idx={idx} shoes={shoes[idx]}></Card>
                                );
                            })}
                        </div>
                    </div>
                    {
                    btnCount == 3 
                    ? <div className="alert alert-warning">더 이상 제품이 없습니다.</div>
                    : <button onClick={() => {
                        setLoadingTxt(true);
                        setBtnCount(btnCount + 1);
                        axios.get('https://codingapple1.github.io/shop/data' + (btnCount+2) + '.json').then((result)=>{
                            console.log(result.data);
                            // * [...shoes] -> shoes의 깊은 복사, 전개 연산자를 이용
                            let shoes_copy = [...shoes, ...result.data];
                            console.log(shoes_copy);
                            // var newShoesArr = shoes_copy.concat(result.data);
                            // console.log(newShoesArr);
                            // setShoes(newShoesArr);
                            setShoes(shoes_copy);
                            setLoadingTxt(false);
                        })
                        .catch(() => {
                            console.log('실패');
                            setLoadingTxt(false);
                        })
                    }}>더보기, {btnCount}</button>
                    }
                    {
                        loadingTxt == true
                        ? <div className="alert alert-warning">로딩중입니다.</div>
                        : null
                    }
                </Route>
                <Route path="/detail/:id">
                    {/* <Suspence> */}
                    <Context1.Provider value={{재고}}>
                    <Detail shoes={shoes}></Detail>
                    </Context1.Provider>
                    {/* </Suspence> */}
                </Route>
                <Route path="/cart">
                    {/* <Suspence> */}
                    <Cart></Cart>
                    {/* </Suspence> */}
                </Route>
                <Route path="/:id">
                    <div>아무거나 적었을때 이거 보여주셈</div>
                </Route>
            </Switch>
        </div>
    );
}

export default App;
