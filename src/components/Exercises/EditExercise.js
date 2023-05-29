import { Col, Row, Form, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button';
import { getCurrentDateAsJson, convertDateAndTimeToJson, getJsonAsDateString, getJsonAsTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { updateToFirebaseById } from '../../datatier/datatier';

function EditExercise({ exerciseID, exercise, onClose }) {

  //states

  //start date and time
  const [startDate, setStartDate] = useState(''); //todo: laita oletuksena nykypvm
  const [startTime, setStartTime] = useState(''); //todo: laita oletuksena nykyinen kellonaika

  //end date and time 
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [created, setCreated] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState('');

  //translation
  const { t, ready } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

  useEffect(() => {
    if (exercise != null) {
      setCategory(exercise.category);
      setCreated(exercise.created);
      setCreatedBy(exercise.createdBy);

      var startDateTime = exercise.startDatetime;
      setStartDate(getJsonAsDateString(startDateTime));
      setStartTime(getJsonAsTimeString(startDateTime));

      var endDateTime = exercise.endDateTime;
      setEndDate(getJsonAsDateString(endDateTime));
      setEndTime(getJsonAsTimeString(endDateTime));

      setDescription(exercise.description);
      setStars(exercise.stars);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    var startDateTime = convertDateAndTimeToJson(startDate, startTime);
    var endDateTime = convertDateAndTimeToJson(endDate, endTime);
    saveExercise(exerciseID, {
      category, created, createdBy, description, endDateTime, stars, startDateTime
    });
  }

  const saveExercise = async (exerciseID, exercise) => {
    try {
      exercise["modified"] = getCurrentDateAsJson();
      updateToFirebaseById(Constants.DB_EXERCISES, exerciseID, exercise);
    } catch (ex) {
      setError(t('exercise_save_exception'));
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('startdate')}</Form.Label>
          <Form.Control type="date" name='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('starttime')}</Form.Label>
          <Form.Control type="time" name='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('enddate')}</Form.Label>
          <Form.Control type="date" name='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>{t('endtime')}</Form.Label>
          <Form.Control type="time" name='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </Form.Group>
      </Row>
      <Form.Group className="mb-3" controlId="addDrinkForm-Description">
        <Form.Label>{t('description')}</Form.Label>
        <Form.Control type='text'
          autoComplete="off"
          placeholder={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
      </Form.Group>
      <Row>
        <ButtonGroup>
          <Button type='button' text={t('close')} className='btn btn-block' onClick={() => onClose()} />
          <Button type='submit' text={t('button_save_exercise')} className='btn btn-block saveBtn' />
        </ButtonGroup>
      </Row>
    </Form>
  )
}

export default EditExercise