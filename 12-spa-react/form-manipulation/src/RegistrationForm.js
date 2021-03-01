import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
const provinceData = require('./provinces.json')

export default function RegistrationForm() {
  const { register, handleSubmit, control, watch, errors } = useForm();
  const [province, setProvince] = useState(provinceData[0])
  const [amphur, setAmphur] = useState(provinceData[0].amphur[0])
  const [amphurList, setAmphurList] = useState()

  const handleProvinceChange = (obj) => {
    // console.log('handleProvinceChange', obj)
    setProvince(obj)
    setAmphur(null)
    setAmphurList(obj.amphur)
  }

  const handleAmphurChange = (obj) => {
    // console.log('handleAmphurChange', obj)
    setAmphur(obj)
  }

  const onSubmit = (data) => {
    data = {...data, province, amphur}
    console.log('onSubmit', data)
    // alert("Registered")
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col>
            <label>Name</label>
          </Col>
          <Col>
            <input type="text" placeholder="Name" ref={register({ required: true })} name="name" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>E-mail</label>
          </Col>
          <Col>
            <input type="email" placeholder="E-mail" ref={register({ required: true })} name="email" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>Password</label>
          </Col>
          <Col>
            <input type="password" placeholder="Password" ref={register({ required: true })} name="password" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>Confirmed Password</label>
          </Col>
          <Col>
            <input type="password" placeholder="Confirmed Password" ref={register({ required: true })} name="password2" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>Address</label>
          </Col>
          <Col>
            <input type="text" placeholder="Address" ref={register({ required: true })} name="address" />
          </Col>
        </Row>
        <Row>
          <Col>
            <label>Province</label>
          </Col>
          <Col>
            <Select
              name="province"
              placeholder="Select Province"
              value={province}
              options={provinceData}
              onChange={handleProvinceChange}
              getOptionLabel={x => x.name}
              getOptionValue={x => x.id}
            />

          </Col>
        </Row>
        <Row>
          <Col>
            <label>Amphur</label>
          </Col>
          <Col>
            <Select
              name="amphur"
              placeholder="Select Amphur"
              value={amphur}
              options={amphurList}
              onChange={handleAmphurChange}
              getOptionLabel={x => x.name}
              getOptionValue={x => x.id}
            />

          </Col>
        </Row>
        <Row>
          <Col>
            <button type="submit">Submit</button>
          </Col>
        </Row>
      </form>

    </>
  )
}