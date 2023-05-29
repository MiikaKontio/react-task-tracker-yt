import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { getIconNameByCategory } from './Categories';
import Icon from '../Icon';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';

const Exercise = ({ exercise, onDelete }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    <Icon name={getIconNameByCategory(exercise.category)} />
                    <Link style={{ textDecoration: 'none' }} to={`${Constants.NAVIGATION_EXERCISE}/${exercise.id}`}>
                        {
                            getJsonAsDateTimeString(exercise.datetime, i18n.language)
                        }
                    </Link>
                </span>
                <Icon className='deleteBtn' name={Constants.ICON_DELETE} color='red' fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(exercise.id); } }} />
            </h5>
            <p>
                {exercise.category > 0 ?
                    (<span> {
                        '#' + t('category_' + getExerciseCategoryNameByID(exercise.category))
                    }</span>) : ('')}
            </p>
            <p>
                {exercise.description}
            </p>

            <StarRating starCount={exercise.stars} />
        </div>
    )
}

export default Exercise