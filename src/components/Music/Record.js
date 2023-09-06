import { useTranslation } from 'react-i18next';
import { FaCheckSquare, FaSquare } from 'react-icons/fa';
import * as Constants from '../../utils/Constants';
import { getMusicFormatNameByID } from '../../utils/ListUtils';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddRecord from './AddRecord';
import { useToggle } from '../useToggle';
import CustomCard from '../Site/CustomCard';
import { Button } from 'react-bootstrap';

export default function Record({ record, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MUSIC, { keyPrefix: Constants.TRANSLATION_MUSIC });

    //toggle
    const { status: showEdit, toggleStatus: toggleShowEdit } = useToggle();

    const updateRecord = (updateRecordID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_MUSIC_RECORDS, updateRecordID, object);
        toggleShowEdit();
    }

    const markHaveAtHome = () => {
        record["haveAtHome"] = true;
        onEdit(record);
    }

    const markNotHaveAtHome = () => {
        record["haveAtHome"] = false;
        onEdit(record);
    }

    const getTitle = () => {

        let title = record.band;
        if (record.band !== '') {
            title += ' - ';
        }
        title += record.name;
        if (record.publishYear > 0) {
            title += ' (' + record.publishYear + ')';
        }
        return title;
    }

    const getSubTitle = () => {
        if (record.format > 0) {
            return t('music_format_' + getMusicFormatNameByID(record.format));
        }
        return '';
    }

    const editClicked = () => {
        toggleShowEdit();
    }

    return (

        <CustomCard
            deleteConfirmText={t('delete_music_confirm_message')}
            stars={record.stars}
            showStarRating={true}
            subTitle={getSubTitle()}
            title={getTitle()}
            id={record.id}
            description={record.description}
            onDelete={onDelete}
            linkUrl={`${Constants.NAVIGATION_MUSIC_RECORD}/${record.id}`}
            linkText={t('view_details')}
            editClicked={editClicked}
        >
            {
                /* TODO tee tästä jokin toggle button komponentti */
                record.haveAtHome &&
                <Button
                    onClick={() => { markNotHaveAtHome() }}
                    variant={Constants.VARIANT_SUCCESS}
                    style={{ margin: '5px' }}>
                    {t('have')}&nbsp;
                    <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                </Button>
            }
            {
                !record.haveAtHome &&
                <Button
                    onClick={() => { markHaveAtHome() }}
                    variant={Constants.VARIANT_DANGER}
                    style={{ margin: '5px' }}>
                    {t('have_not')}&nbsp;
                    <FaSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                </Button>
            }
            {
                showEdit && <AddRecord
                    recordID={record.id}
                    onClose={() => toggleShowEdit()}
                    onSave={updateRecord}
                    showLabels={false} />
            }
        </CustomCard>

    )
}