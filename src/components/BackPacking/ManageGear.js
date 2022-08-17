//react
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
//buttons
import Button from '../Button';
import GoBackButton from '../GoBackButton';
import AddGear from './AddGear';
//firebase
import { db } from '../../firebase-config';
import { ref, push, onValue } from 'firebase/database';
//db
import { useDatabase } from '../../contexts/DatabaseContext';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
import Gears from './Gears';
import PageTitle from '../PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import { SortMode } from '../SearchSortFilter/SortModes';

export default function ManageGear() {

    //constants
    const DB_GEAR = "/backpacking-gear";

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //user
    const { currentUser } = useAuth();

    const { deleteItem, get } = useDatabase();

    //states
    const [showAdd, setShowAdd] = useState(false);
    const [error, setError] = useState(false);
    const [gear, setGear] = useState();
    const [originalGear, setOriginalGear] = useState();
    const [loading, setLoading] = useState(true);

    //load data
    useEffect(() => {
        let cancel = false;

        const getGear = async () => {
            if (cancel) {
                return;
            }
            await fetchGearsFromFirebase();
        }
        getGear();

        return () => {
            cancel = true;
        }
    }, [])


    /** Fetch Gears From Firebase */
    const fetchGearsFromFirebase = async () => {

        try {
            //clear the error
            setError('');
            setLoading(true);
            await get(DB_GEAR).then(gear => {
                console.log(gear);
                setGear(gear);
            })
        } catch (error) {
            setError(t('failed_to_delete_gear'));
            console.log(error);
        }

        setLoading(false);

/*
        const dbref = await ref(db, DB_GEAR);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setLoading(false);
            setGear(fromDB);
            setOriginalGear(fromDB);
        })
        */
    }

    /** Add Gear To Firebase */
    const addGear = async (gear) => {
        try {
            gear["created"] = getCurrentDateAsJson();
            gear["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_GEAR);
            push(dbref, gear);
            // setMessage(t('save_success'));
            // setShowMessage(true);
        } catch (ex) {
            // setError(t('save_exception'));
        }
    }

    const deleteGear = async (id) => {

        try {
            //clear the error
            setError('');
            setLoading(true);
            await deleteItem(id, DB_GEAR);
        } catch (error) {
            setError(t('failed_to_delete_gear'));
            console.log(error);
        }

        setLoading(false);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>

            {error && <div className="error">{error}</div>}
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        color={showAdd ? 'red' : 'green'}
                        text={showAdd ? t('button_close') : t('button_add_gear')}
                        onClick={() => setShowAdd(!showAdd)} />
                </ButtonGroup>
            </Row>

            <PageTitle title={t('my_gear_title')} />

            <div className="page-content">
                {showAdd && <AddGear onAddGear={addGear} onClose={() => setShowAdd(false)} />}
                <SearchSortFilter onSet={setGear} originalList={originalGear} useNameFiltering={true} showSortByName={true} defaultSort={SortMode.Name_DESC} />
                {
                    gear != null && gear.length > 0 ? (
                        <Gears gears={gear}
                            onDelete={deleteGear} />
                    ) : (
                        t('no_gear_to_show')
                    )
                }
            </div>
        </div>
    )
}
