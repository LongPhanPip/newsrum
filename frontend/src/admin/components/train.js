import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import RecCard from './rec_card';
import {get_recommenders, create_recommender} from '../services';

const AdminTrainRecommender = () => {
  const [recommenders, setRecommenders] = useState([]);
  const [embLen, setEmdlen] = useState('8');
  const [topLayers, setTopLayers] = useState('[128, 64, 32]');
  const [negRatio, setNegRatio] = useState('5');
  const [valRatio, setValRatio] = useState('0.2');
  const [batchSize, setBatchSize] = useState('32');
  const [epoch, setEpoch] = useState('30');
  const [lr, setLr] = useState('0.0002');
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    get_recommenders().then(res => setRecommenders(res.data.results))
  },[])

  const onChangeEmbLen = (e) => {
    setEmdlen(e.target.value)
  }

  const onChangeTopLayers = (e) => {
    setTopLayers(e.target.value)
  }

  const onChangeNegRatio = (e) => {
    setNegRatio(e.target.value)
  }

  const onChangeValRatio = (e) => {
    setValRatio(e.target.value)
  }

  const onChangeBatchSize = (e) => {
    setBatchSize(e.target.value)
  }

  const onChangeEpoch = (e) => {
    setEpoch(e.target.value)
  }

  const onChangeLr = (e) => {
    setLr(e.target.value)
  }


  const onDeleteRec = (id) => {
    setRecommenders(recommenders.filter(rec => {return rec.id !== id;}))
  }

  const onChangeUse = (id) => {
    get_recommenders().then(res => setRecommenders(res.data.results))
  }


  const onSubmitTrain = (e) => {
    e.preventDefault()
    const params = `{"emb_len": ${embLen}, "top_layers": ${topLayers}, "neg_ratio": ${negRatio}, "val_ratio": ${valRatio}, "batch_size": ${batchSize}, "epoch": ${epoch}, "lr": ${lr}}`
    setIsTraining(true)
    create_recommender(params).then(res => {
      setRecommenders(old => [...old, res.data])
      setIsTraining(false)
    })

  }

  const list_rec = recommenders.map(rec => <RecCard key={rec.id} rec={rec} onDelete={onDeleteRec} onChange={onChangeUse} in_used={rec.in_used}/>)

  return(
    <Container>
      <Form className="m-4" onSubmit={onSubmitTrain}>
        <span className="fs-4 text-secondary">Hiệu chỉnh tham số</span>
        <Row>
          <Col md={4}>
            <Form.Group className="m-2">
              <Form.Label>Số chiều embedding</Form.Label>
              <Form.Control value={embLen} onChange={onChangeEmbLen}/>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="m-2">
              <Form.Label>Lớp neural net</Form.Label>
              <Form.Control value={topLayers} onChange={onChangeTopLayers}/>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="m-2">
              <Form.Label>Tỉ lệ dữ liệu không tương tác</Form.Label>
              <Form.Control value={negRatio} onChange={onChangeNegRatio}/>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <Form.Group className="m-2">
              <Form.Label>Tỉ lệ kiểm thử</Form.Label>
              <Form.Control value={valRatio} onChange={onChangeValRatio}/>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="m-2">
              <Form.Label>Batch</Form.Label>
              <Form.Control value={batchSize} onChange={onChangeBatchSize}/>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="m-2">
              <Form.Label>Epoch</Form.Label>
              <Form.Control value={epoch} onChange={onChangeEpoch}/>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="m-2">
              <Form.Label>Learning rate</Form.Label>
              <Form.Control value={lr} onChange={onChangeLr}/>
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={3} className="text-center">
            {isTraining ?
              <Button type="submit" variant="outline-primary" disabled>Đang huấn luyện</Button>
              :<Button type="submit" variant="outline-primary">Huấn luyện</Button>
            }
          </Col>
        </Row>
      </Form>
      <Row className="justify-content-center">
        {list_rec}
      </Row>
    </Container>
  )
}

export default AdminTrainRecommender
