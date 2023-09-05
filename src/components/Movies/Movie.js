import { useTranslation } from 'react-i18next';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import RightWrapper from '../Site/RightWrapper';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';
import { Button, ButtonGroup, Card } from 'react-bootstrap';

export default function Movie({ movie, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //states
    const [editable, setEditable] = useState(false);

    const updateMovie = (updateMovieID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MOVIES, updateMovieID, object);
        setEditable(false);
    }

    const markHaveAtHome = () => {
        movie["haveAtHome"] = true;
        onEdit(movie);
    }

    const markNotHaveAtHome = () => {
        movie["haveAtHome"] = false;
        onEdit(movie);
    }

    return (
        <>

            <Card className='cardCustom' style={{ marginBottom: '10px' }}>
                <Card.Header>
                    <RightWrapper>
                        <ButtonGroup>
                            <Icon name={Constants.ICON_EDIT} className={'btn ' + Constants.CLASSNAME_EDITBTN}
                                style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => editable ? setEditable(false) : setEditable(true)} />
                            <Icon className={'btn ' + Constants.CLASSNAME_DELETEBTN}
                                name={Constants.ICON_DELETE}
                                color={Constants.COLOR_DELETEBUTTON}
                                style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                onClick={() => {
                                    if (window.confirm(t('delete_movie_confirm_message'))) {
                                        onDelete(movie.id);
                                    }
                                }} />
                        </ButtonGroup>
                    </RightWrapper>
                    {movie.name} {movie.publishYear > 0 ? '(' + movie.publishYear + ')' : ''}
                    <div style={{ fontWeight: 'normal' }}>
                        <StarRating starCount={movie.stars} />
                    </div>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>{movie.nameFi !== "" ? movie.nameFi : ''}</Card.Subtitle>
                    <Card.Text>{movie.format > 0 ?
                        (<span> {
                            t('movie_format_' + getMovieFormatNameByID(movie.format))
                        }</span>) : ('')}
                        <br />
                        {movie.description}

                        {
                            editable && <AddMovie
                                movieID={movie.id}
                                onClose={() => setEditable(false)}
                                onSave={updateMovie}
                                showLabels={false} />
                        }
                    </Card.Text>
                    <Card.Link href="#">
                        <Link className='btn btn-primary' to={`${Constants.NAVIGATION_MOVIE}/${movie.id}`}>{t('view_details')}</Link>
                    </Card.Link>
                    <Card.Link href="#">
                        {
                            movie.haveAtHome &&
                            <span
                                onClick={() => { markNotHaveAtHome() }}
                                className='btn btn-success' style={{ margin: '5px' }}>
                                {t('have')}&nbsp;
                                <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                            </span>
                        }
                        {
                            !movie.haveAtHome &&
                            <Button
                                onClick={() => { markHaveAtHome() }}
                                className='btn btn-danger' style={{ margin: '5px' }}>
                                {t('have_not')}&nbsp;
                                <FaSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                            </Button>

                        }
                    </Card.Link>
                </Card.Body>
            </Card>
        </>
    )
}