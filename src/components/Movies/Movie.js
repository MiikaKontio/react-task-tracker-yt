import { useTranslation } from 'react-i18next';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import * as Constants from '../../utils/Constants';
import { getMovieFormatNameByID } from '../../utils/ListUtils';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddMovie from './AddMovie';
import { Button } from 'react-bootstrap';
import CustomCard from '../Site/CustomCard';
import { useToggle } from '../useToggle';

export default function Movie({ movie, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MOVIES, { keyPrefix: Constants.TRANSLATION_MOVIES });

    //modal
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const updateMovie = (updateMovieID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MOVIES, updateMovieID, object);
        toggleShowEdit();
    }

    const markHaveAtHome = () => {
        movie["haveAtHome"] = true;
        onEdit(movie);
    }

    const markNotHaveAtHome = () => {
        movie["haveAtHome"] = false;
        onEdit(movie);
    }

    const editClicked = () => {
        toggleShowEdit();
    }

    return (
        <CustomCard
            deleteConfirmText={t('delete_movie_confirm_message')}
            stars={movie.stars}
            showStarRating={true}
            subTitle={movie.nameFi !== "" ? movie.nameFi : ''}
            title={movie.name + (movie.publishYear > 0 ? ' (' + movie.publishYear + ')' : '')}
            id={movie.id}
            description={movie.description}
            onDelete={onDelete}
            linkUrl={`${Constants.NAVIGATION_MOVIE}/${movie.id}`}
            linkText={t('view_details')}
            editClicked={editClicked}
        >
            {movie.format > 0 ?
                (<span> {
                    t('movie_format_' + getMovieFormatNameByID(movie.format))
                }</span>) : ('')}
            <br />

            {
                movie.haveAtHome &&
                <Button
                    onClick={() => { markNotHaveAtHome() }}
                    variant={Constants.VARIANT_SUCCESS}
                    style={{ marginTop: '5px' }}>
                    {t('have')}&nbsp;
                    <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                </Button>
            }
            {
                !movie.haveAtHome &&
                <Button
                    onClick={() => { markHaveAtHome() }}
                    variant={Constants.VARIANT_DANGER}
                    style={{ marginTop: '5px' }}>
                    {t('have_not')}&nbsp;
                    <FaSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                </Button>
            }
            {
                showEdit && <AddMovie
                    movieID={movie.id}
                    onClose={() => toggleShowEdit()}
                    onSave={updateMovie}
                    showLabels={false} />
            }
        </CustomCard>
    )
}