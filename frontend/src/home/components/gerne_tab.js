import {useState, useEffect} from 'react';
import {Container, Row, Col, Dropdown, ButtonGroup} from 'react-bootstrap';
import { useNavigate, Link} from 'react-router-dom';

import {get_gernes} from '../../gerne';

const MAX_GERNE_IN_TAB = 8;

function GerneTab() {
  const [gernes, setGerne] = useState([]);
  const navigate = useNavigate();
  useEffect( () => {
    get_gernes().then(res => {
      setGerne(res.data)
    })
  }
  ,[]);

  const list_gerne = gernes.slice(0, MAX_GERNE_IN_TAB).map(gerne =>
    <Col key={gerne.id} xs={1}>
      <Link to={'/gernes/' + gerne.id} className="text-decoration-none text-secondary">
        {gerne.name}
      </Link>
    </Col>
  )

  const more_gerne = gernes.slice(MAX_GERNE_IN_TAB, gernes.length).map(gerne =>
    <Dropdown.Item key={gerne.id} className="text-secondary d-block">
      <Link to={'/gernes/' + gerne.id} className="text-decoration-none text-secondary">{gerne.name}</Link>
    </Dropdown.Item>
  )

  return (
    <Container fluid="md" className="border-bottom border-secondary p-2 text-secondary">
      {gernes ?
        <Row className="justify-content-center align-items-center">
          {list_gerne}
          <Col xs={1}>
          <Dropdown>
            <Dropdown.Toggle id="dropdown-gerne" className="bg-white text-secondary border-0">
              Thêm
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {more_gerne}
            </Dropdown.Menu>
          </Dropdown>
          </Col>
        </Row> : null}
    </Container>
  )

}

export default GerneTab;
