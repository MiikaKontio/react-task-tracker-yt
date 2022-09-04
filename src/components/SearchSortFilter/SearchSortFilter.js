//react
import { useState, useEffect } from 'react';
import { Col, Row, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
import { SortMode } from './SortModes';
//proptypes
import PropTypes from 'prop-types';

const SearchSortFilter = ({ onSet,
    originalList,
    //sorting
    defaultSort,
    showSortByName,
    showSortByTitle,
    showSortByCreatedDate,
    showSortByText,
    showSortByStarRating,
    //searching
    showSearch,
    showSearchByDescription,
    //filtering
    showFilterHaveAtHome,
    showFilterNotHaveAtHome,
    showFilterHaveRated,
    showFilterNotHaveRated,
    showFilterCore,
    showFilterReady,
    showFilterNotReady,
    useNameFiltering,
    useTitleFiltering,
    useTextFiltering,
    categories
}) => {

    //states
    const [searchString, setSearchString] = useState('');
    const [searchStringDescription, setSearchStringDescription] = useState('');
    const [sortBy, setSortBy] = useState(defaultSort);
    const [showOnlyHaveAtHome, setShowOnlyHaveAtHome] = useState(false);
    const [showOnlyNotHaveAtHome, setShowOnlyNotHaveAtHome] = useState(false);
    const [showOnlyHaveRated, setShowOnlyHaveRated] = useState(false);
    const [showOnlyNotHaveRated, setShowOnlyNotHaveRated] = useState(false);
    const [showOnlyCore, setShowOnlyCore] = useState(false);
    const [showOnlyReady, setShowOnlyReady] = useState(false);
    const [showOnlyNotReady, setShowOnlyNotReady] = useState(false);
    const [category, setCategory] = useState(0);

    //sorting
    const [_showSortByName, _setShowSortByName] = useState(showSortByName);
    const [_showSortByTitle, _setShowSortByTitle] = useState(showSortByTitle);
    const [_showSortByCreatedDate, _setShowSortByCreatedDate] = useState(showSortByCreatedDate);
    const [_showSortByText, _setShowSortByText] = useState(showSortByText);
    const [_showSortByStarRating, _setShowSortByStarRating] = useState(showSortByStarRating);
    //filtering
    const [_showOnlyHaveAtHome, _setShowOnlyHaveAtHome] = useState(showFilterHaveAtHome);
    const [_showOnlyNotHaveAtHome, _setShowOnlyNotHaveAtHome] = useState(showFilterNotHaveAtHome);
    const [_showOnlyHaveRated, _setShowOnlyHaveRated] = useState(showFilterHaveRated);
    const [_showOnlyNotHaveRated, _setShowOnlyNotHaveRated] = useState(showFilterNotHaveRated);
    const [_showOnlyReady, _setShowOnlyReady] = useState(showFilterReady);
    const [_showOnlyNotReady, _setShowOnlyNotReady] = useState(showFilterNotReady);

    //translation
    const { t } = useTranslation('searchsortfilter', { keyPrefix: 'searchsortfilter' });

    //componentDidMount
    useEffect(() => {
        filterAndSort();
    }, []);

    useEffect(() => {
        filterAndSort();
    }, [sortBy, searchString, searchStringDescription,
        showOnlyHaveAtHome, showOnlyNotHaveAtHome,
        showOnlyHaveRated, showOnlyNotHaveRated,
        showOnlyCore, category,
        showOnlyReady, showOnlyNotReady]);

    const filterAndSort = () => {
        if (!originalList) {
            return;
        }
        let newList = originalList;
        newList = searching(newList);
        newList = filtering(newList);
        newList = sorting(newList);
        onSet(newList);
    }

    const searching = (newList) => {
        if (searchString !== "") {
            if (useNameFiltering) {
                newList = newList.filter(x => x.name != null && x.name.toLowerCase().includes(searchString.toLowerCase()));
            }
            if (useTitleFiltering) {
                newList = newList.filter(x => x.title != null && x.title.toLowerCase().includes(searchString.toLowerCase()));
            }
            if (useTextFiltering) {
                newList = newList.filter(x => x.text.toLowerCase().includes(searchString.toLowerCase()));
            }
        }
        if (searchStringDescription !== "") {
            newList = newList.filter(x => x.description.toLowerCase().includes(searchStringDescription.toLowerCase()));
        }
        return newList;
    }

    const filtering = (newList) => {

        //have at home
        if (showOnlyHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === true);
        }
        //not have at home
        else if (showOnlyNotHaveAtHome) {
            newList = newList.filter(x => x.haveAtHome === false || !x.haveAtHome);
        }

        //rated
        if (showOnlyHaveRated) {
            newList = newList.filter(x => x.stars !== undefined && x.stars > 0);
        }
        //not rated
        else if (showOnlyNotHaveRated) {
            newList = newList.filter(x => x.stars === undefined || x.stars === 0);
        }

        //core
        if (showOnlyCore) {
            newList = newList.filter(x => x.isCore === true);
        }

        //ready
        if (showOnlyReady) {
            newList = newList.filter(x => x.reminder === true);
        }
        //notready
        else if (showOnlyNotReady) {
            newList = newList.filter(x => x.reminder === false);
        }

        //category
        if (category > 0) {
            newList = newList.filter(x => x.category === category);
        }

        return newList;
    }

    const sorting = (newList) => {

        //sortit
        switch (sortBy) {
            case SortMode.Name_ASC:
            case SortMode.Name_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.name > b.name ? 1 : -1
                });
                if (sortBy === SortMode.Name_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Title_ASC:
            case SortMode.Title_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.title > b.title ? 1 : -1
                });
                if (sortBy === SortMode.Title_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Created_ASC:
            case SortMode.Created_DESC:
                newList = [...newList].sort(
                    (a, b) => new Date(a.created).setHours(0, 0, 0, 0) - new Date(b.created).setHours(0, 0, 0, 0)
                );
                if (sortBy === SortMode.Created_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.Text_ASC:
            case SortMode.Text_DESC:
                newList = [...newList].sort((a, b) => {
                    return a.text > b.text ? 1 : -1
                });
                if (sortBy === SortMode.Text_DESC) {
                    newList.reverse();
                }
                break;
            case SortMode.StarRating_ASC:
            case SortMode.StarRating_DESC:
                newList = [...newList].sort((a, b) => {
                    let aStars = a.stars === undefined ? 0 : a.stars;
                    let bStars = b.stars === undefined ? 0 : b.stars;
                    return aStars - bStars
                });
                if (sortBy === SortMode.StarRating_DESC) {
                    newList.reverse();
                }
                break;
        }
        return newList;
    }

    return (
        <div>
            <Form className='form-no-paddings'>
                <Form.Group as={Row}>
                    <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
                    <Col xs={9} sm={10}>
                        {
                            _showSortByCreatedDate &&
                            <>
                                <Button
                                    iconName={sortBy === SortMode.Created_DESC ? 'arrow-down' : sortBy === SortMode.Created_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Created_ASC ? setSortBy(SortMode.Created_DESC) : setSortBy(SortMode.Created_ASC);
                                    }}
                                    text={t('created_date')} type="button" />
                            </>
                        }
                        {
                            _showSortByName &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Name_DESC ? 'arrow-down' : sortBy === SortMode.Name_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Name_ASC ? setSortBy(SortMode.Name_DESC) : setSortBy(SortMode.Name_ASC);
                                    }}
                                    text={t('name')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByTitle &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Title_DESC ? 'arrow-down' : sortBy === SortMode.Title_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Title_ASC ? setSortBy(SortMode.Title_DESC) : setSortBy(SortMode.Title_ASC);
                                    }}
                                    text={t('title')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByText &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.Text_DESC ? 'arrow-down' : sortBy === SortMode.Text_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.Text_ASC ? setSortBy(SortMode.Text_DESC) : setSortBy(SortMode.Text_ASC);
                                    }}
                                    text={t('text')} type="button"
                                />
                            </>
                        }
                        {
                            _showSortByStarRating &&
                            <>
                                &nbsp;
                                <Button
                                    iconName={sortBy === SortMode.StarRating_DESC ? 'arrow-down' : sortBy === SortMode.StarRating_ASC ? 'arrow-up' : ''}
                                    onClick={() => {
                                        sortBy === SortMode.StarRating_ASC ? setSortBy(SortMode.StarRating_DESC) : setSortBy(SortMode.StarRating_ASC);
                                    }}
                                    text={t('star_rating')} type="button"
                                />
                            </>
                        }
                    </Col>
                </Form.Group>
                {
                    showSearch &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchString"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchString(e.target.value)}
                                    placeholder='nimi'
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showSearchByDescription &&
                    <>
                        <Form.Group as={Row}>
                            <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Control
                                    autoComplete='off'
                                    type="text"
                                    id="inputSearchStringDescription"
                                    aria-describedby="searchHelpBlock"
                                    onChange={(e) => setSearchStringDescription(e.target.value)}
                                    placeholder='kuvaus'
                                />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterHaveAtHome &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyHaveAtHome'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_have_at_home')}
                                    onChange={(e) => {
                                        setShowOnlyHaveAtHome(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotHaveAtHome &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotHaveAtHome'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_have_at_home')}
                                    onChange={(e) => {
                                        setShowOnlyNotHaveAtHome(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterHaveRated &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyHaveRated'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_have_rated')}
                                    onChange={(e) => {
                                        setShowOnlyHaveRated(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotHaveRated &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotHaveRated'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_have_rated')}
                                    onChange={(e) => {
                                        setShowOnlyNotHaveRated(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterCore &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyCore'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_core')}
                                    onChange={(e) => {
                                        setShowOnlyCore(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterReady &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyReady'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_ready')}
                                    onChange={(e) => {
                                        setShowOnlyReady(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    showFilterNotReady &&
                    <>
                        <Form.Group as={Row} controlId='searchSortFilter-OnlyNotReady'>
                            <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
                            <Col xs={9} sm={10}>
                                <Form.Check label={t('show_only_not_ready')}
                                    onChange={(e) => {
                                        setShowOnlyNotReady(e.currentTarget.checked);
                                    }} />
                            </Col>
                        </Form.Group>
                    </>
                }
                {
                    categories != null && categories.length > 0 && (
                        <Form.Group className="mb-3" controlId="searchSortFilter-Category">
                            <Form.Label>{t('category')}</Form.Label>
                            <Form.Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(({ id, name }) => (
                                    <option value={id} key={id}>{t(`category_${name}`)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )
                }
            </Form>
        </div>
    )
}

SearchSortFilter.defaultProps = {
    //sorting
    defaultSort: SortMode.Created_ASC,
    showSortByName: false,
    showSortByTitle: false,
    showSortByCreatedDate: false,
    showSortByText: false,
    showSortByStarRating: false,
    //searching
    showSearch: true,
    showSearchByDescription: false,
    //filtering
    showFilterHaveAtHome: false,
    showFilterNotHaveAtHome: false,
    showFilterHaveRated: false,
    showFilterNotHaveRated: false,
    showFilterCore: false,
    showfilterReady: false,
    showFilterNotReady: false,
    useNameFiltering: false,
    useTitleFiltering: false,
    useTextFiltering: false
}

SearchSortFilter.propTypes = {
    //sorting
    defaultSort: PropTypes.string,
    showSortByName: PropTypes.bool,
    showSortByTitle: PropTypes.bool,
    showSortByCreatedDate: PropTypes.bool,
    showSortByText: PropTypes.bool,
    showSortByStarRating: PropTypes.bool,
    //searching
    showSearch: PropTypes.bool,
    showSearchByDescription: PropTypes.bool,
    //filtering
    showFilterHaveAtHome: PropTypes.bool,
    showFilterNotHaveAtHome: PropTypes.bool,
    showFilterHaveRated: PropTypes.bool,
    showFilterNotHaveRated: PropTypes.bool,
    showFilterCore: PropTypes.bool,
    showFilterReady: PropTypes.bool,
    showFilterNotReady: PropTypes.bool,
    useNameFiltering: PropTypes.bool,
    useTitleFiltering: PropTypes.bool,
    useTextFiltering: PropTypes.bool,
    //other
    onSet: PropTypes.func
}

export default SearchSortFilter
